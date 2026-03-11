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

## Operations

### Stop / start the VM from GitHub

You can stop or start the VM from the **Actions** tab without installing
`gcloud` locally:

- Go to **Actions** → **Cloud dev VM: stop or start**
- Click **Run workflow**
- Choose `stop` or `start` and confirm

Under the hood this workflow authenticates with the same Workload Identity
Federation setup used by Terraform CI and runs:

```bash
gcloud compute instances stop cloud-dev-vm --zone=us-east1-b --project=z-megarepo
gcloud compute instances start cloud-dev-vm --zone=us-east1-b --project=z-megarepo
```

