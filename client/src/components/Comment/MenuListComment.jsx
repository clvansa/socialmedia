import React, { useState } from "react";
import styled from "styled-components";
import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import { Avatar, IconButton, Tooltip } from "@material-ui/core";
import MoreHorizOutlinedIcon from "@material-ui/icons/MoreHorizOutlined";

const MenuListComment = ({ deleteComment, editComment }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div style={{ position: "absolute", bottom: "20px" }}>
      <IconButton style={{ padding: "3px" }} onClick={handleClick}>
        <MoreHorizOutlined />
      </IconButton>
      <Menu
        id="comment-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuContent>
          <MenuItem
            onClick={() => {
              editComment();
              handleClose();
            }}
          >
            Edit
          </MenuItem>
          <MenuItem onClick={deleteComment}>Delete</MenuItem>
        </MenuContent>
      </Menu>
    </div>
  );
};

export default MenuListComment;

const MoreHorizOutlined = styled(MoreHorizOutlinedIcon)`
  color: ${(props) => props.theme.tintColorSecondary};
`;

const MenuContent = styled.div`
  color: ${(props) => props.theme.tintColorSecondary};
  background-color: ${(props) => props.theme.backgroundColorSecondary};
  border:1px solid ${(props) => props.theme.grayColor};
`;
