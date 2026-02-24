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

variable "project_id" {
  type = string
}

provider "google" {
  project = var.project_id
}

output "hello" {
  value = "cloud-dev-vm scaffold is working in ${var.project_id}"
}
