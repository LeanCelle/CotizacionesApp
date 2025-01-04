import os
from scripts.app import app  # Ajusta esta línea si tu aplicación está en otro archivo

os.environ.setdefault("FLASK_APP", "scripts.app")
os.environ.setdefault("FLASK_ENV", "production")

if __name__ == "__main__":
    app.run()
