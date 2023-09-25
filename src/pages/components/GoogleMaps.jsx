import React, { useState } from 'react';
import GoogleMapReact from 'google-map-react';
import LocationPin from './LocationPin';
import LocationDrone from './LocationDrone';

const GoogleMaps = (props) => {
  const [selectedMarkerIndex, setSelectedMarkerIndex] = useState(null);
  const [markers, setMarkers] = useState([]);

  const handleMarkerClick = (index) => {
    // Check if the marker is already selected
    if (selectedMarkerIndex === index) {
      // Deselect the marker and remove it from the markers state
      const updatedMarkers = markers.filter((_, i) => i !== index);
      setMarkers(updatedMarkers);
      setSelectedMarkerIndex(null); // Deselect the marker
    } else {
      // Select the marker
      setSelectedMarkerIndex(index);
    }
  };  

  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <GoogleMapReact
        bootstrapURLKeys={{
            key: "AIzaSyAQhpgh7axWcIaO_G4YjpHROf0XnfqmSlo",
            language: "id",
        }}
        defaultCenter={props.center}
        defaultZoom={props.zoom}
      >
        {props.droneLocation && (
        //   <LocationPin
        //     lat={props.droneLocation.lat}
        //     lng={props.droneLocation.lng}
        //     text="Drone"
        //     color="black"
        //   />
        <LocationDrone 
            lat={props.droneLocation.lat}
            lng={props.droneLocation.lng}
            text="Drone" 
            color="black" 
            startLat={props.droneLocation.lat}
            startLong={props.droneLocation.lng}
            />
        )}
        {markers.map((marker, index) => (
          <LocationPin
            key={index}
            lat={marker.lat}
            lng={marker.lng}
            text={`Waypoint ${index + 1}`}
            color={selectedMarkerIndex === index ? 'red' : 'blue'} // Change color based on selection
            onClick={() => handleMarkerClick(index)} // Handle marker click
          />
        ))}
      </GoogleMapReact>
    </div>
  );
};

export default GoogleMaps;
