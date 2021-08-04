import { useContext, useEffect, useRef, useState } from "react";
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
import { axiosInstance } from "../util/axiosInstance";
import TagMenu from "./TagMenu";
import TagLists from "./TagLists";
import FeelingLists from "./FeelingLists";
import { Tooltip } from "@material-ui/core";
import axios from "axios";

const Share = (props) => {
  const { user } = useContext(AuthContext);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const desc = useRef();
  const location = useGeoLocation();
  const [currentCity, setCurrentCity] = useState("");
  const [file, setFile] = useState(null);
  const [tag, setTag] = useState(false);
  const [tagValue, setTagValue] = useState("");
  const [input, setInput] = useState("");
  const [searchUsers, setSearchUsers] = useState([]);
  const [tagResults, setTagResults] = useState([]);
  const [openFeeling, setOpenFeeling] = useState(false);
  const [feeling, setFeeling] = useState({});

  const getLocation = async () => {
    try {
      const res = await axios.get(
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
    const newPost = {
      userId: user._id,
      desc: desc.current.value,
      location: currentCity && currentCity,
      feeling: feeling && feeling,
    };

    if (file) {
      const data = new FormData();
      const extension = file.name.split(".")[file.name.split(".").length - 1];
      const name = uuid().toString().replace(/-/g, "");
      const fileBlob = new Blob([file], { type: file.type }); // WORKS much better (if you know what MIME type you want.

      console.log(fileBlob);
      const fileName = `${name}.${extension}`;

      data.append("name", fileName);
      data.append("file", fileBlob);
      console.log(fileName);

      const config = {
        headers: {
          "Access-Control-Allow-Headers": "access-control-allow-origin",
          "Access-Control-Allow-Methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/x-www-form-urlencoded",
        },
      };

      try {
        const res = await axiosInstance.post(`/uploads/`, data, config);
        const { imageUrl } = await res.data;
        if (file.type === "video/mp4") {
          newPost.video = imageUrl;
        } else {
          newPost.img = imageUrl;
        }
      } catch (err) {
        console.log(err);
      }
    }

    try {
      await axiosInstance.post("/posts", newPost);
    } catch (err) {
      console.log(err);
    }

    // props.update();
    desc.current.value = "";
    setFile(null);
  };

  useEffect(() => {
    if (!tagValue) return;
    desc.current.value += ` @${tagValue.username} `;
    setTagValue("");
  }, [tagValue]);

  const handleSearch = (e) => {
    setInput(e.target.value);
    let res = [];
    if (!e.target.value.match(/(?:@|\.)(\w+)/gi)) {
      setSearchUsers([]);
    } else {
      setSearchUsers(e.target.value.match(/(?:@|\.)(\w+)/gi));
      res = e.target.value.match(/(?:@|\.)(\w+)/gi);
    }

    const us = res.map((u) => {
      const getUser = async (e) => {
        // setSearch(e.target.value);
        try {
          // if (!e.target.value) return;
          const res = await axiosInstance.get(
            `/users/search?username=${u.split("@")[1]}`
          );

          setTagResults(res.data);
        } catch (err) {
          console.log(err);
        }
      };
      return getUser();
    });
  };

  let keywords = [
    "SELECT",
    "FROM",
    "WHERE",
    "LIKE",
    "BETWEEN",
    "UNION",
    "FALSE",
    "NULL",
    "FROM",
    "TRUE",
    "NOT",
    "ORDER",
    "GROUP",
    "BY",
    "NOT",
    "IN",
  ];
  // useEffect(() => {
  //   // Keyup event
  //   document.querySelector("#editor").addEventListener("keyup", (e) => {
  //     // Space key pressed
  //     if (e.keyCode == 32) {
  //       var newHTML = "";
  //       // Loop through words
  //       let str = e.target.innerText;
  //       let chunks = str
  //           .split(new RegExp(keywords.map((w) => `(${w})`).join("|"), "i"))
  //           .filter(Boolean),
  //         markup = chunks.reduce((acc, chunk) => {
  //           acc += keywords.includes(chunk.toUpperCase())
  //             ? `<span class="statement">${chunk}</span>`
  //             : `<span class='other'>${chunk}</span>`;
  //           return acc;
  //         }, "");
  //       e.target.innerHTML = markup;

  //       // Set cursor postion to end of text
  //       //    document.querySelector('#editor').focus()
  //       var child = e.target.children;
  //       var range = document.createRange();
  //       var sel = window.getSelection();
  //       range.setStart(child[child.length - 1], 1);
  //       range.collapse(true);
  //       sel.removeAllRanges();
  //       sel.addRange(range);
  //       // this.focus();
  //     }
  //   });
  // }, []);

  return (
    <ShareContianer>
      <ShareWrapper>
        <ShareTop>
          <ShareProfileImage src={user?.profilePicture} alt="Profie Image" />
          <ShareInput
            placeholder={`What's in your mind ${user?.username}...? ${currentCity}`}
            ref={desc}
            // onChange={handleSearch}
            // value={input}
          />

          {/* <div id="editor" contenteditable="true"></div> */}

          {!!searchUsers.length && (
            <TagLists
              tags={tagResults}
              setSearchUsers={setSearchUsers}
              setTagResults={setTagResults}
              setInput={setInput}
              input={input}
            />
          )}
        </ShareTop>
        <ShareHr />
        {file && (
          <div>
            {file.type !== "video/mp4" ? (
              <ShareImageContainer>
                <ShareImg src={URL.createObjectURL(file)} alt="" />
                <CancelIcon onClick={() => setFile(null)} />
              </ShareImageContainer>
            ) : (
              <ShareImageContainer>
                <ReactPlayer
                  url={file && URL.createObjectURL(file)}
                  controls={true}
                  width={"100%"}
                />
                <CancelIcon onClick={() => setFile(null)} />
              </ShareImageContainer>
            )}
          </div>
        )}
        <ShareBottom onSubmit={handleSubmit}>
          <ShareOptions>
            <label htmlFor="file">
              <Tooltip title="Add photo or viedo">
                <ShareOption>
                  <PermMedia htmlColor="tomato" />
                  <ShareOptionText> Photo or Viedo</ShareOptionText>
                  <input
                    type="file"
                    id="file"
                    accept=".png,.jpeg,.jpg,.mp4"
                    onChange={(e) => {
                      setFile(e.target.files[0]);
                    }}
                    hidden
                  />
                </ShareOption>
              </Tooltip>
            </label>

            <Tooltip title="Tag your friendes">
              <ShareOption
                tag={tag}
                onClick={() => setTag((prevTag) => !prevTag)}
                style={{ position: "relative" }}
              >
                <Label htmlColor="darkblue" />
                <ShareOptionText>Tag</ShareOptionText>
                {tag && <TagMenu user={user} setTagValue={setTagValue} />}
              </ShareOption>
            </Tooltip>
            <Tooltip title=" Set your location">
              <ShareOption
                currentCity={currentCity}
                custom
                onClick={handleClick}
              >
                <Room htmlColor="green" />
                <ShareOptionText>Location</ShareOptionText>
              </ShareOption>
            </Tooltip>

            <Tooltip
              title={
                feeling.char ? `${feeling.char} ${feeling.name}` : "Feelings"
              }
            >
              <ShareOption
                feeling={openFeeling}
                onClick={() => setOpenFeeling(true)}
                style={{ backgroundColor: feeling?.name && "#eeeeee32" }}
              >
                <EmojiEmotions
                  htmlColor={feeling?.name ? "#f02f2f" : "goldenrod"}
                />
                <ShareOptionText>Feelings</ShareOptionText>
              </ShareOption>
            </Tooltip>
          </ShareOptions>
          <ShareButton type="submit">Share</ShareButton>
        </ShareBottom>
      </ShareWrapper>
      {openFeeling && (
        <FeelingLists setOpen={setOpenFeeling} setFeeling={setFeeling} />
      )}
    </ShareContianer>
  );
};

export default Share;

const ShareContianer = styled.div`
  width: 100%;
  max-width: 660px;
  border-radius: 10px;
  -webkit-box-shadow: 0px 0px 16px -8px rgba(0, 0, 0, 0.68);
  box-shadow: 0px 0px 16px -8px rgba(0, 0, 0, 0.68);
  background-color: ${(props) => props.theme.backgroundColorSecondary};
  margin: auto;
  margin-bottom: 30px;
  position: relative;
  /* display: none; */

  @media (max-width: 910px) {
    width: 90%;
    margin: auto;
  }
`;
const ShareWrapper = styled.div`
  box-sizing: border-box;
  padding: 10px;
`;
const ShareTop = styled.div`
  display: flex;
  align-items: center;
  position: relative;
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
  background-color: ${(props) => props.theme.inputBackgroundColor};
  color: ${(props) => props.theme.tintColorSecondary};
  padding: 10px;
  border-radius: 20px;

  &:focus {
    outline: none;
  }
`;
const ShareHr = styled.hr`
  margin: 20px;
  border-color: ${(props) => props.theme.grayColor};
`;
const ShareBottom = styled.form`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
const ShareOptions = styled.div`
  display: flex;
  margin-left: 20px;
  @media (max-width: 910px) {
    margin-left: 0px;
  }
  @media (max-width: 450px) {
    display: flex;
    justify-content: space-around;
    width: 100%;
  }
`;
const ShareOption = styled.div`
  display: flex;
  align-items: center;
  padding: 15px;
  cursor: pointer;
  border-radius: 10px;
  color: ${(props) => props.theme.tintColorPrimary};

  &:hover {
    background-color: ${(props) => props.theme.hoverColorPrimary};
  }
  background-color: ${(props) =>
    props.custom && props.currentCity && "#cfe2b9"};
  color: ${(props) => props.custom && props.currentCity && "#e03535"};
  background-color: ${(props) => props.tag && "#b9d3e2"};
  background-color: ${(props) => props.feeling && "#e2dfb9"};

  @media (max-width: 1550px) {
    padding: 5px;
  }
`;
const ShareOptionText = styled.span`
  margin-left: 3px;
  font-size: 14px;
  white-space: nowrap;

  @media (max-width: 1200px) {
    margin-left: 0px;
    font-size: 12px;
  }

  @media (max-width: 450px) {
    display: none;
  }
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
  object-fit: cover;
`;

const ShareImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const CancelIcon = styled(Cancel)`
  position: absolute;
  top: 10px;
  right: 25px;
  cursor: pointer;
  opacity: 0.7;
  &:hover {
    opacity: 1;
  }
`;
