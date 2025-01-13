# Cotizaciones.App

Cotizaciones.App es una aplicación web creada con **React.js** en el frontend, **Python** en el backend, y **Firebase** para la autenticación y la gestión de datos. La app proporciona cotizaciones de acciones, junto con información detallada sobre ellas y noticias relevantes. Las APIs están alojadas en **Render**, lo que garantiza un rendimiento rápido y confiable.

## Tecnologías Utilizadas

- **Frontend**: React.js
- **Backend**: Python
- **Base de Datos y Autenticación**: Firebase
- **APIs**: Render
- **Hosting**: Vercel (para el frontend) y Render (para el backend)

## Características

- Visualiza las **cotizaciones de acciones** en tiempo real.
- Obtén **información detallada** sobre cada acción.
- Lee **noticias** relacionadas.
- **Autenticación de usuarios** mediante Firebase para gestionar el acceso de forma segura.
- **Interfaz intuitiva** y fácil de usar, creada con React Js.

## Requisitos

Para ejecutar este proyecto localmente, asegúrate de tener los siguientes programas instalados:

- **Node.js**
- **Python**
- **Firebase CLI** (si deseas trabajar con la autenticación)
- **Render account** (para manejar las APIs)

## Instalación

1. Clona el repositorio:
   ```bash
   git clone https://github.com/LeanCelle/CotizacionesApp

2. Navega al directorio del frontend (React) y instala las dependencias:
   ```bash
    npm install

3. Navega al directorio del backend (Python) y crea un entorno virtual:
   ```bash
    python -m venv venv
    source venv/bin/activate  # En Windows usa `venv\Scripts\activate`
    pip install -r requirements.txt

4. Configura Firebase para la autenticación y la base de datos, siguiendo la documentación oficial.

5. Ejecuta la app en modo de desarrollo:

- Para el frontend, ejecuta:
    ```bash
    npm start

- En el directorio backend, ejecuta:
    ```bash
    python app.py

- En el directorio backend, también ejecuta:
    ```bash
    uvicorn news:app --reload