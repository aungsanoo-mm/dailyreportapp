resource "aws_instance" "webserver" {
    ami = "ami-0b8607d2721c94a77"
    instance_type = "t2.micro"
    key_name = "expenseapp"
    tags = {
        Name = "WebServer"
    }
  
}