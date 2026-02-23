#!/bin/bash
set -euo pipefail

PROJECT_ID="${1:?Usage: ./bootstrap.sh <project-id> <github-repo>}"
GITHUB_REPO="${2:?Usage: ./bootstrap.sh <project-id> <github-repo>}"

REGION="us-east1"
STATE_BUCKET="${PROJECT_ID}-tfstate"
SA_NAME="terraform-ci"
SA_EMAIL="${SA_NAME}@${PROJECT_ID}.iam.gserviceaccount.com"
WIF_POOL="github-actions-pool"
WIF_PROVIDER="github-actions-provider"

echo "=== Bootstrapping GCP project: ${PROJECT_ID} ==="
echo "    GitHub repo: ${GITHUB_REPO}"
echo ""

gcloud config set project "$PROJECT_ID"

# Enable required APIs
echo "Enabling APIs..."
gcloud services enable \
  compute.googleapis.com \
  iam.googleapis.com \
  cloudresourcemanager.googleapis.com \
  iamcredentials.googleapis.com \
  sts.googleapis.com

# Create GCS bucket for Terraform state
echo "Creating state bucket..."
gcloud storage buckets create "gs://${STATE_BUCKET}" \
  --location="$REGION" \
  --uniform-bucket-level-access \
  2>/dev/null || echo "  Bucket already exists, skipping."

gcloud storage buckets update "gs://${STATE_BUCKET}" --versioning

# Create service account for Terraform CI
echo "Creating service account..."
gcloud iam service-accounts create "$SA_NAME" \
  --display-name="Terraform CI" \
  2>/dev/null || echo "  Service account already exists, skipping."

echo "Granting roles..."
for role in roles/compute.admin roles/iam.serviceAccountUser roles/storage.admin; do
  gcloud projects add-iam-policy-binding "$PROJECT_ID" \
    --member="serviceAccount:${SA_EMAIL}" \
    --role="$role" \
    --condition=None \
    --quiet
done

# Workload Identity Federation (keyless auth for GitHub Actions)
echo "Setting up Workload Identity Federation..."
gcloud iam workload-identity-pools create "$WIF_POOL" \
  --location="global" \
  --display-name="GitHub Actions" \
  2>/dev/null || echo "  Pool already exists, skipping."

gcloud iam workload-identity-pools providers create-oidc "$WIF_PROVIDER" \
  --location="global" \
  --workload-identity-pool="$WIF_POOL" \
  --display-name="GitHub Actions" \
  --attribute-mapping="google.subject=assertion.sub,attribute.repository=assertion.repository" \
  --issuer-uri="https://token.actions.githubusercontent.com" \
  2>/dev/null || echo "  Provider already exists, skipping."

PROJECT_NUMBER=$(gcloud projects describe "$PROJECT_ID" --format="value(projectNumber)")

gcloud iam service-accounts add-iam-policy-binding "$SA_EMAIL" \
  --role="roles/iam.workloadIdentityUser" \
  --member="principalSet://iam.googleapis.com/projects/${PROJECT_NUMBER}/locations/global/workloadIdentityPools/${WIF_POOL}/attribute.repository/${GITHUB_REPO}"

echo ""
echo "=== Bootstrap complete ==="
echo ""
echo "Add these as GitHub repository variables (Settings > Secrets and variables > Actions):"
echo ""
echo "  GCP_PROJECT_ID:       ${PROJECT_ID}"
echo "  GCP_WIF_PROVIDER:     projects/${PROJECT_NUMBER}/locations/global/workloadIdentityPools/${WIF_POOL}/providers/${WIF_PROVIDER}"
echo "  GCP_SERVICE_ACCOUNT:  ${SA_EMAIL}"
echo "  GCP_TF_STATE_BUCKET:  ${STATE_BUCKET}"
