#!/bin/bash
cd $PWD
suffix="Service"
# Check if the service name as been passed in argument
if [ $# -gt 0 ]; then
    name="$1"
else
    # Ask for the service name
    read -p "Service Name ? " name
fi

# Check if name is not empty
if [ -z "$name" ]; then
    echo "Aucun nom de service n'a été fourni."
    exit 1
fi

# Make the first character of name upper case
first_letter=$(echo "${name:0:1}" | tr '[:lower:]' '[:upper:]')
name="${first_letter}${name:1}"

echo "Starting creation of new $name Service"

echo "Verifying existance of $name$suffix directory"
if [ -d $name$suffix ] 
then
    echo "$name$suffix directory already exists"
    exit 1
fi
echo "Creating $name$suffix directory"
mkdir $name$suffix
echo "Initialise project"

cd "$name$suffix"

packageName=$(echo "$name-$suffix" | tr '[:upper:]' '[:lower:]')

echo "{
  \"name\": \"$packageName\",
  \"version\": \"1.0.0\",
  \"description\": \"\",
  \"main\": \"server.js\",
  \"type\": \"module\",
  \"scripts\": {
    \"dev\": \"nodemon server.js\"
  },
  \"author\": \"eq_04_01\",
  \"license\": \"MIT\"
}" > package.json

echo "Adding dependencies"

npm i express
npm i cors
npm i axios
npm i nodemon
npm i dotenv

# TODO: Install tests dependencies

echo "Creating server.js template file"
echo "Default app port is set to 8080"
appPort=8080
echo "APP_PORT=$appPort" > .env-template-template-template
cp .env-template-template-template .env-template-template-template.template

echo "\"use strict\"
import express from 'express';
import axios from 'axios';
import cors from 'cors';
import dotenv from 'dotenv';

const app = express();
dotenv.config();

app.use(cors());
app.use(express.json());

app.listen(process.env.APP_PORT, () => console.log(\`Service running on port ${process.env.APP_PORT}\`));" > server.js

echo "Creating Podmanfile"
read -p "What port to expose ?" exposedPort
echo "# Use official node image from docker at version 20
FROM node:20

# Create app dir
RUN mkdir -p /usr/src/app

# Change work dir as the created one
WORKDIR /usr/src/app

# Copy local file into the container in the app dir
COPY . .

# Install dependencies
RUN npm i
RUN npm i -g nodemon pm2

# Expose port $exposedPort
EXPOSE $exposedPort

# Run the service
CMD [\"pm2-runtime\", \"start\", \"--name\", \"service\", \"--\", \"nodemon\", \"server.js\"]
" > Podmanfile

echo "Create build and run podman container bash script"

echo "#!/bin/bash
echo \"Build Podman file to create $packageName image\"
podman build -t $packageName -f $PWD/Podmanfile
echo \"Starting container at name $name$suffix\"
podman run -dit --replace --name $name$suffix -p $exposedPort:$appPort $packageName
" > deploy.sh

echo "Giving execution permission to deploy.sh"
chmod u+x deploy.sh

read -p "Open folder with VSCode ? (y/n)" vscode

echo "DONE !"
if [ "$vscode" = "y" ] 
then
    echo "Open project in VSCode"
    code .
fi

cd ..
