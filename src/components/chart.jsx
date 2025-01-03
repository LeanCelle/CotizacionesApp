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

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const ChartComponent = ({ selectedAction }) => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    if (selectedAction) {
      const ticker = selectedAction.name.trim();
      if (!ticker || typeof ticker !== 'string') {
        console.error("Ticker inválido");
        return;
      }

      axios
        .get(`http://127.0.0.1:5000/last5days/${ticker}`)
        .then((response) => {
          console.log("Datos recibidos de la API:", response.data); // Agregar console.log aquí

          const { prices, dates } = response.data;
          if (Array.isArray(prices) && Array.isArray(dates)) {
            const formattedPrices = prices.map((price, index) => ({
              x: dates[index],
              y: price
            }));

            setChartData({
              labels: dates,
              datasets: [
                {
                  label: `Variación de ${ticker}`,
                  data: formattedPrices,
                  fill: true,
                  backgroundColor: 'rgba(75, 192, 192, 0.2)',
                  borderColor: 'rgba(75, 192, 192, 1)',
                  borderWidth: 1,
                  fill: 'origin',

                },
              ],
            });
          } else {
            console.error("Datos inválidos: Los campos 'prices' o 'dates' no son arrays.");
          }
        })
        .catch((error) => {
          console.error("Error fetching chart data:", error);
        });
    }
  }, [selectedAction]);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: `Variación de ${selectedAction?.name} en el último mes`,
      },
    },
  };

  return (
    <div className="chart-container" style={{ width: '100%', margin: 'auto', textAlign:'center' }}>
      {chartData ? (
        <Line data={chartData} options={options} />
      ) : (
        <LoadingLogo loading={true} logoSrc={null}/>
      )}
    </div>
  );
};

export default ChartComponent;
