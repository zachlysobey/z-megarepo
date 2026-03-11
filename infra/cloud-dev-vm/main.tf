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
  zone    = var.zone
}

resource "google_compute_address" "dev_vm" {
  name   = "cloud-dev-vm-ip"
  region = var.region
}

# No service_account block — uses default CE SA. This VM doesn't call GCP
# APIs, so scoped credentials aren't needed.
resource "google_compute_instance" "dev_vm" {
  name         = "cloud-dev-vm"
  machine_type = "e2-medium"
  zone         = var.zone

  boot_disk {
    initialize_params {
      image = "debian-cloud/debian-12"
      size  = 20
      type  = "pd-ssd"
    }
  }

  network_interface {
    network = "default"
    access_config {
      nat_ip = google_compute_address.dev_vm.address
    }
  }

  metadata = {
    enable-oslogin = "TRUE"
  }

  metadata_startup_script = file("${path.module}/startup.sh")

  tags = ["cloud-dev-vm"]
}

resource "google_compute_firewall" "dev_vm_allow_ssh" {
  name    = "cloud-dev-vm-allow-ssh"
  network = "default"

  allow {
    protocol = "tcp"
    ports    = ["22"]
  }

  source_ranges = var.ssh_source_ranges
  target_tags   = ["cloud-dev-vm"]
}
