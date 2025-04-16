output "port" {
  value = docker_container.machi-koro.ports[0].external
}
