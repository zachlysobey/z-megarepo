output "external_ip" {
  description = "Static public IP — use this in Termius (persists across stop/start)"
  value       = google_compute_address.dev_vm.address
}

output "ssh_command" {
  description = "gcloud SSH command"
  value       = "gcloud compute ssh ${google_compute_instance.dev_vm.name} --zone=${var.zone} --project=${var.project_id}"
}
