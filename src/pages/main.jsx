import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import DataTable from '../components/data_table';
import Navbar from '../components/navbar';
import LoadingLogo from '../components/loading_logo';
import Footer from '../components/footer';

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

    const handleSearch = (query) => {
        if (query) {
            navigate(`/action/${query}`);
        } else {
            // Redirigir a la página principal o mostrar un mensaje de error
            navigate('/'); // Redirigir a la página principal
        }
    };

    return (
        <div className="app-container">
            <Navbar onSearch={handleSearch} />
            {loading ? (
                <LoadingLogo loading={true} logoSrc={null} />
            ) : error ? (
                <p style={{textAlign:"center"}}>Error al cargar los datos.</p>
            ) : (
                <DataTable
                    data={data}
                    handleActionClick={handleActionClick}
                    getRecommendation={getRecommendation}
                />
            )}
            <Footer/>
        </div>
    );
};

export default Main;
