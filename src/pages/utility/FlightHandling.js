import mqtt from "mqtt/dist/mqtt";
import options from "./OptionsMQTT";

const setFLightConnection=(status) =>{
  let hasPublished = false;
  const port =	37900;
  const server = "wss://hairdresser.cloudmqtt.com";
  const client = mqtt.connect(`${server}:${port}`, options);
    client.on(
      "connect",
      () => {
        console.log("MQTT client connected to the server.");
        if (!hasPublished) {
          client.publish("/drone/take_land", String(status), { qos: 0 });
          hasPublished = true;
        }
        return () => client.end();
      },
      []
    );
}

export const handleLanding = () => {
  setFLightConnection(0);
  };

export const handleTakeOff = () => {
  setFLightConnection(1);
};

