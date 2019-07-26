#!/bin/bash

pwd
whoami
cd /home/centos/webapp
if [ -d "var" ] 
then
    echo "Directory /home/centos/webapp/var exists." 
else
    sudo mkdir var
fi

sudo cp /var/.env /home/centos/webapp/var
sudo chmod 666 .env
pwd
sudo pm2 start index.js
