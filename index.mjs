import express from "express";
import cors from "cors";
import morgan from "morgan";
const app = express();
const port = process.env.PORT || 3000

app.use(cors());
app.use(express.json());
app.use(morgan('short'));

app.use((req, res, next) => {
  console.log("a request came", req.body);
  next();
});

app.get('/', (req, res) => {
  res.send('Hello World!')
});

// WEBHOOK

app.post('/webhook', (req, res) => {
    console.log('GOT a POST Request');
    if(!req.body){
        return res.sendStatus(400);
    }
    console.log('here is the post request from Dialogflow');
    console.log(req.body);
    console.log('Got geo city parameter from Dialogflow' + req.body.queryResult.parameters['geo-city']);
    var city = req.body.queryResult.parameters['geo-city'];
    var w = getWeather(city);
    let response = " "; //Default response from the webhook to show that it is working.
    let responseObj = {
        "fulfillmentText": response,
        "fulfillmentMessages": [{'text': {'text': [w]}}],
        "source": ""
    };
    console.log('here is the reposnse to Dialogflow');
    console.log(responseObj);
    return res.json(responseObj);
});


function getWeather(city) {
    let URL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=8bd6abdc20db1f463412a5c9df7dc7d7&units=metric`;
    var request = require('request');
    request(URL, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var info = JSON.parse(body);
            console.log(info);
            var weather = info.weather[0].main;
            var temp = info.main.temp;
            var humidity = info.main.humidity;
            var wind = info.wind.speed;
            var response = `The weather in ${city} is ${weather} and the temperature is ${temp} degrees celsius. The humidity is ${humidity}% and the wind speed is ${wind} km/h.`;
            return response;
        }
    });
}

app.listen(port, () => {
  console.log(`Server is listening on port: ${port}`)
});