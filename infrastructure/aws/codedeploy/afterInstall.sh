#!/bin/bash

#sudo systemctl stop tomcat.service

#sudo rm -rf /opt/tomcat/webapps/docs  /opt/tomcat/webapps/examples /opt/tomcat/webapps/host-manager  /opt/tomcat/webapps/manager /opt/tomcat/webapps/ROOT

#sudo chown tomcat:tomcat /opt/tomcat/webapps/ROOT.war

# cleanup log files
#sudo rm -rf /opt/tomcat/logs/catalina*
#sudo rm -rf /opt/tomcat/logs/*.log
#sudo rm -rf /opt/tomcat/logs/*.txt
pwd

 su - centos -c "aws configure set region us-east-1"

rdsEndpoint = `aws rds describe-db-instances --db-instance-identifier csye6225-su19 --query 'DBInstances[*].Endpoint.Address' --output text`
echo $rdsEndpoint

s3bucket = `aws s3api list-buckets --query "Buckets[].Name" --output text | grep csye6225-* | awk '{print $1}'`
echo $s3bucket

cd /home/centos/webapp/
pwd

sudo npm install

sudo npm i forever -g

NODE_ENV=prod NODE_DB_HOST=$rdsEndpoint NODE_S3_BUCKET=csye6225-spring2019-zhaojiawe.me.csye6225.com NODE_DB_USER=csye6225master NODE_DB_PASS=csye6225password forever start index.js
