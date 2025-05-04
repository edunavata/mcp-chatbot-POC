# Chatbot App — Flask + React

Este proyecto es una aplicación de chatbot que combina un backend en Flask con un frontend moderno en React. El backend sirve como API para interactuar con el modelo de OpenAI, y el frontend ofrece una interfaz de usuario interactiva.

---

## 📁 Estructura del Proyecto

```
chatbot/
├── backend/               # Backend en Flask
│   ├── app/               # Lógica de aplicación Flask
│   ├── requirements.txt   # Dependencias Python
│   ├── run.py             # Script de arranque del servidor Flask
│   └── venv/              # Entorno virtual (opcional)
├── frontend/              # Frontend en React
│   ├── public/            # Archivos públicos
│   ├── src/               # Código fuente de React
│   ├── package.json       # Dependencias JS
│   └── vite.config.js     # Configuración de Vite
└── README.md              # Este archivo
```

---

## 🚀 Puesta en marcha

### 1. Clona el repositorio

```bash
git clone https://github.com/tu-usuario/chatbot.git
cd chatbot
```

---

### 2. Backend (Flask)

```bash
cd backend
python -m venv venv
source venv/bin/activate      # En Windows: venv\Scripts\activate
pip install -r requirements.txt
```

#### Configuración del entorno

Crea un archivo `.env` dentro de `backend/app` siguiendo el formato de `.env.demo`. Asegúrate de incluir tu clave de API de OpenAI:

```env
# backend/app/.env
OPENAI_API_KEY=tu_token_aquí
```

#### Ejecutar el servidor Flask

```bash
python run.py
```

Esto levantará el backend en `http://localhost:5000`.

---

### 3. Frontend (React + Vite)

```bash
cd ../frontend
npm install
npm run dev
```

Esto iniciará el servidor de desarrollo en `http://localhost:5173`.

---

## 🌐 Acceso a la App

* Backend: [http://localhost:5000](http://localhost:5000)
* Frontend: [http://localhost:5173](http://localhost:5173)

---

## 📦 Tecnologías Usadas

* **Backend**: Python, Flask, dotenv
* **Frontend**: React, Vite, JavaScript
* **API**: OpenAI API

---

## 💪 Contribuciones

Pull requests y sugerencias son bienvenidas. ¡Gracias por mejorar este proyecto!

---
