#!/bin/bash
set -euo pipefail

export DEBIAN_FRONTEND=noninteractive

apt-get update
apt-get install -y git xz-utils

# NVM (system-wide at /opt/nvm)
export NVM_DIR="/opt/nvm"
mkdir -p "$NVM_DIR"
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | NVM_DIR="$NVM_DIR" bash

cat > /etc/profile.d/nvm.sh << 'EOF'
export NVM_DIR="/opt/nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"
EOF

# Install Node LTS via nvm (needed for Claude Code)
. "$NVM_DIR/nvm.sh"
nvm install --lts

# Claude Code
npm install -g @anthropic-ai/claude-code

# Helix editor
HELIX_VERSION="24.07"
curl -L "https://github.com/helix-editor/helix/releases/download/${HELIX_VERSION}/helix-${HELIX_VERSION}-x86_64-linux.tar.xz" -o /tmp/helix.tar.xz
mkdir -p /opt/helix
tar xf /tmp/helix.tar.xz -C /opt/helix --strip-components=1
ln -sf /opt/helix/hx /usr/local/bin/hx
rm /tmp/helix.tar.xz

cat > /etc/profile.d/helix.sh << 'EOF'
export HELIX_RUNTIME=/opt/helix/runtime
EOF
