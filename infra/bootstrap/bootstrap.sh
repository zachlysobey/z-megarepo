#!/bin/bash
set -euo pipefail

DRY_RUN=false
if [[ "${1:-}" == "--dry-run" ]]; then
  DRY_RUN=true
  shift
fi

PROJECT_ID="${1:?Usage: ./bootstrap.sh [--dry-run] <project-id> <github-repo>}"
GITHUB_REPO="${2:?Usage: ./bootstrap.sh [--dry-run] <project-id> <github-repo>}"

run() {
  if $DRY_RUN; then
    echo "[dry-run] $*"
  else
    "$@"
  fi
}

STATE_BUCKET="${PROJECT_ID}-tfstate"
SA_NAME="terraform-ci"
SA_EMAIL="${SA_NAME}@${PROJECT_ID}.iam.gserviceaccount.com"
WIF_POOL="github-actions-pool"
WIF_PROVIDER="github-actions-provider"

run gcloud config set project "$PROJECT_ID"

run gcloud services enable \
  compute.googleapis.com \
  iam.googleapis.com \
  cloudresourcemanager.googleapis.com \
  iamcredentials.googleapis.com \
  sts.googleapis.com

# State bucket
run gcloud storage buckets create "gs://${STATE_BUCKET}" \
  --location=us-east1 --uniform-bucket-level-access \
  2>/dev/null || echo "Bucket already exists"
run gcloud storage buckets update "gs://${STATE_BUCKET}" --versioning

# Service account
run gcloud iam service-accounts create "$SA_NAME" --display-name="Terraform CI" \
  2>/dev/null || echo "SA already exists"
for role in roles/compute.admin roles/iam.serviceAccountUser roles/storage.admin; do
  run gcloud projects add-iam-policy-binding "$PROJECT_ID" \
    --member="serviceAccount:${SA_EMAIL}" --role="$role" --condition=None --quiet
done

# Workload Identity Federation
run gcloud iam workload-identity-pools create "$WIF_POOL" \
  --location=global --display-name="GitHub Actions" \
  2>/dev/null || echo "Pool already exists"
run gcloud iam workload-identity-pools providers create-oidc "$WIF_PROVIDER" \
  --location=global --workload-identity-pool="$WIF_POOL" \
  --display-name="GitHub Actions" \
  --attribute-mapping="google.subject=assertion.sub,attribute.repository=assertion.repository" \
  --attribute-condition="assertion.repository == '${GITHUB_REPO}'" \
  --issuer-uri="https://token.actions.githubusercontent.com" \
  2>/dev/null || echo "Provider already exists"

if $DRY_RUN; then
  echo "[dry-run] gcloud projects describe $PROJECT_ID --format=value(projectNumber)"
  PROJECT_NUMBER="<PROJECT_NUMBER>"
else
  PROJECT_NUMBER=$(gcloud projects describe "$PROJECT_ID" --format="value(projectNumber)")
fi
run gcloud iam service-accounts add-iam-policy-binding "$SA_EMAIL" \
  --role="roles/iam.workloadIdentityUser" \
  --member="principalSet://iam.googleapis.com/projects/${PROJECT_NUMBER}/locations/global/workloadIdentityPools/${WIF_POOL}/attribute.repository/${GITHUB_REPO}"

echo ""
echo "Set these as GitHub repo variables:"
echo "  GCP_PROJECT_ID:      ${PROJECT_ID}"
echo "  GCP_WIF_PROVIDER:    projects/${PROJECT_NUMBER}/locations/global/workloadIdentityPools/${WIF_POOL}/providers/${WIF_PROVIDER}"
echo "  GCP_SERVICE_ACCOUNT: ${SA_EMAIL}"
echo "  GCP_TF_STATE_BUCKET: ${STATE_BUCKET}"
