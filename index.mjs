import express, { request } from "express";
import cors from "cors";
import morgan from "morgan";
import request from "request";
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

function cb(err, response, body) {

    if(err) {
        console.log('error:', error);
    }

    var weather = JSON.parse(body);
    if(weather.message === 'city not found') {
        result = 'unable to get weather' + weather.message;
    } else {
        result = 'Right now its ' + weather.main.temp + ' degrees with ' + weather.weather[0].description;
    }

}


function getWeather(city) {
    result = undefined;
    var URL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=8bd6abdc20db1f463412a5c9df7dc7d7&units=metric`;
    console.log(URL);
    var req = request(URL, cb);
    while(result === undefined) {
        require('deasync').runLoopOnce();
    }
    return result;
}

app.listen(port, () => {
  console.log(`Server is listening on port: ${port}`)
});