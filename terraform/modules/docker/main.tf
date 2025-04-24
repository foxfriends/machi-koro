terraform {
  required_providers {
    docker = {
      source  = "kreuzwerker/docker"
      version = "~> 3.0.2"
    }
  }
}

locals {
  image         = "${var.image_name}:${var.image_version}"
  internal_port = 3000
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

  dynamic "ports" {
    for_each = var.expose ? [var.port] : []

    content {
      internal = local.internal_port
      external = ports.value
    }
  }

  network_mode = "bridge"

  dynamic "networks_advanced" {
    for_each = var.networks
    iterator = net

    content {
      name = net.value["name"]
    }
  }

  healthcheck {
    test         = ["CMD", "curl", "-f", "localhost:${local.internal_port}/health"]
    interval     = "5s"
    retries      = 2
    start_period = "1s"
    timeout      = "500ms"
  }

  env = [
    "machi_port=${local.internal_port}",
  ]
}
