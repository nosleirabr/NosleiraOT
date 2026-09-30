# Entradas do módulo backups (bucket Spaces para dumps do MySQL).
variable "env" {
  description = "Nome do ambiente (dev, staging, prod)."
  type        = string
}

variable "region" {
  description = "Região do Spaces (ex.: nyc3)."
  type        = string
}
