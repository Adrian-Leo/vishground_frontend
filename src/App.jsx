import React from "react";
import { Route, Routes } from "react-router-dom";
import theme from "./styles/theme";
import { ThemeProvider } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import Home from "./pages/Home";
import About from "./pages/About";
import Controls from "./pages/Controls";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import PageNotFound from "./pages/components/PageNotFound";

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes>
        <Route path="/" element={<Login />} exact />
        <Route path="/SignUp" element={<SignUp />} exact />
        <Route path="/Dashboard" element={<Home />} exact />
        <Route path="/About" element={<About />} exact />
        <Route path="/Controls" element={<Controls />} exact />
        <Route path="*" element={<PageNotFound />} exact />
      </Routes>
    </ThemeProvider>
  );
};

export default App;
