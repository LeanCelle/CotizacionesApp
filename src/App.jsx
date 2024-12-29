import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import { FadeLoader } from 'react-spinners';

const App = () => {
    const [data, setData] = useState({});
    const [error, setError] = useState(false);

    useEffect(() => {
        axios.get('http://127.0.0.1:5000/predict')
            .then(response => {
                setData(response.data);
                setError(false);
            })
            .catch(() => setError(true));
    }, []);

    const getRecommendation = (percentVariation) => {
        if (percentVariation > 5) return "Comprar";
        if (percentVariation < -5) return "Vender";
        return "Hold";
    };

    return (
        <div className="app-container">
            <div className='title-container'>
                <h1 className="title">Precios Actuales y Predicciones</h1>
            </div>
            <div className="table-container">
                {error ? (
                    <div className="error-container">
                        <p className="error-message">Error al cargar los datos. Por favor, inténtalo nuevamente más tarde.</p>
                    </div>
                ) : Object.keys(data).length > 0 ? (
                    <div className="data-table">
                        <div className="data-table-actions">
                            <div className='data-tabla-actions-into'><p>Acción</p></div>
                            <div className='data-tabla-actions-into'><p>Precio Actual</p></div>
                            <div className='data-tabla-actions-into'><p>Predicción</p></div>
                            <div className='data-tabla-actions-into'><p>% Variación</p></div>
                            <div className='data-tabla-actions-into'><p>Recomendación</p></div>
                            <div className='data-tabla-actions-into'><p>52-Week High</p></div>
                            <div className='data-tabla-actions-into'><p>52-Week Low</p></div>
                            <div className='data-tabla-actions-into'><p>Última Fecha y Hora</p></div>
                        </div>
                        {Object.entries(data).map(([ticker, info], index) => (
                            <div className='data' key={index}>
                                <div className='data-into'><p>{ticker}</p></div>
                                <div className='data-into'><p>{info.current_price !== null ? `$${info.current_price.toFixed(2)}` : "No disponible"}</p></div>
                                <div className='data-into'><p>{info.prediction !== null ? `$${info.prediction.toFixed(2)}` : "No disponible"}</p></div>
                                <div
                                    className='data-into'
                                    style={{
                                        color: info.percent_variation > 0
                                            ? 'green'
                                            : info.percent_variation < 0
                                            ? 'red'
                                            : 'black'
                                    }}
                                >
                                    <p>{info.percent_variation !== null ? `${info.percent_variation.toFixed(2)}%` : "No disponible"}</p>
                                </div>
                                <div className='data-into'>
                                    <p>{info.percent_variation !== null ? getRecommendation(info.percent_variation) : "No disponible"}</p>
                                </div>
                                <div className='data-into'><p>{info.high_52_week !== null ? `$${info.high_52_week}` : "No disponible"}</p></div>
                                <div className='data-into'><p>{info.low_52_week !== null ? `$${info.low_52_week}` : "No disponible"}</p></div>
                                <div className='data-into'><p>{info.last_date || "No disponible"}</p></div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="loader-container">
                        <FadeLoader color="rgba(255, 0, 0, 0.39)" loading={true} size={150} />
                        <p className="loading">Cargando datos...</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default App;
