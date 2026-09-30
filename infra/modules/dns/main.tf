# Zona DNS + registros A para site e jogo.
resource "digitalocean_domain" "ot74" {
  name = var.domain_name
}

resource "digitalocean_record" "root" {
  domain = digitalocean_domain.ot74.id
  type   = "A"
  name   = "@"
  value  = var.droplet_ip
  ttl    = 300
}

resource "digitalocean_record" "www" {
  domain = digitalocean_domain.ot74.id
  type   = "A"
  name   = "www"
  value  = var.droplet_ip
  ttl    = 300
}

resource "digitalocean_record" "game" {
  count  = var.create_game_record ? 1 : 0
  domain = digitalocean_domain.ot74.id
  type   = "A"
  name   = "game"
  value  = var.droplet_ip
  ttl    = 300
}
