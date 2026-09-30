output "bucket_name" {
  description = "Nome do bucket de backups."
  value       = digitalocean_spaces_bucket.ot74_backups.name
}
