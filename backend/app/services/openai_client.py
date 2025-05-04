import asyncio
from agents import Agent, Runner
from agents.mcp import MCPServerStdio
from openai import OpenAI
from .prompts import build_classification_prompt, build_task_description_prompt

client = OpenAI()

CLASSIFICATION_MODEL = "gpt-3.5-turbo"
TASK_DESCRIPTION_MODEL = "gpt-4o-mini"
FULL_EXECUTION_MODEL = "gpt-4o"


def should_treat_as_task(messages: list, model=CLASSIFICATION_MODEL) -> bool:
    prompt = build_classification_prompt(messages)
    response = client.chat.completions.create(
        model=model,
        messages=[{"role": "user", "content": prompt}],
        temperature=0,
    )
    return response.choices[0].message.content.strip().upper() == "TAREA"


def generate_task_description(messages: list, model=TASK_DESCRIPTION_MODEL) -> str:
    prompt = build_task_description_prompt(messages)
    response = client.chat.completions.create(
        model=model,
        messages=[{"role": "user", "content": prompt}],
        temperature=0,
    )
    return response.choices[0].message.content.strip()


async def _run_agent_with_mcp(messages, model=FULL_EXECUTION_MODEL) -> str:
    user_messages = [
        getattr(m, "content", None) or m.get("content")
        for m in messages
        if (getattr(m, "role", None) or m.get("role")) == "user"
    ]
    full_prompt = "\n".join(user_messages)

    async with MCPServerStdio(
        params={
            "command": "npx",
            "args": [
                "-y",
                "@modelcontextprotocol/server-filesystem",
                "/home/edu/code/",
            ],
        }
    ) as server:
        tools = await server.list_tools()
        agent = Agent(
            name="Assistant",
            instructions="Use the tools to achieve the task",
            mcp_servers=[server],
        )
        print("Tarea:", full_prompt)
        result = await Runner.run(starting_agent=agent, input=full_prompt)
        return result.final_output


def get_chat_completion(messages, model=FULL_EXECUTION_MODEL):
    if should_treat_as_task(messages):
        print("→ Detected as TAREA")
        task_description = generate_task_description(messages)
        return asyncio.run(
            _run_agent_with_mcp([{"role": "user", "content": task_description}], model)
        )
    else:
        print("→ Detected as MENSAJE normal")
        full_prompt = [{"role": m.role, "content": m.content} for m in messages]
        response = client.chat.completions.create(
            model=model,
            messages=full_prompt,
            temperature=0.7,
        )
        return response.choices[0].message.content.strip()
