#!/bin/bash
# setup.sh - Script de configuración automática para Jetlex

# Colores para mejor visualización
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# Banner
echo -e "${BLUE}"
echo "     _      _   _            "
echo "    | | ___| |_| | _____  __ "
echo " _  | |/ _ \ __| |/ _ \ \/ / "
echo "| |_| |  __/ |_| |  __/>  <  "
echo " \___/ \___|\__|_|\___/_/\_\ "
echo "                             "
echo -e "${PURPLE}Aviation Intelligence System v2.0${NC}"
echo -e "${BLUE}=================================${NC}\n"

# Función para verificar comandos
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Función para imprimir con formato
print_step() {
    echo -e "\n${BLUE}▶ $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# Detectar sistema operativo
detect_os() {
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        echo "Linux"
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        echo "macOS"
    elif [[ "$OSTYPE" == "cygwin" ]] || [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "win32" ]]; then
        echo "Windows"
    else
        echo "Unknown"
    fi
}

OS=$(detect_os)
print_step "Sistema detectado: $OS"

# Verificar Node.js
print_step "Verificando dependencias..."

if ! command_exists node; then
    print_error "Node.js no está instalado"
    echo "📥 Descargalo desde: https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node -v)
NODE_MAJOR=$(echo $NODE_VERSION | cut -d'.' -f1 | cut -d'v' -f2)

if [ "$NODE_MAJOR" -lt "14" ]; then
    print_error "Se requiere Node.js 14 o superior (actual: $NODE_VERSION)"
    exit 1
fi
print_success "Node.js $NODE_VERSION"

# Verificar npm
if ! command_exists npm; then
    print_error "npm no está instalado"
    exit 1
fi
print_success "npm $(npm -v)"

# Verificar MySQL
print_step "Verificando MySQL..."
if command_exists mysql; then
    print_success "MySQL detectado"
else
    print_warning "MySQL no detectado - asegurate de instalarlo antes de continuar"
fi

# Crear estructura de directorios
print_step "Creando estructura de directorios..."
mkdir -p backend/uploads
mkdir -p backend/logs
mkdir -p backend/temp
print_success "Directorios creados"

# Configurar archivos .env
print_step "Configurando variables de entorno..."

# Backend .env
if [ ! -f backend/.env ]; then
    cat > backend/.env << 'EOF'
# Entorno
NODE_ENV=development
PORT=5000

# Base de datos MySQL
DB_HOST=localhost
DB_PORT=3306
DB_NAME=jetlex_db
DB_USER=root
DB_PASSWORD=
DATABASE_URL=mysql://root:@localhost:3306/jetlex_db

# JWT y Seguridad
JWT_SECRET=jetlex_secret_key_cambiar_en_produccion_2024
JWT_EXPIRE=7d
INVITE_PIN=123456

# URLs
FRONTEND_URL=http://localhost:3000
API_URL=http://localhost:5000

# Admin inicial
ADMIN_EMAIL=admin@jetlex.com
ADMIN_PASSWORD=Admin123!

# Email (opcional - configurar para notificaciones)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=
EMAIL_PASS=

# Storage
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=10485760

# OpenAI (opcional)
OPENAI_API_KEY=

# ANAC Monitoring
ANAC_BASE_URL=https://anac.gov.ar
ANAC_CHECK_INTERVAL=3600000
EOF
    print_success "backend/.env creado"
    print_warning "Editá backend/.env con tus credenciales de MySQL"
else
    print_success "backend/.env ya existe"
fi

# Frontend .env
if [ ! -f frontend/.env ]; then
    cat > frontend/.env << 'EOF'
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_APP_NAME=Jetlex Aviation Intelligence
REACT_APP_VERSION=2.0.0
GENERATE_SOURCEMAP=false
EOF
    print_success "frontend/.env creado"
else
    print_success "frontend/.env ya existe"
fi

# Instalar dependencias
print_step "Instalando dependencias..."

# Root package.json (para concurrently)
if [ ! -f package.json ]; then
    cat > package.json << 'EOF'
{
  "name": "jetlex-aviation",
  "version": "2.0.0",
  "description": "Jetlex Aviation Intelligence System",
  "scripts": {
    "dev": "concurrently \"npm:dev:backend\" \"npm:dev:frontend\"",
    "dev:backend": "cd backend && npm run dev",
    "dev:frontend": "cd frontend && npm start",
    "install:all": "npm install && cd backend && npm install && cd ../frontend && npm install",
    "build": "cd frontend && npm run build",
    "start": "cd backend && npm start"
  },
  "devDependencies": {
    "concurrently": "^8.2.2"
  }
}
EOF
    print_success "package.json raíz creado"
fi

# Instalar concurrently
npm install

# Backend
cd backend
print_step "Instalando dependencias del backend..."
npm install
cd ..

# Frontend
cd frontend
print_step "Instalando dependencias del frontend..."
npm install
cd ..

# Crear base de datos si el usuario quiere
print_step "Configuración de Base de Datos"
echo -e "${YELLOW}¿Querés crear la base de datos automáticamente? (s/n)${NC}"
read -r CREATE_DB

if [[ "$CREATE_DB" =~ ^[Ss]$ ]]; then
    echo "Ingresá la contraseña de MySQL root (dejar vacío si no tiene):"
    read -s MYSQL_ROOT_PASS
    
    if [ -z "$MYSQL_ROOT_PASS" ]; then
        mysql -u root -e "CREATE DATABASE IF NOT EXISTS jetlex_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;" 2>/dev/null
    else
        mysql -u root -p"$MYSQL_ROOT_PASS" -e "CREATE DATABASE IF NOT EXISTS jetlex_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;" 2>/dev/null
    fi
    
    if [ $? -eq 0 ]; then
        print_success "Base de datos 'jetlex_db' creada"
    else
        print_warning "No se pudo crear la base de datos automáticamente"
        echo "Creala manualmente con: CREATE DATABASE jetlex_db;"
    fi
fi

# Resumen final
echo -e "\n${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✅ ¡Configuración completada exitosamente!${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"

echo -e "${BLUE}📋 Próximos pasos:${NC}"
echo -e "1. ${YELLOW}Configurar MySQL:${NC}"
echo "   - Editá backend/.env con tus credenciales"
echo "   - Si no creaste la DB: CREATE DATABASE jetlex_db;"
echo ""
echo -e "2. ${YELLOW}Ejecutar migraciones:${NC}"
echo "   cd backend && npm run migrate"
echo ""
echo -e "3. ${YELLOW}Crear usuario admin:${NC}"
echo "   cd backend && npm run seed"
echo ""
echo -e "4. ${YELLOW}Iniciar la aplicación:${NC}"
echo "   npm run dev"
echo ""
echo -e "${BLUE}🔗 URLs de acceso:${NC}"
echo "   Frontend: ${PURPLE}http://localhost:3000${NC}"
echo "   Backend:  ${PURPLE}http://localhost:5000${NC}"
echo "   Admin:    ${PURPLE}admin@jetlex.com / Admin123!${NC}"
echo ""
echo -e "${GREEN}✈️  ¡Jetlex está listo para despegar!${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"