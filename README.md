# CSYE 6225 - Summer 2019

## Team Information

| Name | NEU ID | Email Address |
| --- | --- | --- |
| Prathamesh Tambe  | 001494644 | tambe.p@husky.neu.edu |
| Jiawei Zhao | 001495711 | zhao.jiawe@husky.neu.edu  |
| Ishita Chausalkar | 001448216 | chausalkar.i@husky.neu.edu  |


## Technology Stack

To run this you need to have postman,nodejs,mysql and npm installed on your machine.


## Build Instructions

Git clone this repo on your local machine.

Run following query commands in mysql

create 'books' database in mysql and create following table in it

```
	CREATE TABLE `user` (
	`id` INT NOT NULL AUTO_INCREMENT,
	`username` VARCHAR(255) NOT NULL,
	`password` VARCHAR(255) NOT NULL,
	`cdate` TIMESTAMP NOT NULL,
	PRIMARY KEY (`id`)
	) ENGINE=InnoDB;
```

```
	CREATE TABLE `books`.`book` (
  	`id` VARCHAR(255) NOT NULL,
  	`title` VARCHAR(255) NOT NULL,
  	`author` VARCHAR(100) NULL,
  	`isbn` VARCHAR(255) NULL,
  	`quantity` INT NULL,
  	PRIMARY KEY (`id`));
```

and run following commands 

```
-	cd ccwebapp/webapp
-	npm install
-	node index.js	
```

and then open http://localhost:3000 on postman to check following scenarios.

1. 	Create new user by accessing http://localhost:3000/user/register with username and password in postman using content type - application/json.
	-	if user already exists then it will print user already exists.
	-	else it will create user with generating bcrypt encoded hash.

2.	When user access this http://localhost:3000 url without passing basic authentication it will return error message.
	-	if user passes valid creds then it will show current date in json response.		

3.	It satisfies all user stories required in assignment00.01 and assignment1.


and for testing run following command.

```
	mocha
```


## Deploy Instructions

Its explained in Build sections above;

## Running Tests

Implemented and checks Unit tests 

and for testing run following command.

```
	mocha
```

## CI/CD


