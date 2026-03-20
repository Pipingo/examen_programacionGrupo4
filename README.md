# Examen Programacion 5 - Inventario (React Native + Firebase)

Aplicacion movil con React Native (Expo) y Firebase que cumple:

- Autenticacion con email y contraseña
- CRUD completo de productos
- Datos filtrados por usuario
- Validaciones y manejo visible de errores
- Navegacion entre pantallas de lista y formulario

## Tecnologias

- Expo + React Native
- Firebase Authentication
- Firebase Firestore
- React Navigation

## Entidad elegida (Opcion C)

Producto:

- nombre
- precio
- cantidad
- categoria
- user_id

Tambien se muestra alerta de stock bajo cuando cantidad <= 3.

## 1) Configurar Firebase

1. Crea un proyecto en Firebase.
2. Activa Authentication con proveedor Email/Password.
3. Crea una base Firestore en modo produccion o prueba.
4. Copia las credenciales de tu app web Firebase.

Crea un archivo .env en la raiz del proyecto con este formato (basado en .env.example):

EXPO_PUBLIC_FIREBASE_API_KEY=tu_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=tu_auth_domain
EXPO_PUBLIC_FIREBASE_PROJECT_ID=tu_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=tu_storage_bucket
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=tu_messaging_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=tu_app_id

## 2) Reglas recomendadas de Firestore

Usa reglas para que cada usuario solo pueda acceder a sus propios productos:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /productos/{docId} {
      allow read, update, delete: if request.auth != null && resource.data.user_id == request.auth.uid;
      allow create: if request.auth != null && request.resource.data.user_id == request.auth.uid;
    }
  }
}
```

## 3) Instalar y ejecutar

Instalar dependencias:

npm install

Ejecutar proyecto:

npm run start

Luego abre en Android/iOS/Web desde Expo.

## Flujo funcional

- Registro e inicio de sesion
- Lista de productos por usuario autenticado
- Crear producto
- Editar producto
- Eliminar producto
- Cerrar sesion

## Validaciones implementadas

- Email con formato valido
- Contraseña minima de 6 caracteres en registro
- Campos obligatorios en formulario de producto
- Precio mayor a 0
- Cantidad entera mayor o igual a 0
- Mensajes de error visibles en pantalla y Alert

## Estructura principal

- App.js
- src/services/firebase.js
- src/contexts/AuthContext.js
- src/navigation/RootNavigator.js
- src/screens/LoginScreen.js
- src/screens/RegisterScreen.js
- src/screens/ProductListScreen.js
- src/screens/ProductFormScreen.js
- src/components/AuthForm.js
- src/components/ProductCard.js

## Commits sugeridos (minimo 3 con progreso real)

1. setup: crear proyecto Expo y dependencias base
2. feat(auth): implementar registro, login y contexto de autenticacion
3. feat(crud): implementar lista, crear, editar y eliminar productos por usuario
4. feat(ui): agregar validaciones, alertas y mejoras de interfaz
5. docs: agregar README con configuracion Firebase y ejecucion
