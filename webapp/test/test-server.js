var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../index');
var should = chai.should();

chai.use(chaiHttp);

let username = 'pratham.m1231@gmail.com';
let password = 'nrA43acxkFd#';

describe('User', function() {
	it('should add a SINGLE User on /user/register POST', function(done) {
		chai.request(server)
		  .post('/user/register')
		  .send({"username": "pratham.m1231@gmail.com",
		  "password": password})
		  .end(function(err, res){
			res.should.have.status(200);
			res.body.should.have.property('message');
			res.body.message.should.equal('added successfully');
			/*res.body.SUCCESS.should.have.property('name');
			res.body.SUCCESS.should.have.property('lastName');
			res.body.SUCCESS.should.have.property('_id');
			res.body.SUCCESS.name.should.equal('Java');
			res.body.SUCCESS.lastName.should.equal('Script');*/
			done();
		  });
	});
});

describe('book', function() {
	it('should add a SINGLE book on /book POST', function(done) {
		chai.request(server)
		  .post('/book')
		  .auth(username,password)
		  .send({"title": "Computer Networks 1",
		  "author": "Andrew S. Tanenbaum 1",
		  "isbn": "978-0132126953",
		  "quantity": 5})
		  .end(function(err, res){
			res.should.have.status(201);
			res.should.be.json;
			res.body.should.be.a('object');
			/*res.body.SUCCESS.should.have.property('name');
			res.body.SUCCESS.should.have.property('lastName');
			res.body.SUCCESS.should.have.property('_id');
			res.body.SUCCESS.name.should.equal('Java');
			res.body.SUCCESS.lastName.should.equal('Script');*/
			done();
		  });
	});

	it('should delete a SINGLE book on /book DELETE', function(done) {
		chai.request(server)
			.delete('/book/1b42a2c7-9aa1-4c44-84a1-57251f9d9ea4')
			.auth(username,password)
			.end(function(err, res){
				res.should.have.status(200);
				res.body.should.have.property('message');
				res.body.message.should.equal('delete successfully');
				done();
			});
	});
	it('should get a SINGLE book on /book GET', function(done) {
		chai.request(server)
			.get('/book/9c17fcb6-986f-4a5c-a2b2-7639f235eecf')
			.auth(username,password)
			.end(function(err, res){
				res.should.have.status(200);
				res.should.be.json;
				res.body.should.be.a('array');
				res.body[0].id.should.equal('9c17fcb6-986f-4a5c-a2b2-7639f235eecf');
				done();
			});
	});
});

