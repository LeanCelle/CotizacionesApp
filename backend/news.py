import requests
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware  # Importar CORSMiddleware

app = FastAPI()

# Habilitar CORS para solicitudes desde tu frontend (localhost:3005)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Cambia a tu URL de frontend si es diferente
    allow_credentials=True,
    allow_methods=["*"],  # Permitir todos los métodos HTTP
    allow_headers=["*"],  # Permitir todos los encabezados
)

API_URL = "https://newsapi.org/v2/everything"
API_KEY = "1f4082a069ca452ba1daa5cf0336c12b"  # Usa tu clave de NewsAPI

@app.get("/news")
def get_stock_news():
    """
    Endpoint para obtener noticias de acciones con texto e imágenes.
    """
    params = {
        "q": "Nasdaq",  # Palabras clave para buscar
        "language": "es",  # Cambiar a "es" si quieres en español
        "sortBy": "publishedAt",
        "apiKey": API_KEY
    }

    response = requests.get(API_URL, params=params)
    if response.status_code != 200:
        return {"error": "No se pudieron obtener las noticias."}

    data = response.json()
    articles = data.get("articles", [])

    # Filtrar noticias que tienen imágenes válidas
    news = [
        {
            "title": article.get("title"),
            "description": article.get("description"),
            "image": article.get("urlToImage") if article.get("urlToImage") else None,
            "url": article.get("url")
        }
        for article in articles if article.get("urlToImage")  # Solo incluir artículos con imagen
    ]

    # Eliminar noticias que tengan imagen como None (es decir, si no hay imagen)
    news = [article for article in news if article['image'] is not None]

    return {"news": news}