# Bootstrap

One-time GCP project setup for Terraform CI. This has already been run
against the `z-megarepo` project. The script is idempotent and safe to re-run
if needed.

## What the script does

`bootstrap.sh` configures:

1. Required GCP APIs (Compute, IAM, STS, Billing Budgets, etc.).
2. A GCS bucket (`z-megarepo-tfstate`) for Terraform remote state, with
   versioning enabled.
3. A `terraform-ci` service account with project-level roles
   (`compute.admin`, `iam.serviceAccountUser`) and bucket-scoped
   `storage.objectAdmin` on the state bucket.
4. A `terraform-billing` service account with bucket-scoped
   `storage.objectAdmin` on the state bucket (no project admin roles).
5. **Workload Identity Federation** (WIF) so GitHub Actions can authenticate
   as these service accounts with no long-lived keys.
6. Optional billing account IAM binding (`roles/billing.costsManager`) for
   `terraform-billing` when a billing account ID is provided.

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
4. If using billing automation, a billing account where your user can grant
   IAM bindings (for `roles/billing.costsManager`).

## Usage

```bash
cd infra/bootstrap
./bootstrap.sh <gcp-project-id> <github-owner/repo> [billing-account-id]
```

Example:

```bash
./bootstrap.sh z-megarepo zachlysobey/z-megarepo
./bootstrap.sh z-megarepo zachlysobey/z-megarepo 000000-111111-222222
```

## GitHub repo variables

The script outputs values that are configured as **GitHub repo variables**
(Settings > Secrets and variables > Actions > Variables tab):

- **`GCP_PROJECT_ID`** — `z-megarepo`
- **`GCP_WIF_PROVIDER`** — the full provider path, e.g.
  `projects/<number>/locations/global/workloadIdentityPools/github-actions-pool/providers/github-actions-provider`
- **`GCP_SERVICE_ACCOUNT`** — `terraform-ci@z-megarepo.iam.gserviceaccount.com`
- **`GCP_BILLING_SERVICE_ACCOUNT`** — `terraform-billing@z-megarepo.iam.gserviceaccount.com`
- **`GCP_TF_STATE_BUCKET`** — `z-megarepo-tfstate`
- **`GCP_BUDGET_AMOUNT_USD`** — default monthly budget value (for CI workflows)

Also set this as a GitHub Actions secret:

- **`GCP_BILLING_ACCOUNT_ID`** — billing account ID used by the billing module

The script prints copy/paste `gh variable set ...` and `gh secret set ...`
commands to minimize manual UI steps.
