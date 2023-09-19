import React from 'react'
import { Stack, Typography, Grid, Card, Box } from '@mui/material'
import GoogleMapReact from "google-map-react";


export default function GoogleMaps () {
  return (
    <div className='h-[80vh] w-full'>
      {/* <iframe
        src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2288.4471123898966!2d106.82640085155674!3d-6.362309885442591!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69ee15b87a8c0f%3A0x92e67255b39c3a8d!2sUniversitas%20Indonesia%2C%20Kampus%20UI%20Depok!5e0!3m2!1sen!2sid!4v1661633258973!5m2!1sen!2sid'
        style={{ border: 0, height: '80vh', width: '100%' }}
        allowFullScreen={true}
        loading='lazy'
      ></iframe> */}
          <GoogleMapReact
              bootstrapURLKeys={{
                key: "AIzaSyD3RzE2fq7JvhFmDTbXyjj22jqIAytT7XU",
                language: "id",
              }}
              defaultCenter={defaultProps.center}
              defaultZoom={defaultProps.zoom}
              options={{ mapTypeId: mapType }}
              onClick={(e) => {
                if (mapsFlightLtd.length < titik) {
                  let arr = [...mapsFlight];
                  let arr1 = [...mapsFlightLtd];
                  let arr2 = [...mapsFlightLng];
                  arr.push({ lat: e.lat, lng: e.lng });
                  arr1.push(e.lat);
                  arr2.push(e.lng);
                  setMapsFlight(arr);
                  setMapsFlightLtd(arr1);
                  setMapsFlightLng(arr2);
                }
              }}
            >
              <LocationDrone lat={droneFlightLtd} lng={droneFlightLng} text="Drone" color="white" startLat={droneFlightLtd} startLong={droneFlightLng} />
              {mapsFlightLtd?.map((lat, idx) => (
                <LocationPin lat={lat} lng={mapsFlightLng[idx]} text={`Node ${idx + 1}`} color="yellow" />
              ))}
            </GoogleMapReact>
     
    </div>
  )
}
