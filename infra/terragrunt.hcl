# Terragrunt raiz: gera provider/backend e centraliza o remote state.
# Estado remoto via Spaces (S3-compatível). Sem credenciais no Git:
# exportar SPACES_ACCESS_ID, SPACES_SECRET_KEY e DIGITALOCEAN_TOKEN no ambiente/CI.

remote_state {
  backend = "s3"
  generate = {
    path      = "backend.tf"
    if_exists = "overwrite_terragrunt"
  }
  config = {
    endpoint                    = "https://${get_env("SPACES_REGION", "nyc3")}.digitaloceanspaces.com"
    bucket                      = get_env("TF_STATE_BUCKET", "ot74-tfstate")
    key                         = "${path_relative_to_include()}/terraform.tfstate"
    region                      = "us-east-1"
    skip_credentials_validation = true
    skip_metadata_api_check     = true
    skip_region_validation      = true
    encrypt                     = true
  }
}

generate "provider" {
  path      = "provider.tf"
  if_exists = "overwrite_terragrunt"
  contents  = <<-EOF
    terraform {
      required_version = ">= 1.9.0"
      required_providers {
        digitalocean = {
          source  = "digitalocean/digitalocean"
          version = "~> 2.40"
        }
      }
    }
    provider "digitalocean" {}
  EOF
}
