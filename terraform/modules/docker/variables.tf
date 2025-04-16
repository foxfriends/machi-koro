variable "name" {
  type = string
}

variable "image_name" {
  type    = string
  default = "ghcr.io/foxfriends/machi-koro"
}

variable "image_version" {
  type    = string
  default = "main"
}

variable "restart" {
  type    = string
  default = "unless-stopped"
}
