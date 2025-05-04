# backend/Dockerfile
FROM python:3.10-slim

WORKDIR /app

# Copia solo requirements.txt (ya estás dentro de backend/)
COPY requirements.txt .

# Instala dependencias
RUN pip install --no-cache-dir -r requirements.txt

# Copia el resto del código
COPY . .

EXPOSE 5000

CMD ["python", "run.py"]
