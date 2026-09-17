# PluriOne - Portal de Reclutamiento

PluriOne es una plataforma de reclutamiento omnicanal para gestionar vacantes,
candidatos y postulaciones. El proyecto está organizado como una aplicación
cliente-servidor con una API REST y una interfaz web para administrar la
información del proceso de selección.

## Tecnologías utilizadas

- **Backend:** FastAPI, Uvicorn y SQLAlchemy.
- **Base de datos:** PostgreSQL.
- **Frontend:** React con Vite.
- **Estilos:** Tailwind CSS.
- **Interfaz:** React Router, Axios, `react-hot-toast` y `lucide-react`.
- **Comunicación:** API REST.

## Requisitos previos

- Python 3.11 o posterior.
- Node.js y npm.
- PostgreSQL ejecutándose localmente.

## Encender el backend

Desde la raíz del proyecto, abre una terminal y ejecuta:

1. Crea el entorno virtual dentro de `backend`:

   ```powershell
   python -m venv backend\.venv
   ```

2. Activa el entorno virtual en PowerShell:

   ```powershell
   . .\backend\.venv\Scripts\Activate.ps1
   ```

   Si PowerShell bloquea la activación, puedes habilitarla solo para la sesión
   actual:

   ```powershell
   Set-ExecutionPolicy -Scope Process -ExecutionPolicy RemoteSigned
   ```

3. Instala las dependencias:

   ```powershell
   python -m pip install -r backend\requirements.txt
   ```

4. Crea `backend\.env` con la URL de conexión a PostgreSQL. Usa tus propias
   credenciales y no las publiques en el repositorio:

   ```dotenv
   DATABASE_URL=postgresql://USUARIO:CONTRASENA@localhost:5432/plurione_db
   ```

5. Inicia el servidor desde la raíz del proyecto:

   ```powershell
   Set-Location backend
   python -m uvicorn main:app --reload --host 127.0.0.1 --port 8000
   ```

   La API estará disponible en `http://127.0.0.1:8000`. La documentación
   interactiva de FastAPI se encuentra en `http://127.0.0.1:8000/docs`.

## Encender el frontend

Con Node.js instalado, abre otra terminal desde la raíz del proyecto y ejecuta:

1. Entra en la carpeta del frontend:

   ```powershell
   Set-Location frontend
   ```

2. Instala las dependencias de React, Axios, React Router, Tailwind,
   `react-hot-toast` y `lucide-react`:

   ```powershell
   npm install
   ```

3. Inicia el servidor de desarrollo de Vite:

   ```powershell
   npm run dev
   ```

   El frontend estará disponible en la URL que muestre Vite, normalmente
   `http://localhost:5173`.

## Seguridad de configuración

El archivo `backend/.env` contiene configuración local y está excluido del
control de versiones mediante `.gitignore`. No compartas contraseñas reales ni
las incluyas directamente en el código o en la documentación pública.
