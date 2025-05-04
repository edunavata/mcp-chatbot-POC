from flask import Blueprint, request, jsonify
from pydantic import ValidationError
from app.schemas.chat import ChatRequest
from app.services.openai_client import get_chat_completion
from app.services.gemini_client import run_gemini_chat_completion
import asyncio

chat_bp = Blueprint("chat", __name__)

import asyncio


def run_async(func, *args, **kwargs):
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    return loop.run_until_complete(func(*args, **kwargs))


@chat_bp.route("/chat/openai", methods=["POST"])
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


@chat_bp.route("/chat/gemini", methods=["POST"])
def chat_gemini():
    try:
        data = ChatRequest.model_validate(request.get_json())
        result = run_gemini_chat_completion(data.messages)
        return jsonify(result), 200
    except ValidationError as ve:
        return jsonify({"error": ve.errors()}), 400
    except Exception as e:
        print(f"Gemini error: {e}")
        return jsonify({"error": str(e)}), 500
