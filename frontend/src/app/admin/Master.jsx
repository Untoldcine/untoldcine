"use client";

import { useState, useEffect } from "react";
import Active from "./Active"
import AddPanel from "./AddPanel"
import EditHero from "./EditHero"

const Master = ({ content }) => {
  // console.log(content);

  const logOut = () => {
    sessionStorage.clear("adminAccess");
    //SHOULD NAVIGATE AWAY
  };

  const [activePanel, setActivePanel] = useState({});
  const [activePanelOn, setActivePanelOn] = useState(false)

  const [heroPanel, setHeroPanel] = useState({});
  const [heroPanelOn, setHeroPanelOn] = useState(false)

  const [addPanel, setAddPanel] = useState(false)
  const [inputValue, setInputValue] = useState("");

  const [selectedContentType, setSelectedContentType] = useState("none");
  const [filteredContent, setFilteredContent] = useState([]);

  //changes the rendered options for content selection
  useEffect(() => {
    filterContent();
  }, [inputValue, selectedContentType]);

  const filterContent = () => {
    const contentArray = content[selectedContentType] || [];

    const filtered = contentArray.filter((item) => {
      const itemName = item[`${selectedContentType}_name`].toLowerCase();
      return itemName.includes(inputValue.toLowerCase());
    });

    setFilteredContent(filtered);
  };

  //invoked whenever a new Edit choice is selected
  const handleChoice = (item) => {
    setActivePanel(item)
    setActivePanelOn(true)
    setAddPanel(false)
  }

  //invoked when adding content, toggles the edited panel off
  const handleToggleAdd = () => {
    setAddPanel(true)
    setHeroPanelOn(false)
    setActivePanelOn(false)
  }

  const handleToggleHero = () => {
    setHeroPanelOn(true)
    setAddPanel(false)
    setActivePanelOn(false)
  }

  return (
    <div className="admin-wrapper">
      <div className="admin-choices">
        <button className="search-button" onClick = {() => handleToggleAdd()}>Add New Content</button>
        <button className="search-button" onClick = {() => handleToggleHero()}>Edit Hero</button>
        <div className="admin-choices-right">
          <label style={{ color: "white" }}>Search for Content</label>
          <select
            value={selectedContentType}
            onChange={(e) => setSelectedContentType(e.target.value)}
          >
            <option value="none">None Selected</option>
            <option value="series">Series</option>
            <option value="video">Video</option>
            <option value="movie">Movie</option>
            <option value="podcast">Podcast</option>
            <option value="bts_series">BTS_Series</option>
            <option value="bts_movies">BTS_Movies</option>
          </select>
          <input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          ></input>
        </div>
      </div>
      <div className="search-results">
        {filteredContent.map((item, index) => (
          <div key={index} className="search-block">
            <div className="block-left">
              <h3 className="search-title">
                {item[`${selectedContentType}_name`]}
              </h3>
              {item.series ? (
                <p>Series Name: {item.series.series_name}</p>
              ) : null}
              {item.movies ? (
                <p>Movie Name: {item.movies.movie_name}</p>
              ) : null}
            </div>
            <button className="search-button" onClick ={() => handleChoice(item)}>View</button>
          </div>
        ))}
      </div>
      {/* <button onClick = {() => logOut()}>Log Out</button> */}
      {activePanelOn ? <Active type = {selectedContentType} details = {activePanel} countries = {content.countries} toggle = {setSelectedContentType}/> : null}
      {addPanel ? <AddPanel allContent = {content}/> : null }
      {heroPanelOn ? <EditHero/> : null}
    </div>
  );
};

export default Master;
