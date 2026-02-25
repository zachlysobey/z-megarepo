# infra/

Infrastructure-as-code (Terraform) for GCP resources.

## First-time setup

Before any Terraform configs will work, you need to bootstrap GCP
credentials and remote state. See [`bootstrap/README.md`](bootstrap/README.md).

## Directory layout

- **[`bootstrap/`](bootstrap/)** — One-time script that sets up GCP
  credentials, remote state, and Workload Identity Federation for CI.
- **[`cloud-dev-vm/`](cloud-dev-vm/)** — Terraform root module for a
  persistent GCE instance used as a remote dev environment.
