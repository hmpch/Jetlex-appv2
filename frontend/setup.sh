#!/bin/bash

echo "🚀 Configurando Jetlex Aviation Intelligence..."

# Backend
cd backend
npm install
cp .env.example .env
echo "✏️  Edita backend/.env con tus credenciales"

# Frontend  
cd ../frontend
npm install
cp .env.example .env

# Base de datos
cd ../backend
npm run seed

echo "✅ Configuración completa!"
echo "📝 Para iniciar:"
echo "   Backend: cd backend && npm run dev"
echo "   Frontend: cd frontend && npm start"