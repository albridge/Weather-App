const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(express.json());
const key = "c6d26810d4da6a83c8b0b906a49aa13c";
var corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};
app.use(cors(corsOptions));

app.post("/spoon", (req, res) => {
  axios({
    url:
      "https://api.openweathermap.org/data/2.5/onecall?lat=" +
      req.body.variables.lat +
      "&lon=" +
      req.body.variables.lon +
      "&appid=" +
      key +
      "&exclude=current,hourly,alerts,minutely",
    method: "get",
  }).then((result) => {
    // console.log(result.data.daily);
    return res.send(result.data);
  });
});

app.listen(4001, () => {
  console.log("graphql send server connected");
});
