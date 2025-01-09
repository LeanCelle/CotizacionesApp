import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/navbar';
import { registerUser } from '../data/authService';
import Footer from '../components/footer';

const Register = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
    });

    const [error, setError] = useState(null); // Para manejar errores
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const validatePassword = (password) => {
        const regex = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])(?=.{7,})/;
        return regex.test(password);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validación de contraseña
        if (!validatePassword(formData.password)) {
            setError(
                "La contraseña debe tener al menos 7 caracteres, incluir una mayúscula y un carácter especial."
            );
            return;
        }

        try {
            // Llama a la función registerUser con los datos del formulario
            await registerUser(
                formData.firstName,
                formData.lastName,
                formData.email,
                formData.password
            );
            navigate('/'); // Redirige a la página principal
        } catch (error) {
            setError(
                "El E-mail ingresado ya se encuentra en uso."
            );
        }
    };

    const handleSearch = (query) => {
        navigate(`/action/${query}`);
    };

    return (
        <>
            <Navbar onSearch={handleSearch} />
            <div className="register-page">
                <h1>Registrarse</h1>
                <form onSubmit={handleSubmit} className="register-form">
                    <div className="form-group">
                        <input
                            type="text"
                            id="firstName"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            placeholder="Nombre"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="text"
                            id="lastName"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            placeholder="Apellido"
                            required
                        />
                    </div>
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
                        {error && <p style={{ color: 'red', fontSize:'15px' }}>{error}</p>} {/* Mostrar errores */}
                    </div>
                    <button type="submit" className="register-button">Crear usuario</button>
                </form>
            </div>
            <Footer/>
        </>
    );
};

export default Register;
