# Compõe compute + firewall + dns (opcional) + backups.
module "compute" {
  source         = "../modules/compute"
  env            = var.env
  region         = var.region
  droplet_size   = var.droplet_size
  ssh_key_name   = var.ssh_key_name
  ssh_public_key = var.ssh_public_key
  tags           = ["ot74", "env:${var.env}"]
}

module "firewall" {
  source                = "../modules/firewall"
  env                   = var.env
  droplet_ids           = [module.compute.droplet_id]
  ssh_allowed_addresses = var.ssh_allowed_addresses
}

# DNS só quando domain_name informado (dev pode ficar sem domínio).
module "dns" {
  count       = var.domain_name != "" ? 1 : 0
  source      = "../modules/dns"
  domain_name = var.domain_name
  droplet_ip  = module.compute.droplet_ip
}

module "backups" {
  source = "../modules/backups"
  env    = var.env
  region = var.spaces_region
}
