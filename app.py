from flask import Flask, jsonify
from flask_cors import CORS
import yfinance as yf
from prophet import Prophet
import pandas as pd

app = Flask(__name__)
CORS(app)

# Cache para almacenar resultados
results_cache = {}

@app.route('/', methods=['GET'])
def home():
    return "Welcome to Cotizaciones App API"


def fetch_market_info(ticker):
    """Obtiene información del mercado para un ticker dado."""
    market_info = yf.Ticker(ticker).info
    last_updated = yf.Ticker(ticker).history(period='1d').index[-1].strftime('%d-%m-%Y')  # Última fecha disponible

    return {
        "longName": market_info.get("longName"),
        "market_cap": market_info.get("marketCap"),
        "earnings_per_share": market_info.get("trailingEps"),
        "revenue": market_info.get("totalRevenue"),
        "high_52_week": market_info.get("fiftyTwoWeekHigh"),
        "low_52_week": market_info.get("fiftyTwoWeekLow"),
        "last_updated": last_updated  # Agregando la última fecha
    }

def predict_price(ticker, start_date="2024-01-01"):
    """Genera una predicción de precios usando Prophet con configuración mejorada."""
    try:
        data = yf.download(ticker, start=start_date, end=(pd.to_datetime('today') + pd.Timedelta(days=1)).strftime('%Y-%m-%d'))
        if data.empty:
            return None, None, None

        # Usando solo la columna de precios de cierre
        df = data[['Close']].reset_index()
        df.columns = ['ds', 'y']

        # Ajustar Prophet con mejores configuraciones
        model = Prophet(yearly_seasonality=True, daily_seasonality=True, weekly_seasonality=True)
        model.fit(df)

        future = model.make_future_dataframe(periods=1)
        forecast = model.predict(future)

        current_price = float(data['Close'].iloc[-1])
        prediction = float(forecast['yhat'].iloc[-1])
        percent_variation = round(((prediction - current_price) / current_price) * 100, 2)

        return current_price, prediction, percent_variation
    except KeyError as e:
        return None, None, f"KeyError: {str(e)}"
    except Exception as e:
        return None, None, f"Unexpected error: {str(e)}"

@app.route('/predict', methods=['GET'])
def predict():
    tickers = ["AAPL", "MSFT", "GOOGL", "AMZN", "META", "TSLA", "NFLX", "NVDA", "INTC", "ORCL",
               "BABA", "PYPL", "UBER", "DIS", "V"]

    predictions = []
    for ticker in tickers:
        if ticker in results_cache:
            predictions.append(results_cache[ticker])
            continue

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
        predictions.append(result)

    return jsonify(predictions)

@app.route('/search/<ticker>', methods=['GET'])
def search(ticker):
    if ticker in results_cache:
        return jsonify(results_cache[ticker])

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
    return jsonify(result)

@app.route('/last5days/<ticker>', methods=['GET'])
def last5days(ticker):
    try:
        data = yf.download(ticker, period='1mo', interval='1d')

        if data.empty:
            return {"prices": [], "dates": []}

        prices = data['Close'].values.tolist()
        dates = data.index.strftime('%d-%m').tolist()

        if not isinstance(prices, list) or not isinstance(dates, list):
            return {"error": "Datos incompletos para 'prices' o 'dates'"}

        return {"prices": prices, "dates": dates}

    except Exception as e:
        return {"error": str(e)}

if __name__ == '__main__':
    app.run(debug=True)
