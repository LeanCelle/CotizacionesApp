import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSort } from '@fortawesome/free-solid-svg-icons';
import LoadingLogo from './loading_logo';
import TableRow from './table_row';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../data/firebase';

const DataTable = ({ data, selectedAction, handleActionClick, getRecommendation }) => {
    const [loading, setLoading] = useState(false);
    const [sortOrder, setSortOrder] = useState('desc');
    const [sortColumn, setSortColumn] = useState('percent_variation');
    const [sortedData, setSortedData] = useState([]);
    const [chartData, setChartData] = useState(null);
    const [user, setUser] = useState(null);

    const filteredData = Object.entries(data).map(([ticker, info]) => ({ name: ticker, ...info }));

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
          setUser(currentUser);
        });
    
        return () => unsubscribe();
      }, []);

    useEffect(() => {
        if (Object.keys(data).length === 0) {
            setLoading(true);
        } else {
            setLoading(false);
            sortData(sortColumn, sortOrder);
        }
    }, [data, sortOrder, sortColumn]);

    const sortData = (column, order) => {
        const sorted = [...filteredData].sort((a, b) => {
            let valueA = a[column] || '';
            let valueB = b[column] || '';

            if (column === 'name') {
                valueA = valueA.toUpperCase();
                valueB = valueB.toUpperCase();
                return order === 'asc' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
            } else if (column === 'percent_variation') {
                valueA = parseFloat(valueA) || 0;
                valueB = parseFloat(valueB) || 0;
                return order === 'asc' ? valueA - valueB : valueB - valueA;
            }
            return 0;
        });
        setSortedData(sorted);
    };

    const toggleSortOrder = (column) => {
        if (sortColumn === column) {
            setSortOrder((prevOrder) => (prevOrder === 'asc' ? 'desc' : 'asc'));
        } else {
            setSortColumn(column);
            setSortOrder('asc');
        }
    };

    return (
        <div className="data-table">
            {loading ? (
                <LoadingLogo loading={true} logoSrc={null} />
            ) : (
                <>
                    <div className="data-table-actions">
                        <div className='data-tabla-actions-into'>
                            <p>Acción</p>
                            <FontAwesomeIcon
                                icon={faSort}
                                style={{ marginLeft: '8px', cursor: 'pointer' }}
                                title="Ordenar por Acción"
                                onClick={() => toggleSortOrder('name')}
                            />
                        </div>
                        <div className='data-tabla-actions-into d'>
                            <p>Nombre</p>
                            <FontAwesomeIcon
                                icon={faSort}
                                style={{ marginLeft: '8px', cursor: 'pointer' }}
                                title="Ordenar por Nombre"
                                onClick={() => toggleSortOrder('name')}
                            />
                        </div>
                        <div className='data-tabla-actions-into'><p>Precio Actual</p></div>
                        <div className='data-tabla-actions-into'><p>$ Predicción</p></div>
                        <div className='data-tabla-actions-into'>
                            <p>% Predicción</p>
                            {user && (
                                <FontAwesomeIcon
                                    className='d'
                                    icon={faSort}
                                    style={{ marginLeft: '8px', cursor: 'pointer' }}
                                    title="Ordenar por % Predicción"
                                    onClick={() => toggleSortOrder('percent_variation')}
                                />
                            )
                            }
                        </div>
                        <div className='data-tabla-actions-into d'><p>Recomendación</p></div>
                        <div className='data-tabla-actions-into d'><p>52-Week High</p></div>
                        <div className='data-tabla-actions-into d'><p>52-Week Low</p></div>
                        <div className='data-tabla-actions-into d'><p>Última Fecha</p></div>
                    </div>
                    {sortedData.map((info, index) => (
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
