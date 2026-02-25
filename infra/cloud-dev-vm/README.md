# cloud-dev-vm

A persistent GCE instance used as a remote development environment — for
Claude Code, VS Code Remote SSH, or just a Linux box in the cloud.

## What it provisions

- A Compute Engine VM with a static external IP
- A firewall rule allowing SSH access
- OS Login for SSH authentication (no manually managed keys)
- A startup script (`startup.sh`) for initial machine setup

## Usage

This module is applied automatically by CI on pushes to `master`
(see the `terraform-cloud-dev-vm` workflow). To run locally:

```bash
terraform init \
  -backend-config="bucket=<project-id>-tfstate" \
  -backend-config="prefix=cloud-dev-vm"

terraform plan -var="project_id=<project-id>"
```

See [`../bootstrap/README.md`](../bootstrap/README.md) for first-time setup.
