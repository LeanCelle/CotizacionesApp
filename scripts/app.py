from flask import Flask, jsonify
from flask_cors import CORS
from prophet import Prophet
import yfinance as yf
import pandas as pd

app = Flask(__name__)
CORS(app)

@app.route('/predict', methods=['GET'])
def predict():
    # Lista de las 10 acciones más importantes
    tickers = ["AAPL", "MSFT", "GOOGL", "AMZN", "META", "TSLA", "NFLX", "NVDA", "INTC", "ORCL"]
    results = {}

    for ticker in tickers:
        try:
            # Descargar datos históricos (último año)
            data = yf.download(ticker, start="2023-01-01", end="2024-12-29")
            if data.empty:
                results[ticker] = {"current_price": None, "prediction": None}
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

            # Obtener precio actual y predicción para el próximo día
            current_price = data['Close'].iloc[-1]
            prediction = forecast['yhat'].iloc[-1]

            # Almacenar resultados
            results[ticker] = {
                "current_price": float(current_price),
                "prediction": float(prediction),
            }
        except Exception as e:
            print(f"Error procesando {ticker}: {e}")
            results[ticker] = {"current_price": None, "prediction": None}

    return jsonify(results)

if __name__ == '__main__':
    app.run(debug=True)
