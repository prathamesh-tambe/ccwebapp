var http = require("http");
var express = require('express');
var app = express();
var mysql      = require('mysql');
var bodyParser = require('body-parser');
var bcrypt = require('bcrypt');
var uuidv4 = require('uuid/v4');
var EmailValidator = require('email-validator');

//start mysql connection
var connection = mysql.createConnection({
		host     : 'localhost',
		user     : 'root',
		password : 'password',
		database : 'books'
});

connection.connect(function(err) {
  if (err) throw err
  console.log('You are now connected with mysql database...')
})
//end mysql connection

//start body-parser configuration
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));
//end body-parser configuration

//create app server
var server = app.listen(3000,  "127.0.0.1", function () {

  var host = server.address().address
  var port = server.address().port

  console.log("Example app listening at http://%s:%s", host, port)

});

const saltRounds = 10;
const myPlaintextPassword = 's0/\/\P4$$w0rD';
const someOtherPlaintextPassword = 'not_happening';

DEBUG_MODE_ON = true;
if (!DEBUG_MODE_ON) {
	console = console || {};
	console.log = function(){};
}

//rest api to get all customers
app.get('/customer', function (req, res) {
   connection.query('select * from customer', function (error, results, fields) {
	  if (error) throw error;
	  res.end(JSON.stringify(results));
	});
});
app.post('/user/register',(req,res)=>{
		let username = req.body.username;
		let pass = req.body.password;
		console.log('req----',req.body.username,req.body.password, EmailValidator.validate(username));
		if(!EmailValidator.validate(username)){
			return res.status(401).json({ message: 'Email Id not valid' });
		}
		

		connection.query('SELECT * FROM user WHERE username = ?',[username], function (error, results, fields) {
  			if (error) {
				throw error;
			}else{
  				//console.log('Data is ', results.length);
				if(results.length > 0){
					console.log('Data is true', results.length)
					res.json({ message:"user already exists" });	
				}else{
					console.log('Data is false', results.length)
					let strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
					let status = strongRegex.test(pass);
					console.log("status",status);
					if(status){
						bcrypt.hash(pass, saltRounds, function(err, hash) {
							//console.log('hash-------',hash);
							if(err) throw err;							
							connection.query('INSERT INTO user (username, password) VALUES (?, ?); ',[username,hash], function (error, results, fields) {
  								if (error) throw error;
  								console.log('The solution is: ', results[0]);
								res.json({ message:'added successfully' });							
							});  			
						});
					}else{
						res.json({ message:'password not containg nist stadards' });					
					}
										
				}
			}
		});				
	})

	// global authorization check app
	app.all('*',function(req,res,next){
		if (!req.headers.authorization || req.headers.authorization.indexOf('Basic ') === -1) {
			return res.status(401).json({ message: 'User not logged in' });
		}else{
			var header=req.headers['authorization']||'',
				token=header.split(/\s+/).pop()||'',
				auth=new Buffer.from(token, 'base64').toString(),
				parts=auth.split(/:/),
				username=parts[0],
				password=parts[1];
	
			connection.query('SELECT * FROM user WHERE username = ?',[username], function (error, results, fields) {
				if (error) {
					res.status(401).json({ message : 'No such user' });
				}else{
					if(results.length > 0){
						bcrypt.compare(password, results[0].password, function(err, resv) {
							console.log("res---------",resv);    				
							// res == true
							if (error) throw error;	
							if(resv){
								next();
								//res.json({ crrdate : new Date().toISOString() });
							}else{
								res.status(401).json({ message : 'password does not match' });
							}
						});	
					}else{
						console.log('Data is false', results.length)
						res.status(401).json({ message : 'user does not exists' });
					}
				}
			});
		}		
	});

	//get /book/{id}
	    app.get('/book/:id', function (req, res){
		var bookid=req.params.id;
		connection.query('SELECT * FROM book WHERE id =?',[bookid],function (erro, find) {
		    if(erro) res.status(404).json({message:"Not Found"});
		    if(find.length>0){
		        res.json(find);
			}
			else {
				res.status(404).json({message:"Not Found"});
			}
		});
	});



	app.get('/book' , (req, res )=>{
		//res.json({msg : 'in book app'});
		
		connection.query( "SELECT * From book", function(err, result, field){

			if (err) res.status(400).json({ message:'Error occurred' });
            		if(result.length > 0){res.json(result);}
            		else{res.status(204).json({message:"No Content"});}
		 });

	 });

	//DELETE /book/{id}
	app.delete('/book/:id', function (req, res){
	    var bookid=req.params.id;
	    connection.query('DELETE FROM book WHERE id = ?',[bookid],function (error) {
	        if(error) res.status(204).json({message:"No Content"});
	        else{
	            res.json({message:"delete successfully"});
	        }
	    });
	});

	// mount the facets resource
	//app.use('/facets', facets({ config, connection }));

	//Basic app returns date  
	app.get('/', function (req, res){
		var header=req.headers['authorization']||'',
		token=header.split(/\s+/).pop()||'',
		auth=new Buffer.from(token, 'base64').toString(),
		parts=auth.split(/:/),
	      	username=parts[0],
		password=parts[1];
	
		connection.query('SELECT * FROM user WHERE username = ?',[username], function (error, results, fields) {
			if (error) {
				throw error;
			}else{
				if(results.length > 0){
					bcrypt.compare(password, results[0].password, function(err, resv) {
						console.log("res---------",resv);    				
						// res == true
						if (error) throw error;	
						if(resv){
							res.json({ crrdate : new Date().toISOString() });
						}else{
							res.json({ message : 'password does not match' });
						}
					});	
				}else{
					console.log('Data is false', results.length)
					res.json({ message : 'user does not exists' });
				}
			}
		});
	});
	
	//Book create app	
	app.post('/book', (req, res) => {
		let id = (req.body.id) ? req.body.id.trim() : '';
		let title = (req.body.title) ? req.body.title.trim() : '';
		let author = (req.body.author) ? req.body.author.trim() : '';
		let isbn = (req.body.isbn) ? req.body.isbn.trim() : '';
		let quantity = req.body.quantity;

		if(title.length > 0 && author.length > 0 && isbn.length > 0 && Number.isInteger(quantity) && quantity > 0){			
			connection.query('INSERT INTO book (`id`, `title`, `author`, `isbn`,`quantity`) VALUES (?,?,?,?,?)',[uuidv4(),title,author,isbn,quantity], function (error, results, fields) {
	  			if (error) {
					throw res.status(400).json({ message:"connection error",err:error });
				}else{
					//console.log("result-----",results);
					if(results){
						res.status(201).json({ message:'created' });
					}else{
						res.status(400).json({ message:"connection error",err:error });
					}
				}
			});
		}else{
			res.status(400).json({ message:"Bad Request" });
		}				
	});
	
	//Book update app	
	app.put('/book', (req, res) => {
		let id = req.body.id.trim();
		let title = req.body.title.trim();
		let author = req.body.author.trim();
		let isbn = req.body.isbn.trim();
		let quantity = req.body.quantity;
			
		if(id.length > 0 && (title.length > 0 || author.length > 0 || isbn.length > 0 || quantity > 0)){
			connection.query('SELECT * from book WHERE id = ?',[id], function (error, results, fields) {
				if (error) throw res.status(400).json({ message:'Error occurred' });
				if(results.length > 0){
					var query = 'UPDATE book SET ';
					console.log("query --------",query);	            			
					query = query + ((title.length > 0) ? ' title = "'+title+'"' : '');
					query = query + ((title.length > 0) ? ',' : '');
					query = query + ((author.length > 0) ? ' author = "'+author+'"' : '');
					query = query + ((author.length > 0) ? ',' : '');
					query = query + ((isbn.length > 0) ? ' isbn = "'+isbn+'"' : '');
					query = query + ((isbn.length > 0) ? ',' : '');
					query = query + ((quantity > 0) ? ' quantity = "'+quantity+'"' : '');
					if(quantity < 0){
						res.status(400).json({ message:"Bad Request" });
						return false;
					}
					query = query.replace(/,\s*$/, "");				
					query = query + ' WHERE id = "'+id+'"';
					console.log("query --------",query);
					connection.query(query, function (error, results, fields) {
						if (error) throw res.status(400).json({ message:'Error occurred',err:error });
						if(results){
							res.status(200).json({ message:'Content updated successfully' });
						}else{
							res.status(400).json({ message:'Error occurred' });								
						}
					});			
				}else{
					res.status(204).json({ message:'No Content' });
				}
			});		
		}else{
			res.status(400).json({ message:"Bad Request" });
		}
    	});

module.exports = app;
