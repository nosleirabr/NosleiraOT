# Ambiente prod: tamanho real, SSH restrito ao IP do admin, domínio oficial.
include "root" {
  path = find_in_parent_folders("terragrunt.hcl")
}

terraform {
  source = "../../root"
}

inputs = {
  env          = "prod"
  region       = "nyc1"
  spaces_region = "nyc3"
  droplet_size = "s-2vcpu-4gb"
  ssh_key_name = "ot74-prod"
  # Chave pública via TF_VAR_ssh_public_key — nunca no Git.
  ssh_public_key = get_env("TF_VAR_ssh_public_key", "ssh-ed25519 AAAAC3-prod-exemplo")
  # Restringir ao IP do admin em produção (ex.: ["203.0.113.10/32"]).
  ssh_allowed_addresses = ["0.0.0.0/0", "::/0"]
  domain_name           = get_env("TF_VAR_prod_domain", "")
}
