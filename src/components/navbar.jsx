// components/navbar.js
import React from 'react';
import { BrowserRouter as Link } from 'react-router-dom';
import SearchBar from './search';

const Navbar = ({ onSearch }) => {
    return (
        <nav className="navbar">
            <div className="navbar-container">
                <div className="navbar-container-title">
                    <img className="logo-navbar" src="/img/logo.png" alt="Cotizaciones.App." />
                </div>
                <SearchBar onSearch={onSearch} />
                <div className="navbar-container-links">
                    <ul className="navbar-links">
                        <li className='registrarse'>
                            <Link to="/register">Registrarse</Link>
                        </li>
                        <li className='ingresar'>
                            <Link to="/login">Ingresar</Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};


export default Navbar;
