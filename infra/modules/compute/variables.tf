# Entradas do módulo compute (Droplet + chave SSH + user-data).
variable "env" {
  description = "Nome do ambiente (dev, staging, prod)."
  type        = string
}

variable "region" {
  description = "Região da DigitalOcean (ex.: nyc1, menor latência para BR)."
  type        = string
}

variable "droplet_size" {
  description = "Tamanho do Droplet por ambiente."
  type        = string
}

variable "droplet_image" {
  description = "Imagem base do Droplet."
  type        = string
  default     = "ubuntu-22-04-x64"
}

variable "ssh_key_name" {
  description = "Nome da chave SSH registrada na conta DO."
  type        = string
}

variable "ssh_public_key" {
  description = "Conteúdo da chave pública SSH (nunca commitar chave privada)."
  type        = string
  sensitive   = true
}

variable "tags" {
  description = "Tags aplicadas ao Droplet."
  type        = list(string)
  default     = ["ot74", "tfs12"]
}
