import React from "react";
import styled from "styled-components";

const TagLists = ({ tags, setSearchUsers, setTagResults, setInput, input }) => {
    
  const handleChoiceTag = (tag) => {
    setSearchUsers([]);
    setTagResults([]);
    setInput(input.replace(/(?:@|\.)(\w+)/gi, "@" + tag.username));
  };

  return (
    <TagListsContainer style={{ display: tags ? "flex" : "none" }}>
      <TagListsWarpper>
        {tags.map((tag, i) => (
          <TagList key={i} onClick={() => handleChoiceTag(tag)}>
            <TagListName>{tag.username}</TagListName>
          </TagList>
        ))}
      </TagListsWarpper>
    </TagListsContainer>
  );
};

export default TagLists;

const TagListsContainer = styled.div`
  position: absolute;
  top: 50px;
  width: 200px;
  max-height: 300px;
  background-color: #ccc9c9;
  border-radius: 20px;
  -webkit-box-shadow: 0px 0px 16px -8px rgba(0, 0, 0, 0.68);
  box-shadow: 0px 0px 16px -8px rgba(0, 0, 0, 0.68);
  
`;

const TagListsWarpper = styled.div`
  padding: 10px;
  width: 100%;
`;
const TagList = styled.div`
  display: flex;
  padding: 10px;
  border-radius: 10px;
  &:hover {
    background-color: gray;
  }
`;
const TagListName = styled.span`
  color: #252525;
`;
