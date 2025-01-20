from flask import Flask, jsonify
from flask_cors import CORS
from apscheduler.schedulers.background import BackgroundScheduler
import yfinance as yf
from prophet import Prophet
import pandas as pd
import threading

app = Flask(__name__)
CORS(app)

results_cache = {}
cache_ready = False

DEFAULT_TICKERS = ["AAPL", "MSFT", "GOOGL", "AMZN", "META", "TSLA", "NVDA", "BRK-A", "AVGO", "DIS", "V", "LLY", "WMT", "JPM", "MA", "XOM"]


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


def initialize_cache():
    """Llena el caché con datos iniciales para los tickers predeterminados."""
    global cache_ready
    for ticker in DEFAULT_TICKERS:
        try:
            market_info = fetch_market_info(ticker)
            current_price, prediction, percent_variation = predict_price(ticker)

            results_cache[ticker] = {
                "name": ticker,
                "current_price": current_price,
                "prediction": prediction,
                "percent_variation": percent_variation,
                **market_info
            }
            print(f"Datos iniciales cargados para: {ticker}")
        except Exception as e:
            print(f"Error cargando datos para {ticker}: {e}")

    cache_ready = True
    print("Caché inicial completo")


def update_cache():
    """Actualiza el caché con datos recientes para los tickers."""
    global cache_ready
    if not cache_ready:
        return

    tickers = list(results_cache.keys())
    for ticker in tickers:
        try:
            market_info = fetch_market_info(ticker)
            current_price, prediction, percent_variation = predict_price(ticker)

            results_cache[ticker] = {
                "name": ticker,
                "current_price": current_price,
                "prediction": prediction,
                "percent_variation": percent_variation,
                **market_info
            }
            print(f"Caché actualizado para: {ticker}")
        except Exception as e:
            print(f"Error actualizando {ticker}: {e}")


@app.route('/predict', methods=['GET'])
def predict():
    if not cache_ready:
        return jsonify({"message": "Cache is still loading. Please try again later."}), 503

    return jsonify(list(results_cache.values()))


@app.route('/search/<query>', methods=['GET'])
def search(query):
    for key, result in results_cache.items():
        if query.lower() in [result["name"].lower(), result["longName"].lower()]:
            return jsonify(result)

    try:
        market_info = fetch_market_info(query)
        current_price, prediction, percent_variation = predict_price(query)

        result = {
            "name": query,
            "current_price": current_price,
            "prediction": prediction,
            "percent_variation": percent_variation,
            **market_info
        }

        results_cache[query] = result
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 404


@app.route('/last5days/<ticker>', methods=['GET'])
def last5days(ticker):
    if not cache_ready:
        return jsonify({"message": "Cache is still loading. Please try again later."}), 503

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


scheduler = BackgroundScheduler()
scheduler.add_job(initialize_cache, 'date')
scheduler.add_job(update_cache, 'interval', minutes=60)
scheduler.start()

if __name__ == '__main__':

    threading.Thread(target=initialize_cache).start()

    try:
        app.run(debug=True)
    except (KeyboardInterrupt, SystemExit):
        scheduler.shutdown()
