#!/bin/bash

pwd
whoami
cd /home/centos/webapp
sudo mkdir var
sudo cp /var/.env /home/centos/ccwebapps/webapp/var
pwd
sudo pm2 start index.js