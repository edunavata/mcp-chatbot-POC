from openai import OpenAI


class OpenAIClient:
    def __init__(self):
        self.client = None

    def init_app(self, api_key: str):
        self.client = OpenAI(api_key=api_key)

    def get_client(self):
        if not self.client:
            raise RuntimeError("OpenAI client not initialized.")
        return self.client


openai_client = OpenAIClient()
