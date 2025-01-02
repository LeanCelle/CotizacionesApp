import React from 'react';
import LoadingLogo from './loading_logo';
import TableRow from './table_row';

const DataTable = ({ data, selectedAction, handleActionClick, getRecommendation }) => {
    const [loading, setLoading] = React.useState(false);

    const filteredData = Object.entries(data).map(([ticker, info]) => ({ name: ticker, ...info }));

    React.useEffect(() => {
        if (Object.keys(data).length === 0) {
            setLoading(true);
        } else {
            setLoading(false);
        }
    }, [data]);

    return (
        <div className="data-table">
            {loading ? (
                <LoadingLogo loading={true} logoSrc={null} />
            ) : (
                <>
                    <div className="data-table-actions">
                        <div className='data-tabla-actions-into'><p>Acción</p></div>
                        <div className='data-tabla-actions-into'><p>Precio Actual</p></div>
                        <div className='data-tabla-actions-into'><p>Predicción</p></div>
                        <div className='data-tabla-actions-into'><p>% Variación</p></div>
                        <div className='data-tabla-actions-into'><p>Recomendación</p></div>
                        <div className='data-tabla-actions-into'><p>52-Week High</p></div>
                        <div className='data-tabla-actions-into'><p>52-Week Low</p></div>
                        <div className='data-tabla-actions-into'><p>Última Fecha</p></div>
                    </div>
                    {filteredData.map((info, index) => (
                        <TableRow
                            key={index}
                            data={info}
                            selectedAction={selectedAction}
                            handleActionClick={handleActionClick}
                            getRecommendation={getRecommendation}
                        />
                    ))}
                </>
            )}
        </div>
    );
};

export default DataTable;
