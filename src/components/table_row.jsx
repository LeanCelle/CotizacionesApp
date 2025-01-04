import React from 'react';

const TableRow = ({ data, selectedAction, handleActionClick, getRecommendation }) => {
    return (
        <div
            className='data'
            onClick={() => handleActionClick(data.name)}
            style={{
                cursor: 'pointer',
                backgroundColor: selectedAction?.name === data.name ? '#f0f8ff' : 'transparent',
            }}
        >
            <div className='data-into'><p>{data.name || "No disponible"}</p></div>
            <div className='data-into'><p>{data.longName || "No disponible"}</p></div>
            <div className='data-into'>
                <p>
                    {typeof data.current_price === "number"
                        ? `$${data.current_price.toFixed(2)}`
                        : "No disponible"}
                </p>
            </div>
            <div className='data-into'>
                <p>
                    {typeof data.prediction === "number"
                        ? `$${data.prediction.toFixed(2)}`
                        : "No disponible"}
                </p>
            </div>
            <div
                className='data-into'
                style={{
                    color: data.percent_variation > 0
                        ? 'green'
                        : data.percent_variation < 0
                        ? 'red'
                        : 'black',
                }}
            >
                <p>
                    {typeof data.percent_variation === "number"
                        ? `${data.percent_variation.toFixed(2)}%`
                        : "No disponible"}
                </p>
            </div>
            <div className='data-into'>
                <p>
                    {typeof data.percent_variation === "number"
                        ? getRecommendation(data.percent_variation)
                        : "No disponible"}
                </p>
            </div>
            <div className='data-into'>
                <p>
                    {typeof data.high_52_week === "number"
                        ? `$${data.high_52_week}`
                        : "No disponible"}
                </p>
            </div>
            <div className='data-into'>
                <p>
                    {typeof data.low_52_week === "number"
                        ? `$${data.low_52_week}`
                        : "No disponible"}
                </p>
            </div>
            <div className='data-into'><p>{data.last_updated || "No disponible"}</p></div>
        </div>
    );
};

export default TableRow;
