import { version } from '../../package.json';
import { Router } from 'express';
import facets from './facets';
import bcrypt from 'bcrypt';
import uuidv4 from 'uuid/v4';

const saltRounds = 10;
const myPlaintextPassword = 's0/\/\P4$$w0rD';
const someOtherPlaintextPassword = 'not_happening';



export default ({ config, db }) => {

	let api = Router();

	var checkUser = function(uname){
		console.log("username",uname)
		db.query('SELECT * FROM user WHERE username = ?',[uname], function (error, results, fields) {
  			if (error) {
				throw error;
			}else{
  				//console.log('Data is ', results.length);
				if(results.length > 0){
					console.log('Data is true', results.length)
					return 1;	
				}else{
					console.log('Data is false', results.length)
					return 0;				
				}
			}
		});
	}

	// User register Api
	api.post('/user/register',(req,res)=>{
		let username = req.body.username;
		let pass = req.body.password;
		console.log('req----',req.body.username,req.body.password);
		
		db.query('SELECT * FROM user WHERE username = ?',[username], function (error, results, fields) {
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
							db.query('INSERT INTO user (username, password) VALUES (?, ?); ',[username,hash], function (error, results, fields) {
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

	// global authorization check api
	api.all('*',function(req,res,next){
		if (!req.headers.authorization || req.headers.authorization.indexOf('Basic ') === -1) {
			return res.status(401).json({ message: 'User not logged in' });
		}else{
			var header=req.headers['authorization']||'',
				token=header.split(/\s+/).pop()||'',
				auth=new Buffer.from(token, 'base64').toString(),
				parts=auth.split(/:/),
				username=parts[0],
				password=parts[1];
	
			db.query('SELECT * FROM user WHERE username = ?',[username], function (error, results, fields) {
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
	    api.get('/book/:id', function (req, res){
		var bookid=req.params.id;
		db.query('SELECT * FROM book WHERE id =?',[bookid],function (erro, find) {
		    if(erro) res.status(404).json({message:"Not Found"});
		    if(find){
		        res.json(find);
		    }
		});
	});



	api.get('/book' , (req, res )=>{
		//res.json({msg : 'in book api'});
		
		db.query( "SELECT * From book", function(err, result, field){

			if (err) res.status(400).json({ message:'Error occurred' });
            		if(result.length > 0){res.json(result);}
            		else{res.status(204).json({message:"No Content"});}
		 });

	 });

	//DELETE /book/{id}
	api.delete('/book/:id', function (req, res){
	    var bookid=req.params.id;
	    db.query('DELETE FROM book WHERE id = ?',[bookid],function (error) {
	        if(error) res.status(204).json({message:"No Content"});
	        else{
	            res.json({message:"delete successfully"});
	        }
	    });
	});

	// mount the facets resource
	//api.use('/facets', facets({ config, db }));

	//Basic api returns date  
	api.get('/', function (req, res){
		var header=req.headers['authorization']||'',
		token=header.split(/\s+/).pop()||'',
		auth=new Buffer.from(token, 'base64').toString(),
		parts=auth.split(/:/),
	      	username=parts[0],
		password=parts[1];
	
		db.query('SELECT * FROM user WHERE username = ?',[username], function (error, results, fields) {
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
	
	//Book create Api	
	api.post('/book', (req, res) => {
		let id = (req.body.id) ? req.body.id.trim() : '';
		let title = (req.body.title) ? req.body.title.trim() : '';
		let author = (req.body.author) ? req.body.author.trim() : '';
		let isbn = (req.body.isbn) ? req.body.isbn.trim() : '';
		let quantity = req.body.quantity;

		if(title.length > 0 && author.length > 0 && isbn.length > 0 && Number.isInteger(quantity) && quantity > 0){			
			db.query('INSERT INTO book (`id`, `title`, `author`, `isbn`,`quantity`) VALUES (?,?,?,?,?)',[uuidv4(),title,author,isbn,quantity], function (error, results, fields) {
	  			if (error) {
					throw res.status(400).json({ message:"db error",err:error });
				}else{
					//console.log("result-----",results);
					if(results){
						res.status(201).json({ message:'created' });
					}else{
						res.status(400).json({ message:"db error",err:error });
					}
				}
			});
		}else{
			res.status(400).json({ message:"Bad Request" });
		}				
	});
	
	//Book update Api	
	api.put('/book', (req, res) => {
		let id = req.body.id.trim();
		let title = req.body.title.trim();
		let author = req.body.author.trim();
		let isbn = req.body.isbn.trim();
		let quantity = req.body.quantity;
			
		if(id.length > 0 && (title.length > 0 || author.length > 0 || isbn.length > 0 || quantity > 0)){
			db.query('SELECT * from book WHERE id = ?',[id], function (error, results, fields) {
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
					db.query(query, function (error, results, fields) {
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

	return api;
}
