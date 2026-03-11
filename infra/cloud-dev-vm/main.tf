terraform {
  required_version = ">= 1.5"
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.0"
    }
  }
  # "Partial backend config" — bucket, prefix, etc. are injected via
  # -backend-config flags at `terraform init` time (see CI workflow).
  # This keeps environment-specific values out of checked-in code.
  backend "gcs" {}
}

provider "google" {
  project = var.project_id
  region  = var.region
}

output "hello" {
  value = "cloud-dev-vm scaffold is working in ${var.project_id}"
}
