# Bootstrap

One-time setup that prepares a GCP project and GitHub repo for Terraform CI.

Run this **before** your first `terraform init` or CI run.

## Prerequisites

1. A **GCP project** with billing enabled.
2. The **`gcloud` CLI**, authenticated as a user with Owner or Editor role
   on that project (`gcloud auth login`).
3. Your **GitHub repo name** in `owner/repo` format
   (e.g. `zachlysobey/z-megarepo`).

## What the script does

`bootstrap.sh` is idempotent — safe to re-run. It:

1. Enables the required GCP APIs (Compute, IAM, STS, etc.).
2. Creates a GCS bucket (`<project-id>-tfstate`) for Terraform remote state,
   with versioning enabled.
3. Creates a `terraform-ci` service account and grants it the roles Terraform
   needs (`compute.admin`, `iam.serviceAccountUser`, `storage.admin`).
4. Sets up **Workload Identity Federation** (WIF) so GitHub Actions can
   authenticate as that service account — no long-lived keys required.

## Usage

```bash
cd infra/bootstrap
./bootstrap.sh <gcp-project-id> <github-owner/repo>
```

Example:

```bash
./bootstrap.sh my-project-123 zachlysobey/z-megarepo
```

## After running

The script prints four values. Set them as **GitHub repo variables**
(Settings > Secrets and variables > Actions > Variables tab):

- **`GCP_PROJECT_ID`** — e.g. `my-project-123`
- **`GCP_WIF_PROVIDER`** — the full provider path, e.g.
  `projects/123456/locations/global/workloadIdentityPools/github-actions-pool/providers/github-actions-provider`
- **`GCP_SERVICE_ACCOUNT`** — e.g. `terraform-ci@my-project-123.iam.gserviceaccount.com`
- **`GCP_TF_STATE_BUCKET`** — e.g. `my-project-123-tfstate`

Once those are set, CI will authenticate and manage state automatically.
