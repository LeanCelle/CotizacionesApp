import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import DataTable from '../components/data_table';
import LoadingLogo from '../components/loading_logo';

const Main = ({ getRecommendation }) => {
    const [data, setData] = useState([]);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        setLoading(true);
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/predict`)
            .then(response => {
                setData(response.data);
                setLoading(false);
            })
            .catch(() => {
                setError(true);
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
                <div style={{height:'74vh'}}>
                    <p style={{textAlign:"center"}}>Error al cargar los datos.</p>
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
