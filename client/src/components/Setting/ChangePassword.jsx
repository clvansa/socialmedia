import { Button } from "@material-ui/core";
import { useState } from "react";
import styled from "styled-components";
import SettingItem from "./SettingItem";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { changePasswordSchema } from "../../util/yupSchema";
import axios from "axios";

const ChangePassword = ({ setShowChangePassword }) => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(changePasswordSchema),
  });

  const onSubmit = async (data) => {
    const password = {
      oldPassword: data.oldPassword,
      newPassword: data.newPassword,
    };
    try {
      const res = await axios.put("/users/changepassword", password);
      setShowChangePassword(false);
    } catch (err) {
      setError("oldPassword", {
        type: "server",
        message: "Something went wrong with Password",
      });
    }
  };

  const handleClose = () => {
    setShowChangePassword(false);
  };
  console.log(errors);
  return (
    <ChangePasswordContainer>
      <ChangePasswordWrapper>
        <ChangePasswordTitle>Change Password</ChangePasswordTitle>
        <SettingItems onSubmit={handleSubmit(onSubmit)}>
          <SettingItem
            type="password"
            Label="Old Password"
            name="oldPassword"
            disabled={false}
            id="oldpassword"
            minLength={6}
            maxLength={24}
            required
            style={{ border: !!errors.oldPassword?.message && "1px inset red" }}
            {...register("oldPassword")}
          />
          <ErrorMessage>{errors.oldPassword?.message}</ErrorMessage>
          <SettingItem
            type="password"
            Label="New Password"
            disabled={false}
            minLength={6}
            maxLength={24}
            id="newpassword"
            required
            style={{ border: !!errors.newPassword?.message && "1px inset red" }}
            {...register("newPassword")}
          />
          <ErrorMessage>{errors.newPassword?.message}</ErrorMessage>
          <SettingItem
            type="password"
            Label="RePassword"
            disabled={false}
            minLength={6}
            maxLength={24}
            id="repassword"
            required
            style={{ border: !!errors.rePassword?.message && "1px inset red" }}
            {...register("rePassword")}
          />
          <ErrorMessage>
            {errors.rePassword?.message ===
            "rePassword must be one of the following values: , Ref(newPassword)"
              ? "Password not match"
              : errors.rePassword?.message}
          </ErrorMessage>
          <ButtonGroup>
            <Button variant="contained" color="primary" type="submit">
              Save
            </Button>

            <Button variant="outlined" color="secondary" onClick={handleClose}>
              Cancel
            </Button>
          </ButtonGroup>
        </SettingItems>
      </ChangePasswordWrapper>
    </ChangePasswordContainer>
  );
};

export default ChangePassword;

const ChangePasswordContainer = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 450px;
  height: 400px;
  border-radius: 10px;
  background-color: ${(props) => props.theme.backgroundColorSecondary};
  -webkit-box-shadow: 0px 0px 16px -8px rgba(0, 0, 0, 0.68);
  box-shadow: 0px 0px 16px -8px rgba(0, 0, 0, 0.68);
  border: 1px solid ${(props) => props.theme.grayColor};
`;

const ChangePasswordWrapper = styled.div`
  padding: 20px;
`;

const ChangePasswordTitle = styled.h3`
  color: ${(props) => props.theme.tintColorPrimary};
`;

const SettingItems = styled.form`
  width: 90%;
  height: 350px;
  padding: 15px 20px;
`;

const ButtonGroup = styled.div`
  padding-top: 10px;
  display: flex;
  justify-content: space-around;
`;

const ErrorMessage = styled.p`
  padding: 0;
  margin: 0;
  color: red;
  font-size: 12px;
  padding-left: 125px;
`;
