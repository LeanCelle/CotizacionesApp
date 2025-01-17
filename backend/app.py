from flask import Flask, jsonify
from flask_cors import CORS
import yfinance as yf
from prophet import Prophet
import pandas as pd
from apscheduler.schedulers.background import BackgroundScheduler
import time

app = Flask(__name__)
CORS(app)

# Cache para almacenar resultados
results_cache = {}
last_updated_time = {}

# Tickers a monitorear
tickers = ["AAPL", "MSFT", "GOOGL", "AMZN", "META", "TSLA", "NVDA", "BRK-A", "AVGO", "DIS", "V", "LLY", "WMT", "JPM", "MA", "XOM"]

@app.route('/', methods=['GET'])
def home():
    return "Welcome to Cotizaciones.App API"


def fetch_market_info(ticker):
    """Obtiene información relevante del mercado para un ticker dado."""
    market_info = yf.Ticker(ticker).info
    last_updated = yf.Ticker(ticker).history(period='1d').index[-1].strftime('%d-%m')

    return {
        "symbol": market_info.get("symbol"),
        "longName": market_info.get("longName"),
        "beta": market_info.get("beta"),
        "volume": market_info.get("volume"),
        "high_52_week": market_info.get("fiftyTwoWeekHigh"),
        "low_52_week": market_info.get("fiftyTwoWeekLow"),
        "earnings_per_share": market_info.get("trailingEps"),
        "sector": market_info.get("sector"),
        "industry": market_info.get("industry"),
        "last_updated": last_updated
    }


def predict_price(ticker, start_date="2024-01-01"):
    """Genera una predicción de precios usando Prophet con métricas relevantes."""
    try:
        data = yf.download(ticker, start=start_date, end=(pd.to_datetime('today') + pd.Timedelta(days=1)).strftime('%Y-%m-%d'))
        if data.empty:
            return None, None, None

        df = data[['Close']].reset_index()
        df.columns = ['ds', 'y']

        model = Prophet(yearly_seasonality=True, daily_seasonality=True, weekly_seasonality=True)
        model.fit(df)

        future = model.make_future_dataframe(periods=1)
        forecast = model.predict(future)

        current_price = float(data['Close'].iloc[-1])
        prediction = float(forecast['yhat'].iloc[-1])
        percent_variation = round(((prediction - current_price) / current_price) * 100, 2)

        return current_price, prediction, percent_variation
    except Exception as e:
        return None, None, f"Error: {str(e)}"


def update_cache():
    """Actualiza la información y las predicciones de todos los tickers en el cache."""
    global results_cache
    print(f"Actualizando cache: {time.strftime('%Y-%m-%d %H:%M:%S')}")
    for ticker in tickers:
        try:
            market_info = fetch_market_info(ticker)
            current_price, prediction, percent_variation = predict_price(ticker)

            result = {
                "name": ticker,
                "current_price": current_price,
                "prediction": prediction,
                "percent_variation": percent_variation,
                **market_info
            }

            results_cache[ticker] = result
            last_updated_time[ticker] = time.time()

        except Exception as e:
            print(f"Error actualizando {ticker}: {str(e)}")


@app.route('/predict', methods=['GET'])
def predict():
    """Devuelve predicciones almacenadas en el cache."""
    return jsonify(list(results_cache.values()))


@app.route('/search/<query>', methods=['GET'])
def search(query):
    """Busca información de un ticker específico en el cache."""
    for key, result in results_cache.items():
        if query.lower() in [result["name"].lower(), result["longName"].lower()]:
            return jsonify(result)

    return jsonify({"error": "Ticker not found in cache"}), 404


@app.route('/last5days/<ticker>', methods=['GET'])
def last5days(ticker):
    """Devuelve los precios de cierre de los últimos días."""
    try:
        data = yf.download(ticker, period='3mo', interval='1d')

        if data.empty:
            return {"prices": [], "dates": [], "nextDayPrediction": None}

        prices = data['Close'].values.tolist()
        dates = data.index.strftime('%d-%m').tolist()

        _, next_day_prediction, _ = predict_price(ticker)

        return {
            "prices": prices,
            "dates": dates,
            "nextDayPrediction": next_day_prediction
        }

    except Exception as e:
        return {"error": str(e)}


# Configuración del Scheduler
scheduler = BackgroundScheduler()
scheduler.add_job(func=update_cache, trigger="interval", minutes=5)  # Actualiza cada 5 minutos
scheduler.start()

# Actualización inicial del cache
update_cache()

if __name__ == '__main__':
    app.run(debug=True)
