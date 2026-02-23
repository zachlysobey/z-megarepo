output "external_ip" {
  description = "Static public IP — use this in Termius (persists across stop/start)"
  value       = google_compute_address.dev_vm.address
}

output "ssh_command" {
  description = "gcloud SSH command"
  value       = "gcloud compute ssh cloud-dev-vm --zone=${var.zone} --project=${var.project_id}"
}
