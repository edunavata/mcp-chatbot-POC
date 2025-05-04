from flask import Blueprint, request, jsonify
from pydantic import ValidationError
from app.schemas.chat import ChatRequest
from app.services.openai_client import get_chat_completion

chat_bp = Blueprint("chat", __name__)


@chat_bp.route("/chat", methods=["POST"])
def chat():
    try:
        data = ChatRequest.model_validate(request.get_json())
        result = get_chat_completion(data.messages, data.model)
        return jsonify(result), 200
    except ValidationError as ve:
        return jsonify({"error": ve.errors()}), 400
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": str(e)}), 500
