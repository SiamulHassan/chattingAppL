import React, { useRef, useState } from "react";
import { IoIosImages } from "react-icons/io";
import { ImageCropper } from "../ImageCrop/ImageCrop";
import {
  getStorage,
  ref,
  uploadString,
  getDownloadURL,
} from "firebase/storage";
import { useDispatch, useSelector } from "react-redux";
import { getAuth, updateProfile } from "firebase/auth";
//css
import "./style.css";
import { loggedInUsers } from "../../Slice/loginSlice";
export const UploadProfile = ({ setOpen }) => {
  const dispatch = useDispatch();
  const auth = getAuth();
  const currentUser = useSelector((user) => user.logIn.loggedIn);
  const storage = getStorage();
  const storageRef = ref(storage, currentUser.uid);
  const choosefile = useRef();
  const [cropData, setCropData] = useState("#");
  const [cropper, setCropper] = useState();
  const [loading, setLoading] = useState(false);
  ////////////////////////////////
  const [image, setImage] = useState();
  const handleChange = (e) => {
    e.preventDefault();
    let files;
    if (e.dataTransfer) {
      files = e.dataTransfer.files;
    } else if (e.target) {
      files = e.target.files;
    }
    const reader = new FileReader();
    reader.onload = () => {
      // reader image ke url e convert korar por onLoad e reader image url er final result dibe ja setImage e set hocche ... setImage/image holo just url
      // useRef e current property ache ja getImage()method dibe ar getImage method e toDataURL method pabe Orthat uporer image url ref amader dataURL hisabe dibe
      setImage(reader.result);
    };
    reader.readAsDataURL(files[0]);
  };

  const getCropData = () => {
    if (typeof cropper !== "undefined") {
      setLoading(true);
      setCropData(cropper.getCroppedCanvas().toDataURL());
      // message4:::  The first argument to the function is a reference to the location in the storage bucket where the string should be uploaded. The second argument is the string to be uploaded, which is in this case message4.
      // The third argument to uploadString() is the format of the data in the string being uploaded. In this case, the format is specified as data_url. This parameter tells Firebase Storage that the string being uploaded is in the data: URL format.
      const message4 = cropper.getCroppedCanvas().toDataURL();
      uploadString(storageRef, message4, "data_url").then((snapshot) => {
        getDownloadURL(storageRef).then((downloadURL) => {
          updateProfile(auth.currentUser, {
            photoURL: downloadURL,
          }).then(() => {
            setOpen(false);
            dispatch(loggedInUsers({ ...currentUser, photoURL: downloadURL }));
            localStorage.setItem(
              "users",
              JSON.stringify({ ...currentUser, photoURL: downloadURL })
            );
            setLoading(false);
          });
        });
      });
    }
  };
  // drag and drop image
  const handleDragOver = (e) => {
    e.preventDefault();
    // value 'copy' means ... copy is allowed.when the item is dropped on the target, a copy of the data will be created at the drop location.
    e.dataTransfer.dropEffect = "copy";
  };

  const handleDrop = (e) => {
    e.preventDefault();
    handleChange(e);
  };
  return (
    <div
      className="upload-box"
      onDragOver={handleDragOver}
      onDragEnter={handleDragOver}
      onDragLeave={handleDragOver}
      onDrop={handleDrop}
    >
      <input type="file" hidden ref={choosefile} onChange={handleChange} />
      <div className="upload">
        {/* When the upload-icon element is clicked, the click() method of the choosefile reference is called, which programmatically triggers the file selection dialog of the hidden input element. */}
        <div className="upload-icon" onClick={() => choosefile.current.click()}>
          <IoIosImages />
        </div>
        {image && (
          <ImageCropper
            image={image}
            setCropper={setCropper}
            cropData={cropData}
            setImage={setImage}
            getCropData={getCropData}
            loading={loading}
          />
        )}
        <p>Upload Photo</p>
      </div>
    </div>
  );
};
