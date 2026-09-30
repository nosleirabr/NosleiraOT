# Entradas da stack por ambiente (repasse aos módulos).
variable "env" {
  description = "Nome do ambiente (dev, staging, prod)."
  type        = string
}

variable "region" {
  description = "Região do Droplet (ex.: nyc1)."
  type        = string
}

variable "spaces_region" {
  description = "Região do Spaces para backups/state (ex.: nyc3)."
  type        = string
}

variable "droplet_size" {
  description = "Tamanho do Droplet do ambiente."
  type        = string
}

variable "ssh_key_name" {
  description = "Nome da chave SSH na conta DO."
  type        = string
}

variable "ssh_public_key" {
  description = "Conteúdo da chave pública SSH."
  type        = string
  sensitive   = true
}

variable "ssh_allowed_addresses" {
  description = "CIDRs liberados para SSH."
  type        = list(string)
}

variable "domain_name" {
  description = "Domínio raiz do ambiente. Vazio desabilita o módulo DNS."
  type        = string
  default     = ""
}
