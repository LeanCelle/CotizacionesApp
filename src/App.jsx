import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
    const [data, setData] = useState({});

    useEffect(() => {
        axios.get('http://127.0.0.1:5000/predict')
            .then(response => setData(response.data))
            .catch(error => console.error("Error fetching data:", error));
    }, []);

    const getRecommendation = (percentVariation) => {
        if (percentVariation > 5) return "Comprar";
        if (percentVariation < -5) return "Vender";
        return "Hold";
    };

    return (
        <div className="app-container">
            <h1 className="title">Precios Actuales y Predicciones</h1>
            <div className="table-container">
                {Object.keys(data).length > 0 ? (
                    <div className="data-table">
                        <div className="data-table-actions">
                            <div className='data-tabla-actions-into'><p>Acción</p></div>
                            <div className='data-tabla-actions-into'><p>Precio Actual</p></div>
                            <div className='data-tabla-actions-into'><p>Predicción</p></div>
                            <div className='data-tabla-actions-into'><p>Última Fecha y Hora</p></div>
                            <div className='data-tabla-actions-into'><p>% Variación</p></div>
                            <div className='data-tabla-actions-into'><p>Recomendación</p></div>
                        </div>
                        {Object.entries(data).map(([ticker, info], index) => (
                            <div className='data' key={index}>
                                <div className='data-into'><p>{ticker}</p></div>
                                <div className='data-into'><p>{info.current_price !== null ? `$${info.current_price.toFixed(2)}` : "No disponible"}</p></div>
                                <div className='data-into'><p>{info.prediction !== null ? `$${info.prediction.toFixed(2)}` : "No disponible"}</p></div>
                                <div className='data-into'><p>{info.last_date || "No disponible"}</p></div>
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
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="loading">Cargando datos...</p>
                )}
            </div>
        </div>
    );
};

export default App;
