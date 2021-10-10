const express = require('express');
const { appendFileSync } = require('fs');
const app = express();
const mysql = require('mysql');
const port = 3000;
const path = require('path');
const hbs = require('hbs');
const multer = require('multer');
const queries = require('./sqlFun/queries');
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const jsonParser = bodyParser.json();
const fs = require('fs');
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());


// app.set('view engine', 'ejs');
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('images'));
app.use(express.static('images/badges'));






app.get('/',  async (req, res) => {
	// res.render('home');
	
	// const x = function leaderboard(results){
	// 	var answer = JSON.stringify(results);
	// 	return answer;
	// }
	var connection = mysql.createConnection({
		host: 'localhost',
		user: 'root',
		database: 'hacktober',
	});

	var q =
		'SELECT c.u_id, u.name, count(*) as c_count from c_certificates as c INNER JOIN u_users as u on u.u_id = c.u_id GROUP BY 		  c.u_id ORDER BY 3 DESC Limit 5;';

	 connection.query(q,  async function (error, results, fields) {
		if (error) throw error;
		var userdetails = results;
		// leaderboard(userdetails);
		 res.render('home',{x:userdetails});
	});
	
	// console.log(userdetails);
	connection.end();
});

app.get('/admin/login', (req, res) => {
	res.render('login');

});

app.post('/admin/login', urlencodedParser, (req, res) => {
	const data = JSON.parse(JSON.stringify(req.body));
	const connection = mysql.createConnection({
		host: 'localhost',
		user: 'root',
		database: 'hacktober',
	});
	var answer;
	connection.query('SELECT * from a_admins', function (error, results, fields) {
		if (error) throw error;
		for (var i = 0; i < results.length; i++) {
			if (results[i].username === data.email) {
				if (results[i].password === data.password) {
					return res.render('register');
					console.log('yes');
					break;
				}
			} else {
				console.log("No");
				return res.render('login');
			}
		}

	});

	connection.end();
});



app.get('/registeruser',(req,res)=>{
	res.render('regiuser');
})
app.post('/registeruser',(req,res)=>{
	const data =  JSON.parse(JSON.stringify(req.body));
		console.log(data);
	
	
	
	
	
	
		var badgeName = req.file.filename+'.png';
	console.log(badgeName);
	
	
		var dataObject ={
		name : data.name,
		email  : data.date,
		g_no : badgeName
			avatar:,
	}
		queries.insertToUsers(dataObject);
	
	
	
})






app.get('/registerevents', (req, res) => {
res.render('registerevents');
})
const upload = multer({
	dest: 'images/badges'
});

app.post('/registerevents', upload.single('badge'), urlencodedParser,async (req, res) => {
	console.log("Helo");
	const data = JSON.parse(JSON.stringify(req.body));
		console.log(data);
	   console.log(req.file.filename);
	   console.log(req.file.originalname);
	fs.rename('images/badges/' + req.file.filename, 'images/badges/' + req.file.filename+'.png', function (err) {
		if (err) console.log('ERROR: ' + err);
		
	});
	var badgeName = req.file.filename+'.png';
	console.log(badgeName);
	var dataObject ={
		name : data.name,
		date  : data.date,
		badges : badgeName
	}
		queries.insertToEvents(dataObject);
	
	
	
	res.render('registerevents');
});


app.get('/upload',(req,res)=>{
	var connection = mysql.createConnection({
		host: 'localhost',
		user: 'root',
		database: 'hacktober',
	});

	var q =
		'SELECT u.u_id as u_id, e.name as event_name, e.badges as badge_link from u_users as u INNER JOIN c_certificates as c on c.u_id = u.u_id INNER JOIN e_events as e on e.e_id = c.e_id where u.email = ? ';

	connection.query(q, data, function (error, results, fields) {
		if (error) {
			console.log('User not found');
		} else {
			answer = results;
			console.log(results);
		}
	});
	console.log('hello');
	connection.end();
})

	
		
	app.get('/users', (req, res) => {
		res.render('users');

	});

	app.post('/users', urlencodedParser, (req, res) => {
		const data = JSON.parse(JSON.stringify(req.body));
		console.log(data);
		
	});
     
	app.get('/certificates',async (req,res)=>{

		var connection = mysql.createConnection({
		host: 'localhost',
		user: 'root',
		database: 'hacktober',
	});
	
	var answer;
	await connection.query('SELECT * from e_events', function (error, results, fields) {
		if (error) throw error;
		answer = results;		
		res.render('certificate',{events:answer});
	});

	connection.end();
	// return answer;
	});

	app.post('/certificates', urlencodedParser,(req,res)=>{
		const data = JSON.parse(JSON.stringify(req.body));
		console.log(data);
		res.render('certificate');
		var c = data.users;
		 function replaceAll(str, find, replace) {
  			return str.replace(new RegExp(find, 'g'), replace);
		}
		c = replaceAll(c,'\r'," ");
		c = replaceAll(c,'\r\n'," ");
		c = replaceAll(c,'\n'," ");
			// console.log(replaceAll('adsdasdasdasd', 'as', '=='));
		
		var e = c.split(" ");
		var finalarr = e.filter(ele=>{
			return ele!="";
		});
		console.log(finalarr);
		
		var arr=[];
		for(var i= 0;i< finalarr.length;i++){
			arr.push([finalarr[i],data.events]);
		}
		
		console.log(arr);
		
		for(var i=0;i<arr.length ;i++){
			console.log("hello");
			queries.sendCertificates(arr[i]);
		}
		console.log("executed");
	});
	 
	




	app.listen(port, (req, res) => {
		console.log("Server is listening on port" + port);
	});