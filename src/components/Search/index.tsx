import React, { useState } from "react";
import styled from "styled-components";

const SearchContainer = styled.div`
  display: flex;
  justify-content: center;
  padding: 0 2rem 2rem;
`;
const SearchInput = styled.input`
  width: 50%;
  margin: 0 1rem;

  border: solid 1px #c0c0c0;
  border-radius: 5px;
  padding: 1rem;
`;

const SearchButton = styled.button`
  padding: 1rem 2rem;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  background-color: rgb(44, 154, 244);
  color: white;
`;

interface searchProps {
  onClick: (val: string) => void;
}

const Search: React.FC<searchProps> = ({ onClick }) => {
  const [query, setQuery] = useState("");
  return (
    <SearchContainer>
      <SearchInput
        placeholder="Search photos..."
        onChange={(e) => setQuery(e.target.value)}
      />
      <SearchButton onClick={() => onClick(query)}>Search</SearchButton>
    </SearchContainer>
  );
};

export default Search;
