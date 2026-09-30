# Ambiente staging: espelho de prod em tamanho menor, com domínio de homologação.
include "root" {
  path = find_in_parent_folders("terragrunt.hcl")
}

terraform {
  source = "../../root"
}

inputs = {
  env          = "staging"
  region       = "nyc1"
  spaces_region = "nyc3"
  droplet_size = "s-1vcpu-2gb"
  ssh_key_name = "ot74-staging"
  # Chave pública via TF_VAR_ssh_public_key — nunca no Git.
  ssh_public_key        = get_env("TF_VAR_ssh_public_key", "ssh-ed25519 AAAAC3-staging-exemplo")
  ssh_allowed_addresses = ["0.0.0.0/0", "::/0"]
  domain_name           = get_env("TF_VAR_staging_domain", "")
}
