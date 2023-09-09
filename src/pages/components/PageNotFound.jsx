import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGhost } from "@fortawesome/free-solid-svg-icons";

const PageNotFound = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => {
    setIsOpen(!isOpen);
  };
  return (
    <div className="flex flex-col h-screen w-screen">
      <div className="flex flex-col mx-20 h-full justify-center items-center place-content-center">
        <div className="items-center">
          <FontAwesomeIcon icon={faGhost} className="w-40 h-40 animate-bounce" />
        </div>
        <p className="text-center mt-4"> Halaman Yang Di Tuju Tidak Ada ....</p>
      </div>
    </div>
  );
};
export default PageNotFound;
