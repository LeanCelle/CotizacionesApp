import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from '../data/firebase';

const InfoIcon = ({ onClick, title }) => (
    <div className="data-into">
        <p>
            <FontAwesomeIcon
                icon={faCircleInfo}
                style={{ color: '#05347c', cursor: 'pointer' }}
                title={title}
                onClick={onClick}
                aria-label={title}
            />
        </p>
    </div>
);

const TableRow = ({ data, handleActionClick }) => {
    const [user, setUser] = useState(null);
    const [alertMessage, setAlertMessage] = useState('');

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        }, (error) => {
            console.error("Error al verificar el estado de autenticación: ", error);
            setAlertMessage("Error en la autenticación.");
            setTimeout(() => setAlertMessage(''), 3000);
        });

        return () => unsubscribe();
    }, []);

    const getRecommendation = (percentVariation) => {
        if (percentVariation > 5) return "Comprar";
        if (percentVariation < -5) return "Vender";
        return "Hold";
    };

    const handleIconClick = (e) => {
        e.stopPropagation();
        if (!user) {
            setAlertMessage('Debes iniciar sesión para acceder a estos detalles');
            setTimeout(() => setAlertMessage(''), 3000);
        }
    };

    const renderDataCell = (value, format = null) => {
        if (value === null) return "No disponible";
        return format ? format(value) : value;
    };

    const renderVariationColor = (variation) => {
        if (variation > 0) return 'green';
        if (variation < 0) return 'red';
        return 'black';
    };

    return (
        <div
            className="data"
            onClick={() => handleActionClick(data.name)}
            style={{ cursor: 'pointer' }}
        >
            <div className="data-into"><p>{data.name}</p></div>
            <div className="data-into d"><p>{data.longName}</p></div>
            <div className="data-into"><p>{renderDataCell(data.current_price, (value) => `$${value.toFixed(2)}`)}</p></div>

            {user ? (
                <>
                    <div className="data-into">
                        <p style={{ color: renderVariationColor(data.percent_variation) }}>
                            {renderDataCell(data.prediction, (value) => `$${value.toFixed(2)}`)}
                        </p>
                    </div>
                    <div className="data-into" style={{ color: renderVariationColor(data.percent_variation) }}>
                        <p>{renderDataCell(data.percent_variation, (value) => `${value.toFixed(2)}%`)}</p>
                    </div>
                    <div className='data-into d'>
                        <p>{renderDataCell(data.percent_variation, getRecommendation)}</p>
                    </div>
                </>
            ) : (
                <>
                    <InfoIcon onClick={handleIconClick} title="Debes iniciar sesión para acceder a estos detalles" />
                    <InfoIcon onClick={handleIconClick} title="Debes iniciar sesión para acceder a estos detalles" />
                    <InfoIcon onClick={handleIconClick} title="Debes iniciar sesión para acceder a estos detalles" />
                </>
            )}

            <div className="data-into d"><p>{renderDataCell(data.high_52_week, (value) => `$${value}`)}</p></div>
            <div className="data-into d"><p>{renderDataCell(data.low_52_week, (value) => `$${value}`)}</p></div>
            <div className="data-into d"><p>{renderDataCell(data.last_updated)}</p></div>

            {alertMessage && (
                <div className="alert-message">
                    {alertMessage}
                </div>
            )}
        </div>
    );
};

export default TableRow;
