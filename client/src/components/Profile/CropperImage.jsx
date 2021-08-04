import { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { Button } from "@material-ui/core";
import Cropper from "cropperjs";
import "cropperjs/dist/cropper.css";
import urlToFile from "../../util/urlToFile";
import { axiosInstance } from "../../util/axiosInstance";
import { v4 as uuid } from "uuid";

const CropperImage = ({ file, type, setFile }) => {
  const [imageDestination, setImageDestination] = useState("");
  const imageElement = useRef();

  const aspectRatio = type === "cover" ? 16 / 6 : 1;
  const canvasOptions =
    type === "cover"
      ? { width: 1200, heigth: 250 }
      : { width: 150, heigth: 150 };

  useEffect(() => {
    let cropper;
    if (file.size) {
      cropper = new Cropper(imageElement.current, {
        zoomable: true,
        scalable: false,
        autoCropArea: aspectRatio,
        aspectRatio: aspectRatio,
        toggleDragModeOnDblclick: false,

        crop: () => {
          const canvas = cropper.getCroppedCanvas(canvasOptions);
          setImageDestination(canvas.toDataURL("image/jpg"));
        },
      });
    }

    return () => {
      setImageDestination({});
      cropper.destroy();
    };
  }, [file, type]);

  const randomNumber = () => Math.floor(Math.random() * 99999999);

  const handleSubmit = async () => {
    let image;

    const data = new FormData();
    // const fileName = Date.now() + randomNumber() + ".jpg";
    const extension = file.name.split(".")[file.name.split(".").length - 1];
    const name = uuid().toString().replace(/-/g, "");
    const fileName = `${name}.${extension}`;

    try {
      const converetFile = await urlToFile(
        imageDestination,
        fileName,
        "image/jpg"
      );

      data.append("name", fileName);
      data.append("file", converetFile);

      const res = await axiosInstance.post("/uploads", data);
      if (type === "cover") {
        image = {
          coverPicture: `${res.data.imageUrl}`,
        };
      } else {
        image = {
          profilePicture: `${res.data.imageUrl}`,
        };
      }
    } catch (err) {
      console.log(err);
    }

    try {
      const res = await axiosInstance.put(`/users/`, image);
    } catch (err) {
      console.log(err);
    }
    setFile({});
  };

  return (
    <CropperImageContainer>
      <CropperImageWrapper>
        <ContainerTop>
          <OrginalImage>
            {file?.size && (
              <img src={URL.createObjectURL(file)} ref={imageElement} />
            )}
          </OrginalImage>
          <PreviewImage type={type}>
            <img src={imageDestination} />
          </PreviewImage>
        </ContainerTop>
        <ContainerButtom>
          <ButtonGroup>
            <Button onClick={handleSubmit} variant="contained" color="primary">
              Save
            </Button>
            <Button
              onClick={() => setFile({})}
              variant="outlined"
              color="secondary"
            >
              Cancel
            </Button>
          </ButtonGroup>
        </ContainerButtom>
      </CropperImageWrapper>
    </CropperImageContainer>
  );
};

export default CropperImage;

const CropperImageContainer = styled.div`
  background-color: #25252575;
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 10;
`;
const CropperImageWrapper = styled.div`
  padding: 10px;
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 50vw;
  height: 50vh;
  z-index: 1;
  min-width: 360px;
  max-width: 700px;
  min-height: 460px;
  background-color: ${(props) => props.theme.backgroundColorSecondary};
  overflow: hidden;
  border-radius: 10px;
`;
const ContainerTop = styled.div`
  width: 100%;
  height: 90%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const OrginalImage = styled.div`
  width: 100%;
  height: 300px;
  overflow: hidden;
  img {
    width: 100%;
    height: 100%;
    max-width: 600px;
    max-height: 400px;
  }
`;
const PreviewImage = styled.div`
  margin-top: 10px;
  width: ${(props) => (props.type === "cover" ? "300px" : "100px")};
  height: 100px;
  img {
    display: block;
    width: 100%;
    height: 100%;
    max-width: 100%;
    object-fit: cover;
    border: 1px solid ${(props) => props.theme.grayColor};
    border-radius: ${(props) => (props.type === "cover" ? "10px" : "50%")};
  }
`;
const ContainerButtom = styled.div`
  width: 100%;
`;

const ButtonGroup = styled.div`
  margin: auto;
  display: flex;
  justify-content: space-evenly;
  width: 30%;
`;
