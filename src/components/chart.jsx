import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import 'chartjs-plugin-annotation';
import LoadingLogo from './loading_logo';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../data/firebase';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const ChartComponent = ({ selectedAction }) => {
  const [chartData, setChartData] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (selectedAction) {
      const ticker = selectedAction.name.trim();
      if (!ticker || typeof ticker !== 'string') {
        console.error('Ticker inválido');
        return;
      }

      axios
        .get(`${process.env.REACT_APP_BACKEND_URL}/last5days/${ticker}`)
        .then((response) => {
          const { prices, dates, nextDayPrediction } = response.data;
          if (Array.isArray(prices) && Array.isArray(dates)) {
            const formattedPrices = prices.map((price, index) => ({
              x: dates[index],
              y: price,
            }));

            const extendedDates = [...dates];
            let extendedPrices = [...formattedPrices];

            if (user) { // Solo agregar la predicción si el usuario está autenticado
              extendedDates.push('Predicción');
              extendedPrices.push({ x: 'Predicción', y: nextDayPrediction });
            }

            setChartData({
              labels: extendedDates,
              datasets: [
                {
                  label: `Variación de ${ticker}`,
                  data: formattedPrices,
                  fill: true,
                  backgroundColor: '#05357c68',
                  borderColor: '#05347c',
                  borderWidth: 1,
                  fill: 'origin',
                  pointBorderWidth: 0,
                  pointBackgroundColor: 'rgba(217, 7, 7, 0)',
                },
                ...(user
                  ? [
                      {
                        label: 'Predicción',
                        data: extendedPrices,
                        borderColor: '#FF4500',
                        borderDash: [5, 5],
                        borderWidth: 2,
                        pointBackgroundColor: '#FF4500',
                        pointBorderColor: '#FF4500',
                        borderWidth: 1,
                        pointStyle: 'rectRot',
                        pointBorderWidth: 0,
                        pointBackgroundColor: 'rgba(217, 7, 7, 0)',
                      },
                    ]
                  : []),
              ],
            });
          } else {
            console.error('Datos inválidos');
          }
        })
        .catch((error) => {
          console.error('Error fetching chart data:', error);
        });
    }
  }, [selectedAction, user]);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: `Variación de ${selectedAction?.name} en los últimos 3 meses`,
      },
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: 'Fecha',
        },
      },
      y: {
        display: true,
        title: {
          display: true,
          text: 'Precio',
        },
      },
    },
  };

  return (
    <div className="chart">
      {chartData ? (
        <Line data={chartData} options={options} />
      ) : (
        <LoadingLogo loading={true} logoSrc={null} />
      )}
    </div>
  );
};

export default ChartComponent;
