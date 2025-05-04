def build_classification_prompt(messages: list) -> str:
    last_user_message = [m for m in messages if m.role == "user"][-1].content
    history = [(m.role, m.content) for m in messages]

    return (
        "Analiza la siguiente conversación y determina si el **último mensaje del usuario** requiere una acción técnica "
        "(como crear/modificar archivos, ejecutar herramientas, etc.), o si es un mensaje conversacional.\n\n"
        "Devuelve únicamente 'TAREA' o 'MENSAJE'.\n\n"
        f"Historial:\n{history}\n\n"
        f"Último mensaje del usuario:\n{last_user_message}"
    )


def build_task_description_prompt(messages: list) -> str:
    last_user_message = [m for m in messages if m.role == "user"][-1].content
    history = [(m.role, m.content) for m in messages]

    return (
        "Analiza esta conversación. Tu única tarea es generar una **descripción técnica clara y precisa** de la "
        "**última acción solicitada por el usuario**. No repitas tareas anteriores ya completadas, y no resumas toda la conversación.\n\n"
        f"Historial:\n{history}\n\n"
        f"Instrucción a analizar:\n{last_user_message}\n\n"
        "Descripción clara y técnica de la tarea actual:"
    )
