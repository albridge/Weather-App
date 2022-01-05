import "./App.css";
import axios from "axios";
import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import cities from "./country";
import "./mystyle.css";

function App() {
  const [temperature, setTemperature] = useState("");
  const [city, setCity] = useState("");
  const [description, setDescription] = useState("");
  const [ci, setCi] = useState("");
  const [bundle, setBundle] = useState({});
  // const myQuery = `

  //     query {
  //       getCityByName(name: "Basel") {
  //         id
  //         name
  //         country
  //         coord {
  //           lon
  //           lat
  //         }
  //         weather {
  //           summary {
  //             title
  //             description
  //             icon
  //           }
  //           temperature {
  //             actual
  //             feelsLike
  //             min
  //             max
  //           }
  //           wind {
  //             speed
  //             deg
  //           }
  //           clouds {
  //             all
  //             visibility
  //             humidity
  //           }
  //           timestamp
  //         }
  //       }
  //     }
  //  `;

  var myQuery;

  function foo(code) {
    myQuery = `

      query ($code:String!){
        getCityByName(name:$code) {
          id
          name
          country
          coord {
            lon
            lat
          }
          weather {
            summary {
              title
              description
              icon
            }
            temperature {
              actual
              feelsLike
              min
              max
            }
            wind {
              speed
              deg
            }
            clouds {
              all
              visibility
              humidity
            }
            timestamp
          }
        }
      }
   `;
  }
  var variable = city;
  foo(variable);

  // const loadWeather = async () => {
  //   axios({
  //     url: "https://graphql-weather-api.herokuapp.com/",
  //     method: "post",
  //     data: {
  //       query: myQuery,
  //       variables: { code: variable },
  //     },
  //   }).then((result) => {
  //     console.log(result.data);
  //   });
  // };

  const loadWeather = async () => {
    fetch("https://graphql-weather-api.herokuapp.com/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: myQuery,
        variables: { code: variable },
      }),
    })
      .then((response) => response.json())
      .then((data) => setBundle(data));
  };

  const getWeather_2 = (text) => {
    let term = text.split(" ");

    variable = term[1];
    document.getElementById("cityList").innerHTML = "";
    loadWeather();
  };

  function getdate(timestamp) {
    var unixTimestamp = timestamp;
    var date = new Date(unixTimestamp * 1000);
    // console.log("Unix Timestamp:", unixTimestamp);
    // console.log("Date Timestamp:", date.getTime());
    // console.log(date);
    return (
      "Date: " +
      date.getDate() +
      "/" +
      (date.getMonth() + 1) +
      "/" +
      date.getFullYear() +
      " " +
      date.getHours() +
      ":" +
      date.getMinutes() +
      ":" +
      date.getSeconds()
    );
  }

  const cList = document.getElementById("cityList");

  const getCity = (term) => {
    getWeather_2(term);
  };

  const searchCity = (e) => {
    let text = e.target.value;
    setCity(text);
    document.getElementById("box").style.display = "none";
    document.getElementById("box").style.height = "10px";
    let mycity;
    mycity = cities.filter((city) => {
      return city.subcountry == text;
    });

    // var PATTERN = text;
    // mycity = cities.filter(function (str) {
    //   return str.subcountry.indexOf(PATTERN) === -1;
    // });

    cList.innerHTML = "";

    for (var d = 0; d < mycity.length; d++) {
      const element = document.createElement("div");
      element.style.padding = "5px";
      element.style.color = "white";
      element.style.borderBottom = "1px solid white";
      element.style.cursor = "pointer";
      element.style.backgroundColor = "red";

      element.innerText =
        mycity[d].name + " " + mycity[d].subcountry + " " + mycity[d].country;
      element.addEventListener("click", function () {
        getCity(element.textContent);

        document.getElementById("box").style.display = "block";
      });
      cList.append(element);
      // if (d == 5) {
      //   return;
      // }
    }
  };

  const current_temp = Math.floor(
    bundle.data.getCityByName.weather.temperature.actual - 273.15
  );
  let background = "";
  const sunny = "sunny.jpg";
  const winter = "cold.jpg";
  bundle && current_temp < 10 ? (background = winter) : (background = sunny);

  return (
    <div
      className="container-fluid"
      style={{
        backgroundImage: "url(" + background + ")",
        height: "100vh",
        // marginTop: "-70px",
        // fontSize: "50px",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",

        textAlign: "center",
        color: "white",
        display: "block",
      }}
    >
      <h1 style={{ color: "white" }}>WeatherApp</h1>

      <div>
        <input type="text" onChange={(e) => searchCity(e)} value={city}></input>
      </div>
      <div
        id="cityList"
        style={{
          width: "300px",
          overflow: "auto",
          minHeight: "10px",
          height: "100px",
          // position: "fixed",
          display: "block",
          margin: "auto",
        }}
      ></div>
      <div id="box" style={{ color: "black" }}>
        <div className="glass">
          {bundle.data != null
            ? Math.floor(
                bundle.data.getCityByName.weather.temperature.actual - 273.15
              )
            : ""}
          {bundle.data != null && <span>&deg;C&#176;</span>}
        </div>
        <div>{bundle.data != null ? bundle.data.getCityByName.name : ""}</div>
        <div>
          {bundle.data != null ? bundle.data.getCityByName.country : ""}
        </div>
        <div>
          {bundle.data != null
            ? bundle.data.getCityByName.weather.summary.description
            : ""}
        </div>
        <div>
          {bundle.data != null
            ? bundle.data.getCityByName.weather.summary.title
            : ""}
        </div>
        <div>
          {bundle.data != null
            ? "http://openweathermap.org/img/w/" +
              bundle.data.getCityByName.weather.summary.icon +
              ".png"
            : ""}
        </div>
        <div>
          {bundle.data != null
            ? bundle.data.getCityByName.weather.clouds.humidity
            : ""}
        </div>
        <div>
          {bundle.data != null
            ? bundle.data.getCityByName.weather.temperature.min
            : ""}
        </div>
        <div>
          {bundle.data != null
            ? bundle.data.getCityByName.weather.temperature.max
            : ""}
        </div>
        <div>
          {bundle.data != null
            ? getdate(bundle.data.getCityByName.weather.timestamp)
            : ""}
        </div>
        <div>
          {bundle.data != null
            ? bundle.data.getCityByName.weather.wind.speed
            : ""}
        </div>
      </div>
    </div>
  );
}

export default App;
