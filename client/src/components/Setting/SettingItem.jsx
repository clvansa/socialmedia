import { forwardRef } from "react";
import styled from "styled-components";

const SettingItem = forwardRef((props, ref) => {
  return (
    <SettingItemContainer>
      <SettingItemLabel htmlFor={props.id}>{props.Label}:</SettingItemLabel>
      <SettingItemInput
        type={props.type || "text"}
        id={props.id}
        value={props.value}
        disabled={props.disabled}
        // ref={ref}
        {...props}
      />
    </SettingItemContainer>
  );
});

export default SettingItem;

const SettingItemContainer = styled.div`
  display: flex;
  justify-content: space-between;
  /* margin: 5px; */
  padding: 15px 0;
  align-items: "center";
  border-radius: 10px;
`;
const SettingItemLabel = styled.label`
  min-width: 125px;
  color: ${(props) => props.theme.tintColorSecondary};
  line-height: 2rem;
`;
const SettingItemInput = styled.input`
  border: none;
  border-bottom: 1px solid ${(props) => props.theme.grayColor};
  background-color: ${(props) => props.theme.inputBackgroundColor};
  color: ${(props) => props.theme.tintColorSecondary};
  width: 100%;
  font-size: 16px;
  padding: 8px;
  border-radius: 5px;

  &:focus {
    outline: none;
  }
`;
