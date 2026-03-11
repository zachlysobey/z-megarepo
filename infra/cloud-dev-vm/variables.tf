variable "project_id" {
  description = "The GCP project ID to deploy into"
  type        = string
}

variable "region" {
  description = "The GCP region for resources"
  type        = string
  default     = "us-east1"
}

variable "zone" {
  description = "The GCP zone for resources"
  type        = string
  default     = "us-east1-b"
}

# Open to all IPs because SSH access requires OS Login (Google account auth),
# and the VM needs to be reachable from devices without stable IPs (e.g. phone).
variable "ssh_source_ranges" {
  description = "CIDR ranges allowed to SSH"
  type        = list(string)
  default     = ["0.0.0.0/0"]
}
