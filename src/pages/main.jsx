// Main.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { top100Actions } from '../data/List100';
import DataTable from '../components/data_table';
import LoadingLogo from '../components/loading_logo';
import ChartComponent from '../components/chart';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import Navbar from '../components/navbar'; // Importa Navbar

const Main = () => {
    const [data, setData] = useState({});
    const [error, setError] = useState(false);
    const [selectedAction, setSelectedAction] = useState(null);
    const [loadingDetails, setLoadingDetails] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        if (Object.keys(data).length === 0) {
            axios.get(`${process.env.REACT_APP_BACKEND_URL}/predict`)
                .then(response => {
                    setData(response.data);
                    setLoading(false);
                })
                .catch(() => {
                    setError(true);
                    setLoading(false);
                });
        }
    }, [data]);

    const getRecommendation = (percentVariation) => {
        if (percentVariation > 5) return "Comprar";
        if (percentVariation < -5) return "Vender";
        return "Hold";
    };

    const handleActionClick = (action) => {
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
    };

    const handleBackToTable = () => {
        setSelectedAction(null);
    };

    return (
        <div className="app-container">
            <Navbar /> {/* Navbar incluido aquí */}

            <div className="top-actions-container">
                <ul className="top-actions-list">
                    {top100Actions.map((action, index) => (
                        <li
                            key={index}
                            className="top-action-item"
                            onClick={() => handleActionClick(action)}
                            style={{
                                cursor: 'pointer',
                                textDecoration: selectedAction?.name === action ? 'underline' : 'none',
                                fontWeight: selectedAction?.name === action ? 'bold' : 'normal'
                            }}
                        >
                            {action}
                        </li>
                    ))}
                </ul>
            </div>

            {selectedAction ? (
                <div className="selected-action-details">
                    <p onClick={handleBackToTable} className="back-button">
                        <FontAwesomeIcon icon={faArrowLeft} style={{ marginRight: '6px', color: '#333' }} />
                        Volver a la tabla
                    </p>

                    {loadingDetails ? (
                        <LoadingLogo loading={true} logoSrc={null} />
                    ) : (
                        <>
                            <div className='chart-big-container'>
                                <div className='chart-container-info'>
                                    <p className='DataCotizaciones'><strong>Datos de cotizaciones - {selectedAction.name}, {selectedAction.longName}</strong></p>
                                    <div className='data-cotizaciones-container'>
                                        <div className='data-cotizaciones-first'>
                                            <p>Precio Actual: <strong>${selectedAction.current_price?.toFixed(2) || "No disponible"}</strong></p>
                                            <p>Predicción: <strong>${selectedAction.prediction?.toFixed(2) || "No disponible"}</strong></p>
                                            <p>52-Week High: <strong>${selectedAction.high_52_week?.toFixed(2) || "No disponible"}</strong></p>
                                            <p>Recomendación: <strong>{getRecommendation(selectedAction.percent_variation)}</strong></p>
                                        </div>
                                        <div className='data-cotizaciones-second'>
                                        <p>Última Fecha: <strong>{selectedAction.last_updated || "No disponible"}</strong></p>
                                        <p>% Variación: <strong>{selectedAction.percent_variation?.toFixed(2) || "No disponible"}%</strong></p>
                                            <p>52-Week Low: <strong>${selectedAction.low_52_week || "No disponible"}</strong></p>
                                            <p>&nbsp;</p>
                                        </div>
                                    </div>
                                </div>
                                <div className='chart-container'>
                                    <ChartComponent selectedAction={selectedAction} />
                                </div>
                            </div>
                        </>
                    )}
                </div>
            ) : (
                <DataTable
                    data={data}
                    selectedAction={selectedAction}
                    handleActionClick={handleActionClick}
                    getRecommendation={getRecommendation}
                />
            )}
        </div>
    );
};

export default Main;
