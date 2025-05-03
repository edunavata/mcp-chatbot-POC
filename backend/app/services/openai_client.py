from app.extensions import openai_client


def get_chat_completion(messages, model):
    client = openai_client.get_client()

    completion = client.chat.completions.create(
        model="gpt-4o",
        messages=messages,
    )

    return completion.choices[0].message.content
