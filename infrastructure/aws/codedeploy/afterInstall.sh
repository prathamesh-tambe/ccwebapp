#!/bin/bash

#sudo systemctl stop tomcat.service

#sudo rm -rf /opt/tomcat/webapps/docs  /opt/tomcat/webapps/examples /opt/tomcat/webapps/host-manager  /opt/tomcat/webapps/manager /opt/tomcat/webapps/ROOT

#sudo chown tomcat:tomcat /opt/tomcat/webapps/ROOT.war

# cleanup log files
#sudo rm -rf /opt/tomcat/logs/catalina*
#sudo rm -rf /opt/tomcat/logs/*.log
#sudo rm -rf /opt/tomcat/logs/*.txt

pwd

aws configure set default.region us-east-1
aws configure list
cd /home/centos/webapp/
source /etc/profile.d/envvariable.sh
pwd

sudo npm install
sudo npm i forever -g
sudo forever list
sudo forever stopall
sudo forever list

sudo forever start --minUptime 1000 --spinSleepTime 1000 index.js
sudo forever list
