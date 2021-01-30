// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
const express = require("express");
const app = express();
const request = require('request');


var user1_in = '';

var translatedResponse=''

// make all the files in 'public' available
// https://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

// https://expressjs.com/en/starter/basic-routing.html
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/views/index.html");
});


app.get("/translate", (req, response) => {
  // express helps us take JS objects and send them as JSON
      let options = {
        method: 'POST',
        baseUrl: 'https://api.cognitive.microsofttranslator.com/',
        url: 'translate',
        qs: {
          'api-version': '3.0',
          'to': req.query.lang_to,
          'from': req.query.lang_from,
        },
        headers: {
          'Ocp-Apim-Subscription-Key': process.env.SECRET,
          'Ocp-Apim-Subscription-Region': 'eastus',
          'Content-type': 'application/json',
        },
        body: [{
              'text': req.query.user_in
        }],
        json: true,
    };

    request(options, function(err, res, body){
        console.log(JSON.stringify(body, null, 4));
        response.json(body);
    });
});


// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});

