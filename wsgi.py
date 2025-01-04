import os
from app import app  # Ajusta esta línea si tu aplicación está en otro archivo

os.environ.setdefault("FLASK_APP", "app")
os.environ.setdefault("FLASK_ENV", "production")

if __name__ == "__main__":
    app.run()
