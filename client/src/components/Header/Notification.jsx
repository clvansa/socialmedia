import styled from "styled-components";
import NotificationMessage from "./NotificationMessage";
import { useHistory } from "react-router-dom";

const Notification = ({ open, notifications }) => {
  const history = useHistory();

  const handleOpen = (notification) => {
    if (notification.notifyType !== "user") {
      history.push(`/post/${notification.postId}`);
    } else {
      history.push(`/profile/${notification.sender.username}`);
    }
  };

  return notifications.length > 0 ? (
    <>
      <NotificationContainer open={open}>
        {notifications.map((notification) => (
          <div key={notification._id} onClick={() => handleOpen(notification)}>
            <NotificationMessage notification={notification} />
          </div>
        ))}
      </NotificationContainer>
    </>
  ) : (
    <>
      <NotificationContainer open={open}>
        <p>No Notification</p>
      </NotificationContainer>
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
  color: ${(props) => props.theme.tintColorSecondary};
`;
