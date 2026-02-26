#!/bin/bash
set -e

echo "🚀 Starting XUI Panel installation..."

# Check if running as root
if [ "$EUID" -ne 0 ]; then
  echo "❌ Please run as root (use sudo)"
  exit 1
fi

# Update system packages
echo "📦 Updating package list..."
apt update

# Install python3-venv if not present
echo "📦 Installing python3-venv..."
apt install -y python3-venv

# Get current directory (where the script is located)
INSTALL_DIR=$(pwd)
echo "📁 Installation directory: $INSTALL_DIR"

# Check if requirements.txt exists
if [ ! -f "$INSTALL_DIR/requirements.txt" ]; then
    echo "❌ requirements.txt not found in current directory!"
    exit 1
fi

# Create virtual environment
echo "🐍 Creating Python virtual environment..."
python3 -m venv venv

# Activate virtual environment and install requirements
echo "📦 Installing Python dependencies..."
source venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt
deactivate
echo "✅ Dependencies installed successfully."

# Create systemd service file
SERVICE_FILE="/etc/systemd/system/xui-panel.service"
echo "🔧 Creating systemd service file: $SERVICE_FILE"

cat > $SERVICE_FILE <<EOF
[Unit]
Description=XUI Panel Flask App
After=network.target

[Service]
User=root
WorkingDirectory=$INSTALL_DIR
ExecStart=$INSTALL_DIR/venv/bin/python $INSTALL_DIR/app.py
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
EOF

# Reload systemd and enable the service
echo "🔄 Reloading systemd daemon..."
systemctl daemon-reload

echo "⚙️ Enabling xui-panel service to start on boot..."
systemctl enable xui-panel.service

echo "▶️ Starting xui-panel service..."
systemctl start xui-panel.service

# Wait a moment for the service to start
sleep 3

# Show service status
echo "📋 Service status:"
systemctl status xui-panel.service --no-pager

# Get server IP address
IP=$(hostname -I | awk '{print $1}')

echo ""
echo "========================================="
echo "🎉 MRCO Panel installed successfully!"
echo "========================================="
echo "🌐 Panel URL: http://$IP:5006"
echo "👤 Default username: admin"
echo "🔑 Default password: admin"
echo ""
echo "📌 Useful commands:"
echo "   systemctl start xui-panel    # Start the panel"
echo "   systemctl stop xui-panel      # Stop the panel"
echo "   systemctl restart xui-panel   # Restart the panel"
echo "   systemctl status xui-panel    # Check status"
echo "   journalctl -u xui-panel -f    # View live logs"
echo "========================================="
