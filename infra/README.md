# infra/

Infrastructure-as-code (Terraform) for GCP resources in the `z-megarepo`
project. All Terraform modules are planned and applied via GitHub Actions CI.

## Directory layout

- **[`bootstrap/`](bootstrap/)** — One-time GCP project setup: remote state
  bucket, service account, and Workload Identity Federation for CI.
- **[`cloud-dev-vm/`](cloud-dev-vm/)** — Terraform root module for a remote
  development environment.
- **[`billing/`](billing/)** — Monthly budget and email alerts (50%/90%/100%) for
  the project.
