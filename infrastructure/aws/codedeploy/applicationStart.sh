#!/bin/bash

pwd
whoami
cd /home/centos/webapp
pwd
sudo chmod 777 /etc/profile.d/envvariable.sh 
source /etc/profile.d/envvariable.sh
env