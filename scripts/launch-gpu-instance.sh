#!/bin/bash
# Launch GPU Training Instance for HeySalad-7B
# This script launches a g5.xlarge EC2 instance ready for training

set -e

echo "🚀 Launching HeySalad GPU Training Instance"
echo "==========================================="

# Configuration
INSTANCE_TYPE="g5.xlarge"
REGION="eu-west-2"
AMI_ID="ami-0b9932f4918a00c4f" # Ubuntu 22.04 in eu-west-2
KEY_NAME="yumi-builder-2026"
INSTANCE_NAME="HeySalad-Training"

# Check if AWS CLI is available
if ! command -v aws &> /dev/null; then
    echo "❌ AWS CLI not found. Installing..."
    curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
    unzip awscliv2.zip
    sudo ./aws/install
fi

# Get default VPC and subnet
echo "📡 Finding default VPC and subnet..."
VPC_ID=$(aws ec2 describe-vpcs --region $REGION --filters "Name=isDefault,Values=true" --query 'Vpcs[0].VpcId' --output text)
SUBNET_ID=$(aws ec2 describe-subnets --region $REGION --filters "Name=vpc-id,Values=$VPC_ID" --query 'Subnets[0].SubnetId' --output text)

echo "   VPC: $VPC_ID"
echo "   Subnet: $SUBNET_ID"

# Create or get security group
echo "🔒 Setting up security group..."
SG_NAME="heysalad-training-sg"
SG_ID=$(aws ec2 describe-security-groups --region $REGION --filters "Name=group-name,Values=$SG_NAME" --query 'SecurityGroups[0].GroupId' --output text 2>/dev/null || echo "")

if [ "$SG_ID" == "None" ] || [ -z "$SG_ID" ]; then
    echo "   Creating new security group..."
    SG_ID=$(aws ec2 create-security-group \
        --region $REGION \
        --group-name $SG_NAME \
        --description "Security group for HeySalad training instance" \
        --vpc-id $VPC_ID \
        --query 'GroupId' \
        --output text)

    # Allow SSH
    aws ec2 authorize-security-group-ingress \
        --region $REGION \
        --group-id $SG_ID \
        --protocol tcp \
        --port 22 \
        --cidr 0.0.0.0/0

    # Allow vLLM API
    aws ec2 authorize-security-group-ingress \
        --region $REGION \
        --group-id $SG_ID \
        --protocol tcp \
        --port 8000 \
        --cidr 0.0.0.0/0

    echo "   ✅ Security group created: $SG_ID"
else
    echo "   ✅ Using existing security group: $SG_ID"
fi

# Launch instance
echo "🚀 Launching instance..."
INSTANCE_ID=$(aws ec2 run-instances \
    --region $REGION \
    --image-id $AMI_ID \
    --instance-type $INSTANCE_TYPE \
    --key-name $KEY_NAME \
    --security-group-ids $SG_ID \
    --subnet-id $SUBNET_ID \
    --block-device-mappings '[{"DeviceName":"/dev/sda1","Ebs":{"VolumeSize":200,"VolumeType":"gp3"}}]' \
    --tag-specifications "ResourceType=instance,Tags=[{Key=Name,Value=$INSTANCE_NAME},{Key=Project,Value=HeySalad},{Key=Type,Value=Training}]" \
    --query 'Instances[0].InstanceId' \
    --output text)

echo "   Instance ID: $INSTANCE_ID"

# Wait for instance to be running
echo "⏳ Waiting for instance to start..."
aws ec2 wait instance-running --region $REGION --instance-ids $INSTANCE_ID

# Get public IP
PUBLIC_IP=$(aws ec2 describe-instances \
    --region $REGION \
    --instance-ids $INSTANCE_ID \
    --query 'Reservations[0].Instances[0].PublicIpAddress' \
    --output text)

echo ""
echo "✅ Instance launched successfully!"
echo "==========================================="
echo "Instance ID: $INSTANCE_ID"
echo "Public IP:   $PUBLIC_IP"
echo "Region:      $REGION"
echo "Type:        $INSTANCE_TYPE"
echo "Cost:        ~$1.50/hour (~$500/month if 24/7)"
echo ""
echo "🔑 SSH Command:"
echo "   ssh -i ~/.ssh/$KEY_NAME.pem ubuntu@$PUBLIC_IP"
echo ""
echo "📋 Next Steps:"
echo "   1. Wait 2-3 minutes for instance to fully boot"
echo "   2. SSH into instance using command above"
echo "   3. Run setup script:"
echo "      bash <(curl -s https://raw.githubusercontent.com/Hey-Salad/ai/main/model-training/setup_training_instance.sh)"
echo "   Or copy it manually:"
echo "      scp -i ~/.ssh/$KEY_NAME.pem model-training/setup_training_instance.sh ubuntu@$PUBLIC_IP:~/"
echo "      ssh -i ~/.ssh/$KEY_NAME.pem ubuntu@$PUBLIC_IP"
echo "      chmod +x setup_training_instance.sh"
echo "      ./setup_training_instance.sh"
echo ""
echo "💾 Instance details saved to: ./instance-info.txt"

# Save instance info
cat > instance-info.txt << EOF
INSTANCE_ID=$INSTANCE_ID
PUBLIC_IP=$PUBLIC_IP
REGION=$REGION
INSTANCE_TYPE=$INSTANCE_TYPE
KEY_NAME=$KEY_NAME
LAUNCHED=$(date)
EOF

echo ""
echo "🎉 Ready to train HeySalad-7B!"
