output "server_public_ip" {
  description = "Public IP address of the portal server"
  value       = aws_instance.app_server.public_ip
}

output "ssh_command" {
  description = "Command to SSH into the server"
  value       = "ssh -i <path-to-private-key> ubuntu@${aws_instance.app_server.public_ip}"
}

output "deployment_path" {
  description = "Directory created for deployment"
  value       = "/app/portal"
}
