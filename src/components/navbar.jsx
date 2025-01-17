import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../data/firebase';
import SearchBar from './search';

const Navbar = ({ onSearch }) => {
    const [user, setUser] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
    const toggleMenu = () => {
      setIsOpen(!isOpen);
    };

    useEffect(() => {
        setIsOpen(false);
      }, [navigate]);      

    useEffect(() => {
        const handleResize = () => {
          setIsMobile(window.innerWidth < 768);
        };
    
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
      }, []);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                
            } else {
                setUser(null);
            }
        });

        return () => unsubscribe();
    }, []);

    // Función para cerrar sesión
    const handleSignOut = async () => {
        try {
            await signOut(auth);
            navigate('/');
        } catch (error) {
            console.error("Error al cerrar sesión: ", error);
        }
    };

    const handleLogoutClick = () => {
        setIsModalOpen(true);
    };

    const handleConfirmLogout = () => {
        handleSignOut();
        setIsModalOpen(false);
    };

    const handleCancelLogout = () => {
        setIsModalOpen(false);
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <div className="navbar-hamburger" onClick={toggleMenu}>
                    <div className={`line ${isOpen ? 'open' : ''}`}></div>
                    <div className={`line ${isOpen ? 'open' : ''}`}></div>
                    <div className={`line ${isOpen ? 'open' : ''}`}></div>
                </div>
                <div className="navbar-container-title">
                    <Link to="/" style={{textDecoration:'none', border:'none' }}>
                        <img className="logo-navbar" src="/img/logo.png" alt="Cotizaciones.App." />
                    </Link>
                </div>
                <SearchBar onSearch={onSearch} />
                <div className={`navbar-container-links ${isOpen ? 'active' : ''}`}>
                    <ul className="navbar-links">
                        <Link to="/news" style={{textDecoration:'none' }}><li className="ingresar">Noticias</li></Link>
                        {user ? (
                            <>
                                <li className="user-info">{user.displayName}</li>
                                <li onClick={handleLogoutClick} className="logout">
                                    Cerrar sesión
                                </li>
                            </>
                        ) : (
                            <>
                                <Link to="/register" style={{textDecoration:'none' }}>
                                    <li className="registrarse">Registrarse</li>
                                </Link>
                                <Link to="/login" style={{textDecoration:'none' }}>
                                    <li className="ingresar">Ingresar</li>
                                </Link>
                            </>
                        )}
                    </ul>
                </div>
            </div>

            {isModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <p className='sure'>¿Seguro que desea cerrar sesión?</p>
                        <button className='modalButton' onClick={handleConfirmLogout}>Sí</button>
                        <button className='modalButton' onClick={handleCancelLogout}>No</button>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
