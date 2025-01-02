import React from 'react';

const TableRow = ({ data, selectedAction, handleActionClick, getRecommendation }) => {
    return (
        <div
            className='data'
            onClick={() => handleActionClick(data.name)}
            style={{ cursor: 'pointer', backgroundColor: selectedAction?.name === data.name ? '#f0f8ff' : 'transparent' }}
        >
            <div className='data-into'><p>{data.name}</p></div>
            <div className='data-into'><p>{data.current_price !== null ? `$${data.current_price.toFixed(2)}` : "No disponible"}</p></div>
            <div className='data-into'><p>{data.prediction !== null ? `$${data.prediction.toFixed(2)}` : "No disponible"}</p></div>
            <div
                className='data-into'
                style={{
                    color: data.percent_variation > 0
                        ? 'green'
                        : data.percent_variation < 0
                        ? 'red'
                        : 'black'
                }}
            >
                <p>{data.percent_variation !== null ? `${data.percent_variation.toFixed(2)}%` : "No disponible"}</p>
            </div>
            <div className='data-into'>
                <p>{data.percent_variation !== null ? getRecommendation(data.percent_variation) : "No disponible"}</p>
            </div>
            <div className='data-into'><p>{data.high_52_week !== null ? `$${data.high_52_week}` : "No disponible"}</p></div>
            <div className='data-into'><p>{data.low_52_week !== null ? `$${data.low_52_week}` : "No disponible"}</p></div>
            <div className='data-into'><p>{data.last_date || "No disponible"}</p></div>
        </div>
    );
};

export default TableRow;
