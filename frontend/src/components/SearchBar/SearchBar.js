import React, { useState } from 'react';
import styles from './SearchBar.module.css'; 

export const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    console.log('Searching for:', searchTerm);
  };

  return (
    <form className={styles.searchBar} onSubmit={handleSearchSubmit}>
      <input
        type="text"
        className={styles.searchInput}
        placeholder="Search"
        value={searchTerm}
        onChange={handleSearchChange}
      />
      <button type="submit" className={styles.searchButton}>
        🔍
      </button>
    </form>
  );
};

export default SearchBar;
