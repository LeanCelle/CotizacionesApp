import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

const SearchBar = ({ onSearch }) => {
    const [query, setQuery] = useState('');
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [isExpanded, setIsExpanded] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleChange = (e) => {
        setQuery(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (onSearch) {
            onSearch(query);
        }
        setIsExpanded(false);
    };

    const toggleSearch = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <div className="search-bar-container">
            {isMobile ? (
                <>
                    <button className="search-icon" onClick={toggleSearch}>
                        <FontAwesomeIcon icon={faSearch} color="#05347c" />
                    </button>
                    {isExpanded && (
                        <form className="search-bar-mobile" onSubmit={handleSubmit}>
                            <input
                                type="text"
                                value={query}
                                onChange={handleChange}
                                placeholder="Buscar acción (ej: AMZN)..."
                                required
                            />
                            <button type="submit" className="search-button-mobile">
                                Buscar
                            </button>
                        </form>
                    )}
                </>
            ) : (
                <form className="search-bar" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        value={query}
                        onChange={handleChange}
                        placeholder="Buscar acción (ej: AMZN)..."
                        required
                    />
                    <button type="submit" className="search-button">
                        <FontAwesomeIcon icon={faSearch} color="#05347c" />
                    </button>
                </form>
            )}
        </div>
    );
};

export default SearchBar;
