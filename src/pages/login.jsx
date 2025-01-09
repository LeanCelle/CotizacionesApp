import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, onAuthStateChanged  } from "firebase/auth";
import { auth } from '../data/firebase'; // Asegúrate de que la ruta sea correcta
import Navbar from '../components/navbar';
import Footer from '../components/footer';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Maneja el cambio de valores en los campos de texto
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                navigate('/login'); // Si el usuario ya está logueado, redirigir a la página principal
            }
        });
    }, [navigate]);

    // Función de validación para el email
    const validateEmail = (email) => {
        const regex = /\S+@\S+\.\S+/;
        return regex.test(email);
    };

    // Función de manejo del submit
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateEmail(formData.email)) {
            setError("Por favor ingresa un correo electrónico válido.");
            return;
        }

        try {
            await signInWithEmailAndPassword(auth, formData.email, formData.password);
            navigate('/'); // Redirige a la página principal o dashboard después de iniciar sesión
        } catch (error) {
            setError("E-mail o contraseña incorrectos.");
        }
    };

    const handleSearch = (query) => {
        navigate(`/action/${query}`);
    };

    return (
        <>
            <Navbar onSearch={handleSearch} />
            <div className="login-page">
                <h1>Accede a tu cuenta</h1>
                <form onSubmit={handleSubmit} className="login-form">
                    <div className="form-group">
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="E-Mail"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Contraseña"
                            required
                        />
                        {error && <p style={{ color: 'red', fontSize:'15px' }}>{error}</p>}
                    </div>
                    <button type="submit" className="login-button">Iniciar sesión</button>
                </form>
            </div>
            <Footer/>
        </>
    );
};

export default Login;
