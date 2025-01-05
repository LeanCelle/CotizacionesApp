// components/navbar.js
import React from 'react';
import { BrowserRouter as Link } from 'react-router-dom';
import logo from '../assets/img/WhatsApp_Image_2025-01-05_at_02.48.41_8d8acf1f-removebg-preview.png'

const Navbar = () => {
    return (
        <nav className="navbar">
            <div className="navbar-container">
                <div className='navbar-container-title'>
                    <img className='logo-navbar' src={logo} alt="Cotizacione.App." />
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
