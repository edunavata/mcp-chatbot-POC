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


from contextlib import AsyncExitStack


async def _run_agent_with_mcp(
    messages, mcp_server_configs: list, model=FULL_EXECUTION_MODEL
) -> str:
    """
    Runs an agent using the given list of MCP server configurations.

    :param messages: List of message dicts with role and content.
    :param mcp_server_configs: List of MCP server parameter dicts.
    :param model: Model name to use in the agent.
    :return: Final output from the agent.
    """
    user_messages = [
        getattr(m, "content", None) or m.get("content")
        for m in messages
        if (getattr(m, "role", None) or m.get("role")) == "user"
    ]
    full_prompt = "\n".join(user_messages)

    # Create all MCP server instances in a shared async context
    async with AsyncExitStack() as stack:
        mcp_servers = []
        for config in mcp_server_configs:
            server = await stack.enter_async_context(MCPServerStdio(params=config))
            mcp_servers.append(server)

        tools = await asyncio.gather(
            *(s.list_tools() for s in mcp_servers)
        )  # opcional: verifica herramientas

        agent = Agent(
            name="Assistant",
            instructions="Use the tools to achieve the task",
            mcp_servers=mcp_servers,
        )

        print("Tarea:", full_prompt)
        result = await Runner.run(starting_agent=agent, input=full_prompt)
        return result.final_output


def get_chat_completion(messages, model=FULL_EXECUTION_MODEL):
    if should_treat_as_task(messages):
        print("→ Detected as TAREA")
        task_description = generate_task_description(messages)
        return asyncio.run(
            _run_agent_with_mcp(
                messages=[{"role": "user", "content": task_description}],
                mcp_server_configs=[
                    {
                        "command": "npx",
                        "args": [
                            "-y",
                            "@modelcontextprotocol/server-filesystem",
                            "/home/edu/code/chatbot",
                        ],
                    }
                ],
                model=model,
            )
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
