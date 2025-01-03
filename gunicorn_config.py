bind = "0.0.0.0:8000"
workers = 3

try:
    from gunicorn.app.base import Application
except ImportError:
    # Manejar excepciones o seguir una ruta alternativa
    pass

application = "scripts.app:app"  # Ajustado para apuntar al archivo 'app.py' en la carpeta 'scripts'
