import { version } from '../../package.json';
import { Router } from 'express';
import facets from './facets';
import bcrypt from 'bcrypt';

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

	// mount the facets resource
	api.use('/facets', facets({ config, db }));

	// perhaps expose some API metadata at the root
	/*api.get('/', (req, res) => {
		res.json({ version });
	});*/
	
	api.get('/', function (req, res){
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
		}		
	});


	api.get('/user/login', (req, res) => {
		let username = req.body.username;
		let pass = req.body.password;
		console.log('req----',req.body.username,req.body.password);
		
		db.query('SELECT * FROM user WHERE username = ?',[username], function (error, results, fields) {
  			if (error) {
				throw error;
			}else{
  				if(results.length > 0){
					bcrypt.compare(myPlaintextPassword, hash, function(err, res) {
						console.log("res---------",res);    				
						// res == true
					});
					res.json({ version });
				}else{
					res.json({ message:"user not logged in" });
				}
			}
		});
		
	});
	
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
	});



		api.get('/book' , (req, res )=>{
		

			//res.json({msg : 'in book api'});
		
		db.query( "SELECT * From book", function(err, result, field){

			if (err) throw res.status(400).json({ message:'Error occurred' });
            		if(result.length > 0)
            		res.json(result);
            		res.status(204).json({ message:'No Content' });
		
		

	 });
		

		//console.log(checkUser(username));
				
		//, function(id) {

    		/*	console.log('check user called-------------------',id);    

			let strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
			let status = strongRegex.test(pass);
			console.log("status",status);
			if(status){
				bcrypt.hash(pass, saltRounds, function(err, hash) {
					//console.log('hash-------',hash);
					/*db.query('insert into ', function (error, results, fields) {
  						if (error) throw error;
  						console.log('The solution is: ', results[0].solution);
					});*/  			
		/*		});
			}
			res.json({  });		
		*/
		//});
		
				
	});
	return api;
}