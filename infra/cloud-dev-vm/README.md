# cloud-dev-vm

Terraform root module for a cloud development VM with a static IP, OS Login,
and dev tooling.

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
