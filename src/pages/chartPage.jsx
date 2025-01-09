import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import ChartComponent from '../components/chart';
import LoadingLogo from '../components/loading_logo';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import Navbar from '../components/navbar';

const ActionDetails = () => {
    const { action } = useParams(); // Obtiene el nombre de la acción desde la URL
    const navigate = useNavigate();
    const [selectedAction, setSelectedAction] = useState(null);
    const [loadingDetails, setLoadingDetails] = useState(true);

    useEffect(() => {
        setLoadingDetails(true);
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/search/${action}`)
            .then(response => {
                setSelectedAction({ name: action, ...response.data });
                setLoadingDetails(false);
            })
            .catch(() => {
                setSelectedAction(null);
                setLoadingDetails(false);
            });
    }, [action]);

    const getRecommendation = (percentVariation) => {
        if (percentVariation > 5) return "Comprar";
        if (percentVariation < -5) return "Vender";
        return "Hold";
    };

    const handleSearch = (query) => {
        if (query) {
            navigate(`/action/${query}`);
        } else {
            // Redirigir a la página principal o mostrar un mensaje de error
            navigate('/'); // Redirigir a la página principal
        }
    };

    return (
        <div className="selected-action-details">
            <Navbar onSearch={handleSearch}/>
            <p onClick={() => navigate('/')} className="back-button" style={{ cursor: 'pointer' }}>
                <FontAwesomeIcon icon={faArrowLeft} style={{ marginRight: '6px', color: '#333' }} />
                Volver a la tabla
            </p>

            {loadingDetails ? (
                <LoadingLogo loading={true} logoSrc={null} />
            ) : selectedAction ? (
                <div className="chart-big-container">
                    <div className="chart-container-info">
                        <p className="DataCotizaciones">
                            <strong>Datos de cotizaciones - {selectedAction.name}, {selectedAction.longName}</strong>
                        </p>
                        <div className="data-cotizaciones-container">
                            <div className="data-cotizaciones-first">
                                <p>Precio Actual: <strong>${selectedAction.current_price?.toFixed(2) || "No disponible"}</strong></p>
                                <p>$ Predicción: <strong>${selectedAction.prediction?.toFixed(2) || "No disponible"}</strong></p>
                                <p>52-Week High: <strong>${selectedAction.high_52_week?.toFixed(2) || "No disponible"}</strong></p>
                                <p>Recomendación: <strong>{getRecommendation(selectedAction.percent_variation)}</strong></p>
                            </div>
                            <div className="data-cotizaciones-second">
                                <p>Última Fecha: <strong>{selectedAction.last_updated || "No disponible"}</strong></p>
                                <p>% Predicción: <strong>{selectedAction.percent_variation?.toFixed(2) || "No disponible"}%</strong></p>
                                <p>52-Week Low: <strong>${selectedAction.low_52_week?.toFixed(2) || "No disponible"}</strong></p>
                                <p>&nbsp;</p>
                            </div>
                        </div>
                    </div>
                    <div className="chart-container">
                        <ChartComponent selectedAction={selectedAction} />
                    </div>
                </div>
            ) : (
                <p style={{textAlign:'center' }}>No hay datos disponibles para la acción seleccionada.</p>
            )}
        </div>
    );
};

export default ActionDetails;
