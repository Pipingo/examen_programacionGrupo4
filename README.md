# Examen Programación 5 - Inventario (React Native + Firebase)
## Grupo 4

Aplicación móvil con React Native (Expo) y Firebase que implementa un CRUD completo de inventario de productos con autenticación por usuario.

**Integrantes:**
- Edward Parra Jara (parrexpro@gmail.com)

## Tecnologías

- **React Native** + Expo (SDK 54)
- **Firebase Authentication** (Email/Password)
- **Firebase Firestore** (Base de datos)
- **React Navigation** (Navegación entre pantallas)

## Cómo ejecutar (Para el profesor)

### Opción 1: RÁPIDA (Recomendado - Windows)

Simplemente ejecuta en PowerShell:
```bash
.\setup.bat
npm.cmd run start
```

Listo. La app está en el aire.

### Opción 2: Manual paso a paso

1. Clonar repositorio:
   ```bash
   git clone https://github.com/Pipingo/examen_programacionGrupo4.git
   cd examen_programacionGrupo4
   ```

2. Crear `.env` (copia el contenido de `.env.example`):
   ```bash
   copy .env.example .env
   ```

3. Instalar dependencias:
   ```bash
   npm install
   ```

4. Ejecutar:
   ```bash
   npm.cmd run start
   ```

Escanea el QR con **Expo Go**.

## Flujo funcional

1. Registrarse con email/contraseña
2. Iniciar sesión
3. Crear productos (nombre, precio, cantidad, categoría)
4. Editar productos
5. Eliminar productos
6. Ver solo tus productos (cada usuario ve solo lo suyo)
7. Cerrar sesión

## Requisitos cumplidos

✅ Autenticación con email/contraseña
✅ CRUD completo funcionando
✅ Datos aislados por usuario
✅ Validaciones de formularios
✅ Errores visibles en pantalla
✅ Navegación entre pantallas
✅ Base de datos en Firestore
