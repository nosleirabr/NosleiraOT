# Firewall da DigitalOcean: só entra o necessário, MySQL fica interno ao Docker.
resource "digitalocean_firewall" "ot74" {
  name        = "ot74-${var.env}"
  droplet_ids = var.droplet_ids

  # SSH restrito por CIDR (ideal: só IP do admin).
  inbound_rule {
    protocol         = "tcp"
    port_range       = "22"
    source_addresses = var.ssh_allowed_addresses
  }

  # Site via Cloudflare (80 para ACME + redirect, 443 HTTPS).
  inbound_rule {
    protocol         = "tcp"
    port_range       = "80"
    source_addresses = ["0.0.0.0/0", "::/0"]
  }

  inbound_rule {
    protocol         = "tcp"
    port_range       = "443"
    source_addresses = ["0.0.0.0/0", "::/0"]
  }

  # Protocolo Tibia: login 7171 + game 7172 com rate-limit no UFW/fail2ban.
  inbound_rule {
    protocol         = "tcp"
    port_range       = "7171-7172"
    source_addresses = ["0.0.0.0/0", "::/0"]
  }

  # Saída liberada (updates, DNS, Spaces, Cloudflare).
  outbound_rule {
    protocol              = "tcp"
    port_range            = "1-65535"
    destination_addresses = ["0.0.0.0/0", "::/0"]
  }

  outbound_rule {
    protocol              = "udp"
    port_range            = "1-65535"
    destination_addresses = ["0.0.0.0/0", "::/0"]
  }

  outbound_rule {
    protocol              = "icmp"
    destination_addresses = ["0.0.0.0/0", "::/0"]
  }
}
