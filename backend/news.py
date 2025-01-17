import requests
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://cotizaciones-app.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

API_URL = "https://newsapi.org/v2/everything"
API_KEY = "1f4082a069ca452ba1daa5cf0336c12b"

@app.get("/")
def read_root():
    return {"message": "Bienvenido a la API de noticias de acciones"}

@app.get("/news")
def get_stock_news():
    """
    Endpoint para obtener noticias de acciones con texto e imágenes,
    excluyendo las noticias de 'La Jornada' basándonos en la URL de la imagen,
    y eliminando noticias repetidas.
    """
    params = {
        "q": "Nasdaq",
        "language": "es",
        "sortBy": "publishedAt",
        "apiKey": API_KEY
    }

    response = requests.get(API_URL, params=params)
    if response.status_code != 200:
        return {"error": "No se pudieron obtener las noticias."}

    data = response.json()
    articles = data.get("articles", [])

    news = [
        {
            "title": article.get("title"),
            "description": article.get("description"),
            "image": article.get("urlToImage") if article.get("urlToImage") else None,
            "url": article.get("url")
        }
        for article in articles
        if article.get("urlToImage") and "www.jornada.com" not in article.get("urlToImage", "")
    ]

    news = [article for article in news if article['image'] is not None]

    # Eliminar noticias repetidas basándonos en el título
    seen_titles = set()
    unique_news = []
    for article in news:
        if article["title"] not in seen_titles:
            unique_news.append(article)
            seen_titles.add(article["title"])

    return {"news": unique_news}
