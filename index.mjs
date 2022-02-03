import express, { request } from "express";
import cors from "cors";
import morgan from "morgan";
import dfff from "dialogflow-fulfillment";
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(morgan("short"));

app.use((req, res, next) => {
  console.log("a request came", req.body);
  next();
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// WEBHOOK

app.post("/webhook", (req, res) => {
  const agent = new dfff.WebhookClient({ request: req, response: res });

  function welcome(agent) {
    agent.add("Greetings! from a Webhook Server to Dialogflow");
  }

  var intentMap = new Map();

  intentMap.set("webhookDemo", welcome);

  agent.handleRequest(intentMap);
});

app.listen(port, () => {
  console.log(`Server is listening on port: ${port}`);
});
