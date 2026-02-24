variable "project_id" {
  description = "GCP project ID"
  type        = string
}

variable "region" {
  description = "GCP region"
  type        = string
  default     = "us-east1"
}

variable "zone" {
  description = "GCP zone"
  type        = string
  default     = "us-east1-b"
}

variable "ssh_source_ranges" {
  description = "CIDR ranges allowed to SSH (default: anywhere, relying on OS Login for auth)"
  type        = list(string)
  default     = ["0.0.0.0/0"]
}
