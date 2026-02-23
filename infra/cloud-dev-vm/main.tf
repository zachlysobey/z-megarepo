terraform {
  required_version = ">= 1.5"

  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.0"
    }
  }

  backend "gcs" {
    # Bucket and prefix are passed via -backend-config at init time.
    # See terraform-shared.yml or run manually:
    #   terraform init \
    #     -backend-config="bucket=<project-id>-tfstate" \
    #     -backend-config="prefix=cloud-dev-vm"
  }
}

provider "google" {
  project = var.project_id
  region  = var.region
  zone    = var.zone
}

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
      # Ephemeral public IP
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

  source_ranges = ["0.0.0.0/0"]
  target_tags   = ["cloud-dev-vm"]
}
