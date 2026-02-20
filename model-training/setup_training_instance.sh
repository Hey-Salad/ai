#!/bin/bash
# HeySalad Model Training Instance Setup
# Run this on a fresh EC2 g5.xlarge instance

set -e

echo "=========================================="
echo "  🥗 HeySalad Training Instance Setup"
echo "=========================================="

# Update system
echo "📦 Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install NVIDIA drivers
echo "🔧 Installing NVIDIA drivers..."
sudo apt install -y nvidia-driver-535

# Install CUDA
echo "🔧 Installing CUDA toolkit..."
wget https://developer.download.nvidia.com/compute/cuda/repos/ubuntu2204/x86_64/cuda-keyring_1.0-1_all.deb
sudo dpkg -i cuda-keyring_1.0-1_all.deb
sudo apt update
sudo apt install -y cuda

# Install Python and pip
echo "🐍 Installing Python 3.10..."
sudo apt install -y python3.10 python3-pip python3.10-venv git

# Create virtual environment
echo "📁 Creating virtual environment..."
python3 -m venv ~/heysalad-train-env
source ~/heysalad-train-env/bin/activate

# Install PyTorch with CUDA
echo "🔥 Installing PyTorch with CUDA support..."
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu118

# Install training dependencies
echo "📚 Installing training libraries..."
pip install transformers==4.37.0
pip install peft==0.8.2
pip install accelerate==0.26.1
pip install bitsandbytes==0.42.0
pip install datasets==2.16.1
pip install wandb

# Optional: Install vLLM for inference testing
echo "🚀 Installing vLLM..."
pip install vllm

# Test GPU
echo "🧪 Testing GPU..."
python3 << EOF
import torch
print(f"PyTorch version: {torch.__version__}")
print(f"CUDA available: {torch.cuda.is_available()}")
print(f"CUDA version: {torch.version.cuda}")
if torch.cuda.is_available():
    print(f"GPU: {torch.cuda.get_device_name(0)}")
    print(f"GPU Memory: {torch.cuda.get_device_properties(0).total_memory / 1e9:.2f} GB")
else:
    print("⚠️  WARNING: No GPU detected!")
EOF

# Clone HeySalad AI repo
echo "📥 Cloning HeySalad AI repository..."
if [ ! -d ~/heysalad-ai ]; then
    git clone https://github.com/Hey-Salad/ai.git ~/heysalad-ai
fi

# Create directories
echo "📁 Creating directories..."
mkdir -p ~/heysalad-ai/model-training/data
mkdir -p ~/heysalad-ai/model-training/models

# Install Hugging Face CLI
echo "🤗 Installing Hugging Face CLI..."
pip install huggingface-hub

echo ""
echo "=========================================="
echo "  ✅ Setup Complete!"
echo "=========================================="
echo ""
echo "🔑 Next steps:"
echo ""
echo "1. Set up Hugging Face token:"
echo "   huggingface-cli login"
echo ""
echo "2. Set up Weights & Biases (optional):"
echo "   wandb login"
echo ""
echo "3. Create training data:"
echo "   cd ~/heysalad-ai/model-training"
echo "   python collect_training_data.py"
echo ""
echo "4. Start training:"
echo "   python train_heysalad.py"
echo ""
echo "5. Test the model:"
echo "   python test_heysalad.py"
echo ""
echo "6. Deploy with vLLM:"
echo "   python -m vllm.entrypoints.openai.api_server \\"
echo "     --model ./heysalad-7b-XXXXXXXX \\"
echo "     --host 0.0.0.0 \\"
echo "     --port 8000"
echo ""
echo "Instance info:"
echo "  GPU: $(nvidia-smi --query-gpu=name --format=csv,noheader)"
echo "  Memory: $(nvidia-smi --query-gpu=memory.total --format=csv,noheader)"
echo "  CUDA: $(nvcc --version | grep "release" | awk '{print $6}')"
echo ""
echo "Happy training! 🚀"
