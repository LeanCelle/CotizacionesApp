import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import DataTable from '../components/data_table';
import LoadingLogo from '../components/loading_logo';

const Main = ({ getRecommendation }) => {
    const [data, setData] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        setLoading(true);
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/predict`)
            .then(response => {
                if (Array.isArray(response.data)) {
                    setData(response.data);
                } else {
                    throw new Error("Formato de datos inválido.");
                }
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error al obtener los datos:", error);
                setError("No se pudieron cargar los datos. Intenta nuevamente más tarde.");
                setLoading(false);
            });
    }, []);

    const handleActionClick = (action) => {
        navigate(`/action/${action}`);
    };

    return (
        <div className="app-container">
            {loading ? (
                <LoadingLogo loading={true} logoSrc={null} />
            ) : error ? (
                <div style={{ height: '74vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <p style={{ color: 'red', fontSize: '1.2rem', textAlign: 'center' }}>
                        {error}
                    </p>
                </div>
            ) : data.length === 0 ? (
                <div style={{ height: '74vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <p style={{ fontSize: '1.2rem', textAlign: 'center' }}>
                        No hay datos disponibles para mostrar.
                    </p>
                </div>
            ) : (
                <DataTable
                    data={data}
                    handleActionClick={handleActionClick}
                    getRecommendation={getRecommendation}
                />
            )}
        </div>
    );
};

export default Main;
