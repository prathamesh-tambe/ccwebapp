aws cloudformation list-stacks --stack-status-filter CREATE_COMPLETE||CREATE_IN_PROGRESS||REVIEW_IN_PROGRESS||DELETE_IN_PROGRESS||DELETE_FAILED||UPDATE_IN_PROGRESS||DELETE_COMPLETE

echo "Enter name of stack you want to create"
read Stack_Name

echo "Displaying all keys!"
aws ec2 describe-key-pairs
echo -e "\n"
echo "Choose 1 Key which you want to use!"
read KEY_CHOSEN

echo "Displaying AMI!"
aws ec2 describe-images --owners self --query 'Images[*].{ID:ImageId}'
echo -e "\n"
echo "Enter AMI ID"
read amiId
echo "Displaying VPC"
#aws ec2 describe-vpcs --query 'Vpcs[*]'
aws ec2 describe-vpcs --query 'Vpcs[*].{Id:VpcId}'
echo "input ID of VPC you want to use:"
read vpcId
echo "vpcId is: $vpcId"
aws ec2 describe-vpcs --vpc-ids $vpcId --query 'Vpcs[*].Tags[*]' --output text
echo "Input the name of vpc:"
read vpcname

subnet1=`aws ec2 describe-subnets --filter "Name=tag:Name,Values=${vpcId}-public-az1" --query 'Subnets[*].{id:SubnetId}' --output text`
echo $subnet1
subnet2=`aws ec2 describe-subnets --filter "Name=tag:Name,Values=${vpcId}-public-az2" --query 'Subnets[*].{id:SubnetId}' --output text`
echo $subnet2
subnet3=`aws ec2 describe-subnets --filter "Name=tag:Name,Values=${vpcId}-public-az3" --query 'Subnets[*].{id:SubnetId}' --output text`
echo $subnet3


getStackStatus() {
	aws cloudformation describe-stacks \
		--stack-name $Stack_Name \
		--query Stacks[].StackStatus \
		--output text
}

waitForState() {
	local status

	status=$(getStackStatus $1)

	while [[ "$status" != "$2" ]]; do

		echo "Waiting for stack $1 to obtain status $2 - Current status: $status"
		
		if [[ "$status" != *"_IN_PROGRESS"* ]]; then
			exitWithErrorMessage "Unexpected status '$status'"
		fi

		status=$(getStackStatus $1)
		sleep 30

	done

	echo "Stack $1 obtained $2 status"

}


exitWithErrorMessage() {
	echo "ERROR: $1"
	exit 1
}


dir_var=$(pwd)
# echo "Current Directory is '$dir_var'"
file_dir_var="file://$dir_var/csye6225-cf-application.json"


aws cloudformation create-stack \
	--stack-name $Stack_Name  \
	--template-body $file_dir_var \
	--parameters ParameterKey="keyname",ParameterValue=$KEY_CHOSEN ParameterKey="AmiId",ParameterValue=$amiId 		ParameterKey="subnet1",ParameterValue=$subnet1 ParameterKey="subnet2",ParameterValue=$subnet2 ParameterKey="subnet3",ParameterValue=$subnet3 ParameterKey="vpcId",ParameterValue=$vpcId ParameterKey="vpcname",ParameterValue=$vpcname\
	--disable-rollback


if ! [ "$?" = "0" ]; then

	exitWithErrorMessage "Cannot create stack ${Stack_Name}!"

fi

#Wait for completion
waitForState ${Stack_Name} "CREATE_COMPLETE"
