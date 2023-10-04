import React from "react";
import { TfiSearch } from "react-icons/tfi";
import "./style.css";
const Search = ({ handleSearch }) => {
  const handleSearchRoot = (e) => {
    handleSearch(e.target.value);
  };
  return (
    <>
      <div className="search-wrapper">
        <div className="search_icon">
          <TfiSearch />
        </div>
        <div className="search">
          <input
            type="text"
            placeholder="search here..."
            onChange={(e) => handleSearchRoot(e)}
          />
        </div>
      </div>
    </>
  );
};

export default Search;
