import React, { useState, useRef, useEffect, useContext } from "react";
import styled from "styled-components";
import IconButton from "@material-ui/core/IconButton";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Grow from "@material-ui/core/Grow";
import Paper from "@material-ui/core/Paper";
import Popper from "@material-ui/core/Popper";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";
import { makeStyles } from "@material-ui/core/styles";
import { Link, useHistory } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { Logout } from "../../context/AuthActions";
import useOutside from "../../util/useOutside";

const ProfileMenuList = () => {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);
  const { user, dispatch } = useContext(AuthContext);
  const history = useHistory();
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const openRef = useRef();

  useOutside(openRef, setOpen);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  function handleListKeyDown(event) {
    if (event.key === "Tab") {
      event.preventDefault();
      setOpen(false);
    }
  }

  // return focus to the button when we transitioned from !open -> open
  const prevOpen = useRef(open);
  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }

    prevOpen.current = open;
  }, [open]);

  const handleLogout = () => {
    Logout(history, dispatch);
  };

  return (
    <div>
      <IconButton
        ref={anchorRef}
        aria-controls={open ? "menu-list-grow" : undefined}
        aria-haspopup="true"
        onClick={handleToggle}
      >
        <TopbarImage src={user?.profilePicture} alt="profile image" />
      </IconButton>
      <Popper
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        ref={openRef}
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === "bottom" ? "center top" : "center bottom",
            }}
          >
            {/* <ClickAwayListener onClickAway={handleClose}> */}
            <Paper>
              <MenuList
                autoFocusItem={open}
                id="menu-list-grow"
                onKeyDown={handleListKeyDown}
              >
                <Content>
                  <Link
                    to={`/profile/${user?.username}`}
                    onClick={() =>
                      (window.location.href = `/profile/${user.username}`)
                    }
                  >
                    <MenuItem>
                      <Title>Profile</Title>
                    </MenuItem>
                  </Link>
                  <Link to="/setting">
                    <MenuItem>
                      <Title>My account</Title>
                    </MenuItem>
                  </Link>
                  <MenuItem onClick={handleLogout}>
                    <Title>Logout</Title>
                  </MenuItem>
                </Content>
              </MenuList>
            </Paper>
            {/* </ClickAwayListener> */}
          </Grow>
        )}
      </Popper>
    </div>
  );
};

export default ProfileMenuList;

const TopbarImage = styled.img`
  width: 32px;
  height: 32px;
  object-fit: cover;
  border-radius: 50%;
  cursor: pointer;
`;

const Content = styled.div`
  background-color: ${(props) => props.theme.backgroundColorSecondary};
  border: 1px solid ${(props) => props.theme.grayColor};
  border-top: none;
`;

const Title = styled.span`
  color: ${(props) => props.theme.tintColorSecondary};
`;
