import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { top100Actions } from '../data/List100';
import DataTable from '../components/data_table';
import LoadingLogo from '../components/loading_logo';
import ChartComponent from '../components/chart';

const Main = () => {
    const [data, setData] = useState({});
    const [error, setError] = useState(false);
    const [selectedAction, setSelectedAction] = useState(null);
    const [loadingDetails, setLoadingDetails] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        if (Object.keys(data).length === 0) {
            axios.get(`http://127.0.0.1:5000/predict`)
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
        axios.get(`http://127.0.0.1:5000/search/${action}`)
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
            <div className='title-container'>
                <h1 className="title">Precios Actuales y Predicciones</h1>
            </div>

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
                    <button onClick={handleBackToTable} className="back-button">
                        Volver a la tabla
                    </button>
                    {loadingDetails ? (
                        <LoadingLogo loading={true} logoSrc={null} />
                    ) : (
                        <>
                        <div className='chart-big-container'>
                            <div className='chart-container-info'>
                                <h2>{selectedAction.name} - {selectedAction.longName}</h2>
                                <p><strong>Precio Actual:</strong> ${selectedAction.current_price?.toFixed(2) || "No disponible"}</p>
                                <p><strong>Predicción:</strong> ${selectedAction.prediction?.toFixed(2) || "No disponible"}</p>
                                <p><strong>% Variación:</strong> {selectedAction.percent_variation?.toFixed(2) || "No disponible"}%</p>
                                <p><strong>Recomendación:</strong> {getRecommendation(selectedAction.percent_variation)}</p>
                                <p><strong>52-Week High:</strong> ${selectedAction.high_52_week?.toFixed(2) || "No disponible"}</p>
                                <p><strong>52-Week Low:</strong> ${selectedAction.low_52_week || "No disponible"}</p>
                                <p><strong>Última Fecha:</strong> {selectedAction.last_updated || "No disponible"}</p>
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
