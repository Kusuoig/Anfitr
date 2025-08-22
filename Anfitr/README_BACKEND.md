# Anfitr Backend (RAYO Y EMILIANITO)

Backend API con Node.js + MongoDB Atlas

## Tecnologías
- Node.js + Express
- MongoDB Atlas
- Docker

## Ejecutar

```bash
# Con Docker
docker-compose up -d

# Sin Docker
npm install
npm start
```

## API Endpoints

**Sistema:**
- `GET /` - Info de la API
- `GET /health` - Estado del servidor

**Usuarios:**
- `GET /api/users` - Listar usuarios
- `POST /api/users` - Crear usuario
- `PUT /api/users/:id` - Actualizar usuario
- `DELETE /api/users/:id` - Eliminar usuario

## Ejemplo de Uso

```bash
# Crear usuario
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name": "Juan", "email": "juan@test.com", "role": "host"}'

# Ver usuarios
curl http://localhost:3000/api/users
```

## Estado
MongoDB Atlas conectado  
API funcionando en puerto 3000  
Docker contenedores activos
