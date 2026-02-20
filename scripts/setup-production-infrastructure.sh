#!/bin/bash
# Set up Production Infrastructure for HeySalad AI
# This script sets up load balancing, monitoring, and auto-scaling

set -e

echo "🏗️  Setting Up Production Infrastructure"
echo "========================================"

# Configuration
REGION="${AWS_REGION:-eu-west-2}"
PROJECT_NAME="heysalad"
ENVIRONMENT="${ENVIRONMENT:-production}"

echo "📋 Configuration:"
echo "   Region: $REGION"
echo "   Project: $PROJECT_NAME"
echo "   Environment: $ENVIRONMENT"
echo ""

# Function to create CloudWatch dashboard
create_monitoring_dashboard() {
    echo "📊 Creating CloudWatch monitoring dashboard..."

    # Create dashboard
    aws cloudwatch put-dashboard \
        --region $REGION \
        --dashboard-name "${PROJECT_NAME}-${ENVIRONMENT}" \
        --dashboard-body file://<(cat << 'EOF'
{
    "widgets": [
        {
            "type": "metric",
            "properties": {
                "metrics": [
                    [ "AWS/EC2", "CPUUtilization", { "stat": "Average" } ],
                    [ ".", "NetworkIn" ],
                    [ ".", "NetworkOut" ]
                ],
                "period": 300,
                "stat": "Average",
                "region": "eu-west-2",
                "title": "EC2 Metrics",
                "yAxis": {
                    "left": {
                        "min": 0
                    }
                }
            }
        },
        {
            "type": "metric",
            "properties": {
                "metrics": [
                    [ "AWS/ApplicationELB", "RequestCount", { "stat": "Sum" } ],
                    [ ".", "TargetResponseTime", { "stat": "Average" } ],
                    [ ".", "HTTPCode_Target_4XX_Count", { "stat": "Sum" } ],
                    [ ".", "HTTPCode_Target_5XX_Count", { "stat": "Sum" } ]
                ],
                "period": 300,
                "stat": "Average",
                "region": "eu-west-2",
                "title": "Load Balancer Metrics"
            }
        },
        {
            "type": "log",
            "properties": {
                "query": "SOURCE '/aws/ec2/heysalad-model'\n| fields @timestamp, @message\n| sort @timestamp desc\n| limit 20",
                "region": "eu-west-2",
                "title": "Recent Logs"
            }
        }
    ]
}
EOF
)

    echo "   ✅ Dashboard created: https://console.aws.amazon.com/cloudwatch/home?region=$REGION#dashboards:name=${PROJECT_NAME}-${ENVIRONMENT}"
}

# Function to set up CloudWatch alarms
setup_alarms() {
    echo "🔔 Setting up CloudWatch alarms..."

    # High CPU alarm
    aws cloudwatch put-metric-alarm \
        --region $REGION \
        --alarm-name "${PROJECT_NAME}-high-cpu" \
        --alarm-description "Alert when CPU exceeds 80%" \
        --metric-name CPUUtilization \
        --namespace AWS/EC2 \
        --statistic Average \
        --period 300 \
        --threshold 80 \
        --comparison-operator GreaterThanThreshold \
        --evaluation-periods 2

    # High error rate alarm
    aws cloudwatch put-metric-alarm \
        --region $REGION \
        --alarm-name "${PROJECT_NAME}-high-errors" \
        --alarm-description "Alert when 5XX errors exceed 10" \
        --metric-name HTTPCode_Target_5XX_Count \
        --namespace AWS/ApplicationELB \
        --statistic Sum \
        --period 300 \
        --threshold 10 \
        --comparison-operator GreaterThanThreshold \
        --evaluation-periods 1

    echo "   ✅ Alarms created"
}

# Function to create launch template
create_launch_template() {
    echo "🚀 Creating launch template..."

    # User data script for auto-configuration
    USER_DATA=$(cat << 'USERDATA' | base64 -w 0
#!/bin/bash
# Auto-setup script for new instances

# Install dependencies
apt update
apt install -y python3-pip git

# Clone repo
git clone https://github.com/Hey-Salad/ai.git /opt/heysalad-ai

# Install dependencies
cd /opt/heysalad-ai/model-training
pip3 install -r requirements.txt

# Download model from S3 (if configured)
if [ ! -z "$MODEL_S3_PATH" ]; then
    aws s3 cp $MODEL_S3_PATH /opt/heysalad-model --recursive
fi

# Start model server
systemctl enable heysalad-model
systemctl start heysalad-model

# Install CloudWatch agent
wget https://s3.amazonaws.com/amazoncloudwatch-agent/ubuntu/amd64/latest/amazon-cloudwatch-agent.deb
dpkg -i amazon-cloudwatch-agent.deb

# Start CloudWatch agent
/opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl \
    -a fetch-config \
    -m ec2 \
    -s \
    -c default
USERDATA
)

    # Get AMI ID (Ubuntu 22.04 with NVIDIA drivers)
    AMI_ID=$(aws ec2 describe-images \
        --region $REGION \
        --owners 099720109477 \
        --filters "Name=name,Values=ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-amd64-server-*" \
        --query 'Images | sort_by(@, &CreationDate) | [-1].ImageId' \
        --output text)

    # Create launch template
    aws ec2 create-launch-template \
        --region $REGION \
        --launch-template-name "${PROJECT_NAME}-template" \
        --version-description "HeySalad model server template" \
        --launch-template-data "{
            \"ImageId\": \"$AMI_ID\",
            \"InstanceType\": \"g5.xlarge\",
            \"KeyName\": \"yumi-builder-2026\",
            \"UserData\": \"$USER_DATA\",
            \"BlockDeviceMappings\": [
                {
                    \"DeviceName\": \"/dev/sda1\",
                    \"Ebs\": {
                        \"VolumeSize\": 200,
                        \"VolumeType\": \"gp3\"
                    }
                }
            ],
            \"TagSpecifications\": [
                {
                    \"ResourceType\": \"instance\",
                    \"Tags\": [
                        {\"Key\": \"Name\", \"Value\": \"${PROJECT_NAME}-worker\"},
                        {\"Key\": \"Project\", \"Value\": \"${PROJECT_NAME}\"},
                        {\"Key\": \"Environment\", \"Value\": \"${ENVIRONMENT}\"}
                    ]
                }
            ]
        }" 2>/dev/null || echo "   ⚠️  Launch template may already exist"

    echo "   ✅ Launch template created"
}

# Function to create target group
create_target_group() {
    echo "🎯 Creating target group..."

    VPC_ID=$(aws ec2 describe-vpcs --region $REGION --filters "Name=isDefault,Values=true" --query 'Vpcs[0].VpcId' --output text)

    TG_ARN=$(aws elbv2 create-target-group \
        --region $REGION \
        --name "${PROJECT_NAME}-tg" \
        --protocol HTTP \
        --port 8000 \
        --vpc-id $VPC_ID \
        --health-check-enabled \
        --health-check-path "/health" \
        --health-check-interval-seconds 30 \
        --health-check-timeout-seconds 5 \
        --healthy-threshold-count 2 \
        --unhealthy-threshold-count 3 \
        --query 'TargetGroups[0].TargetGroupArn' \
        --output text 2>/dev/null || \
        aws elbv2 describe-target-groups --region $REGION --names "${PROJECT_NAME}-tg" --query 'TargetGroups[0].TargetGroupArn' --output text)

    echo "   ✅ Target group created: $TG_ARN"
    echo "$TG_ARN" > .target-group-arn
}

# Function to create load balancer
create_load_balancer() {
    echo "⚖️  Creating application load balancer..."

    VPC_ID=$(aws ec2 describe-vpcs --region $REGION --filters "Name=isDefault,Values=true" --query 'Vpcs[0].VpcId' --output text)
    SUBNET_IDS=$(aws ec2 describe-subnets --region $REGION --filters "Name=vpc-id,Values=$VPC_ID" --query 'Subnets[*].SubnetId' --output text)

    # Create security group for ALB
    SG_ID=$(aws ec2 create-security-group \
        --region $REGION \
        --group-name "${PROJECT_NAME}-alb-sg" \
        --description "Security group for HeySalad ALB" \
        --vpc-id $VPC_ID \
        --query 'GroupId' \
        --output text 2>/dev/null || \
        aws ec2 describe-security-groups --region $REGION --filters "Name=group-name,Values=${PROJECT_NAME}-alb-sg" --query 'SecurityGroups[0].GroupId' --output text)

    # Allow HTTP and HTTPS
    aws ec2 authorize-security-group-ingress --region $REGION --group-id $SG_ID --protocol tcp --port 80 --cidr 0.0.0.0/0 2>/dev/null || true
    aws ec2 authorize-security-group-ingress --region $REGION --group-id $SG_ID --protocol tcp --port 443 --cidr 0.0.0.0/0 2>/dev/null || true

    # Create load balancer
    LB_ARN=$(aws elbv2 create-load-balancer \
        --region $REGION \
        --name "${PROJECT_NAME}-alb" \
        --subnets $SUBNET_IDS \
        --security-groups $SG_ID \
        --scheme internet-facing \
        --type application \
        --ip-address-type ipv4 \
        --query 'LoadBalancers[0].LoadBalancerArn' \
        --output text 2>/dev/null || \
        aws elbv2 describe-load-balancers --region $REGION --names "${PROJECT_NAME}-alb" --query 'LoadBalancers[0].LoadBalancerArn' --output text)

    echo "   ✅ Load balancer created: $LB_ARN"

    # Get DNS name
    LB_DNS=$(aws elbv2 describe-load-balancers --region $REGION --load-balancer-arns $LB_ARN --query 'LoadBalancers[0].DNSName' --output text)
    echo "   🌐 DNS: $LB_DNS"

    # Create listener
    TG_ARN=$(cat .target-group-arn)
    aws elbv2 create-listener \
        --region $REGION \
        --load-balancer-arn $LB_ARN \
        --protocol HTTP \
        --port 80 \
        --default-actions Type=forward,TargetGroupArn=$TG_ARN 2>/dev/null || true

    echo "   ✅ Listener created"
}

# Main execution
main() {
    echo ""
    read -p "🤔 Set up full production infrastructure? This will create AWS resources. (y/n) " -n 1 -r
    echo ""

    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "❌ Cancelled"
        exit 0
    fi

    create_monitoring_dashboard
    setup_alarms
    create_launch_template
    create_target_group
    create_load_balancer

    echo ""
    echo "=" * 60
    echo "✅ Production Infrastructure Setup Complete!"
    echo "=" * 60
    echo ""
    echo "📋 Next Steps:"
    echo ""
    echo "1. Launch instances manually or set up auto-scaling:"
    echo "   aws ec2 run-instances --launch-template LaunchTemplateName=${PROJECT_NAME}-template"
    echo ""
    echo "2. Configure DNS:"
    echo "   Point your domain to the load balancer DNS"
    echo ""
    echo "3. Set up SSL certificate:"
    echo "   aws acm request-certificate --domain-name model.heysalad.app"
    echo ""
    echo "4. Monitor dashboard:"
    echo "   https://console.aws.amazon.com/cloudwatch/home?region=$REGION#dashboards:name=${PROJECT_NAME}-${ENVIRONMENT}"
    echo ""
    echo "💰 Estimated Monthly Cost:"
    echo "   - 3x g5.xlarge: $1,500"
    echo "   - Load Balancer: $20"
    echo "   - CloudWatch: $30"
    echo "   - Total: ~$1,550/month"
    echo ""
    echo "🎉 Infrastructure is ready!"
}

main
