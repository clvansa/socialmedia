import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import axios from "axios";
import styled from "styled-components";
import Post from "../Post";

function rand() {
  return Math.round(Math.random() * 20) - 10;
}

function getModalStyle() {
  const top = 30;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: "800px",
    height: "400px",
    border: 0,
    outline: 0,
    margin: 0,
  },
}));

export default function SimpleModal({ postId, handleClose, handleOpen, open }) {
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);
  const [post, setPost] = useState(null);

  useEffect(() => {
    const getPost = async () => {
      try {
        const res = await axios.get(`/posts/${postId}`);
        await setPost(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getPost();
  }, [postId]);

  const body = (
    <div style={modalStyle} className={classes.paper}>
      {post && <Post post={post} />}
    </div>
  );

  return (
    <div styled={{ position: "relative" }}>
      <CloseButton onClick={handleClose}>X</CloseButton>
      <Modal open={open} onClose={handleClose}>
        {body}
      </Modal>
    </div>
  );
}

const CloseButton = styled.span`
  position: fixed;
  left: 30px;
  top: 70px;
  background: #201616;
  border-radius: 50%;
  padding: 3px 9px;
  /* font-weight: bold; */
  transition: all 0.5s;
  cursor: pointer;
  &:hover {
    background-color: #a19f9f;
  }
`;
