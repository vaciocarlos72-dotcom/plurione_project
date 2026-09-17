# Arquitectura del frontend

## Estructura del Proyecto

La aplicación React se encuentra dentro de `frontend` y su código principal está
organizado en `frontend/src`:

```text
frontend/src/
|-- api.js
|-- App.jsx
|-- main.jsx
`-- components/
    `-- VacantesList.jsx
```

- `main.jsx`: punto de entrada de React. Monta el componente `App` en el
  elemento raíz del documento.
- `App.jsx`: componente principal de la aplicación y configuración de las rutas.
- `api.js`: instancia centralizada de Axios para comunicarse con el backend.
- `components/`: contiene componentes reutilizables de la interfaz.
- `components/VacantesList.jsx`: consulta y muestra las vacantes disponibles.

## Capa de Comunicación

El archivo `api.js` crea una instancia de Axios con la URL base del backend
local:

```javascript
const api = axios.create({
  baseURL: 'http://127.0.0.1:8000',
})
```

Los componentes utilizan esta instancia para realizar peticiones HTTP sin
repetir la dirección del servidor. `VacantesList.jsx` consume el endpoint
`GET /vacantes/`, por lo que la petición completa se dirige a
`http://127.0.0.1:8000/vacantes/`.

## Componentes Actuales

`VacantesList.jsx` usa `useState` para administrar tres estados: la colección
de vacantes, el indicador de carga y el mensaje de error. Al montarse, `useEffect`
realiza una petición asíncrona mediante `api.get('/vacantes/')`.

El componente utiliza renderizado condicional para mostrar:

- Un mensaje de carga mientras la petición está en curso.
- Un mensaje de error si la API no responde correctamente.
- Un mensaje informativo cuando no existen vacantes.
- Una tabla con título, descripción y estado cuando hay resultados.

También evita actualizar el estado si el componente ya fue desmontado, lo que
previene actualizaciones tardías durante cambios de ruta o desmontajes.

## Manejo de Rutas

`App.jsx` utiliza `BrowserRouter` como proveedor de navegación y define sus
rutas mediante `Routes` y `Route`. Actualmente existe una ruta principal:

- `/`: muestra el título `PluriOne - Portal de Reclutamiento` y el componente
  `VacantesList`.

Esta estructura permite agregar nuevas vistas y rutas sin concentrar toda la
lógica de navegación en un solo componente.
