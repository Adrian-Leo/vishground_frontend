import React from "react";
import { Dialog, DialogHeader, DialogBody, DialogFooter, Typography, Button } from "@material-tailwind/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapLocationDot } from "@fortawesome/free-solid-svg-icons";

const ConfirmDialog = ({ open, handleClose }) => {
  return (
    <Dialog open={open} handler={handleClose} overlay={false} className="backdrop-none">
      <DialogHeader>
        <Typography variant="h5" color="blue-gray">
          Confirmation Waypoint
        </Typography>
      </DialogHeader>
      <DialogBody divider className="grid place-items-center gap-4">
        <FontAwesomeIcon className="w-20 h-20 text-purple-light" icon={faMapLocationDot} />
        <Typography color="red" variant="h4">
          You should read this!
        </Typography>
        <Typography className="text-center font-normal">A small river named Duden flows by their place and supplies it with the necessary regelialia.</Typography>
      </DialogBody>
      <DialogFooter className="space-x-2">
        <Button variant="text" color="blue-gray" onClick={handleClose}>
          Close
        </Button>
        <Button variant="gradient" onClick={handleClose}>
          Ok, Got it
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

export default ConfirmDialog;
