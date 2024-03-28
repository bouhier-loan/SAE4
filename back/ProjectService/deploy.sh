#!/bin/bash
echo "Build Podman file to create conversation-service image"
podman build -t conversation-service -f /var/home/E224341Z/WebstormProjects/SAE4/back-v2/ConversationService/Podmanfile
echo "Starting container at name ConversationService"
podman run -dit --replace --name ConversationService -p 8083:8080 conversation-service

