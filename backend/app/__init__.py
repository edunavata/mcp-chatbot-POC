from flask import Flask
from flask_cors import CORS  # 👈 Importa CORS
from .config import Config
from .extensions import openai_client
from .routes.chat import chat_bp


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Configurar CORS para permitir peticiones desde el frontend
    CORS(
        app, resources={r"/api/*": {"origins": "*"}}
    )  # 👈 Permitir todos los orígenes (desarrollo)

    # Inicializa OpenAI
    openai_client.init_app(app.config["OPENAI_API_KEY"])

    # Registra rutas
    app.register_blueprint(chat_bp, url_prefix="/api")

    return app
