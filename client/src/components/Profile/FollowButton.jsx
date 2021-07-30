import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import { FOLLOW, UNFOLLOW } from "../../context/type";
import { Button } from "@material-ui/core";
import styled from "styled-components";

const FollowButton = ({ user }) => {
  const { user: currentUser, dispatch } = useContext(AuthContext);
  const [followed, setfollowed] = useState(
    currentUser?.followings.includes(user?._id)
  );

  useEffect(() => {
    setfollowed(currentUser?.followings.includes(user?._id));
  }, [user]);

  const handleClick = async () => {
    try {
      if (followed) {
        await axios.put(`/users/${user._id}/unfollow`);
        dispatch({ type: UNFOLLOW, payload: user._id });
      } else {
        await axios.put(`/users/${user._id}/follow`);
        dispatch({ type: FOLLOW, payload: user._id });
      }
    } catch (err) {
      console.log(err);
    }
    setfollowed(!followed);
  };

  return (
    <div style={{ position: "absolute", right: "0", top: 0 }}>
      {currentUser._id !== user._id && (
        <FollowButtonCss variant="outlined" onClick={handleClick}>
          {followed ? "Unfollow" : "Follow"}
        </FollowButtonCss>
      )}
    </div>
  );
};

export default FollowButton;

const FollowButtonCss = styled(Button)`
  color: ${(props) => props.theme.tintColorPrimary} !important;
  border: 1px solid ${(props) => props.theme.grayColor} !important; ;
`;
