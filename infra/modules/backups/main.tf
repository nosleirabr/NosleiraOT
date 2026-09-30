# Bucket exclusivo por ambiente para os dumps (mysqldump a cada 12h).
# Retenção e ciclo de 7 dias + 4 semanais configurados fora do TF (lifecycle via console/API).
resource "digitalocean_spaces_bucket" "ot74_backups" {
  name   = "ot74-backups-${var.env}"
  region = var.region
  acl    = "private"
}
