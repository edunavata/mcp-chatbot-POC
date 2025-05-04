import os
import asyncio
from google import genai
from google.genai import types
from dotenv import load_dotenv
from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client

load_dotenv()
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))


def clean_schema(schema: dict) -> dict:
    """Recursively remove unsupported keys like 'additionalProperties'."""
    if isinstance(schema, dict):
        return {
            k: clean_schema(v) for k, v in schema.items() if k != "additionalProperties"
        }
    elif isinstance(schema, list):
        return [clean_schema(item) for item in schema]
    else:
        return schema


async def get_gemini_chat_completion(
    messages: list, model: str = "gemini-2.0-flash"
) -> dict:
    try:
        # Conversión de mensajes a formato Gemini
        gemini_messages = [
            types.Content(role=msg.role, parts=[types.Part(text=msg.content)])
            for msg in messages
        ]
        print(f"Initial Gemini messages: {gemini_messages}")

        # MCP server config (ejemplo: servidor del clima con npx)
        server_params = StdioServerParameters(
            command="npx",
            args=[
                "-y",
                "@modelcontextprotocol/server-filesystem",
                "/home/edu/code/chatbot",
            ],
        )

        async with stdio_client(server_params) as (read, write):
            print("Stdio client connected.")
            async with ClientSession(read, write) as session:
                print("Client session initialized.")
                await session.initialize()
                print("MCP session initialized.")

                # Obtener tools MCP y adaptarlas a Gemini
                mcp_tools = await session.list_tools()
                print(f"MCP Tools: {mcp_tools}")
                tools = []
                for tool in mcp_tools.tools:
                    try:
                        cleaned = clean_schema(tool.inputSchema)
                        tool_obj = types.Tool(
                            function_declarations=[
                                {
                                    "name": tool.name,
                                    "description": tool.description,
                                    "parameters": cleaned,
                                }
                            ]
                        )
                        tools.append(tool_obj)
                    except Exception as e:
                        print(f"⚠️ Skipping tool '{tool.name}' due to schema error: {e}")

                print(f"Gemini Tools: {tools}")

                # Primer paso: enviar mensajes con herramientas
                print("Sending initial request to Gemini...")
                response = client.models.generate_content(
                    model=model,
                    contents=gemini_messages,
                    config=types.GenerateContentConfig(tools=tools),
                )
                print(f"First Gemini Response: {response}")

                # Comprobamos si hay llamada a función
                if response.candidates and response.candidates[0].content.parts:
                    call = response.candidates[0].content.parts[0].function_call
                    if call:
                        print(f"Function call detected: {call}")
                        # Ejecutamos llamada a través de MCP
                        print(
                            f"Calling MCP tool '{call.name}' with arguments: {call.args}"
                        )
                        result = await session.call_tool(call.name, arguments=call.args)
                        print(f"MCP Tool Result: {result}")

                        # Enviar el resultado como mensaje de vuelta al modelo
                        followup_messages = gemini_messages + [
                            types.Content(
                                role="model", parts=[types.Part(function_call=call)]
                            ),
                            types.Content(
                                role="user",
                                parts=[
                                    types.Part.from_function_response(
                                        name=call.name,
                                        response={"result": result.content[0].text},
                                    )
                                ],
                            ),
                        ]
                        print(f"Follow-up Gemini messages: {followup_messages}")

                        # Respuesta final con contexto completo
                        print("Sending follow-up request to Gemini...")
                        final_response = client.models.generate_content(
                            model=model,
                            contents=followup_messages,
                            config=types.GenerateContentConfig(tools=tools),
                        )
                        print(f"Final Gemini Response: {final_response}")
                        return {"response": final_response.text}
                    else:
                        print("No function call in the first Gemini response.")
                        return {"response": response.text}
                else:
                    print(
                        "No candidates or content parts in the first Gemini response."
                    )
                    return {"response": response.text}

    except Exception as e:
        print(f"Exception in get_gemini_chat_completion: {e}")
        raise RuntimeError(f"Failed to get response from Gemini MCP: {str(e)}")


def run_gemini_chat_completion(messages, model="gemini-2.0-flash"):
    return asyncio.run(get_gemini_chat_completion(messages, model))
