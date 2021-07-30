import React, { useContext, useState } from "react";
import styled from "styled-components";
import { AuthContext } from "../../context/AuthContext";
import { Button } from "@material-ui/core";
import DeleteAcount from "./DeleteAcount";
import SettingItem from "./SettingItem";
import ChoiseTheme from "./ChoiseTheme";
import ChangePassword from "./ChangePassword";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { accountSettingSchema } from "../../util/yupSchema";

const AccontSetting = () => {
  const { user } = useContext(AuthContext);
  const [confirm, setConfirm] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);

  const {
    register,
    handleSubmit,
    setError,

    formState: { errors },
  } = useForm({
    resolver: yupResolver(accountSettingSchema),
  });

  const onSubmit = (data) => {
    console.log(data);
    console.log(errors);
    if (register) {
      return;
    }
  };

  const handleClick = () => {
    setConfirm(true);
  };

  return (
    <AccontSettingContainer>
      <AccontSettingWrapper>
        <PaperStyled>
          <SettingItems onSubmit={handleSubmit(onSubmit)}>
            <SettingItem
              id="username"
              type="text"
              Label="Username"
              disabled={true}
              value={user.username}
              style={{ cursor: "not-allowed" }}
            />
            <SettingItem
              id="email"
              type="email"
              Label="Email"
              disabled={true}
              value={user.email}
              style={{ cursor: "not-allowed" }}
            />
            <SettingItem
              id="fn"
              type="text"
              Label="First name"
              disabled={false}
              maxLength={16}
              style={{
                border: !!errors.firstName?.message && "1px inset red",
              }}
              {...register("firstName")}
            />
            <ErrorMessage>{errors.firstName?.message}</ErrorMessage>

            <SettingItem
              id="ln"
              type="text"
              Label="Last name"
              disabled={false}
              maxLength={16}
              style={{
                border: !!errors.lastName?.message && "1px inset red",
              }}
              {...register("lastName")}
            />
            <ErrorMessage>{errors.lastName?.message}</ErrorMessage>

            <SettingItem
              id="mobile"
              type="text"
              Label="Mobile"
              disabled={false}
              maxLength={16}
              style={{
                border: !!errors.mobile?.message && "1px inset red",
              }}
              {...register("mobile")}
            />
            <ErrorMessage>{errors.mobile?.message}</ErrorMessage>

            <Button variant="outlined" color="primary" type="submit">
              Save
            </Button>
          </SettingItems>
          <SettingHr />
          <SettingItems>
            <LabelTitle>Dark Theme</LabelTitle>
            <ChoiseTheme />
          </SettingItems>
          <SettingHr />
          <ButtonGroup>
            <CustomButton onClick={() => setShowChangePassword(true)}>
              Change Password
            </CustomButton>
            <CustomButton onClick={handleClick}>Delete my account</CustomButton>
          </ButtonGroup>
        </PaperStyled>

        {confirm && <DeleteAcount setConfirm={setConfirm} />}
        {showChangePassword && (
          <ChangePassword setShowChangePassword={setShowChangePassword} />
        )}
      </AccontSettingWrapper>
    </AccontSettingContainer>
  );
};

export default AccontSetting;

const AccontSettingContainer = styled.div`
  background-color: ${(props) => props.theme.backgroundColorSecondary};
  -webkit-box-shadow: 0px 0px 16px -8px rgba(0, 0, 0, 0.68);
  box-shadow: 0px 0px 16px -8px rgba(0, 0, 0, 0.68);
  border-radius: 10px;
  overflow: hidden;
`;

const AccontSettingWrapper = styled.div``;

const SettingItems = styled.form`
  width: 70%;
  padding: 15px 20px;
`;

const PaperStyled = styled.div`
  background-color: ${(props) =>
    props.theme.backgroundColorSecondary} !important;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 10px;
`;

const CustomButton = styled(Button)`
  text-transform: capitalize !important;
  color: ${(props) => props.theme.tintColorSecondary} !important;
`;

const SettingHr = styled.hr`
  border: none;
  border-bottom: 1px solid ${(props) => props.theme.grayColor};
`;

const LabelTitle = styled.label`
  color: ${(props) => props.theme.tintColorSecondary};
`;

const ErrorMessage = styled.p`
  padding: 0;
  margin: 0;
  color: red;
  font-size: 12px;
  padding-left: 125px;
`;
