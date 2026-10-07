# Sistema Web Seguro de Gestión - Tambo+

Proyecto de Desarrollo de Aplicaciones Web con catálogo de productos, carrito de compra, autenticación de administrador y CRUD protegido de inventario.

## Requisitos

- Node.js 18 o superior
- npm

## Instalación y ejecución

bash
npm install
npm start


Abrir en el navegador:

text
http://localhost:3000
```

## Primer uso

1. Entra a **Administración**.
2. Si `data/users.json` está vacío, el sistema mostrará **Configuración inicial**.
3. Crea el primer administrador con una contraseña de mínimo 8 caracteres, una mayúscula, una minúscula y un número.
4. La contraseña se guarda únicamente como hash bcrypt.
5. Después de crear la cuenta, inicia sesión.
6. Solo con una sesión válida aparecen y funcionan las opciones para crear, editar y eliminar productos.

Después de que existe el primer administrador, el formulario de creación inicial deja de estar disponible y se muestra solamente el inicio de sesión.

## Funcionalidades

- Catálogo público y dinámico de productos.
- Carrito de compra con manipulación del DOM.
- Autenticación de administrador mediante usuario y contraseña.
- Sesión segura con token aleatorio almacenado en cookie `HttpOnly` y `SameSite=Strict`.
- CRUD completo de productos: GET, POST, PUT y DELETE.
- GET de productos público; POST, PUT y DELETE protegidos por middleware de autenticación.
- Fetch API + async/await sin recargar la página.
- Validación de formularios en frontend y backend.
- Sanitización de entradas para reducir riesgo de XSS/inyección.
- Contraseñas protegidas con bcrypt (12 rondas por defecto).
- Persistencia local en archivos JSON mediante una capa Repository.
- Manejo centralizado de errores HTTP.
- Cabeceras defensivas: CSP, X-Content-Type-Options, X-Frame-Options y Referrer-Policy.
- Interfaz responsive para escritorio, tablet y móvil.

## Flujo del administrador

```text
Primera ejecución
      
Crear administrador
      
bcrypt genera passwordHash
      
Iniciar sesión
      
Servidor crea una sesión temporal
      
Cookie HttpOnly
      
Panel de administración
      
POST / PUT / DELETE protegidos


El cliente normal solo puede consultar el catálogo, usar el carrito y realizar la compra simulada.

## Arquitectura

text
public/           Frontend HTML5, CSS3 y Vanilla JS
routes/           Definición de endpoints HTTP
controllers/      Entrada/salida HTTP
services/         Lógica de negocio
repositories/     Acceso y persistencia de datos
models/           Entidades POO
validators/       Validación y sanitización de datos
utils/            bcrypt y administración de sesiones
middleware/       Autenticación y manejo transversal de errores
data/             Persistencia JSON del proyecto
```

La separación aplica el principio SOLID de Responsabilidad Única (SRP). La lógica de negocio no depende directamente de Express ni del formato de almacenamiento.

## POO aplicada

- `BaseEntity` encapsula `id` y `createdAt` con campos privados.
- `Product` y `User` heredan de `BaseEntity`.
- `User` encapsula el hash de contraseña y nunca lo devuelve al frontend.
- `ProductRepository` y `UserRepository` heredan de `BaseJsonRepository`.
- Los servicios reciben sus repositorios por constructor.
- `SessionManager` encapsula la creación, consulta, expiración y destrucción de sesiones.

## API REST

| Método | Ruta | Acceso | Función |
|---|---|---|---|
| GET | `/api/products` | Público | Lista productos |
| POST | `/api/products` | Administrador | Crea producto |
| PUT | `/api/products/:id` | Administrador | Actualiza producto |
| DELETE | `/api/products/:id` | Administrador | Elimina producto |
| GET | `/api/auth/status` | Público | Consulta estado de sesión/configuración |
| POST | `/api/auth/setup` | Solo primera configuración | Crea el primer administrador |
| POST | `/api/auth/login` | Público | Verifica contraseña y crea sesión |
| POST | `/api/auth/logout` | Público | Destruye la sesión actual |

## Seguridad

- Nunca se almacena la contraseña en texto plano.
- bcrypt se usa para generar y comparar hashes.
- El backend valida nombre, precio, URL, usuario y contraseña.
- Los textos se sanitizan antes de persistirse.
- Las URLs solo aceptan protocolos `http` o `https`.
- El frontend usa `textContent` y creación de nodos DOM.
- POST, PUT y DELETE de inventario requieren una sesión válida.
- La sesión usa un token aleatorio de 32 bytes almacenado solo en el servidor.
- El navegador recibe el token mediante una cookie `HttpOnly`, por lo que JavaScript no puede leerla.
- La cookie utiliza `SameSite=Strict` y en producción puede usar `Secure`.
- Las sesiones expiran automáticamente después de 2 horas y se pierden al reiniciar el servidor.
- CSP limita scripts, estilos, imágenes y conexiones a orígenes previstos.
- No existen llaves secretas hardcodeadas.

## Variables opcionales

Copiar `.env.example` a `.env` si se desea configurar:

```text
PORT=3000
BCRYPT_ROUNDS=12
```

## Pruebas rápidas para la exposición

1. Abrir el catálogo y agregar productos al carrito.
2. Entrar a Administración sin haber creado usuario: aparece la configuración inicial.
3. Crear `admin123` con una contraseña de prueba como `ClaveSegura1`.
4. Mostrar `data/users.json` y comprobar que solo existe `passwordHash`.
5. Iniciar sesión con `admin123` y la contraseña elegida.
6. Crear, editar y eliminar un producto sin recargar la página.
7. Cerrar sesión y comprobar que el panel desaparece.
8. Intentar un POST/PUT/DELETE sin sesión y explicar que el backend responde 401.
9. Mostrar la estructura Routes -> Middleware -> Controllers -> Services -> Repositories.

