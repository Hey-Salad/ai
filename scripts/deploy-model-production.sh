#!/bin/bash
# Deploy HeySalad-7B Model to Production
# Run this on the GPU instance after training is complete

set -e

echo "🚀 Deploying HeySalad-7B to Production"
echo "======================================"

# Configuration
MODEL_PATH="${1:-./heysalad-7b-*}"
PORT="${2:-8000}"
DOMAIN="${3:-}"

# Check if model exists
if [ ! -d "$MODEL_PATH" ]; then
    echo "❌ Model not found at: $MODEL_PATH"
    echo "Please provide model path: $0 /path/to/model"
    exit 1
fi

MODEL_PATH=$(realpath "$MODEL_PATH")
echo "📦 Model path: $MODEL_PATH"

# Install vLLM if not already installed
if ! command -v vllm &> /dev/null; then
    echo "📥 Installing vLLM..."
    pip install vllm
fi

# Create systemd service
echo "⚙️  Creating systemd service..."
sudo tee /etc/systemd/system/heysalad-model.service > /dev/null << EOF
[Unit]
Description=HeySalad-7B Model Server
After=network.target

[Service]
Type=simple
User=$USER
WorkingDirectory=$HOME
Environment="PATH=$HOME/heysalad-train-env/bin:/usr/local/bin:/usr/bin:/bin"
ExecStart=$HOME/heysalad-train-env/bin/python -m vllm.entrypoints.openai.api_server \
    --model $MODEL_PATH \
    --host 0.0.0.0 \
    --port $PORT \
    --dtype half \
    --gpu-memory-utilization 0.9 \
    --max-model-len 2048
Restart=always
RestartSec=10
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
EOF

# Reload systemd and enable service
echo "🔄 Enabling service..."
sudo systemctl daemon-reload
sudo systemctl enable heysalad-model
sudo systemctl start heysalad-model

# Wait for service to start
echo "⏳ Waiting for model to load..."
sleep 10

# Check service status
if sudo systemctl is-active --quiet heysalad-model; then
    echo "✅ Service is running!"
else
    echo "❌ Service failed to start. Checking logs..."
    sudo journalctl -u heysalad-model -n 50
    exit 1
fi

# Test the endpoint
echo "🧪 Testing endpoint..."
PUBLIC_IP=$(curl -s http://checkip.amazonaws.com)
sleep 5

RESPONSE=$(curl -s -X POST http://localhost:$PORT/v1/chat/completions \
    -H "Content-Type: application/json" \
    -d '{
        "model": "heysalad-7b",
        "messages": [{"role": "user", "content": "Hello"}],
        "max_tokens": 50
    }' || echo "FAILED")

if [[ $RESPONSE == *"content"* ]]; then
    echo "✅ Model is responding!"
else
    echo "⚠️  Model may still be loading. Check logs with:"
    echo "   sudo journalctl -u heysalad-model -f"
fi

# Set up Nginx if domain provided
if [ -n "$DOMAIN" ]; then
    echo ""
    echo "🌐 Setting up Nginx reverse proxy..."

    # Install Nginx
    if ! command -v nginx &> /dev/null; then
        echo "📥 Installing Nginx..."
        sudo apt update
        sudo apt install -y nginx certbot python3-certbot-nginx
    fi

    # Create Nginx config
    sudo tee /etc/nginx/sites-available/heysalad-model > /dev/null << EOF
server {
    listen 80;
    server_name $DOMAIN;

    location / {
        proxy_pass http://localhost:$PORT;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;

        # Important for streaming
        proxy_buffering off;
        proxy_cache off;

        # Timeouts
        proxy_connect_timeout 300s;
        proxy_send_timeout 300s;
        proxy_read_timeout 300s;
    }
}
EOF

    # Enable site
    sudo ln -sf /etc/nginx/sites-available/heysalad-model /etc/nginx/sites-enabled/
    sudo nginx -t
    sudo systemctl restart nginx

    # Set up SSL with Let's Encrypt
    echo "🔒 Setting up HTTPS..."
    sudo certbot --nginx -d $DOMAIN --non-interactive --agree-tos --email dev@heysalad.app

    echo "✅ HTTPS enabled!"
    ENDPOINT="https://$DOMAIN"
else
    ENDPOINT="http://$PUBLIC_IP:$PORT"
fi

echo ""
echo "======================================"
echo "✅ Deployment Complete!"
echo "======================================"
echo ""
echo "📊 Service Status:"
sudo systemctl status heysalad-model --no-pager | head -15
echo ""
echo "🌐 Model Endpoint:"
echo "   $ENDPOINT/v1/chat/completions"
echo ""
echo "🧪 Test Command:"
echo "   curl -X POST $ENDPOINT/v1/chat/completions \\"
echo "     -H 'Content-Type: application/json' \\"
echo "     -d '{\"model\":\"heysalad-7b\",\"messages\":[{\"role\":\"user\",\"content\":\"Hello\"}]}'"
echo ""
echo "📝 View Logs:"
echo "   sudo journalctl -u heysalad-model -f"
echo ""
echo "🔄 Manage Service:"
echo "   sudo systemctl status heysalad-model"
echo "   sudo systemctl restart heysalad-model"
echo "   sudo systemctl stop heysalad-model"
echo ""
echo "💻 Connect to HeySalad AI:"
echo "   client.configureProvider('huggingface', {"
echo "     baseURL: '$ENDPOINT/v1/models'"
echo "   });"
echo ""
echo "💰 Monthly Cost: ~$500 (g5.xlarge 24/7)"
echo "🎉 Your model is LIVE!"
