import React, { useEffect, useState } from "react";
import { Stack, Typography, Grid, Card, Box } from "@mui/material";
import moment from "moment/moment";
import axios from "axios";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import "bootstrap/dist/css/bootstrap.min.css";
import mqtt from "mqtt/dist/mqtt";
import CorCard from "./components/CoordinateCard";
import LocationPin from "./components/LocationPin";
import SensorCard from "./components/SensorCard";
import LocationDrone from "./components/LocationDrone";
import GoogleMaps from "./utility/GoogleMaps";
import options from "./utility/OptionsMQTT";
import { handleTakeOff, handleLanding } from "./utility/FlightHandling";
import NavbarDefault from "./components/Navbar";
import GoogleMapReact from "google-map-react";
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const server = "wss://hairdresser.cloudmqtt.com";
const port = 37900;

const Controls = () => {
  moment.locale("id");
  const [mapsFlight, setMapsFlight] = useState([]);
  const [droneMode, setDroneMode] = useState("");
  const [droneSetMode, setDroneSetMode] = useState("");
  const [droneFlightLtd, setDroneFlightLtd] = useState([]);
  const [droneFlightLng, setDroneFlightLng] = useState([]);
  const [mapsFlightLtd, setMapsFlightLtd] = useState([]);
  const [mapsFlightLng, setMapsFlightLng] = useState([]);
  const [droneProgress, setDroneProgress] = useState([]);
  const [droneStatus, setDroneStatus] = useState([]);
  const [droneAltitude, setDroneAltitude] = useState([]);
  const [anchorEl, setAnchorEl] = useState([]);
  const [markers, setMarkers] = useState([]);
  const [selectedMarkerIndex, setSelectedMarkerIndex] = useState(null);

  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    const client = mqtt.connect(`${server}:${port}`, options);
    client.on("connect", () => {
      client.publish("/drone/set_mode", droneSetMode);
    });
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCloseManual = () => {
    setDroneSetMode("MANUAL");
    setAnchorEl(null);
  }

  const handleCloseAcro = () => {
    setDroneSetMode("ACRO");
    setAnchorEl(null);
  }

  const handleCloseAltitude = () => {
    setDroneSetMode("ALTITUDE");
    setAnchorEl(null);
  }

  const handleCloseHold = () => {
    setDroneSetMode("HOLD");
    setAnchorEl(null);
  }

  const handleClosePosition = () => {
    setDroneSetMode("POSITION");
    setAnchorEl(null);
  }

  const handleCloseMission = () => {
    setDroneSetMode("MISSION");
    setAnchorEl(null);
  }

  const handleCloseOffboard = () => {
    setDroneSetMode("OFFBOARD");
    setAnchorEl(null);
  }

  const handleCloseReturn = () => {
    setDroneSetMode("RETURN");
    setAnchorEl(null);
  }

  const handleCloseStabilized = () => {
    setDroneSetMode("STABILIZED");
    setAnchorEl(null);
  }

  let arrCoor = [...mapsFlight];

  const [attitude, setAttitude] = useState({
    yaw: 0.0,
    pitch: 0.0,
    roll: 0.0,
    att: 0.0,
    lat: -4.6140971,
    lng: 105.224446,
  });


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


  const handleCardHover = (index) => {
    const newHoverCard = [...hoverCard];
    newHoverCard[index] = !newHoverCard[index];
    setHoverCard(newHoverCard);
  };
  const [mapType, setMapType] = useState("roadmap");

  const handleViewChange = () => {
    setMapType(mapType === "roadmap" ? "satellite" : "roadmap");
  };

  const defaultProps = {
    center: {
      //edit jordhie: kalo null bakal ke default hardcode, kalo ga null harusnya ke
      //lokasi drone
      lat: attitude.lat,
      lng: attitude.lng,
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

  const handleResetLocation = () => {
    setMapsFlight([]);
    setMapsFlightLtd([]);
    setMapsFlightLng([]);
    setTitik(0);

    axios
      .post(`${serverHeroku}/resetsum`)
      .then((response) => {
        console.log(response.data); // log the response from the server
      })
      .catch((error) => {
        console.log(error); // log any errors that occurred during the request
      });

    axios
      .post(`${serverHeroku}/resetcor`)
      .then((response) => {
        console.log(response.data); // log the response from the server
      })
      .catch((error) => {
        console.log(error); // log any errors that occurred during the request
      });
  };

  useEffect(() => {
    const client = mqtt.connect(`${server}:${port}`, options);
    client.on("connect", () => {
      console.log("MQTT client connected to the server.");
      client.subscribe("/drone/mode");
      client.subscribe("/drone/status");
      client.subscribe("/drone/progress");
      client.subscribe("/drone/lat");
      client.subscribe("/drone/lng");
      client.subscribe("/drone/alt");
      client.subscribe("/drone/time");
      for (let i = 1; i <= mapsFlight.length; i++) {
        client.publish("/" + i + "/coordinate", JSON.stringify(mapsFlight[i - 1]), { qos: 0 });
        client.publish(
          "/" + i + "/latitude",
          parseFloat(mapsFlightLtd[i - 1])
            .toFixed(6)
            .toString(),
          { qos: 0 }
        );
        client.publish(
          "/" + i + "/longitude",
          parseFloat(mapsFlightLng[i - 1])
            .toFixed(6)
            .toString(),
          { qos: 0 }
        );
      }

      for (let i = 1; i <= 20; i++) {
        client.subscribe("/" + i + "/latitude");
        client.subscribe("/" + i + "/longitude");
      }
    });

    console.log("masuk config");
    client.on("message", (topic, message) => {
      if (topic === "/drone/status") {
        if (message.toString() === "0") {
          setDroneStatus("Disarmed");
        } else if (message.toString() === "1") {
          setDroneStatus("Armed"); 
        }
      }
      if (topic === "/drone/mode"){
        let mode = message.toString();
        console.log(message);
        if(mode === "AUTO.LOITER"){
          setDroneMode("HOLD");
        }else if(mode === "AUTO.MISSION"){
          setDroneMode("MISSION");
        }else if(mode === "AUTO.RTL"){
          setDroneMode("RETURN");
        }else if(mode === "AUTO.LAND"){
          setDroneMode("LAND");
        }else if(mode === "STABILIZED"){
          setDroneMode("STABILIZED");
        }else if(mode === "OFFBOARD"){
          setDroneMode("OFFBOARD");
        }else if(mode === "POSCTL"){
          setDroneMode("POSITION");
        }else if(mode === "ALTCTL"){
          setDroneMode("ALTITUDE");
        }else if(mode === "ACRO"){
          setDroneMode("ACRO");
        }else if(mode === "MANUAL"){
          setDroneMode("MANUAL");
        }
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

  const [shouldSkip, setShouldSkip] = useState(true);

  useEffect(() => {
    const sendData = async () => {
      for (let i = 1; i <= titik; i++) {
        const dataCoordinate = {
          node: i,
          latitude: mapsFlightLtd[i - 1],
          longitude: mapsFlightLng[i - 1],
          coordinate: mapsFlight[i - 1],
        };

        try {
          if (!shouldSkip) {
            axios.post(`${serverHeroku}/insertcoordinate`, dataCoordinate);
            console.log("Data Node sent to the backend");
            console.log(mapsFlight[i - 1]);
          }
        } catch (error) {
          console.error("Error sending data to the backend: ", error);
        }
      }
      setShouldSkip(true);
    };
    sendData();
  }, [mapsFlight, mapsFlightLng, mapsFlightLtd]);

  return (
    <>
      <NavbarDefault />
      <div style={{ display: "flex", flexDirection: "row", gap: "30px" }}>
        <div style={{ flexBasis: "100%", width: "100%", height: "100%" }}>
          <Typography
            style={{
              color: "#BA365D",
              fontSize: "30px",
              margin: "20px auto",
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            Controls Unnamed Drone
          </Typography>
          <div className="flex justify-between ml-[40px] w-fit bg-purple-light hover:bg-purple-dark">
            <p
              id="mode-text"
              className="text-white px-4"
            >
              {droneMode}
            </p>
              {/* <Menu
                id="mode-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                  'aria-labelledby': 'mode-button',
                }}
              >
                <MenuItem onClick={handleCloseManual} style={{backgroundColor: '#3D3356', ':hover': { backgroundColor: '#312945'}}}>MANUAL</MenuItem>
                <MenuItem onClick={handleCloseAcro} style={{backgroundColor: '#3D3356', ':hover': { backgroundColor: '#312945'}}}>ACRO</MenuItem>
                <MenuItem onClick={handleCloseAltitude} style={{backgroundColor: '#3D3356', ':hover': { backgroundColor: '#312945'}}}>ALTITUDE</MenuItem>
                <MenuItem onClick={handleClosePosition} style={{backgroundColor: '#3D3356', ':hover': { backgroundColor: '#312945'}}}>POSITION</MenuItem>
                <MenuItem onClick={handleCloseStabilized} style={{backgroundColor: '#3D3356', ':hover': { backgroundColor: '#312945'}}}>STABILIZED</MenuItem>
                <MenuItem onClick={handleCloseOffboard} style={{backgroundColor: '#3D3356', ':hover': { backgroundColor: '#312945'}}}>OFFBOARD</MenuItem>
                <MenuItem onClick={handleCloseHold} style={{backgroundColor: '#3D3356', ':hover': { backgroundColor: '#312945'}}}>HOLD</MenuItem>
                <MenuItem onClick={handleCloseMission} style={{backgroundColor: '#3D3356', ':hover': { backgroundColor: '#312945'}}}>MISSION</MenuItem>
                <MenuItem onClick={handleCloseReturn} style={{backgroundColor: '#3D3356', ':hover': { backgroundColor: '#312945'}}}>RETURN</MenuItem>
                <MenuItem onClick={handleClose} style={{backgroundColor: '#3D3356', ':hover': { backgroundColor: '#312945'}}}>MANUAL</MenuItem>
                <MenuItem onClick={handleClose} style={{backgroundColor: '#3D3356', ':hover': { backgroundColor: '#312945'}}}>ACRO</MenuItem>
                <MenuItem onClick={handleClose} style={{backgroundColor: '#3D3356', ':hover': { backgroundColor: '#312945'}}}>ALTITUDE</MenuItem>
                <MenuItem onClick={handleClose} style={{backgroundColor: '#3D3356', ':hover': { backgroundColor: '#312945'}}}>POSITION</MenuItem>
                <MenuItem onClick={handleClose} style={{backgroundColor: '#3D3356', ':hover': { backgroundColor: '#312945'}}}>STABILIZED</MenuItem>
                <MenuItem onClick={handleClose} style={{backgroundColor: '#3D3356', ':hover': { backgroundColor: '#312945'}}}>OFFBOARD</MenuItem>
                <MenuItem onClick={handleClose} style={{backgroundColor: '#3D3356', ':hover': { backgroundColor: '#312945'}}}>HOLD</MenuItem>
                <MenuItem onClick={handleClose} style={{backgroundColor: '#3D3356', ':hover': { backgroundColor: '#312945'}}}>MISSION</MenuItem>
                <MenuItem onClick={handleClose} style={{backgroundColor: '#3D3356', ':hover': { backgroundColor: '#312945'}}}>RETURN</MenuItem>
              
              </Menu> */}
          </div>
          <div style={{ display: "flex", flexDirection: "column", padding: "20px", gap: "20px" }} className="h-full">
          <Stack direction={"column"} padding="20px" gap="20px">
            <Stack style={{ height: "50vh", width: "100%" }}>
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
              <button className="bg-purple-light hover:bg-purple-dark hover:shadow-2xl w-40 h-12" onClick={handleTakeOff}>
                Take Off Drone
              </button>
              <div className=" flex flex-col bg-purple-light hover:bg-purple-dark hover:shadow-2xl w-56 h-12 text-center place-content-center">Task Progress : {droneProgress}%</div>
              <button className="bg-purple-light hover:bg-purple-dark hover:shadow-2xl w-40 h-12" onClick={handleLanding}>
                Landing Drone
              </button>
            </div>
          </div>
          {/* <div className="flex flex-col h-full w-full p-8 items-center">
            <h3>Live Streaming</h3>
            <div className="place-content-center">
              <video autoPlay loop muted poster="https://assets.codepen.io/6093409/river.jpg">
                <source src="https://assets.codepen.io/6093409/river.mp4" type="video/mp4" />
              </video>
            </div>
          </div> */}
          <div className="flex flex-col gap-8 p-8">
            <CorCard className="hover:shadow-2xl" title="Coordinate Position Drone" value={"Lat : " + droneFlightLtd + " || Lng : " + droneFlightLng} />
            <Grid item xs={1}>
              <SensorCard className="hover:shadow-2xl" title="Altitude Drone" value={droneAltitude} />
            </Grid>
          </div>
        </div>
      </div>
    </>
  );
};

export default Controls;
