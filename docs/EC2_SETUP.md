# EC2 Setup Guide for HeySalad AI

This guide covers setting up EC2 instances for running LLMs with HeySalad AI.

## Table of Contents

- [Instance Recommendations](#instance-recommendations)
- [GPU Instances for Model Inference](#gpu-instances-for-model-inference)
- [CPU Instances for API Gateway](#cpu-instances-for-api-gateway)
- [Setup Instructions](#setup-instructions)
- [Cost Analysis](#cost-analysis)

## Instance Recommendations

### For Model Inference (GPU Required)

| Model Size | Instance Type | vCPUs | GPU Memory | Monthly Cost* | Use Case |
|------------|---------------|-------|------------|---------------|----------|
| 7B (Small) | g5.xlarge | 4 | 24 GB | ~$500 | Development, testing |
| 7B-13B | g5.2xlarge | 8 | 24 GB | ~$750 | Small production |
| 13B-33B | g5.4xlarge | 16 | 24 GB | ~$1,200 | Medium production |
| 70B | g5.12xlarge | 48 | 96 GB | ~$3,800 | Large production |
| 70B (Fast) | p4d.24xlarge | 96 | 320 GB | ~$24,000 | High-performance |

*On-demand pricing. Save 30-70% with Reserved Instances or Spot Instances.

### For Fine-Tuning

| Task | Instance Type | vCPUs | GPU Memory | Monthly Cost* |
|------|---------------|-------|------------|---------------|
| LoRA (7B) | g5.xlarge | 4 | 24 GB | ~$500 |
| LoRA (13B) | g5.2xlarge | 8 | 24 GB | ~$750 |
| Full Fine-tune (7B) | g5.4xlarge | 16 | 24 GB | ~$1,200 |
| Full Fine-tune (13B) | p3.8xlarge | 32 | 64 GB | ~$9,000 |

### For API Gateway (No GPU Needed)

| Traffic Level | Instance Type | vCPUs | RAM | Monthly Cost* |
|---------------|---------------|-------|-----|---------------|
| Low (< 1000 req/day) | t3.small | 2 | 2 GB | ~$15 |
| Medium (< 10k req/day) | t3.medium | 2 | 4 GB | ~$30 |
| High (< 100k req/day) | c5.large | 2 | 4 GB | ~$60 |
| Very High | c5.2xlarge | 8 | 16 GB | ~$250 |

## GPU Instances for Model Inference

### Option 1: g5 Instances (Recommended for Most Cases)

**Best for**: Cost-effective inference, good performance

```bash
# Launch g5.xlarge instance
aws ec2 run-instances \
  --image-id ami-0c55b159cbfafe1f0 \
  --instance-type g5.xlarge \
  --key-name your-key-pair \
  --security-group-ids sg-xxxxxx \
  --subnet-id subnet-xxxxxx \
  --block-device-mappings '[{"DeviceName":"/dev/sda1","Ebs":{"VolumeSize":100,"VolumeType":"gp3"}}]' \
  --tag-specifications 'ResourceType=instance,Tags=[{Key=Name,Value=HeySalad-Inference}]'
```

**Specs:**
- NVIDIA A10G Tensor Core GPU
- 24 GB GPU memory
- Good for models up to 13B parameters
- PCIe 4.0 support

### Option 2: p3 Instances (High Performance)

**Best for**: Training and large model inference

```bash
# Launch p3.2xlarge instance
aws ec2 run-instances \
  --image-id ami-0c55b159cbfafe1f0 \
  --instance-type p3.2xlarge \
  --key-name your-key-pair \
  --security-group-ids sg-xxxxxx \
  --subnet-id subnet-xxxxxx \
  --block-device-mappings '[{"DeviceName":"/dev/sda1","Ebs":{"VolumeSize":200,"VolumeType":"gp3"}}]'
```

**Specs:**
- NVIDIA V100 Tensor Core GPU
- 16 GB GPU memory per GPU
- Excellent for training
- More expensive than g5

### Option 3: p4d Instances (Maximum Performance)

**Best for**: 70B+ models, production at scale

```bash
# Launch p4d.24xlarge instance (very expensive!)
aws ec2 run-instances \
  --image-id ami-0c55b159cbfafe1f0 \
  --instance-type p4d.24xlarge \
  --key-name your-key-pair \
  --security-group-ids sg-xxxxxx \
  --subnet-id subnet-xxxxxx
```

**Specs:**
- 8x NVIDIA A100 Tensor Core GPUs
- 40 GB GPU memory per GPU (320 GB total)
- 400 Gbps networking
- $32/hour on-demand

## CPU Instances for API Gateway

Use CPU instances to run your HeySalad AI web dashboard and API gateway, while GPU instances handle model inference.

```bash
# Launch t3.medium for API gateway
aws ec2 run-instances \
  --image-id ami-0c55b159cbfafe1f0 \
  --instance-type t3.medium \
  --key-name your-key-pair \
  --security-group-ids sg-xxxxxx \
  --subnet-id subnet-xxxxxx \
  --user-data file://setup-api-gateway.sh
```

## Setup Instructions

### 1. Launch Instance

Choose your instance type based on the tables above.

### 2. Install NVIDIA Drivers (GPU Instances Only)

```bash
# SSH into your instance
ssh -i your-key.pem ubuntu@your-instance-ip

# Update system
sudo apt update && sudo apt upgrade -y

# Install NVIDIA drivers
sudo apt install -y nvidia-driver-535

# Install CUDA toolkit
wget https://developer.download.nvidia.com/compute/cuda/repos/ubuntu2204/x86_64/cuda-keyring_1.0-1_all.deb
sudo dpkg -i cuda-keyring_1.0-1_all.deb
sudo apt update
sudo apt install -y cuda

# Reboot
sudo reboot

# After reboot, verify installation
nvidia-smi
```

### 3. Install Docker (Recommended)

```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Install NVIDIA Container Toolkit
distribution=$(. /etc/os-release;echo $ID$VERSION_ID)
curl -s -L https://nvidia.github.io/nvidia-docker/gpgkey | sudo apt-key add -
curl -s -L https://nvidia.github.io/nvidia-docker/$distribution/nvidia-docker.list | \
  sudo tee /etc/apt/sources.list.d/nvidia-docker.list

sudo apt update
sudo apt install -y nvidia-docker2
sudo systemctl restart docker

# Test GPU access in Docker
docker run --rm --gpus all nvidia/cuda:11.8.0-base-ubuntu22.04 nvidia-smi
```

### 4. Install Python & Dependencies

```bash
# Install Python 3.10+
sudo apt install -y python3.10 python3-pip python3.10-venv

# Create virtual environment
python3 -m venv ~/heysalad-env
source ~/heysalad-env/bin/activate

# Install PyTorch with CUDA
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu118

# Install Hugging Face libraries
pip install transformers accelerate bitsandbytes optimum
```

### 5. Test GPU Setup

```python
# test_gpu.py
import torch

print(f"PyTorch version: {torch.__version__}")
print(f"CUDA available: {torch.cuda.is_available()}")
print(f"CUDA version: {torch.version.cuda}")
print(f"GPU count: {torch.cuda.device_count()}")

if torch.cuda.is_available():
    print(f"GPU name: {torch.cuda.get_device_name(0)}")
    print(f"GPU memory: {torch.cuda.get_device_properties(0).total_memory / 1e9:.2f} GB")
```

```bash
python test_gpu.py
```

## Cost Analysis

### Model Inference Costs (24/7 Operation)

| Setup | Instance Type | Monthly Cost | Cost per 1M tokens* |
|-------|---------------|--------------|---------------------|
| Small (7B) | g5.xlarge | $500 | $0.10 |
| Medium (13B) | g5.2xlarge | $750 | $0.15 |
| Large (70B) | g5.12xlarge | $3,800 | $0.30 |
| HF API | - | Pay per use | $0.60 |
| OpenAI GPT-4 | - | Pay per use | $30.00 |

*Approximate, depends on usage patterns

### Cost Optimization Strategies

#### 1. Use Spot Instances (Save 70%+)

```bash
# Launch spot instance
aws ec2 run-instances \
  --instance-type g5.xlarge \
  --spot-options 'MaxPrice=0.50,SpotInstanceType=one-time' \
  ...
```

**Pros:**
- 70-90% cheaper than on-demand
- Great for batch processing, fine-tuning

**Cons:**
- Can be interrupted
- Not reliable for production inference

#### 2. Use Reserved Instances (Save 30-50%)

Commit to 1 or 3 years:
- 1-year: ~30% savings
- 3-year: ~50% savings

#### 3. Use Savings Plans

Flexible reserved pricing:
- Commit to $/hour usage
- Apply to any instance family
- 1-year: ~25% savings
- 3-year: ~45% savings

#### 4. Auto-scaling with Lambda

For variable traffic:
```
- Use Lambda to start/stop instances
- Run inference only when needed
- Save 80%+ on low-traffic periods
```

#### 5. Hybrid Approach

```
Primary: Self-hosted on EC2 (cost-effective)
Overflow: Hugging Face API (handle spikes)
Fallback: OpenAI/Anthropic (reliability)
```

## Recommended Architecture

### For Development

```
1x t3.medium (API Gateway) - $30/month
1x g5.xlarge (Inference) - $500/month
Total: ~$530/month
```

### For Small Production

```
1x c5.large (API Gateway) - $60/month
1x g5.2xlarge (Inference) - $750/month
S3 + CloudFront (Assets) - $20/month
Total: ~$830/month
```

### For Large Production

```
ALB (Load Balancer) - $20/month
2x c5.xlarge (API Gateway) - $250/month
3x g5.4xlarge (Inference Pool) - $3,600/month
RDS (Database) - $100/month
S3 + CloudFront - $100/month
Total: ~$4,070/month
```

## Next Steps

1. **Choose your instance type** based on your model size and traffic
2. **Set up infrastructure** using the setup instructions
3. **Deploy inference server** (see [SELF_HOSTING.md](SELF_HOSTING.md))
4. **Configure monitoring** with CloudWatch
5. **Implement auto-scaling** for cost optimization

## Resources

- [AWS EC2 Pricing](https://aws.amazon.com/ec2/pricing/)
- [NVIDIA GPU Cloud](https://catalog.ngc.nvidia.com/)
- [Hugging Face Inference Endpoints](https://huggingface.co/inference-endpoints)

---

Need help? Open an issue or contact dev@heysalad.app
