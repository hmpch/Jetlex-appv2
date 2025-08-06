```markdown
# Jetlex Aviation Intelligence

Sistema de gestión integral para consultora aeronáutica con capacidades de OSINT.

## 🚀 Características

- ✅ Autenticación JWT completa
- ✅ Sistema de roles (admin, colaboradorA, colaboradorB)
- ✅ CRUD completo de expedientes y clientes
- ✅ Panel OSINT con OpenAI
- ✅ Dashboard con estadísticas
- ✅ Diseño aeronáutico responsive
- ✅ Base de datos MariaDB optimizada

## 📋 Requisitos

- Node.js 16+
- MariaDB 10.4+
- OpenAI API Key

## 🛠️ Instalación

### Backend
```bash
cd backend
npm install
cp .env.example .env
# Configurar variables de entorno
npm run dev
```

### Frontend
```bash
cd frontend
npm install
cp .env.example .env
npm start
```

### Base de Datos
```sql
CREATE DATABASE jetlex_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

## 🎯 Uso

1. El sistema creará automáticamente las tablas al iniciar
2. El primer usuario registrado será administrador
3. Usuarios posteriores requieren PIN de invitación o creación por admin

## 📚 Documentación

- Backend API: `http://localhost:5000/api`
- Frontend: `http://localhost:3000`
- Usuario inicial: Se crea con registro

## 🔧 Desarrollo

- Backend: `npm run dev`
- Frontend: `npm start`
- Tests: `npm test`
- Lint: `npm run lint`

## 📝 Licencia

Propietario - Jetlex Aviation Intelligence
```

---

## 🎯 Instrucciones de Implementación

### 1. **Clonar la estructura**
```bash
mkdir jetlex-aviation
cd jetlex-aviation
mkdir backend frontend
```

### 2. **Configurar Backend**
```bash
cd backend
npm init -y
# Copiar archivos backend
npm install
cp .env.example .env
```

### 3. **Configurar Frontend**
```bash
cd ../frontend
npx create-react-app . --template typescript
# Reemplazar archivos por los proporcionados
npm install
cp .env.example .env
```

### 4. **Configurar Base de Datos**
```sql
CREATE DATABASE jetlex_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 5. **Iniciar Desarrollo**
```bash
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend
cd frontend && npm start
```
