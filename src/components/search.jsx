import React, { useState } from 'react';

const SearchBar = ({ onSearch }) => {
    const [query, setQuery] = useState('');

    const handleChange = (e) => {
        setQuery(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSearch(query);
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
            <button type="submit">Buscar</button>
        </form>
    );
};

export default SearchBar;
