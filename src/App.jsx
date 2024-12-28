import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
    const [data, setData] = useState({});

    useEffect(() => {
        axios.get('http://127.0.0.1:5000/predict')
            .then(response => {
                setData(response.data);
            })
            .catch(error => {
                console.error("Error fetching data:", error);
            });
    }, []);

    return (
        <div className="app-container">
            <h1 className="title">Precios Actuales y Predicciones</h1>
            <div className="table-container">
                {Object.keys(data).length > 0 ? (
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Acción</th>
                                <th>Precio Actual</th>
                                <th>Predicción</th>
                                <th>Última Fecha</th>
                                <th>Volumen</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.entries(data).map(([ticker, info], index) => (
                                <tr key={index}>
                                    <td>{ticker}</td>
                                    <td>{info.current_price !== null ? `$${info.current_price.toFixed(2)}` : "No disponible"}</td>
                                    <td>{info.prediction !== null ? `$${info.prediction.toFixed(2)}` : "No disponible"}</td>
                                    <td>{info.last_date || "No disponible"}</td>
                                    <td>{info.volume !== null ? info.volume : "No disponible"}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p className="loading">Cargando datos...</p>
                )}
            </div>
        </div>
    );
};

export default App;
