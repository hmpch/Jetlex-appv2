import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Importamos el archivo de estilos principal que a su vez importa Tailwind CSS
import './styles/App.css';

// 1. Obtenemos el elemento 'root' del DOM que está en public/index.html
const rootElement = document.getElementById('root');

// 2. Creamos el punto de entrada para la aplicación React en ese elemento
const root = ReactDOM.createRoot(rootElement);

// 3. Renderizamos el componente principal (App) dentro del StrictMode
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);