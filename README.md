# Examen Programación 5 - Inventario (React Native + Firebase)
## Grupo 4

Aplicación móvil con React Native (Expo) y Firebase que implementa un CRUD completo de inventario de productos con autenticación por usuario.

**Integrantes:**
- Edward
- 
- Arian
- 
- Brayan
- 
- Roy





## Tecnologías

- **React Native** + Expo (SDK 54)
- **Firebase Authentication** (Email/Password)
- **Firebase Firestore** (Base de datos)
- **React Navigation** (Navegación entre pantallas)

## Cómo ejecutar (Para el profesor)

### Opción 1: RÁPIDA (Recomendado - Windows)
clonar

despues en la carpeta .env poner las credenciales 
EXPO_PUBLIC_FIREBASE_API_KEY=AIzaSyDfJ1gmDu_3hkrT_o1op8F9pJWq8EV9hdM
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=inventario-de-productos-10cee.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=inventario-de-productos-10cee
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=inventario-de-productos-10cee.firebasestorage.app
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=741815843624
EXPO_PUBLIC_FIREBASE_APP_ID=1:741815843624:web:15f211c03c465ee0f06e1d



para que la app pueda ejecutarse


ejecuta cmd en la carpeta


   npm install

   
npm.cmd run start





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
