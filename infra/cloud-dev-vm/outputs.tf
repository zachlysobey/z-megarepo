output "external_ip" {
  description = "Public IP address — use this in Termius"
  value       = google_compute_instance.dev_vm.network_interface[0].access_config[0].nat_ip
}

output "ssh_command" {
  description = "gcloud SSH command"
  value       = "gcloud compute ssh cloud-dev-vm --zone=${var.zone} --project=${var.project_id}"
}
