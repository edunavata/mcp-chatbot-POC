from flask import Flask
from .config import Config
from .extensions import openai_client
from .routes.chat import chat_bp


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Inicializa el cliente de OpenAI
    openai_client.init_app(app.config["OPENAI_API_KEY"])

    # Registra blueprints
    app.register_blueprint(chat_bp, url_prefix="/api")

    return app
