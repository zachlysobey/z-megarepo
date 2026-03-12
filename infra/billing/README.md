# Billing

Terraform module for a **monthly budget** on the GCP project, with email alerts at
50%, 90%, and 100% of the budget. Alerts go to billing account administrators.

This module is managed through GitHub Actions CI (same GitOps flow as other
infra modules in this repo).

## Prerequisites

1. Re-run the bootstrap script with your billing account ID:

   ```bash
   cd infra/bootstrap
   ./bootstrap.sh z-megarepo zachlysobey/z-megarepo <BILLING_ACCOUNT_ID>
   ```

   This ensures:
   - `terraform-billing` service account exists
   - `billingbudgets.googleapis.com` is enabled
   - state bucket access is granted
   - billing IAM binding (`roles/billing.costsManager`) is set for billing CI

2. Configure GitHub Actions variables/secrets:
   - Variable: `GCP_PROJECT_ID`
   - Variable: `GCP_WIF_PROVIDER`
   - Variable: `GCP_BILLING_SERVICE_ACCOUNT`
   - Variable: `GCP_TF_STATE_BUCKET`
   - Secret: `GCP_BILLING_ACCOUNT_ID`

   The bootstrap script prints copy/paste `gh variable set` and
   `gh secret set` commands.

## CI behavior

- Pull requests that touch `infra/billing/**` run `terraform plan` and post the
  plan as a PR comment.
- Pushes to `master` touching `infra/billing/**` run `terraform apply`.
- The workflow uses the dedicated `terraform-billing` service account rather
  than the project-level `terraform-ci` account.
- Budget amount is hardcoded at `$50` per month in `main.tf`.

## When alerts fire

- **50%** — Half of the budget is spent.
- **90%** — Nearing the limit.
- **100%** — Budget reached (no automatic shutdown; this is alerting only).

The budget applies to all spend in the target project configured by
`project_id`.
