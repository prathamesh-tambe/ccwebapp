var mysql      	= require('mysql');
var host 	= 'localhost';
var user 	= 'root';	
var password 	= 'password';	
var database	= 'books';

export default callback => {
	// connect to a database if needed, then pass it to `callback`:

	var connection = mysql.createConnection({
  		host     : host,
  		user     : user,
  		password : password,
  		database : database
	});
 
	connection.connect();
 
	/*connection.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
  		if (error) throw error;
  		console.log('The solution is: ', results[0].solution);
	});*/
 
	callback(connection);
}
