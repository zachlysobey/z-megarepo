variable "project_id" {
  description = "The GCP project ID (e.g. z-megarepo)"
  type        = string
}

variable "billing_account_id" {
  description = "Billing account ID (from: gcloud billing accounts list)"
  type        = string
}

variable "budget_amount_usd" {
  description = "Monthly budget amount in USD; alerts at 50%, 90%, 100%"
  type        = number
  default     = 50

  validation {
    condition     = var.budget_amount_usd > 0
    error_message = "budget_amount_usd must be a positive number of US dollars."
  }
}
