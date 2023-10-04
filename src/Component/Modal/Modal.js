import { Backdrop, Fade, Modal } from "@mui/material";
import { Box } from "@mui/system";
import { UploadProfile } from "../UploadProfile/UploadProfile";
// css
import "./style.css";
export const ModalSideBar = ({ open, setOpen }) => {
  const handleClose = () => setOpen(false);
  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={open}>
          <Box className="box-modal">
            {/* jokhon amara profile upload done tokhon setOpen amar false kore dibo. note: amra parent Modal theke child UploadProfile  e state pathcci,,,,child e jokhon value change hobe-> orthat state update hobe , tokhon parent auto sei data ta pabe and state ke update kore dibe*/}
            <UploadProfile setOpen={setOpen} />
          </Box>
        </Fade>
      </Modal>
    </div>
  );
};

export default ModalSideBar;
