import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../data/authService';

const Register = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
    });

    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
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
                'La contraseña debe tener al menos 7 caracteres, incluir una mayúscula y un carácter especial.'
            );
            return;
        }

        setIsSubmitting(true);

        try {
            
            await registerUser(
                formData.firstName,
                formData.lastName,
                formData.email,
                formData.password
            );
            navigate('/');
        } catch (error) {
            setError('El E-mail ingresado ya se encuentra en uso, o es incorrecto.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
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
                    {error && <p style={{ color: 'red', fontSize: '15px' }}>{error}</p>}
                </div>
                <button type="submit" className="register-button" disabled={isSubmitting}>
                    {isSubmitting ? 'Creando usuario...' : 'Crear usuario'}
                </button>
            </form>
        </div>
    );
};

export default Register;
