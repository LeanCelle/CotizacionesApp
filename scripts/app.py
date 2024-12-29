from flask import Flask, jsonify
from flask_cors import CORS
from prophet import Prophet
import yfinance as yf
import pandas as pd

app = Flask(__name__)
CORS(app)

@app.route('/predict', methods=['GET'])
def predict():
    tickers = ["AAPL", "MSFT", "GOOGL", "AMZN", "META", "TSLA", "NFLX", "NVDA", "INTC", "ORCL",
               "BABA", "PYPL", "UBER", "DIS", "V"]

    results = {}

    for ticker in tickers:
        try:
            # Descargar datos históricos (último año)
            data = yf.download(ticker, start="2024-01-01", end=pd.to_datetime('today').strftime('%Y-%m-%d'))
            if data.empty:
                results[ticker] = {
                    "current_price": None,
                    "prediction": None,
                    "last_date": None,
                    "volume": None,
                    "percent_variation": None,
                    "market_cap": None,
                    "earnings_per_share": None,
                    "revenue": None,
                    "high_52_week": None,
                    "low_52_week": None
                }
                continue

            # Crear DataFrame para Prophet
            df = data[['Close']].reset_index()
            df.columns = ['ds', 'y']  # Prophet requiere columnas 'ds' (fecha) y 'y' (valor)

            # Entrenar modelo Prophet
            model = Prophet()
            model.fit(df)

            # Crear un DataFrame para los próximos días
            future = model.make_future_dataframe(periods=1)
            forecast = model.predict(future)

            # Obtener precio actual, predicción y volumen
            current_price = float(data['Close'].iloc[-1])  # Convertir a float explícitamente
            prediction = float(forecast['yhat'].iloc[-1])  # Convertir a float explícitamente
            volume = int(data['Volume'].iloc[-1])  # Convertir a entero explícitamente

            # Calcular la variación porcentual
            percent_variation = round(((prediction - current_price) / current_price) * 100, 2)

            # Obtener métricas adicionales
            market_info = yf.Ticker(ticker).info
            market_cap = market_info.get("marketCap", None)
            earnings_per_share = market_info.get("trailingEps", None)
            revenue = market_info.get("totalRevenue", None)
            high_52_week = market_info.get("fiftyTwoWeekHigh", None)
            low_52_week = market_info.get("fiftyTwoWeekLow", None)

            last_date = data.index[-1]
            results[ticker] = {
                "current_price": current_price,
                "prediction": prediction,
                "last_date": last_date.strftime('%Y-%m-%d %H:%M:%S'),
                "volume": volume,
                "percent_variation": percent_variation,
                "market_cap": market_cap,
                "earnings_per_share": earnings_per_share,
                "revenue": revenue,
                "high_52_week": high_52_week,
                "low_52_week": low_52_week
            }
        except Exception as e:
            print(f"Error procesando {ticker}: {e}")
            results[ticker] = {
                "current_price": None,
                "prediction": None,
                "last_date": None,
                "volume": None,
                "percent_variation": None,
                "market_cap": None,
                "earnings_per_share": None,
                "revenue": None,
                "high_52_week": None,
                "low_52_week": None
            }

    return jsonify(results)

if __name__ == '__main__':
    app.run(debug=True)
