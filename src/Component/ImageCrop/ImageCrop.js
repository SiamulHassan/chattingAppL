import React from "react";
import Button from "@mui/material/Button";
import { AiOutlineClose } from "react-icons/ai";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
//css
import "./style.css";
import { PulseLoader } from "react-spinners";
export const ImageCropper = ({
  image,
  cropData,
  setCropper,
  setImage,
  getCropData,
  loading,
}) => {
  const handleBackImg = () => {
    setImage(null);
  };

  return (
    <div className="upload-img-box">
      <div className="upload-header">
        <h4>Upload Profile Picture</h4>
        <div className="close-icon" onClick={handleBackImg}>
          <AiOutlineClose />
        </div>
      </div>
      <div className="preview-img">
        <div
          className="img-preview"
          style={{ width: "100%", float: "left", height: "300px" }}
        />
      </div>
      <Cropper
        style={{ height: 400, width: "100%" }}
        zoomTo={0.5}
        initialAspectRatio={1}
        preview=".img-preview"
        src={image}
        viewMode={1}
        minCropBoxHeight={10}
        minCropBoxWidth={10}
        background={false}
        responsive={true}
        autoCropArea={1}
        checkOrientation={false}
        onInitialized={(instance) => {
          setCropper(instance);
        }}
        guides={true}
      />
      <div className="upload-btn" onClick={getCropData}>
        {loading ? (
          <PulseLoader color="#5f35f5ea" />
        ) : (
          <Button
            variant="contained"
            sx={{
              background: "#5f35f5ea",
              ":hover": {
                bgcolor: "#5f35f5cb",
              },
            }}
          >
            upload now
          </Button>
        )}
      </div>
    </div>
  );
};
