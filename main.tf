terraform {
  cloud {
    organization = "aungsanoo"
    workspaces {
      name = "dailyreportapp"
    }
  }

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}
provider "aws" {
  region = "ap-southeast-1"
  
}
resource "aws_instance" "webserver" {
    ami = "ami-0b8607d2721c94a77"
    instance_type = "t2.micro"
    key_name = "expenseapp"
    tags = {
        Name = "Webapp_A"
    }
  
}