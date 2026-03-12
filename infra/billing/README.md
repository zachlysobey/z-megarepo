# Billing

Terraform module for a **monthly budget** on the GCP project, with email alerts at
50%, 90%, and 100% of the budget. Alerts go to billing account administrators.

Apply this **locally** (not from CI): budget creation requires billing account
access. Use your own `gcloud auth login` and pass the billing account ID.

## Prerequisites

1. [gcloud CLI](https://docs.cloud.google.com/sdk/docs/install-sdk) authenticated:
   `gcloud auth login`
2. If `terraform apply` fails with an API error, enable the Billing and Budgets APIs:
   `gcloud services enable cloudbilling.googleapis.com billingbudgets.googleapis.com --project=z-megarepo`
3. Billing account ID:
   ```bash
   gcloud billing accounts list
   ```
   Use the `ACCOUNT_ID` (not the name).

## Usage

```bash
cd infra/billing
terraform init \
  -backend-config="bucket=z-megarepo-tfstate" \
  -backend-config="prefix=billing"

terraform plan \
  -var="project_id=z-megarepo" \
  -var="billing_account_id=YOUR_ACCOUNT_ID" \
  -var="budget_amount_usd=50"

terraform apply \
  -var="project_id=z-megarepo" \
  -var="billing_account_id=YOUR_ACCOUNT_ID" \
  -var="budget_amount_usd=50"
```

Or use a `terraform.tfvars` (gitignored) and run `terraform apply` without
repeating `-var`. Default budget is $50/month; change `budget_amount_usd` as needed.

## When alerts fire

- **50%** — Half of the budget is spent.
- **90%** — Nearing the limit.
- **100%** — Budget reached (no automatic shutdown; this is alerting only).

You can create this budget before any other resources (e.g. before merging the
cloud-dev-vm PR); it applies to all spend in the project.
