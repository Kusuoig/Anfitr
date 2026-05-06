# Anfitr 🏠

Aplicación web Full Stack basada en **Angular 20** (con soporte SSR) y un backend en **Node/Express** con **MongoDB**. Gestiona de forma eficiente usuarios y reservas en una arquitectura moderna y escalable.

---

## ✨ Características

*   **Frontend**: Angular 20 con arquitectura de componentes y servicios.
*   **Backend**: API REST con Express + Mongoose (MongoDB).
*   **SSR (Server-Side Rendering)**: Configurado para optimizar SEO y rendimiento de carga.
*   **Gestión de Usuarios**: Rutas dedicadas bajo `/api/users`.
*   **Monitoreo**: Endpoints de salud y verificación de base de datos integrados.

---

## 🚀 Requisitos Previos

*   **Node.js**: Versión 18 o superior recomendada.
*   **Gestor de paquetes**: `npm`, `pnpm` o `yarn`.
*   **Base de Datos**: Instancia de MongoDB (Local o Atlas).
*   **Docker** (Opcional): Para despliegue mediante contenedores.

---

## ⚙️ Configuración (Variables de Entorno)

Crea un archivo `.env` en la raíz del proyecto (dentro de la carpeta `Anfitr`) y configura las siguientes variables:
```bash
# Servidor
PORT=3000
NODE_ENV=development

# Base de Datos
MONGODB_URI="mongodb+srv://tu_usuario:tu_clave@cluster0.mongodb.net"
DB_NAME="anfitr_db"

# Seguridad (Recomendado para producción)
JWT_SECRET="una_clave_secreta_y_segura"

# 1. Clonar el repositorio
# 2. Entrar a la carpeta
cd Anfitr

# 3. Instalar dependencias
npm install

docker-compose up --build



