# CSYE - 6225 (User Api)
==================================

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for Bookes.

### Prerequisites

To run this you need to have postman,nodejs,mysql and npm installed on your machine. 

### How to use

Git clone this repo on your local machine.

Run following query commands in mysql

create Books database in mysql and create following table in it

```
	CREATE TABLE `user` (
	`id` INT NOT NULL AUTO_INCREMENT,
	`username` VARCHAR(255) NOT NULL,
	`password` VARCHAR(255) NOT NULL,
	`cdate` TIMESTAMP NOT NULL,
	PRIMARY KEY (`id`)
	) ENGINE=InnoDB;
```

and run following commands 

```
-	cd ccwebapp/webapp
-	npm install
-	npm start	
```

and then open http://localhost:8080 on postman to check following scenarios.

1. 	Create new user by accessing http://localhost:8080/user/register with username and password in postman using content type - application/json.
	-	if user already exists then it will print user already exists.
	-	else it will create user with generating bcrypt encoded hash.

2.	When user access this http://localhost:8080 url without passing basic authentication it will return error message.
	-	if user passes valid creds then it will show current date in json response.		

3.	It satisfies all user stories required in assignment00.01.


## Built With

* [NodeJs](https://nodejs.org/en/) - Node.js® is a JavaScript runtime built on Chrome's V8 JavaScript engine.

* [MySQL](https://www.mysql.com/) - MySQL is the world's most popular open source database. With its proven performance, reliability and ease-of-use, MySQL has become the leading database choice for web-based applications, used by high profile web properties including Facebook, Twitter, YouTube, Yahoo! and many more.

* [bcrypt](https://www.npmjs.com/package/bcrypt) - A library to help you hash passwords.

## Versioning

We use [github](https://github.com/) for versioning. For the versions available, see the [tags on this repository](https://github.com/prathamesh-tambe/webapp). 

## Group members

**Prahamesh Tambe** - tambe.p@husky.neu.edu

**Ishita Chausalkar** - chausalkar.i@husky.neu.edu

**Jiawei Zhao** - zhao.jiawe@husky.neu.edu

## Acknowledgments

Used this link for boilerplate - [github.com](https://github.com/developit/express-es6-rest-api)

