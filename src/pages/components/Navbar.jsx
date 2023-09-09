import { Canvas } from "react-three-fiber";
import { Physics } from "@react-three/cannon";
import { Drawer, Button, Typography } from "@material-tailwind/react";
import React, { useEffect, useState } from "react";
import logo from "../../public/logo_1.png";
import userPP from "../../public/user-profile.png";
import moment from "moment/moment";
import "bootstrap/dist/css/bootstrap.min.css";
import Cube from "./Cube";
import CustomButton from "./CustomButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faXmark } from "@fortawesome/free-solid-svg-icons";

const NavbarDefault = () => {
  const [open, setOpen] = React.useState(false);

  const openDrawer = () => setOpen(true);
  const closeDrawer = () => setOpen(false);

  moment.locale("id");

  const [hoursTime, setHoursTime] = useState("");
  const [daysTime, setDaysTime] = useState("");

  const [hoverDashboard, setHoverDashboard] = useState(false);
  const [hoverAbout, setHoverAbout] = useState(false);
  const [hoverControls, setHoverControls] = useState(false);

  const handleDashboardHover = () => setHoverDashboard(!hoverDashboard);
  const handleAboutHover = () => setHoverAbout(!hoverAbout);
  const handleControlsHover = () => setHoverControls(!hoverControls);

  useEffect(() => {
    const interval = setInterval(() => {
      setHoursTime(moment().format("H:mm:ss"));
      setDaysTime(moment().format("ddd, DD MMMM YYYY"));
    }, 1000);

    return () => clearInterval(interval);
  }, []);
  return (
    <>
      <div className="navbar sticky flex bg-purple-dark">
        <div className="flex flex-row items-center">
          <button onClick={openDrawer}>
            <FontAwesomeIcon icon={faBars} className="w-8 h-8 ml-16" />
          </button>
          <h4 className="ml-8 mt-2 flex flex-col items-center">VishGround</h4>
        </div>
        <div className="flex-none">
          <div className="dropdown dropdown-end mr-10">
            <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full">
                <img src={userPP} />
              </div>
            </label>
            <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-purple-dark rounded-box w-52">
              <li>
                <a className="justify-between">
                  Profile
                  <span className="badge">New</span>
                </a>
              </li>
              <li>
                <a>Settings</a>
              </li>
              <li>
                <a href="/">Logout</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <Drawer open={open} onClose={closeDrawer} overlay={false}>
        <div style={{ flexBasis: "25%", maxWidth: "100%", alignItems: "center", background: "#000000", height: "100%" }} className="pt-20">
          <div className="flex flex-col items-center">
            <button onClick={closeDrawer}>
              <FontAwesomeIcon icon={faXmark} className="w-8 h-8 -translate-y-10 translate-x-24" />
            </button>
            <img src={logo} alt="Logo" width="180px" />
            <Typography className="mt-4">{hoursTime}</Typography>
            <Typography>{daysTime}</Typography>
          </div>
          <div style={{ display: "flex", flexDirection: "column", padding: "20px", gap: "20px" }}></div>
          <div style={{ display: "flex", flexDirection: "column", gap: "1px" }}>
            <CustomButton href="/Dashboard" label="Dashboard" hover={hoverDashboard} handleHover={handleDashboardHover} />
            <CustomButton href="/About" label="About" hover={hoverAbout} handleHover={handleAboutHover} />
            <CustomButton href="/Controls" label="Controls" hover={hoverControls} handleHover={handleControlsHover} />
          </div>
          <div className="flex flex-col items-center mt-20 w-full">
            <div className="w-48 h-48 items-center ">
              <Canvas dpr={[1, 2]} shadows camera={{ position: [-5, 5, 5], fov: 18 }}>
                <ambientLight />
                <spotLight angle={0.25} penumbra={0.5} position={[10, 10, 3]} castShadow />
                <Physics allowSleep={true}>
                  <Cube />
                </Physics>
              </Canvas>
            </div>
          </div>
        </div>
      </Drawer>
    </>
  );
};

export default NavbarDefault;
