# infra/

Infrastructure-as-code (Terraform) for GCP resources.

## First-time setup

Before any Terraform configs will work, you need to bootstrap GCP
credentials and remote state. See [`bootstrap/README.md`](bootstrap/README.md).

## Directory layout

- **`bootstrap/`** — One-time GCP + GitHub setup script
- **`cloud-dev-vm/`** — Terraform root module for the dev VM
