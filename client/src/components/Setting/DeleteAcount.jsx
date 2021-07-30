import React, { useContext, useState } from "react";
import styled from "styled-components";
import Paper from "@material-ui/core/Paper";
import { Button } from "@material-ui/core";

const DeleteAcount = ({ setConfirm }) => {
  const handleClick = () => {
    setConfirm(true);
  };

  return (
    <ConfirmBox>
      <ConfirmBoxPaper>
        <p>Are you sure want to delete your account? </p>
        <ConfirmOptions>
          <Button variant="contained" color="secondary">
            delete
          </Button>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => setConfirm(false)}
          >
            cancel
          </Button>
        </ConfirmOptions>
      </ConfirmBoxPaper>
    </ConfirmBox>
  );
};

export default DeleteAcount;

const ConfirmBox = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: ${(props) => props.theme.backgroundColorSecondary};
  -webkit-box-shadow: 0px 0px 16px -8px rgba(0, 0, 0, 0.68);
  box-shadow: 0px 0px 16px -8px rgba(0, 0, 0, 0.68);
`;

const ConfirmBoxPaper = styled.div`
  padding: 15px;
  border: 1px solid ${(props) => props.theme.grayColor};
  border-radius: 10px;
  overflow: hidden;

  p {
    color: ${(props) => props.theme.tintColorSecondary};
  }
`;
const ConfirmOptions = styled.div`
  display: flex;
  justify-content: space-around;
`;
