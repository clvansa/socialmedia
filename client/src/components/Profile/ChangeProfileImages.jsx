import React, { useState, useRef } from "react";
import styled from "styled-components";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import { IconButton } from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import CropperImage from "./CropperImage";

const ChangeProfileImages = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [file, setFile] = useState({});
  const [type, setType] = useState("");
  const open = useRef();

  const acceptFile = ".png,.jpg,gif";

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClick = (type) => {
    setType(type);
  };

  const handleChange = async (file) => {
    console.log(file);
    if (file?.size > 5000000) {
      alert("file is too big");
    } else {
      setFile(file);
    }
  };
  return (
    <>
      <Contianer>
        <IconButton style={{ padding: "3px" }} onClick={handleOpen}>
          <EditIcon />
        </IconButton>
        <Menu
          id="profile-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClick={handleClose}
        >
          <MenuContent>
            <label htmlFor="input">
              <MenuItem onClick={() => handleClick("cover")}>
                Change Cover
              </MenuItem>
            </label>
            <label htmlFor="input">
              <MenuItem onClick={() => handleClick("profile")}>
                Change Profile image
              </MenuItem>
            </label>

            <input
              type="file"
              id="input"
              accept={acceptFile}
              ref={open}
              hidden
              onChange={(e) => handleChange(e.target.files[0])}
            />
          </MenuContent>
        </Menu>
      </Contianer>
      {file?.size && <CropperImage file={file} type={type} setFile={setFile} />}
    </>
  );
};

export default ChangeProfileImages;

const Contianer = styled.div`
  position: absolute;
  bottom: 85px;
  right: 15px;
  background: #eee;
  border-radius: 50%;

  &:hover {
    filter: sepia(20%) saturate(70%) grayscale(1) contrast(99%) invert(12%);
  }
`;

const MenuContent = styled.div`
  background-color: ${(props) => props.theme.backgroundColorSecondary};
  border-bottom: 1px solid ${(props) => props.theme.grayColor};
  padding: 10px 0;
  color: ${(props) => props.theme.tintColorSecondary};
`;
