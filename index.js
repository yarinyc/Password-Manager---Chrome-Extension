
const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const fs = require('fs');
const ngrok = require('ngrok');

const app = express();
const port = process.env.PORT || 3000;

let url = undefined;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));

app.use((_, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', '*');
	res.setHeader('Access-Control-Allow-Headers', '*');
	next();
});

//data structures for users and userdata
let users = require('./users.json'); // format: { name: "XYZ@gmail.com" , password: *******}
let data = require('./data.json');  //  format: { name: "XYZ@gmail.com" , passwords: [{domain: ***, userName: ***, password: ***}, {domain: ***, userName: ***, password: ***}, ...]}

const backup = function(){
	try{
		console.log("Started server data backup...");
		fs.writeFileSync('./users.json', JSON.stringify(users, null, 2));
		fs.writeFileSync('./data.json', JSON.stringify(data, null, 2));
		console.log("Completed server data backup succesfully");
	} catch (err){
		console.log("An error happened:");
		console.error(err);
	}
}

process.on( 'SIGINT', async function() {
	console.log( "\nGracefully shutting down from SIGINT (Ctrl-C)" );
	// backup all data to the .json files:
	backup();
	//ngrok.disconnect().then(()=>console.log("okkkkkkkkkkkkkkkkkkkkkkkkkkkkkk")).catch((err)=>console.log("err"));
	//await ngrok.kill(); // kills ngrok process
	process.exit();
});

async function validateUser(Username, password) {
	const user = users.find(user => user.name === Username);
	if (user == undefined) {
		return false;
	}
	else if(await bcrypt.compare(password, user.password)){
		return true;
	}
	else return false;
}

//**** debug *** (ToRemove):
app.get('/', (req, res) => {
	res.send("hello")
});

app.get('/api/users', (req, res) => {
	res.json({users: users, data: data})
})

// --> general user requests: register/login

//Register:
app.post('/api/users', async (req, res) => { 
	try {
		const currentUser = users.find(user => user.name === req.body.name)
		if(currentUser !== undefined){
			res.status(209).send({msg: 'User Name Taken'})
			return;
		}
		const hashedPassword = await bcrypt.hash(req.body.password, 10) // hash the user's password + salt
		const user = { name: req.body.name, password: hashedPassword}
		users.push(user) // add user to users list
		data.push({name: user.name, passwords: []}) // add new empty entry for user to the data
		console.log("regiter request:\n",user)
		res.status(201).send({msg: 'Success'}) //OK - Created
	} catch {
	  	res.status(500).send({msg: 'Server Error'}) // Internal Server Error
	}
});

//login: (only for first validation, sends current password file)
app.post('/api/users/login', async (req, res) => {
	try {
		const user = users.find(user => user.name === req.body.name)
		if (user == undefined) {
			  return res.status(209).send({msg: 'Cannot find user'})
		}
		if(await bcrypt.compare(req.body.password, user.password)) {
			const userData = data.find((d)=>d.name === req.body.name)
			console.log(user.name, " logged in successfully")
			res.send({msg: 'Success', passwords: userData.passwords})
		}
		else {
			res.send({msg: 'Not Allowed'})
		}
	} catch {
	  res.status(500).send({msg: 'Server Error'})
	}
});

//delete: delete all data from current user
app.delete('/api/users', async (req, res) => { 
	try{
		const valid = await validateUser(req.body.name, req.body.password)
		if(!valid){
			res.send({msg: 'Not Allowed'})
			return;
		}
		users = users.filter((u)=> u.name !== req.body.name)
		data = data.filter((d)=> d.name !== req.body.name)
		console.log(req.body.name," deleted his user")
		res.status(200).send({msg: 'Deleted'})
	} catch {
		res.status(500).send({msg: 'Server Error'})
  	}
});

//specific user requests: add/edit credentials 

//update (replace) user's password file:
//--> req.body = {name, password, passwords}
//--> req.body.passwords = [ {domain, userName, userPassword }, ... ]
app.put('/api/data/', async (req, res) => {
	try{
		const valid = await validateUser(req.body.name, req.body.password)
		if(!valid){
			res.send({msg: 'Not Allowed'})
			return;
		}
		const newData = req.body.passwords
		let userData = data.find((d)=>d.name === req.body.name)
		userData.passwords = newData // update current password file with the user's file
		console.log('data recieved:\n', newData)
		res.status(200).send({msg: 'Success'}) // OK
	} catch {
		res.status(500).send({msg: 'Server Error'})
	}
});

//update/add to user's password file for a specific domain:
//--> req.body = {name, password, userName, userPassword}
app.put('/api/data/:domain', async (req, res) => {
	try{
		const valid = await validateUser(req.body.name, req.body.password)
		if(!valid){
			res.send({msg: 'Not Allowed'})
			return;
		}
		let userData = data.find((d)=>d.name === req.body.name)
		let index = userData.passwords.findIndex((e)=>e.domain === req.params.domain)
		if(index === -1){
			userData.passwords.push({domain: req.params.domain, userName: req.body.userName, userPassword: req.body.userPassword})
		}
		else userData.passwords[index] = {domain: req.params.domain, userName: req.body.userName, userPassword: req.body.userPassword}
		console.log('data recieved:\n', {domain: req.params.domain, userName: req.body.userName, userPassword: req.body.userPassword})
		res.status(200).send({msg: "Success"})
	} catch {
		res.status(500).send({msg: 'Server Error'})
	}
});

app.listen(port, async() =>{
	url = await ngrok.connect({
		proto: 'http', // http|tcp|tls, defaults to http
		addr: port, // port or network address, defaults to 80
		region: 'eu', // one of ngrok regions (us, eu, au, ap), defaults to us
	});
	console.log("url:",url);
	console.log(`Listening on port ${port}...`)
});