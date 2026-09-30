output "droplet_ip" {
  description = "IPv4 pública do ambiente."
  value       = module.compute.droplet_ip
}

output "domain" {
  description = "Domínio do ambiente (vazio se DNS desabilitado)."
  value       = var.domain_name != "" ? module.dns[0].domain : ""
}

output "backup_bucket" {
  description = "Bucket de backups do ambiente."
  value       = module.backups.bucket_name
}
