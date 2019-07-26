#!/bin/bash

pwd
whoami
cd /home/centos/webapp
sudo mkdir -p var
sudo cp /var/.env /home/centos/webapp/var
sudo chmod 666 .env
pwd
sudo pm2 start index.js
