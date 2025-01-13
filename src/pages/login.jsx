import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { auth } from '../data/firebase'; // Asegúrate de que la ruta sea correcta
import { Link } from 'react-router-dom';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false); // Para manejar el estado de carga
    const navigate = useNavigate();

    // Maneja el cambio de valores en los campos de texto
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                navigate('/'); // Redirige a la página principal si ya está logueado
            }
        });
        return () => unsubscribe(); // Limpia la suscripción
    }, [navigate]);

    // Función de validación para el email
    const validateEmail = (email) => {
        const regex = /\S+@\S+\.\S+/;
        return regex.test(email);
    };

    // Función de manejo del submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true); // Inicia el estado de carga

        if (!validateEmail(formData.email)) {
            setError("Por favor ingresa un correo electrónico válido.");
            setIsLoading(false); // Detiene el estado de carga en caso de error
            return;
        }

        try {
            await signInWithEmailAndPassword(auth, formData.email, formData.password);
            navigate('/'); // Redirige a la página principal después de iniciar sesión
        } catch (error) {
            setError("E-mail o contraseña incorrectos.");
        } finally {
            setIsLoading(false); // Detiene el estado de carga al finalizar la solicitud
        }
    };

    return (
        <>
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
                        {error && <p style={{ color: 'red', fontSize: '15px' }}>{error}</p>}
                    </div>
                    <button type="submit" className="login-button" disabled={isLoading}>
                        {isLoading ? 'Cargando...' : 'Iniciar sesión'}
                    </button>
                    <p className='notAccount' style={{textAlign:'center'}}>¿Todavia no tenes un cuenta? <Link to="/register" style={{ color:"#05347c" }}>Crear cuenta</Link></p>
                </form>
            </div>
        </>
    );
};

export default Login;
