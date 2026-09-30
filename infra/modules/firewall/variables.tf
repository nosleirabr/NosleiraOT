# Entradas do módulo firewall (superfície mínima 22/80/443/7171/7172).
variable "env" {
  description = "Nome do ambiente (dev, staging, prod)."
  type        = string
}

variable "droplet_ids" {
  description = "IDs dos Droplets protegidos pelo firewall."
  type        = list(number)
}

variable "ssh_allowed_addresses" {
  description = "CIDRs liberados para SSH (restringir o máximo possível)."
  type        = list(string)
  default     = ["0.0.0.0/0", "::/0"]
}
