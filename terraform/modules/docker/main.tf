terraform {
  required_providers {
    docker = {
      source  = "kreuzwerker/docker"
      version = "~> 3.0.2"
    }
  }
}

locals {
  image = "${var.image_name}:${var.image_version}"
}

data "docker_registry_image" "machi-koro" {
  name = local.image
}

resource "docker_image" "machi-koro" {
  name          = local.image
  pull_triggers = [data.docker_registry_image.machi-koro.sha256_digest]
}

resource "docker_container" "machi-koro" {
  image   = docker_image.machi-koro.image_id
  name    = var.name
  restart = var.restart

  ports {
    internal = 3000
  }

  network_mode = "bridge"

  healthcheck {
    test         = ["CMD", "curl", "-f", "localhost:3000/health"]
    interval     = "5s"
    retries      = 2
    start_period = "1s"
    timeout      = "500ms"
  }

  env = [
    "machi_port=3000",
  ]
}
