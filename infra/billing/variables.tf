variable "project_id" {
  description = "The GCP project ID (e.g. z-megarepo)"
  type        = string
}

variable "billing_account_id" {
  description = "Billing account ID (from: gcloud billing accounts list)"
  type        = string
}

