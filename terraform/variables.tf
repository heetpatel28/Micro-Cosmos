variable "aws_region" {
  description = "AWS Region to deploy to"
  type        = string
  default     = "us-east-1"
}

variable "project_name" {
  description = "Name prefix for all resources"
  type        = string
  default     = "micro-cosmos"
}

variable "instance_type" {
  description = "EC2 Instance Type"
  type        = string
  default     = "t2.medium" # Recommended for Node+React builds
}

variable "public_key" {
  description = "SSH Public Key content (e.g., ssh-rsa AAA...)"
  type        = string
  # No default - force user to provide essential security
}
