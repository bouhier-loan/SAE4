#!/bin/bash
echo "Build Podman file to create user-service image"
podman build -t user-service -f /var/home/E224341Z/WebstormProjects/SAE4/back-v2/UserService/Podmanfile
echo "Starting container at name UserService"
podman run -dit --replace --name UserService -p 8080:8080 user-service

