# Cria a chave SSH e o Droplet com user-data de bootstrap.
resource "digitalocean_ssh_key" "ot74" {
  name       = var.ssh_key_name
  public_key = var.ssh_public_key
}

# Bootstrap da VM: docker + compose + UFW + fail2ban + cron de backup.
# Comentários do script em português por padrão do repo.
resource "digitalocean_droplet" "ot74" {
  name     = "ot74-${var.env}"
  region   = var.region
  size     = var.droplet_size
  image    = var.droplet_image
  ssh_keys = [digitalocean_ssh_key.ot74.fingerprint]
  tags     = concat(var.tags, ["env:${var.env}"])

  user_data = templatefile("${path.module}/user-data.sh", {
    env = var.env
  })
}
