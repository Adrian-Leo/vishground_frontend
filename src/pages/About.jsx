import React from "react";
import ParagraphView from "./components/ParagraphView";
import { Stack, Typography, Box } from "@mui/material";
import moment from "moment/moment";
import "bootstrap/dist/css/bootstrap.min.css";
import image1 from "../public/DRONE2.jpeg";
import image2 from "../public/DRONE4.jpg";
import image3 from "../public/DRONE5.jpg";
import NavbarDefault from "./components/Navbar";

const About = () => {
  moment.locale("id");

  return (
    <>
      <NavbarDefault />
      <div style={{ display: "flex", flexDirection: "row", gap: "30px" }}>
        <div style={{ flexBasis: "100%", width: "100%", maxHeight: "100vh" }}>
          <Typography
            style={{
              color: "#BA365D",
              fontSize: "30px",
              margin: "20px auto",
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            About VishGround
          </Typography>
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>
            <div style={{ display: "flex", flexDirection: "row", gap: "20px" }}>
              <img src={image1} alt="Image 1" width="250px" style={{ borderRadius: "50%", border: "5px solid #3D3356" }} />
              <img src={image2} alt="Image 2" width="250px" style={{ borderRadius: "50%", border: "5px solid #3D3356" }} />
              <img src={image3} alt="Image 3" width="250px" style={{ borderRadius: "50%", border: "5px solid #3D3356" }} />
            </div>
          </div>
          <div>
            <ParagraphView
              text="VishGround is a system used to control and monitor unmanned aerial vehicles 
              (UAVs) or other aircraft remotely from the ground. It serves as a command center that enables 
              human operators to control aircraft operations in real-time. Vishwakharma Team is a team from the University of Indonesia specializing in VTOL (Vertical Take-Off and Landing) technology. They are dedicated to advancing and innovating in the field of aerial vehicles. The team consists of passionate and motivated individuals who strive to push the boundaries of aviation engineering.They actively participate in various competitions and projects, showcasing their expertise and technical skills.Their commitment to excellence and continuous learning makes them a valuable asset in the field of aviation technology."
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default About;
