# Bootstrap

One-time GCP project setup for Terraform CI. This has already been run
against the `z-megarepo` project. The script is idempotent and safe to re-run
if needed.

## What the script does

`bootstrap.sh` configures:

1. Required GCP APIs (Compute, IAM, STS, etc.).
2. A GCS bucket (`z-megarepo-tfstate`) for Terraform remote state, with
   versioning enabled.
3. A `terraform-ci` service account with the roles Terraform needs
   (`compute.admin`, `iam.serviceAccountUser`, `storage.admin`).
4. **Workload Identity Federation** (WIF) so GitHub Actions can authenticate
   as that service account — no long-lived keys required.

## Prerequisites

To re-run or run against a new project:

1. The [**`gcloud` CLI**](https://docs.cloud.google.com/sdk/docs/install-sdk),
   authenticated as a user with Owner or Editor role (`gcloud auth login`).
2. A **GCP project** with billing enabled.

   ```bash
   gcloud projects create z-megarepo
   gcloud billing accounts list
   gcloud billing projects link z-megarepo --billing-account=<ACCOUNT_ID>
   ```

3. Your **GitHub repo name** in `owner/repo` format
   (e.g. `zachlysobey/z-megarepo`).

## Usage

```bash
cd infra/bootstrap
./bootstrap.sh <gcp-project-id> <github-owner/repo>
```

Example:

```bash
./bootstrap.sh z-megarepo zachlysobey/z-megarepo
```

## GitHub repo variables

The script outputs four values that are configured as **GitHub repo variables**
(Settings > Secrets and variables > Actions > Variables tab):

- **`GCP_PROJECT_ID`** — `z-megarepo`
- **`GCP_WIF_PROVIDER`** — the full provider path, e.g.
  `projects/<number>/locations/global/workloadIdentityPools/github-actions-pool/providers/github-actions-provider`
- **`GCP_SERVICE_ACCOUNT`** — `terraform-ci@z-megarepo.iam.gserviceaccount.com`
- **`GCP_TF_STATE_BUCKET`** — `z-megarepo-tfstate`
