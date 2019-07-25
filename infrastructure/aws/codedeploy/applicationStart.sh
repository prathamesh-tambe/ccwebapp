#!/bin/bash

pwd
whoami
cd /home/centos/webapp
pwd
sudo chmod 777 /etc/profile.d/envvariable.sh 
sudo -s
source /etc/profile.d/envvariable.sh
env