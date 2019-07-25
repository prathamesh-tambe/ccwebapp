#!/bin/bash

#sudo systemctl stop tomcat.service

#sudo rm -rf /opt/tomcat/webapps/docs  /opt/tomcat/webapps/examples /opt/tomcat/webapps/host-manager  /opt/tomcat/webapps/manager /opt/tomcat/webapps/ROOT

#sudo chown tomcat:tomcat /opt/tomcat/webapps/ROOT.war

# cleanup log files
#sudo rm -rf /opt/tomcat/logs/catalina*
#sudo rm -rf /opt/tomcat/logs/*.log
#sudo rm -rf /opt/tomcat/logs/*.txt

pwd
whoami
aws configure set default.region us-east-1
aws configure list
cd /home/centos
pwd
source /etc/profile.d/envvariable.sh
cd /home/centos/webapp/
pwd

sudo npm install
sudo npm install pm2 -g

#sudo pm2 start index.js