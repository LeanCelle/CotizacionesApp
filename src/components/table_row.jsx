import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from '../data/firebase'; // Asegúrate de que la ruta sea correcta

const TableRow = ({ data, handleActionClick }) => {
    const [user, setUser] = useState(null);
    const [alertMessage, setAlertMessage] = useState('');

    // Verificar si el usuario está logueado
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });

        return () => unsubscribe(); // Limpiar el observador al desmontar
    }, []);

    const getRecommendation = (percentVariation) => {
        if (percentVariation > 5) return "Comprar";
        if (percentVariation < -5) return "Vender";
        return "Hold";
    };

    const handleIconClick = (e) => {
        e.stopPropagation(); // Detener la propagación del evento al contenedor
        if (!user) {
            setAlertMessage('Debes iniciar sesión para acceder a estos detalles');
            setTimeout(() => setAlertMessage(''), 3000); // El mensaje desaparece después de 3 segundos
        }
    };

    return (
        <div
            className="data"
            onClick={() => handleActionClick(data.name)}
            style={{ cursor: 'pointer' }}
        >
            <div className="data-into"><p>{data.name}</p></div>
            <div className="data-into"><p>{data.longName}</p></div>
            <div className="data-into"><p>{data.current_price !== null ? `$${data.current_price.toFixed(2)}` : "No disponible"}</p></div>

            {user ? (
                <>
                    <div className="data-into">
                        <p>{data.prediction !== null ? `$${data.prediction.toFixed(2)}` : "No disponible"}</p>
                    </div>
                    <div
                        className="data-into"
                        style={{
                            color: data.percent_variation > 0
                                ? 'green'
                                : data.percent_variation < 0
                                ? 'red'
                                : 'black'
                        }}
                    >
                        <p>{data.percent_variation !== null ? `${data.percent_variation.toFixed(2)}%` : "No disponible"}</p>
                    </div>
                    <div className='data-into'>
                        <p>{data.percent_variation !== null ? getRecommendation(data.percent_variation) : "No disponible"}</p>
                    </div>
                </>
            ) : (
                <>
                    <div className="data-into">
                        <p>
                            <FontAwesomeIcon 
                                icon={faCircleInfo} 
                                style={{ color: '#05347c', cursor: 'pointer' }} 
                                title="Debes iniciar sesión para acceder a estos detalles" 
                                onClick={handleIconClick} 
                            />
                        </p>
                    </div>
                    <div className="data-into">
                        <p>
                            <FontAwesomeIcon 
                                icon={faCircleInfo} 
                                style={{ color: '#05347c', cursor: 'pointer' }} 
                                title="Debes iniciar sesión para acceder a estos detalles" 
                                onClick={handleIconClick} 
                            />
                        </p>
                    </div>
                    <div className="data-into">
                        <p>
                            <FontAwesomeIcon 
                                icon={faCircleInfo} 
                                style={{ color: '#05347c', cursor: 'pointer' }} 
                                title="Debes iniciar sesión para acceder a estos detalles" 
                                onClick={handleIconClick} 
                            />
                        </p>
                    </div>
                </>
            )}

            <div className="data-into"><p>{data.high_52_week !== null ? `$${data.high_52_week}` : "No disponible"}</p></div>
            <div className="data-into"><p>{data.low_52_week !== null ? `$${data.low_52_week}` : "No disponible"}</p></div>
            <div className="data-into"><p>{data.last_updated || "No disponible"}</p></div>

            {alertMessage && (
                <div className="alert-message">
                    {alertMessage}
                </div>
            )}
        </div>
    );
};

export default TableRow;
