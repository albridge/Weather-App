// import axios from "axios";
import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../mystyle.css";
import Real from "../components/Real";
import { useContext } from "react";
import { ForecastContext } from "../ForecastContext";
const Home = () => {
  const [cityName, setCity] = useState("");
  const [open, setOpen] = useState(false);
  const [forecast, setForecast] = useState(false);
  const [bundle, setBundle] = useState({});
  const [daily, setDaily] = useState(false);
  const [, setForc] = useContext(ForecastContext);

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
  var variable = cityName;

  foo(variable);

  // const loadCityName = async () => {
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

  const showOptions = (data) => {
    let myCity = data.data.getCityByName.name;
    // end fetch call

    if (data) {
      cList.innerHTML = "";
    }

    const element = document.createElement("div");
    element.style.padding = "5px";
    element.style.color = "white";
    element.style.borderBottom = "1px solid white";
    element.style.cursor = "pointer";
    element.style.backgroundColor = "#808B96";

    element.innerText = myCity;
    element.addEventListener("click", function () {
      getCity(myCity);
      document.getElementById("cityList").style.height = "5px";

      document.getElementById("box").style.display = "block";
    });
    cList.append(element);
  };

  const checkBundle = (data) => {
    if (data != null) {
      showOptions(data);
    }
  };

  const loadCityName = async (text) => {
    fetch("https://graphql-weather-api.herokuapp.com/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: myQuery,
        variables: { code: encodeURIComponent(text) },
      }),
    })
      .then((response) => response.json())
      .then((data) => checkBundle(data))
      .catch((err) => console.log(err));
  };
  //   "https://api.openweathermap.org/data/2.5/onecall?lat=19.0760&lon=72.8777&appid={yourAPIkey}"

  const sendOff = (data) => {
    setBundle(data);
    tog2();
  };

  const loadCityWeather = async (text) => {
    fetch("https://graphql-weather-api.herokuapp.com/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: myQuery,
        variables: { code: encodeURIComponent(text) },
      }),
    })
      .then((response) => response.json())
      .then((data) => sendOff(data));
  };

  const runLoop = (val) => {
    var listings = [];
    var days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun", "Mon"];
    for (let x = 0; x < val.length; x++) {
      var value = val[x].temp;
      var des = val[x].weather[0];

      listings[x] = {
        name: days[x],
        High: getCelsius(value.max),
        Low: getCelsius(value.min),
        Des: des.description,
      };
    }
    // return listings;
    setDaily(listings);
    setForc(listings);
    setTimeout(function () {}, 5000);
  };

  // full forecast
  // const spoon = async () => {
  //   const res = await fetch("http://localhost:4001/spoon");
  //   const feedBack = res.json();
  //   console.log(feedBack);
  //   // runLoop(feedBack);
  // };

  const getForecast = () => {
    fetch("http://localhost:4001/spoon", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        // query: myQuery,
        variables: {
          lon: bundle.data.getCityByName.coord.lon,
          lat: bundle.data.getCityByName.coord.lat,
        },
      }),
    })
      .then((response) => response.json())
      // .then((data) => console.log(data.daily));
      .then((data) => runLoop(data.daily));
  };

  // end trial

  const getWeather_2 = (text) => {
    variable = text;

    document.getElementById("cityList").innerHTML = "";
    loadCityWeather(text);
  };

  const cList = document.getElementById("cityList");

  const getCity = (term) => {
    getWeather_2(term);
  };

  const searchCity = (e) => {
    let text = e.target.value;

    setCity(text);
    document.getElementById("box").style.display = "none";
    document.getElementById("box").style.height = "10px";
    document.getElementById("cityList").style.height = "100px";

    // make fetch call
    if (text.length > 0) {
      document.getElementById("cityList").innerText = "";
      loadCityName(text);
    }
  };

  function getCelsius(value) {
    return Math.floor(value - 273.15);
  }

  let current_temp = 20;
  if (bundle.data) {
    current_temp = getCelsius(
      bundle.data.getCityByName.weather.temperature.actual
    );
  }

  let background = "def.jpeg";
  let headColor;
  const sunny = "sunny.jpg";
  const winter = "cold.jpg";
  bundle && current_temp < 10 ? (background = winter) : (background = sunny);
  bundle && current_temp < 10 ? (headColor = "black") : (headColor = "white");

  function carmel(text) {
    return text
      .split(" ")
      .map((w) => w[0].toUpperCase() + w.substr(1).toLowerCase())
      .join(" ");
  }

  function tog() {
    setOpen(!open);
  }

  function tog2() {
    // if (forecast === false) {
    getForecast();

    // window.scrollTo(
    //   0,
    //   document.querySelector(".scrollingContainer").scrollHeight
    // );
    setForecast(!forecast);
    // }
  }
  var iconUrl = "";
  var highUrl = "";
  if (bundle.data) {
    iconUrl =
      "http://openweathermap.org/img/wn/" +
      bundle.data.getCityByName.weather.summary.icon +
      "@4x.png";

    highUrl = "http://openweathermap.org/img/wn/01d.png";
  }

  return (
    <div
      className="container-fluid"
      style={{
        backgroundImage:
          "linear-gradient(to bottom, rgba(30, 45, 20, 0.3), rgba(45, 22, 15, 0.4)),url(" +
          background +
          ")",
        height: "100vh",

        backgroundSize: "cover",
        backgroundRepeat: "repeat",

        backgroundPosition: "center",
        textAlign: "center",
        overflow: "auto",
        color: "white",
        display: "block",
        paddingBottom: "300px",
      }}
    >
      <h1 style={{ color: headColor, paddingTop: "30px" }}>WeatherApp</h1>

      <div>
        <input
          className="form-control"
          type="text"
          onChange={(e) => searchCity(e)}
          value={cityName}
          id="text"
          placeholder="Enter City Name"
          style={{ width: "30%", margin: "auto", marginTop: "30px" }}
          autoComplete="Off"
        ></input>
        <i className="fas fa-map-marker-alt"></i>{" "}
      </div>

      <div
        id="cityList"
        style={{
          width: "300px",
          overflow: "auto",

          display: "block",
          margin: "auto",
          marginTop: "-10px",
        }}
      ></div>

      <div id="box" style={{ color: "black" }}>
        {bundle.data && (
          <div className="glass">
            {bundle.data != null
              ? getCelsius(bundle.data.getCityByName.weather.temperature.actual)
              : ""}
            {bundle.data != null && <span>&deg;C</span>}
          </div>
        )}
        <div style={{ fontWeight: "bold", marginTop: "20px" }}>
          {bundle.data != null ? bundle.data.getCityByName.name : ""}
        </div>
        <div>
          {bundle.data != null ? bundle.data.getCityByName.country : ""}
        </div>
        <div style={{ fontWeight: "bold" }}>
          {bundle.data != null
            ? carmel(bundle.data.getCityByName.weather.summary.description)
            : ""}
        </div>

        <div>{bundle.data != null ? <img src={iconUrl} alt="" /> : ""}</div>

        <div>
          {bundle.data && <div style={{ fontWeight: "bold" }}>MIN</div>}
          <img src={highUrl} alt="" />
          {bundle.data != null
            ? Math.floor(
                bundle.data.getCityByName.weather.temperature.min - 273.15
              )
            : ""}
          {bundle.data != null && <span>&deg;C</span>}
        </div>
        <div>
          {bundle.data && <div style={{ fontWeight: "bold" }}>MAX</div>}
          <img src={highUrl} alt="" />
          {bundle.data != null
            ? getCelsius(bundle.data.getCityByName.weather.temperature.max)
            : ""}
          {bundle.data != null && <span>&#176;C</span>}
        </div>
        {bundle.data && (
          <div
            style={{
              fontWeight: "bold",
              marginTop: "20px",
              color: "#F7DC6F ",
              cursor: "pointer",
              marginBottom: "20px",
            }}
            onClick={tog}
          >
            + Click To View More
          </div>
        )}
        <div>
          {open === true && (
            <div id="more" style={{ fontWeight: "bold", color: "#A93226" }}>
              <div className="">
                {bundle.data != null
                  ? "Wind Speed: " +
                    bundle.data.getCityByName.weather.wind.speed
                  : ""}
              </div>
              <div className="">
                {bundle.data != null
                  ? "Pressure: " +
                    bundle.data.getCityByName.weather.clouds.humidity
                  : ""}
              </div>
            </div>
          )}
        </div>
        {bundle.data && (
          <div
            style={{
              fontWeight: "bold",
              marginTop: "20px",
              color: "#F7DC6F ",
              cursor: "pointer",
              marginBottom: "20px",
            }}
            onClick={tog2}
          >
            Get 7 Day forecast Here ...
          </div>
        )}

        {forecast === true && (
          <div
            style={{
              margin: "auto",
              width: "700px",
              marginTop: "30px",
            }}
          >
            <Real dailyData={daily} />
          </div>
        )}
      </div>

      <div className="scrollingContainer"></div>
    </div>
  );
};

export default Home;
