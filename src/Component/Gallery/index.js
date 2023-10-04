import React from "react";
// style
import "./style.css";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { getDatabase, push, set, ref as dataRef } from "firebase/database";
import { useSelector } from "react-redux";
const Gallery = ({ galleryRef }) => {
  const storage = getStorage();
  const db = getDatabase();
  const currentUser = useSelector((users) => users.logIn.loggedIn);
  const activeSingleFrnd = useSelector(
    (actSingle) => actSingle.activeSingleFrnd.activeStatus
  );
  const handleImgUpload = (e) => {
    const storageRef = ref(storage, `galleryImg/${e.target.files[0].name}`);
    const uploadTask = uploadBytesResumable(storageRef, e.target.files[0]);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
        // switch (snapshot.state) {
        //   case "paused":
        //     console.log("Upload is paused");
        //     break;
        //   case "running":
        //     console.log("Upload is running");
        //     break;
        // }
      },
      (error) => {
        console.log("name img file", error);
      },
      () => {
        console.log("uploadTask", uploadTask.snapshot);
        // Handle successful uploads on complete
        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log("downloaded image", downloadURL);
          set(push(dataRef(db, "singleMessage")), {
            whoSendId: currentUser.uid,
            whoSendName: currentUser.displayName,
            whoReceiveId: activeSingleFrnd?.id,
            whoReceiveName: activeSingleFrnd?.name,
            img: downloadURL,
            date: `${new Date().getFullYear()} - ${
              new Date().getMonth() + 1
            } - ${new Date().getDate()}  ${new Date().getHours()}:${new Date().getMinutes()}`,
          }).catch((err) => {
            console.log("img gall err set", err);
          });
        });
      }
    );
  };
  return (
    <>
      <input type="file" hidden ref={galleryRef} onChange={handleImgUpload} />
    </>
  );
};

export default Gallery;
