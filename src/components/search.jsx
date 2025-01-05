import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

const SearchBar = ({ onSearch }) => {
    const [query, setQuery] = useState('');

    const handleChange = (e) => {
        setQuery(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSearch(query);
    };

    const handleSearch = () => {
        if (onSearch) {
            onSearch(query);
        }
    };

    return (
        <form className="search-bar" onSubmit={handleSubmit}>
            <input 
                type="text" 
                value={query} 
                onChange={handleChange} 
                placeholder="Buscar acción (ej: AMZN)..." 
                required 
            />
            <button onClick={handleSearch} className="search-button">
                <FontAwesomeIcon icon={faSearch} color='#05347c'/>
            </button>
        </form>
    );
};

export default SearchBar;
