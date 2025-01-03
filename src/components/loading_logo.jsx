import React from 'react';
import { FadeLoader } from 'react-spinners';

const LoadingLogo = ({ loading, logoSrc }) => {
    return (
        <div className="loading-logo-container">
            {loading ? (
                <div className="loader-container">
                    <FadeLoader color="#333" loading={true} size={150} />
                    <p className="loading-text">Cargando {logoSrc ? <img src={logoSrc} alt="Logo" /> : ''}</p>
                </div>
            ) : null}
        </div>
    );
};

export default LoadingLogo;
