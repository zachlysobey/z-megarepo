#!/bin/bash
set -euo pipefail

PROVISION_VERSION="1"
PROVISION_MARKER="/opt/.cloud-dev-vm-v${PROVISION_VERSION}"

if [ -f "$PROVISION_MARKER" ]; then
  echo "Already provisioned (v${PROVISION_VERSION}), skipping."
  exit 0
fi

export DEBIAN_FRONTEND=noninteractive

apt-get update
apt-get install -y curl ca-certificates git

export NVM_DIR="/opt/nvm"
mkdir -p "$NVM_DIR"
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | NVM_DIR="$NVM_DIR" bash
chmod -R 755 "$NVM_DIR"

cat > /etc/profile.d/nvm.sh << 'EOF'
export NVM_DIR="/opt/nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"
EOF

. "$NVM_DIR/nvm.sh"
nvm install --lts

npm install -g @anthropic-ai/claude-code

touch "$PROVISION_MARKER"
