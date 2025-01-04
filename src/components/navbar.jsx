// components/navbar.js
import React from 'react';
import { BrowserRouter as Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav className="navbar">
            <div className="navbar-container">
                <div className='navbar-container-title'>
                    <h1 className="navbar-title">
                        Cotizaciones.App
                    </h1>
                </div>
                <div className='navbar-container-links'>
                    <ul className="navbar-links">
                        <li>
                            <Link to="/">
                                Inicio
                            </Link>
                        </li>
                        <li>
                            <Link to="/predictions">
                                Predicciones
                            </Link>
                        </li>
                        <li>
                            <Link to="/about">
                                Acerca de
                            </Link>
                        </li>
                        <li>
                            <Link to="/contact">
                                Contacto
                            </Link>
                        </li>
                    </ul>
                </div>
                
            </div>
        </nav>
    );
};

export default Navbar;
