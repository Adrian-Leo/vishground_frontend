import React, { useEffect, useState } from "react";
import { Stack, Typography, Grid, Card } from "@mui/material";
import moment from "moment/moment";
import axios from "axios";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import "bootstrap/dist/css/bootstrap.min.css";
import mqtt from "mqtt/dist/mqtt";
import CorCard from "./components/CoordinateCard";
import SensorCard from "./components/SensorCard";
import options from "./utility/OptionsMQTT";
import LocationPin from "./components/LocationPin";
import LocationDrone from "./components/LocationDrone";
import NavbarDefault from "./components/Navbar";
import GoogleMaps from "./components/GoogleMaps";

import GoogleMapReact from "google-map-react";

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);




const Home = () => {
  moment.locale("id");
  const [mapsFlight, setMapsFlight] = useState([]);
  const [droneFlightLtd, setDroneFlightLtd] = useState(null);
  const [droneFlightLng, setDroneFlightLng] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [selectedMarkerIndex, setSelectedMarkerIndex] = useState(null);
  const [mapsFlightLtd, setMapsFlightLtd] = useState([]);
  const [mapsFlightLng, setMapsFlightLng] = useState([]);
  const [droneStatus, setDroneStatus] = useState([]);
  const [droneBattery, setDroneBattery] = useState([]);
  const [droneAltitude, setDroneAltitude] = useState([]);
  const [droneSpeedX, setDroneSpeedX] = useState([]);
  const [droneSpeedY, setDroneSpeedY] = useState([]);
  const [droneSpeedZ, setDroneSpeedZ] = useState([]);
  const [droneProgress, setDroneProgress] = useState([]);
  const [droneHeading, setDroneHeading] = useState([]);
  const [droneTimestamp, setDroneTimeStamp] = useState([]);
  

  const handleResetLocation = () => {
    setMapsFlight([]);
    setMapsFlightLtd([]);
    setMapsFlightLng([]);
    setTitik(0);

    axios
      .post("https://vtol-cigritous-backend.herokuapp.com/resetsum")
      .then((response) => {
        console.log(response.data); // log the response from the server
      })
      .catch((error) => {
        console.log(error); // log any errors that occurred during the request
      });

    axios
      .post("https://vtol-cigritous-backend.herokuapp.com/resetcor")
      .then((response) => {
        console.log(response.data); // log the response from the server
      })
      .catch((error) => {
        console.log(error); // log any errors that occurred during the request
      });
  };


  let arrCoor = [...mapsFlight];

  const [titik, setTitik] = useState(0);
  const serverHeroku = "https://vishback-821ca4854d9a.herokuapp.com/";
  useEffect(() => {
    async function fetchData() {
      const response = await axios.get(`${serverHeroku}/updatesumnode`);
      const dataTitik = response.data;
      if (dataTitik.length > 0 && dataTitik[0].angka > 0) {
        setTitik(dataTitik[0].angka);
      } else if (titik > 0) {
        const dataSum = {
          id: 1,
          angka: titik,
        };
        try {
          console.log("Data SUM: ", dataSum);
          await axios.post(`${serverHeroku}/insertsumnode`, dataSum);
          console.log("Data Central sent to the backend");
        } catch (error) {
          console.error("Error sending data to the backend: ", error);
        }
      }
    }
    fetchData();
  }, [titik]);

  let totalNode = 20;

  const nodes = [];

  for (let index = 1; index <= totalNode; index++) {
    nodes.push(index);
  }

  const [dataCor, setDataCor] = useState({
    node: [],
    latitude: [],
    longitude: [],
    coordinate: [],
  });

  useEffect(() => {
    const fetchData = async (a) => {
      try {
        console.log("masuk fetch");
        const response = await axios.get(`${serverHeroku}/updatecoordinate/${a}`);
        const data = response.data;

        if (data.length !== 0) {
          setDataCor({
            node: data.map((item) => item.node),
            latitude: data.map((item) => item.latitude),
            longitude: data.map((item) => item.longitude),
            coordinate: data.map((item) => item.coordinate),
          });

          setMapsFlight((prevArr) => [...prevArr, data.map((item) => item.coordinate)]);
          setMapsFlightLtd((prevArr) => [...prevArr, data.map((item) => item.latitude)]);
          setMapsFlightLng((prevArr) => [...prevArr, data.map((item) => item.longitude)]);

          console.log("inc : ", a);
        } else {
          console.log(`No data returned for ${a}`);
        }
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    for (let a = 1; a <= titik; a++) {
      fetchData(a);
    }
  }, [titik]);

  const [hoverCard, setHoverCard] = useState(Array(nodes.length).fill(false));
  const [mapType, setMapType] = useState("roadmap");

  const handleViewChange = () => {
    setMapType(mapType === "roadmap" ? "satellite" : "roadmap");
  };

  const handleCardHover = (index) => {
    const newHoverCard = [...hoverCard];
    newHoverCard[index] = !newHoverCard[index];
    setHoverCard(newHoverCard);
  };

  

  const [attitude, setAttitude] = useState({
    yaw: 0.0,
    pitch: 0.0,
    roll: 0.0,
    att: 0.0,
    // lat: -4.6140971,
    // lng: 105.224446,
    lat: -4.6140971,
    lng: 105.224446,

  });

  //lanud
  // lat: -4.6140971,
  // lng: 105.224446,

  useEffect(() => {
    const port = 37900;
    const server = "wss://hairdresser.cloudmqtt.com";
    const client = mqtt.connect(`${server}:${port}`, options);
    client.on("connect", () => {
      console.log("MQTT client connected to the server.");
      client.subscribe("/drone/status");
      client.subscribe("/drone/battery");
      client.subscribe("/drone/progress");
      client.subscribe("/drone/lat");
      client.subscribe("/drone/lng");
      client.subscribe("/drone/alt");
      client.subscribe("/drone/vx");
      client.subscribe("/drone/vy");
      client.subscribe("/drone/vz");
      client.subscribe("/drone/yaw_curr");
      client.subscribe("/drone/time");
      for (let i = 1; i <= 20; i++) {
        client.subscribe("/" + i + "/coordinate");
      }
    });

    console.log("masuk config");
    client.on("message", (topic, message) => {
      console.log("tessss");
      if (topic === "/drone/status") {
        if (message.toString() === "0") {
          setDroneStatus("Disarmed");
        } else if (message.toString() === "1") {
          setDroneStatus("Armed");
        }
      }
      if (topic === "/drone/battery") {
        setDroneBattery(message.toString());
      }
      if (topic === "/drone/progress") {
        setDroneProgress(message.toString());
      }
      if (topic === "/drone/lat") {
        setDroneFlightLtd((message / 10e6).toString());
      }
      if (topic === "/drone/lng") {
        setDroneFlightLng((message / 10e6).toString());
      }
      if (topic === "/drone/alt") {
        setDroneAltitude(message.toString());
      }
      if (topic === "/drone/vx") {
        setDroneSpeedX(message.toString());
      }
      if (topic === "/drone/vy") {
        setDroneSpeedY(message.toString());
      }
      if (topic === "/drone/vz") {
        setDroneSpeedZ(message.toString());
      }
      if (topic === "/drone/yaw_curr") {
        setDroneHeading(message.toString());
      }
      if (topic === "/drone/time") {
        setDroneTimeStamp(message.toString());
      }
      for (let i = 1; i <= 20; i++) {
        if (topic === "/" + i + "/coordinate") {
          arrCoor[i - 1] = JSON.parse(message);
          setMapsFlight(arrCoor);
        }
      }
    });
    return () => {
      client.end();
    };
  }, [mapsFlight, droneFlightLng, droneFlightLtd]);

  const defaultProps = {
    center: {
      //edit jordhie: kalo null bakal ke default hardcode, kalo ga null harusnya ke
      //lokasi drone
      lat: droneFlightLtd !== null ? droneFlightLtd : attitude.lat,
      lng: droneFlightLng !== null ? droneFlightLng : attitude.lng,
      // lat: attitude.lat,
      // lng: attitude.lng,
      // lat: droneFlightLtd,
      // lng: droneFlightLng,
    },
    fly: {
      lat: droneFlightLtd,
      lng: droneFlightLng,
    },
    zoom: 18,
    options: {
      disableDefaultUI: true,
      dragging: false,
      scrollwheel: false,
      panControl: false,
      zoomControl: false,
      gestureHandling: "none",
    },
  };

  return (
    <>
      <NavbarDefault />
      <div style={{ display: "flex", flexDirection: "row", gap: "30px" }}>
        <div style={{ flexBasis: "100%", width: "100%", maxHeight: "100%" }}>
          <Typography
            style={{
              color: "#BA365D",
              fontSize: "30px",
              margin: "20px auto",
              fontWeight: "bold",
            }}
            textAlign="center"
          >
            Controls Unnamed Drone
          </Typography>
          <div style={{ display: "flex", flexDirection: "row", gap: "10px", padding: "20px" }}>
            <button className="bg-purple-light hover:bg-purple-dark hover:shadow-2xl w-56 h-12" onClick={handleViewChange}>
              Switch to {mapType === "roadmap" ? "Satellite" : "Roadmap"} view
            </button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", padding: "20px", gap: "20px" }}>
            {/* <GoogleMaps /> */}
          <Stack direction={"column"} padding="20px" gap="20px">
            <Stack style={{ height: "50vh", width: "100%" }}>
            {/* <GoogleMaps
              droneLocation={{
                lat: droneFlightLtd,
                lng: droneFlightLng,
              }}
              center={{
                lat: droneFlightLtd !== null ? droneFlightLtd : attitude.lat,
                lng: droneFlightLng !== null ? droneFlightLng : attitude.lng,
              }}
              zoom={18}
              markers={markers} // Pass the markers state
              // handleMarkerClick={handleMarkerClick} // Pass the handleMarkerClick function
            /> */}
              <GoogleMapReact
                bootstrapURLKeys={{
                  key: "AIzaSyAQhpgh7axWcIaO_G4YjpHROf0XnfqmSlo",
                  language: "id",
                }}
                defaultCenter={defaultProps.center}
                defaultZoom={defaultProps.zoom}
                options={{ mapTypeId: mapType }}
                onClick={(e) => {
                  // Create a new marker object with the clicked latitude and longitude
                  const newMarker = {
                    lat: e.lat,
                    lng: e.lng,
                  };

                  // Add the new marker to the markers state
                  setMarkers([...markers, newMarker]);
                }}
              >
                <LocationDrone lat={droneFlightLtd} lng={droneFlightLng} text="Drone" color="black" startLat={droneFlightLtd} startLong={droneFlightLng} />
                {mapsFlightLtd?.map((lat, idx) => (
                  <LocationPin lat={lat} lng={mapsFlightLng[idx]} text={`Node ${idx + 1}`} color="yellow" />
                ))}

                {/* Render new waypoints */}
                {markers.map((marker, index) => (
                  <LocationPin
                    key={index}
                    lat={marker.lat}
                    lng={marker.lng}
                    text={`Waypoint ${index + 1}`}
                    color={selectedMarkerIndex === index ? "red" : "blue"} // Highlight the selected marker
                    onClick={() => {
                      // If the marker is already selected, remove it
                      if (selectedMarkerIndex === index) {
                        const updatedMarkers = markers.filter((_, i) => i !== index);
                        setMarkers(updatedMarkers);
                        setSelectedMarkerIndex(null); // Deselect the marker
                      } else {
                        // Deselect any previously selected marker
                        setSelectedMarkerIndex(index);
                      }
                    }}
                  />
                ))}
              </GoogleMapReact>
            </Stack>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <button
                onMouseEnter={() => handleCardHover(24)}
                onMouseLeave={() => handleCardHover(24)}
                style={{ backgroundColor: "#3D3356", color: "white", padding: "10px 30px", border: "none", boxShadow: hoverCard[24] ? "0px 0px 20px 0px #000000" : "none" }}
                onClick={handleViewChange}
              >
                Switch to {mapType === "roadmap" ? "Satellite" : "Roadmap"} view
              </button>
              <button
                onMouseEnter={() => handleCardHover(1)}
                onMouseLeave={() => handleCardHover(1)}
                style={{ backgroundColor: "#3D3356", color: "white", padding: "10px 30px", border: "none", boxShadow: hoverCard[1] ? "0px 0px 20px 0px #000000" : "none" }}
                onClick={handleResetLocation}
              >
                Reset Location
              </button>
            </div>
            <Stack direction={"column"} padding="10px" gap="10px"></Stack>
           </Stack>

            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div className="flex flex-col bg-purple-light hover:bg-purple-dark hover:shadow-2xl w-56 h-12 items-center place-content-center">Task Progress : {droneProgress}%</div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", padding: "10px", gap: "10px" }}></div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", padding: "20px", gap: "10px" }}>
            <CorCard title="Coordinate Position Drone" value={"Lat : " + droneFlightLtd + " || Lng : " + droneFlightLng} />
            <div style={{ display: "flex", flexDirection: "column", padding: "20px", gap: "10px" }}>
              <Grid container spacing={2} columns={3} width="100%" justifyContent={"center"}>
                <Grid item xs={1}>
                  <SensorCard title="Status Drone" value={droneStatus} />
                </Grid>
                <Grid item xs={1}>
                  <SensorCard title="Timestamp Drone" value={droneTimestamp} />
                </Grid>
                <Grid item xs={1}>
                  <SensorCard title="Status Battery" value={droneBattery + " %"} />
                </Grid>
                <Grid item xs={1}>
                  <SensorCard title="Altitude Drone" value={droneAltitude} />
                </Grid>
                <Grid item xs={1}>
                  <SensorCard title="Heading Drone" value={droneHeading} />
                </Grid>
              </Grid>
              <div style={{ display: "flex", flexDirection: "column", padding: "20px", gap: "10px" }}>
                <Grid container spacing={2} columns={3} width="100%" justifyContent={"center"}>
                  <Grid item xs={1}>
                    <SensorCard title="Speed Drone (X)" value={droneSpeedX} />
                  </Grid>
                  <Grid item xs={1}>
                    <SensorCard title="Speed Drone (Y)" value={droneSpeedY} />
                  </Grid>
                  <Grid item xs={1}>
                    <SensorCard title="Speed Drone (Z)" value={droneSpeedZ} />
                  </Grid>
                </Grid>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
