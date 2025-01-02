import yfinance as yf
from flask import Flask, jsonify
from flask_cors import CORS
from prophet import Prophet
import pandas as pd
from datetime import datetime

app = Flask(__name__)
CORS(app)

# Cache para almacenar resultados
results_cache = {}

@app.route('/predict', methods=['GET'])
def predict():
    tickers = ["AAPL", "MSFT", "GOOGL", "AMZN", "META", "TSLA", "NFLX", "NVDA", "INTC", "ORCL",
               "BABA", "PYPL", "UBER", "DIS", "V"]

    predictions = []
    for ticker in tickers:
        if ticker in results_cache:
            predictions.append(results_cache[ticker])
            continue

        try:
            market_info = yf.Ticker(ticker).info
            ticker_name = market_info.get("Symbol", ticker)  # Si no existe shortName, utiliza el ticker como nombre.

            data = yf.download(ticker, start="2024-01-01", end=(pd.to_datetime('today') + pd.Timedelta(days=1)).strftime('%Y-%m-%d'))
            if data.empty:
                predictions.append({
                    "name": ticker_name,
                    "current_price": None,
                    "prediction": None,
                    "last_date": None,
                    "percent_variation": None,
                    "market_cap": None,
                    "earnings_per_share": None,
                    "revenue": None,
                    "high_52_week": None,
                    "low_52_week": None
                })
                continue

            df = data[['Close']].reset_index()
            df.columns = ['ds', 'y']

            model = Prophet()
            model.fit(df)

            future = model.make_future_dataframe(periods=1)
            forecast = model.predict(future)

            last_date = data.index[-1]
            current_price = float(data['Close'].iloc[-1])
            prediction = float(forecast['yhat'].iloc[-1])
            percent_variation = round(((prediction - current_price) / current_price) * 100, 2)

            market_cap = market_info.get("marketCap", None)
            earnings_per_share = market_info.get("trailingEps", None)
            revenue = market_info.get("totalRevenue", None)
            high_52_week = market_info.get("fiftyTwoWeekHigh", None)
            low_52_week = market_info.get("fiftyTwoWeekLow", None)

            result = {
                "name": ticker_name,
                "current_price": current_price,
                "prediction": prediction,
                "last_date": last_date.strftime('%Y-%m-%d'),
                "percent_variation": percent_variation,
                "market_cap": market_cap,
                "earnings_per_share": earnings_per_share,
                "revenue": revenue,
                "high_52_week": high_52_week,
                "low_52_week": low_52_week
            }

            results_cache[ticker] = result
            predictions.append(result)

        except Exception as e:
            predictions.append({
                "name": ticker_name,
                "current_price": None,
                "prediction": None,
                "last_date": None,
                "percent_variation": None,
                "market_cap": None,
                "earnings_per_share": None,
                "revenue": None,
                "high_52_week": None,
                "low_52_week": None
            })

    return jsonify(predictions)

@app.route('/search/<ticker>', methods=['GET'])
def search(ticker):
    if ticker in results_cache:
        return jsonify(results_cache[ticker])

    try:
        market_info = yf.Ticker(ticker).info
        ticker_name = market_info.get("Symbol", ticker)  # Si no existe shortName, utiliza el ticker como nombre.

        data = yf.download(ticker, start="2024-01-01", end=(pd.to_datetime('today') + pd.Timedelta(days=1)).strftime('%Y-%m-%d'))
        if data.empty:
            return jsonify({
                "name": ticker_name,
                "current_price": None,
                "prediction": None,
                "last_date": None,
                "percent_variation": None,
                "market_cap": None,
                "earnings_per_share": None,
                "revenue": None,
                "high_52_week": None,
                "low_52_week": None
            })

        df = data[['Close']].reset_index()
        df.columns = ['ds', 'y']

        model = Prophet()
        model.fit(df)

        future = model.make_future_dataframe(periods=1)
        forecast = model.predict(future)

        last_date = data.index[-1]
        current_price = float(data['Close'].iloc[-1])
        prediction = float(forecast['yhat'].iloc[-1])
        percent_variation = round(((prediction - current_price) / current_price) * 100, 2)

        market_cap = market_info.get("marketCap", None)
        earnings_per_share = market_info.get("trailingEps", None)
        revenue = market_info.get("totalRevenue", None)
        high_52_week = market_info.get("fiftyTwoWeekHigh", None)
        low_52_week = market_info.get("fiftyTwoWeekLow", None)

        result = {
            "name": ticker_name,
            "current_price": current_price,
            "prediction": prediction,
            "last_date": last_date.strftime('%Y-%m-%d'),
            "percent_variation": percent_variation,
            "market_cap": market_cap,
            "earnings_per_share": earnings_per_share,
            "revenue": revenue,
            "high_52_week": high_52_week,
            "low_52_week": low_52_week
        }

        results_cache[ticker] = result
        return jsonify(result)

    except Exception as e:
        return jsonify({
            "name": ticker,
            "current_price": None,
            "prediction": None,
            "last_date": None,
            "percent_variation": None,
            "market_cap": None,
            "earnings_per_share": None,
            "revenue": None,
            "high_52_week": None,
            "low_52_week": None
        })

if __name__ == '__main__':
    app.run(debug=True)
