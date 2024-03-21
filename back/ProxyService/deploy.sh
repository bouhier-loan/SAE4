#!/bin/bash
echo "Build Podman file to create proxy-service image"
podman build -t proxy-service -f /var/home/E224341Z/WebstormProjects/SAE4/back-v2/ProxyService/Podmanfile
echo "Starting container at name ProxyService"
podman run -dit --replace --name ProxyService -p 3001:8080 proxy-service

