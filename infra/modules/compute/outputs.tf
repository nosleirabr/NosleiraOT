output "droplet_id" {
  description = "ID do Droplet criado."
  value       = digitalocean_droplet.ot74.id
}

output "droplet_ip" {
  description = "IPv4 pública do Droplet."
  value       = digitalocean_droplet.ot74.ipv4_address
}

output "droplet_name" {
  description = "Nome do Droplet."
  value       = digitalocean_droplet.ot74.name
}
