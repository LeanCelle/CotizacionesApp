import React from "react";

const Maintenance = () => {
  return (
    <div className="maintenance-container">
      <h1 className="maintenance-title">Nos encontramos en mantenimiento</h1>
      <p className="maintenance-text">
        Estamos trabajando para mejorar tu experiencia. <br />
        Volveremos pronto.
      </p>
      <div className="maintenance-spinner"></div>
    </div>
  );
};

export default Maintenance;
