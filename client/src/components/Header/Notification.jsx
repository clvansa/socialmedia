import { useState } from "react";
import styled from "styled-components";
import NotificationMessage from "./NotificationMessage";
import Modal from "./Modal";
import {useHistory} from 'react-router-dom'

const Notification = ({ open, notifications }) => {
  const [openModal, setOpenModal] = useState(false);
  const [postId, setPostId] = useState("");
  const history = useHistory();

  const handleOpen = (postId) => {
    setPostId(postId);
    // setOpenModal(true);
    history.push(`/post/${postId}`);
  };

  const handleClose = () => {
    setOpenModal(false);
  };

  return (
    <>
      <NotificationContainer open={open}>
        {notifications.map((notification) => (
          <div
            key={notification._id}
            onClick={() => handleOpen(notification.postId)}
          >
            <NotificationMessage notification={notification} />
          </div>
        ))}
      </NotificationContainer>
      {openModal && (
        <Modal
          handleOpen={handleOpen}
          handleClose={handleClose}
          open={openModal}
          postId={postId}
        />
      )}
    </>
  );
};

export default Notification;

const NotificationContainer = styled.div`
  position: absolute;
  /* height: 200px; */
  background-color: ${(props) => props.theme.backgroundColorSecondary};
  width: 250px;
  left: 0;
  border-radius: 10px;
  border: 1px solid ${(props) => props.theme.grayColor};
  transform: translate(-50%);
  flex-direction: column;
  display: ${(props) => (props.open ? "flex" : "none")};
  overflow: hidden;
  padding: 10px;
`;
