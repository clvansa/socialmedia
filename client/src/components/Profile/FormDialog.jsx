import React, { useState, useEffect, useContext } from "react";
import styled from "styled-components";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import Input from "@material-ui/core/Input";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import DateFnsUtils from "@date-io/date-fns";
import {axiosInstance} from "../../util/axiosInstance";
import { GetUser, GetOwnUser } from "../../context/AuthActions";
import { AuthContext } from "../../context/AuthContext";

import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";

const FormDialog = ({ user }) => {
  const [open, setOpen] = useState(false);
  const [city, setCity] = useState("");
  const [from, setFrom] = useState("");
  const [work, setWork] = useState("");
  const [study, setStudy] = useState("");
  const [aboutMe, setAboutMe] = useState("");
  const [relationship, setRelationship] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date());
  const [gender, setGender] = useState("");

  const { dispatch } = useContext(AuthContext);

  useEffect(() => {
    setCity(user.city);
    setFrom(user.from);
    setRelationship(user.relationship);
    setDescription(user.desc);
    setGender(user.gender);
    setWork(user.work);
    setStudy(user.study);
    setAboutMe(user.aboutme);
    setDate(new Date(user.birthday));
  }, [user]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDateChange = (date) => {
    setDate(date);
  };

  const handleSave = async () => {
    const data = {
      city,
      from,
      relationship,
      desc: description,
      gender,
      work,
      study,
      aboutme: aboutMe,
      birthday: date,
    };

    try {
      const updateInformation = await axiosInstance.put(`/users/`, data);
      setOpen(false);
      GetOwnUser(dispatch);
    } catch (err) {
      console.log(err.response.data);
    }
  };

  return (
    <div>
      <Button color="primary" onClick={handleClickOpen}>
        <EditIcon />
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogContianer>
          <DialogTitle id="form-dialog-title">User Information</DialogTitle>
          <DialogContent>
            <DialogContentText>
              <DialogContentTextContent>
                Here you can edit your information and description.
              </DialogContentTextContent>
            </DialogContentText>
            <WhiteBorderTextField
              autoFocus
              margin="dense"
              id="city"
              label="City"
              type="text"
              fullWidth
              onChange={(e) => setCity(e.target.value)}
              value={city}
            />

            <WhiteBorderTextField
              autoFocus
              margin="dense"
              id="from"
              label="From"
              type="text"
              fullWidth
              onChange={(e) => setFrom(e.target.value)}
              value={from}
            />

            <WhiteBorderTextField
              autoFocus
              margin="dense"
              id="desc"
              label="Description"
              type="text"
              fullWidth
              onChange={(e) => setDescription(e.target.value)}
              rowsMax="2"
              value={description}
            />

            <WhiteBorderTextField
              autoFocus
              margin="dense"
              id="desc"
              label="Work"
              type="text"
              fullWidth
              onChange={(e) => setWork(e.target.value)}
              rowsMax="2"
              value={work}
            />

            <WhiteBorderTextField
              autoFocus
              margin="dense"
              id="study"
              label="Study"
              type="text"
              fullWidth
              onChange={(e) => setStudy(e.target.value)}
              rowsMax="2"
              value={study}
            />

            <WhiteBorderTextField
              autoFocus
              margin="dense"
              id="aboutMe"
              label="About me"
              type="text"
              fullWidth
              onChange={(e) => setAboutMe(e.target.value)}
              rowsMax="2"
              value={aboutMe}
            />
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <WhiteBorderKeyboardDatePicker
                margin="normal"
                id="Birthday"
                label="Birthday"
                format="MM/dd/yyyy"
                value={date}
                onChange={handleDateChange}
                KeyboardButtonProps={{
                  "aria-label": "change date",
                }}
                style={{ marginTop: 10 }}
              />
            </MuiPickersUtilsProvider>
            <WhiteBorderFormData style={{ margin: 10, minWidth: 120 }}>
              <InputLabel id="demo-dialog-select-label">
                Relationship
              </InputLabel>
              <Select
                labelId="demo-dialog-select-label"
                id="demo-dialog-select"
                label="Relationship"
                value={relationship}
                onChange={(e) => setRelationship(e.target.value)}
                input={<Input fullWidth />}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value={1}>Single</MenuItem>
                <MenuItem value={2}>Married</MenuItem>
                <MenuItem value={3}>Complected</MenuItem>
              </Select>
            </WhiteBorderFormData>

            <WhiteBorderFormData style={{ margin: 10, minWidth: 120 }}>
              <InputLabel id="demo-dialog-select-label1">Gender</InputLabel>
              <Select
                labelId="demo-dialog-select-label1"
                id="demo-dialog-select1"
                label="Gender"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                input={<Input fullWidth />}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value={1}>Male</MenuItem>
                <MenuItem value={2}>Female</MenuItem>
                <MenuItem value={3}>Non-binary</MenuItem>
              </Select>
            </WhiteBorderFormData>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="secondary" variant="outlined">
              Cancel
            </Button>
            <Button onClick={handleSave} color="primary" variant="contained">
              Update
            </Button>
          </DialogActions>
        </DialogContianer>
      </Dialog>
    </div>
  );
};

export default FormDialog;

const EditIcon = styled(EditOutlinedIcon)`
  color: ${(props) => props.theme.tintColorSecondary};
`;

const DialogContianer = styled.div`
  color: ${(props) => props.theme.tintColorSecondary};
  background-color: ${(props) => props.theme.backgroundColor};
`;

const DialogContentTextContent = styled.span`
  color: ${(props) => props.theme.tintColorSecondary};
`;

const WhiteBorderTextField = styled(TextField)`
  & .MuiFormLabel-root {
    color: ${(props) => props.theme.tintColorSecondary};
  }

  & .label.Mui-focused {
    color: ${(props) => props.theme.tintColorSecondary};
  }

  & .MuiInputBase-input {
    color: ${(props) => props.theme.tintColorPrimary};
  }

  & .MuiInput-underline:before {
    border-color: ${(props) => props.theme.grayColor} !important;
  }
  & .MuiInput-underline:after {
    border-color: ${(props) => props.theme.tintColorSecondary}!important;
  }
`;

const WhiteBorderFormData = styled(FormControl)`
  .MuiPopover-paper {
    background-color: ${(props) => props.theme.tintColorSecondary}!important;
  }

  & .MuiInputLabel-formControl {
    color: ${(props) => props.theme.tintColorSecondary};
  }

  & .MuiInputBase-root {
    color: ${(props) => props.theme.tintColorPrimary} !important;
  }

  & label.Mui-focused {
    color: ${(props) => props.theme.tintColorSecondary};
  }

  & .MuiInput-underline:before {
    border-color: ${(props) => props.theme.grayColor} !important;
  }

  & .MuiInput-underline:after {
    border-color: ${(props) => props.theme.tintColorSecondary}!important;
  }

  & .MuiSvgIcon-root {
    color: ${(props) => props.theme.tintColorSecondary}!important;
  }
`;

const WhiteBorderKeyboardDatePicker = styled(KeyboardDatePicker)`
  & .MuiInput-underline:before {
    border-color: ${(props) => props.theme.grayColor} !important;
  }

  & .MuiInput-underline:after {
    border-color: ${(props) => props.theme.tintColorSecondary}!important;
  }

  & .MuiButtonBase-root {
    color: inherit !important;
  }
`;
