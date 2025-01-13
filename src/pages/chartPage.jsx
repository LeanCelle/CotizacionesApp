import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from '../data/firebase'; 
import ChartComponent from '../components/chart';
import LoadingLogo from '../components/loading_logo';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faCircleInfo } from '@fortawesome/free-solid-svg-icons';

const ActionDetails = () => {
    const { action } = useParams();
    const navigate = useNavigate();
    const [selectedAction, setSelectedAction] = useState(null);
    const [loadingDetails, setLoadingDetails] = useState(true);
    const [user, setUser] = useState(null);
    const [alertMessage, setAlertMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const source = axios.CancelToken.source();

        setLoadingDetails(true);
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/search/${action}`, {
            cancelToken: source.token
        })
            .then(response => {
                setSelectedAction({ name: action, ...response.data });
                setLoadingDetails(false);
            })
            .catch((error) => {
                if (axios.isCancel(error)) return;
                setErrorMessage("Error al obtener los datos. Intenta nuevamente.");
                setLoadingDetails(false);
            });

        return () => source.cancel();
    }, [action]);

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

    return (
        <div className="selected-action-details">
            {loadingDetails ? (
                <LoadingLogo loading={true} logoSrc={null} />
            ) : selectedAction ? (
                <div style={{minHeight:'74vh'}}>
                    <div className="chart-big-container">
                        <p onClick={() => navigate('/')} className="back-button" style={{ cursor: 'pointer' }}>
                            <FontAwesomeIcon icon={faArrowLeft} style={{ marginRight: '6px', color: '#333' }} />
                            Volver a la tabla
                        </p>
                        <p className="DataCotizaciones">
                            <strong>{selectedAction.name}, {selectedAction.longName}</strong>
                        </p>
                        <p className="DataCotizacionesSector">
                            {selectedAction.sector} {selectedAction.industry}
                        </p>
                        <ChartComponent selectedAction={selectedAction} />
                        <div className="chart-container-info">
                            <div className="data-cotizaciones-container">
                                <div className="data-cotizaciones-first">
                                    <p>Precio Actual: <strong>${selectedAction.current_price?.toFixed(2) || "No disponible"}</strong></p>
                                    {user ? (
                                        <>
                                            <p>$ Predicción: <strong style={{ color: selectedAction.percent_variation > 0 ? "green" : selectedAction.percent_variation < 0 ? "red" : "black" }}>
                                                ${selectedAction.prediction?.toFixed(2) || "No disponible"}
                                            </strong></p>
                                            <p>Recomendación: <strong>{getRecommendation(selectedAction.percent_variation)}</strong></p>
                                        </>
                                    ) : (
                                        <>
                                            <p>$ Predicción: <FontAwesomeIcon icon={faCircleInfo} style={{ color: '#05347c', cursor:'pointer' }} title="Debes iniciar sesión para acceder a estos detalles" onClick={handleIconClick} /></p>
                                            <p>Recomendación: <FontAwesomeIcon icon={faCircleInfo} style={{ color: '#05347c', cursor:'pointer' }} title="Debes iniciar sesión para acceder a estos detalles" onClick={handleIconClick} /></p>
                                        </>
                                    )}
                                    <p>52-Week High: <strong>${selectedAction.high_52_week?.toFixed(2) || "No disponible"}</strong></p>
                                </div>
                                <div className="data-cotizaciones-second">
                                    <p>Última Fecha: <strong>{selectedAction.last_updated || "No disponible"}</strong></p>
                                    <p>% Predicción: <strong style={{ color: selectedAction.percent_variation > 0 ? "green" : selectedAction.percent_variation < 0 ? "red" : "black" }}>
                                        {user ? `${selectedAction.percent_variation?.toFixed(2) || "No disponible"}%` : <FontAwesomeIcon icon={faCircleInfo} style={{ color: '#05347c', cursor:'pointer' }} title="Debes iniciar sesión para acceder a estos detalles" onClick={handleIconClick} />}
                                    </strong></p>
                                    <p>EPS: <strong>${selectedAction.earnings_per_share?.toFixed(2) || "No disponible"}</strong></p>
                                    <p>52-Week Low: <strong>${selectedAction.low_52_week?.toFixed(2) || "No disponible"}</strong></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div style={{height:'74vh'}}>
                    <p style={{ textAlign: 'center' }}>No hay datos disponibles para la acción seleccionada.</p>
                </div>
            )}
            {alertMessage && (
                <div className="alert-message">
                    {alertMessage}
                </div>
            )}
        </div>
    );
};

export default ActionDetails;
