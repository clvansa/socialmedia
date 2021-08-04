import React, { useContext, useEffect, useState, useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import { axiosInstance } from "../util/axiosInstance";
import { AuthContext } from "../context/AuthContext";
import useGeoLocation from "../util/useGeoLocation";
import styled from "styled-components";
import ReactPlayer from "react-player";
import { v4 as uuid } from "uuid";

import {
  PermMedia,
  Label,
  Room,
  EmojiEmotions,
  Cancel,
} from "@material-ui/icons";

function getModalStyle() {
  const top = 50;
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
    height: "800px",
    border: 0,
    outline: 0,
    margin: 0,
  },
}));

const EditPostModal = ({ currentPost, openModal, setOpenModal }, props) => {
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);
  const { user } = useContext(AuthContext);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const location = useGeoLocation();
  const [currentCity, setCurrentCity] = useState("");
  const [file, setFile] = useState(null);
  const [newFile, setNewFile] = useState(null);
  const [input, setInput] = useState("");

  const getLocation = async () => {
    try {
      const res = await axiosInstance.get(
        `https://www.mapquestapi.com/geocoding/v1/reverse?key=${process.env.REACT_APP_GEOLOCATION_API_KEY}&location=${location.coordinates.lat},${location.coordinates.lan}&includeRoadMetadata=true&includeNearestIntersection=true`
      );
      setCurrentCity(res.data.results[0].locations[0].adminArea3);
    } catch (err) {
      console.log(err);
    }
  };

  const handleClick = () => {
    currentCity ? setCurrentCity("") : getLocation();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatePost = {
      desc: input,
      location: currentCity && currentCity,
      lastEdit: Date.now(),
    };

    if (newFile) {
      const data = new FormData();
      const extension =
        newFile.name.split(".")[newFile.name.split(".").length - 1];
      const name = uuid().toString().replace(/-/g, "");
      const fileName = `${name}.${extension}`;

      data.append("name", fileName);
      data.append("file", newFile);

      try {
        const res = await axiosInstance.post(`/uploads/`, data);
        const { imageUrl } = await res.data;
        console.log(imageUrl);
        if (!file) updatePost.img = "";
        if (newFile.type === "video/mp4") {
          updatePost.video = imageUrl;
        } else {
          updatePost.img = imageUrl;
        }
      } catch (err) {
        console.log(err);
      }
    }
    try {
      await axiosInstance.put(`/posts/${currentPost._id}`, updatePost);
    } catch (err) {
      console.log(err);
    }
    // props.update();
    window.location.reload();
    setInput("");
    setFile(null);
    setOpenModal(false);
  };

  useEffect(() => {
    setFile(currentPost.img ? currentPost.img : currentPost.video);
    setInput(currentPost.desc);
  }, [currentPost]);

  const body = (
    <div style={modalStyle} className={classes.paper}>
      <ShareContianer>
        <ShareWrapper>
          <ShareTop>
            <ShareProfileImage src={user?.profilePicture} alt="Profie Image" />
            <ShareInput
              placeholder={`What's in your mind ${user.username}...? ${currentCity}`}
              onChange={(e) => setInput(e.target.value)}
              defaultValue={currentPost.desc}
            />
          </ShareTop>
          <ShareHr />
          {file && (
            <div>
              {currentPost?.img ? (
                <ShareImageContainer>
                  <ShareImg src={file && `${currentPost.img}`} alt="" />
                  <CancelIcon onClick={() => setFile(null)} />
                </ShareImageContainer>
              ) : (
                <ShareImageContainer>
                  <ReactPlayer
                    url={file && `${currentPost.video}`}
                    controls={true}
                    width={"100%"}
                  />
                  <CancelIcon onClick={() => setFile(null)} />
                </ShareImageContainer>
              )}
            </div>
          )}
          {newFile && (
            <div>
              {newFile.type !== "video/mp4" ? (
                <ShareImageContainer>
                  <ShareImg src={URL.createObjectURL(newFile)} alt="" />
                  <CancelIcon onClick={() => setNewFile(null)} />
                </ShareImageContainer>
              ) : (
                <ShareImageContainer>
                  <ReactPlayer
                    url={newFile && URL.createObjectURL(newFile)}
                    controls={true}
                    width={"100%"}
                  />
                  <CancelIcon onClick={() => setNewFile(null)} />
                </ShareImageContainer>
              )}
            </div>
          )}
          <ShareBottom onSubmit={handleSubmit}>
            <ShareOptions>
              <label htmlFor="file1">
                <ShareOption>
                  <PermMedia htmlColor="tomato" />
                  <ShareOptionText> Photo or Viedo</ShareOptionText>
                  <input
                    type="file"
                    id="file1"
                    accept=".png,.jpeg,.jpg,.mp4"
                    onChange={(e) => {
                      setNewFile(e.target.files[0]);
                    }}
                    hidden
                  />
                </ShareOption>
              </label>

              <ShareOption>
                <Label htmlColor="darkblue" />
                <ShareOptionText>Tag</ShareOptionText>
              </ShareOption>

              <ShareOption
                currentCity={currentCity}
                custom
                onClick={handleClick}
              >
                <Room htmlColor="green" />
                <ShareOptionText>Location</ShareOptionText>
              </ShareOption>

              <ShareOption>
                <EmojiEmotions htmlColor="goldenrod" />
                <ShareOptionText>Feelings</ShareOptionText>
              </ShareOption>
            </ShareOptions>
            <div>
              <ShareButton type="submit">Edit</ShareButton>
              <ShareButton
                type="submit"
                onClick={() => setOpenModal(false)}
                style={{ background: "red" }}
              >
                Cancel
              </ShareButton>
            </div>
          </ShareBottom>
        </ShareWrapper>
      </ShareContianer>
    </div>
  );

  return (
    <div>
      <Modal open={openModal}>{body}</Modal>
    </div>
  );
};
export default EditPostModal;

const ShareContianer = styled.div`
  width: 100%;
  /* height: 170px; */
  border-radius: 10px;
  -webkit-box-shadow: 0px 0px 16px -8px rgba(0, 0, 0, 0.68);
  box-shadow: 0px 0px 16px -8px rgba(0, 0, 0, 0.68);
  background-color: ${(props) => props.theme.backgroundColorSecondary};
`;
const ShareWrapper = styled.div`
  box-sizing: border-box;
  padding: 20px;
`;
const ShareTop = styled.div`
  display: flex;
  align-items: center;
`;
const ShareProfileImage = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 10px;
`;
const ShareInput = styled.input`
  border: none;
  width: 80%;
  font-size: 16px;
  padding: 10px;
  border-radius: 20px;
  background-color: ${(props) => props.theme.inputBackgroundColor};
  color: ${(props) => props.theme.tintColorSecondary};
  &:focus {
    outline: none;
  }
`;
const ShareHr = styled.hr`
  margin: 20px;
`;
const ShareBottom = styled.form`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
const ShareOptions = styled.div`
  display: flex;
  margin-left: 20px;
`;
const ShareOption = styled.div`
  display: flex;
  align-items: center;
  padding: 15px;
  cursor: pointer;
  border-radius: 10px;
  &:hover {
    background-color: ${(props) => props.theme.hoverColorPrimary};
  }
  background-color: ${(props) =>
    props.custom && props.currentCity && "#cfe2b9"};
  color: ${(props) => props.custom && props.currentCity && "#e03535"};
`;
const ShareOptionText = styled.span`
  margin-left: 3px;
  font-size: 14px;
  white-space: nowrap;
  color: ${(props) => props.theme.tintColorPrimary};
`;
const ShareButton = styled.button`
  border: none;
  padding: 7px;
  border-radius: 5px;
  background-color: green;
  font-weight: 400;
  margin-right: 20px;
  cursor: pointer;
  color: #ffffff;
`;

const ShareImageContainer = styled.div`
  padding: 0 20px 10px 20px;
  position: relative;
  /* max-height: 350px; */
  object-fit: cover;
`;

const ShareImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  max-width: 500px;
  max-height: 500px;
`;

const CancelIcon = styled(Cancel)`
  position: absolute;
  top: 10px;
  right: 25px;
  cursor: pointer;
  opacity: 0.7;
  background-color: ${(props) => props.theme.tintColorPrimary};
  border-radius: 50%;
  &:hover {
    opacity: 1;
  }
`;
