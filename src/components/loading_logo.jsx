import React, { useState, useEffect } from 'react';
import { FadeLoader } from 'react-spinners';

const LoadingLogo = ({ loading, logoSrc }) => {
    const [imageError, setImageError] = useState(false);

    useEffect(() => {
        if (logoSrc) {
            const img = new Image();
            img.src = logoSrc;
            img.onload = () => setImageError(false);
            img.onerror = () => setImageError(true);
        }
    }, [logoSrc]);

    return (
        <div className="loading-logo-container">
            {loading ? (
                <div className="loader-container" aria-live="assertive">
                    <FadeLoader color="#05347c" loading={loading} size={150} />
                    <p className="loading-text">
                        {imageError || !logoSrc ? (
                            'Cargando...'
                        ) : (
                            <img
                                src={logoSrc}
                                alt="Logo de la empresa"
                                onError={() => setImageError(true)}
                            />
                        )}
                    </p>
                </div>
            ) : null}
        </div>
    );
};

export default LoadingLogo;
