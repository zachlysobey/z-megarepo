terraform {
  required_version = ">= 1.5"
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.0"
    }
  }
  backend "gcs" {}
}

provider "google" {
  project = var.project_id
}

# Budget scoped to this project. Alerts at 50%, 90%, and 100% of the budget
# are sent to billing account administrators (no extra notification config).
resource "google_billing_budget" "project" {
  billing_account = var.billing_account_id
  display_name    = "${var.project_id} project budget"

  budget_filter {
    projects = ["projects/${var.project_id}"]
  }

  amount {
    specified_amount {
      currency_code = "USD"
      units         = tostring(floor(var.budget_amount_usd))
      nanos         = floor((var.budget_amount_usd - floor(var.budget_amount_usd)) * 1000000000)
    }
  }

  threshold_rules {
    threshold_percent = 0.5
  }
  threshold_rules {
    threshold_percent = 0.9
  }
  threshold_rules {
    threshold_percent = 1.0
  }
}
