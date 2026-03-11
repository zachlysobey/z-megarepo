# cloud-dev-vm

Terraform root module for a remote development environment — intended for
Claude Code, VS Code Remote SSH, or a general-purpose Linux box in the cloud.

Currently a minimal scaffold (provider config, GCS backend, no resources).
Actual VM provisioning will be added in a follow-up.

## CI

Applied automatically on pushes to `master` via
[`terraform-cloud-dev-vm.yml`](../../.github/workflows/terraform-cloud-dev-vm.yml).

To run locally:

```bash
terraform init \
  -backend-config="bucket=z-megarepo-tfstate" \
  -backend-config="prefix=cloud-dev-vm"

terraform plan -var="project_id=z-megarepo"
```
