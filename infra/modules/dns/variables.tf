# Entradas do módulo dns (aponta domínio e subdomínios para o Droplet).
variable "domain_name" {
  description = "Domínio raiz (ex.: nosleiraot.com). Deve estar delegado na DO ou Cloudflare."
  type        = string
}

variable "droplet_ip" {
  description = "IPv4 pública do Droplet do ambiente."
  type        = string
}

variable "create_game_record" {
  description = "Cria registro game.* para o client (opcional)."
  type        = bool
  default     = true
}
