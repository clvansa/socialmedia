import { useRef, useState } from "react";
import styled from "styled-components";
import { IconButton } from "@material-ui/core";
import Picker, { SKIN_TONE_MEDIUM_DARK } from "emoji-picker-react";
import InsertEmoticonIcon from "@material-ui/icons/InsertEmoticon";
import useOutside from "../../util/useOutside";

const Emoji = ({ setData, top = -330, right = 20 }) => {
  const [showEmoji, setShowEmoji] = useState(false);
  const ref = useRef();
  useOutside(ref, setShowEmoji);

  const onEmojiClick = (event, emojiObject) => {
    setData((prvMsg) => prvMsg + emojiObject.emoji);
    console.log(emojiObject)
  };

  return (
    <div>
      <IconButton
        onClick={() => setShowEmoji((prevState) => !prevState)}
        style={{ padding: 6 }}
      >
        <EmoticonIcon />
      </IconButton>
      {showEmoji && (
        <div ref={ref} style={{ zIndex: 10000 }}>
          <Picker
            onEmojiClick={onEmojiClick}
            skinTone={SKIN_TONE_MEDIUM_DARK}
            disableSkinTonePicker={false}
            pickerStyle={{
              position: "absolute",
              top: top,
              right: right,
              zIndex:100000,
              // backgroundColor: "red",
            }}
          />
        </div>
      )}
    </div>
  );
};

export default Emoji;

const EmoticonIcon = styled(InsertEmoticonIcon)`
  color: ${(props) => props.theme.tintColorPrimary};
`;
