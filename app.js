const express = require('express');
const https = require('https');
const bodyParser = require('body-parser');
const request = require('request');

const app = express();

app.use(express.static('public'));	//Static brings the control back to check for static files in our local dir. Put all files in teh folder mentioned

app.use(bodyParser.urlencoded({extended: true}));

app.get("/", (req, res) => {

	res.sendFile(__dirname + '/signup.html');
})

app.post("/", (req, res) => {

	var dat = req.body;

	const firstName = dat.firstName;
	const lastName = dat.lastName;
	const emailId = dat.emailId;

	//Api Key: 05bc762cbcc415bc6d54aed2991628e2-us10
	//List key: 0a27b148ba

	const data = {

		members: [
			{
				email_address: emailId,
				status: "subscribed",
				merge_fields: {
					FNAME: firstName,
					LNAME: lastName
				}
			}
		]
	}

	const jsonData = JSON.stringify(data);

	const url = 'https://us10.api.mailchimp.com/3.0/lists/0a27b148ba';

	const options = {

		method: 'POST',
		auth: 'utkarsh2504:05bc762cbcc415bc6d54aed2991628e2-us10'
	}

	const request = https.request(url, options, response => {

		if(response.statusCode === 200) {

			response.on('data', data => {
				console.log(JSON.parse(data));

				jData = JSON.parse(data);

				if(jData.error_count == 0) {

					res.sendFile(__dirname + '/success.html');
				}

				else {

					res.sendFile(__dirname + '/failure.html');
				}
			})

		}
		else {

			res.sendFile(__dirname + '/failure.html');
		}

	})

	request.write(jsonData);
	request.end();
})

app.post('/failure', (req, res) => {

	res.redirect('/');	//Redirects to home route.
})

app.listen(process.env.PORT || 3000, function() {	//process,env.PORT is for heroku deployment, as they give a dyncamic port. While 3000 is for local testing

	console.log('Server running on port 3000.');
})