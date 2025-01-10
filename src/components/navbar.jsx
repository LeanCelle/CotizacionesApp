import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../data/firebase'; // Asegúrate de que la ruta sea correcta
import SearchBar from './search';

const Navbar = ({ onSearch }) => {
    const [user, setUser] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();

    // Verificar si el usuario está logueado
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                
            } else {
                setUser(null);
            }
        });

        return () => unsubscribe(); // Limpiar el observador al desmontar
    }, []);

    // Función para cerrar sesión
    const handleSignOut = async () => {
        try {
            await signOut(auth);
            navigate('/'); // Redirigir al inicio
        } catch (error) {
            console.error("Error al cerrar sesión: ", error);
        }
    };

    // Mostrar modal de confirmación
    const handleLogoutClick = () => {
        setIsModalOpen(true);
    };

    // Función para manejar la confirmación del modal
    const handleConfirmLogout = () => {
        handleSignOut();
        setIsModalOpen(false);
    };

    // Función para manejar la cancelación del modal
    const handleCancelLogout = () => {
        setIsModalOpen(false);
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <div className="navbar-container-title">
                    <Link to="/" style={{textDecoration:'none', border:'none' }}>
                        <img className="logo-navbar" src="/img/logo.png" alt="Cotizaciones.App." />
                    </Link>
                </div>
                <SearchBar onSearch={onSearch} />
                <div className="navbar-container-links">
                    <ul className="navbar-links">
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

            {/* Modal de confirmación de cierre de sesión */}
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
