#!/bin/bash
# setup.sh - Script mejorado de configuración para Jetlex

echo "🚀 Configurando Jetlex Aviation Intelligence v2.0..."
echo "=================================================="

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Función para verificar comandos
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Verificar sistema operativo
OS="Unknown"
if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    OS="Linux"
elif [[ "$OSTYPE" == "darwin"* ]]; then
    OS="macOS"
elif [[ "$OSTYPE" == "cygwin" ]] || [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "win32" ]]; then
    OS="Windows"
fi
echo -e "${BLUE}Sistema detectado: $OS${NC}"

# Verificar Node.js
echo -e "\n${YELLOW}Verificando dependencias...${NC}"
if ! command_exists node; then
    echo -e "${RED}❌ Node.js no está instalado${NC}"
    echo "📥 Descargalo desde: https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt "14" ]; then
    echo -e "${RED}❌ Se requiere Node.js 14+${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Node.js $(node -v) detectado${NC}"

# Verificar npm
if ! command_exists npm; then
    echo -e "${RED}❌ npm no está instalado${NC}"
    exit 1
fi
echo -e "${GREEN}✅ npm $(npm -v) detectado${NC}"

# Verificar Git
if ! command_exists git; then
    echo -e "${YELLOW}⚠️  Git no detectado${NC}"
fi

# Instalar dependencias globales si no existen
echo -e "\n${YELLOW}Verificando herramientas globales...${NC}"
if ! command_exists concurrently; then
    echo "📦 Instalando concurrently globalmente..."
    npm install -g concurrently
fi

# Crear archivos .env si no existen
echo -e "\n${YELLOW}Configurando variables de entorno...${NC}"

# Backend .env
if [ ! -f backend/.env ]; then
    cp backend/.env.example backend/.env 2>/dev/null || cat > backend/.env << 'EOF'
NODE_ENV=development
PORT=5000
DATABASE_URL=mysql://root:password@localhost:3306/jetlex_db
DB_HOST=localhost
DB_PORT=3306
DB_NAME=jetlex_db
DB_USER=root
DB_PASSWORD=password
JWT_SECRET=tu_super_secret_jwt_key_cambiar_en_produccion_jetlex2024
JWT_EXPIRE=7d
INVITE_PIN=123456
FRONTEND_URL=http://localhost:3000
ADMIN_EMAIL=admin@jetlex.com
ADMIN_PASSWORD=Admin123!
EOF
    echo -e "${GREEN}✅ backend/.env creado${NC}"
fi

# Frontend .env
if [ ! -f frontend/.env ]; then
    cp frontend/.env.example frontend/.env 2>/dev/null || cat > frontend/.env << 'EOF'
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_APP_NAME=Jetlex Aviation Intelligence
GENERATE_SOURCEMAP=false
EOF
    echo -e "${GREEN}✅ frontend/.env creado${NC}"
fi

# Instalar todas las dependencias
echo -e "\n${YELLOW}Instalando dependencias...${NC}"
echo "📦 Instalando dependencias del proyecto principal..."
npm install

echo "📦 Instalando dependencias del backend..."
cd backend && npm install && cd ..

echo "📦 Instalando dependencias del frontend..."
cd frontend && npm install && cd ..

# Crear directorios necesarios
echo -e "\n${YELLOW}Creando directorios...${NC}"
mkdir -p backend/uploads
mkdir -p backend/logs
echo -e "${GREEN}✅ Directorios creados${NC}"

# Instrucciones finales
echo -e "\n${GREEN}✅ ¡Configuración completada!${NC}"
echo -e "\n📋 Próximos pasos:"
echo -e "1. ${YELLOW}Configurar MySQL:${NC}"
echo "   - Asegurate que MySQL esté corriendo"
echo "   - Creá la base de datos: CREATE DATABASE jetlex_db;"
echo "   - Actualizá las credenciales en backend/.env"
echo -e "\n2. ${YELLOW}Ejecutar migraciones:${NC}"
echo "   cd backend && npm run migrate"
echo -e "\n3. ${YELLOW}Crear usuario admin:${NC}"
echo "   cd backend && npm run seed"
echo -e "\n4. ${YELLOW}Iniciar la aplicación:${NC}"
echo "   npm run dev (desde la raíz)"
echo "   O en terminales separadas:"
echo "   - Backend: cd backend && npm run dev"
echo "   - Frontend: cd frontend && npm start"
echo -e "\n🔗 URLs:"
echo "   Frontend: ${BLUE}http://localhost:3000${NC}"
echo "   Backend API: ${BLUE}http://localhost:5000${NC}"
echo "   Credenciales: admin@jetlex.com / Admin123!"
echo -e "\n✈️  ¡Jetlex está listo para despegar!"