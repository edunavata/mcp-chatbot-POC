import asyncio
from agents import Agent, Runner
from agents.mcp import MCPServerStdio
from openai import OpenAI

client = OpenAI()


def should_treat_as_task(messages: list, model="gpt-4o") -> bool:
    """
    Decide si el último mensaje es una tarea que debe ejecutarse con el agente.
    """
    last_user_message = [m for m in messages if m.role == "user"][-1].content

    prompt = (
        "Dado el siguiente historial de conversación, determina si el **último mensaje del usuario** requiere "
        "una **acción técnica automatizada** (como crear/editar/leer un archivo, buscar datos, ejecutar herramientas, etc.) "
        "o si es simplemente un mensaje conversacional.\n\n"
        "Devuelve 'TAREA' si debe ejecutarse como acción automatizada, o 'MENSAJE' si es una conversación normal.\n\n"
        f"Historial completo:\n{[(m.role, m.content) for m in messages]}\n\n"
        f"Último mensaje: {last_user_message}\n\n"
        "Respuesta:"
    )

    response = client.chat.completions.create(
        model=model,
        messages=[{"role": "user", "content": prompt}],
        temperature=0,
    )
    decision = response.choices[0].message.content.strip().upper()
    return decision == "TAREA"


def generate_task_description(messages: list, model="gpt-4o") -> str:
    prompt = (
        "Analiza la siguiente conversación entre un usuario y un asistente. "
        "Tu tarea es generar una **descripción clara y específica** de la acción que debe realizarse, basada en el historial. "
        "Resumen breve, sin adornos ni explicaciones, en lenguaje técnico, directo y claro.\n\n"
        f"{[(m.role, m.content) for m in messages]}\n\n"
        "Descripción de la tarea:"
    )

    response = client.chat.completions.create(
        model=model,
        messages=[{"role": "user", "content": prompt}],
        temperature=0,
    )
    return response.choices[0].message.content.strip()


async def _run_agent_with_mcp(messages, model: str = "gpt-4o") -> str:
    # Concatenar el contenido de los mensajes del usuario en un solo prompt
    user_messages = []

    for m in messages:
        try:
            role = getattr(m, "role", None) or m.get("role")
            content = getattr(m, "content", None) or m.get("content")
            if role == "user" and content:
                user_messages.append(content)
        except Exception:
            continue

    full_prompt = "\n".join(user_messages)

    # Configurar el servidor MCP de filesystem (vía npx)
    async with MCPServerStdio(
        params={
            "command": "npx",
            "args": ["-y", "@modelcontextprotocol/server-filesystem", "."],
        }
    ) as server:
        tools = await server.list_tools()
        agent = Agent(
            name="Assistant",
            instructions="Use the tools to achieve the task",
            mcp_servers=[server],
        )
        print("Prompo", full_prompt)
        result = await Runner.run(starting_agent=agent, input=full_prompt)
        return result.final_output

    print(f"Tools: {tools}")


def get_chat_completion(messages, model):

    if should_treat_as_task(messages, model):
        print("→ Detected as TAREA")
        task_description = generate_task_description(messages, model)
        return asyncio.run(
            _run_agent_with_mcp([{"role": "user", "content": task_description}], model)
        )
    else:
        print("→ Detected as MENSAJE normal")
        # Convierte objetos Message a dicts
        full_prompt = [{"role": m.role, "content": m.content} for m in messages]
        response = client.chat.completions.create(
            model=model,
            messages=full_prompt,
            temperature=0.7,
        )
        return response.choices[0].message.content.strip()
