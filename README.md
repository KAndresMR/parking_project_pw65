# Public Parking Management Web App

## Descripción General

La **Public Parking Management Web App** es una aplicación web desarrollada en Angular que tiene como objetivo principal gestionar eficientemente un parqueadero público, brindando diferentes funcionalidades tanto para administradores (cajeros) como para usuarios (conductores de vehículos). Esta aplicación permite una gestión organizada y segura de los espacios del parqueadero, contratos de arriendo, usuarios registrados y horarios de operación. La aplicación sigue principios de diseño centrados en el usuario, con interfaces intuitivas y un flujo claro de navegación, y está optimizada para ofrecer una experiencia consistente tanto en dispositivos móviles como de escritorio.

La aplicación será desplegada en **Firebase Hosting**, asegurando que esté disponible de forma pública y accesible desde cualquier lugar. Además, para garantizar la seguridad y facilidad de uso, la autenticación de usuarios se realizará mediante **Firebase Authentication**, utilizando Google como proveedor de acceso.

## Funcionalidades

### 1. Autenticación y Seguridad

La aplicación proporciona un sistema de autenticación que permite a los usuarios registrarse e iniciar sesión utilizando sus cuentas de Google. Este sistema es gestionado mediante Firebase Authentication, garantizando que el proceso de inicio de sesión sea seguro y rápido. Los usuarios podrán acceder a diferentes secciones de la aplicación según su rol (administrador o usuario estándar), asegurando una experiencia personalizada.

- Inicio de sesión con Google.
- Autenticación segura mediante Firebase Authentication.
- Acceso diferenciado por roles (Administradores vs Usuarios estándar).

### 2. Funcionalidades para Administradores (Cajero)

Los administradores del parqueadero tendrán acceso a un conjunto de herramientas que les permitirán gestionar de manera eficiente los diferentes aspectos del parqueadero, desde los espacios disponibles hasta los contratos de arriendo. A continuación se detallan las principales funciones disponibles para los administradores:

#### 2.1. Gestión de Espacios de Parqueadero

Los administradores podrán gestionar los espacios disponibles en el parqueadero, asignar espacios a vehículos, y asegurarse de que los conductores tengan acceso a estos espacios de manera organizada.

- Visualización y gestión de los espacios disponibles en el parqueadero.
- Asignación de espacios a vehículos según la disponibilidad.
- Creación de un registro de la ocupación de los espacios en tiempo real.

#### 2.2. Gestión de Contratos de Arriendo

Para clientes que deseen arrendar un espacio de parqueo de manera mensual, los administradores podrán gestionar contratos de arriendo. Los contratos incluirán detalles como el nombre del usuario, el espacio asignado, la fecha de inicio y fin del contrato, y el precio del arriendo.

- Creación y edición de contratos de arriendo.
- Asignación de contratos a espacios específicos del parqueadero.
- Visualización del estado de los contratos (vigentes, vencidos, etc.).

#### 2.3. Gestión de Usuarios Registrados

Los administradores tendrán control sobre los usuarios registrados en el sistema, pudiendo ver sus perfiles, editar información importante y realizar acciones administrativas como suspender cuentas o eliminar usuarios del sistema.

- Visualización de la lista de usuarios registrados.
- Edición de perfiles de usuarios: nombre, correo, rol, etc.
- Acciones administrativas: suspender o eliminar usuarios.

#### 2.4. Definición del Horario de Trabajo

Los administradores podrán definir los horarios de operación del parqueadero, estableciendo los días y horas en que estará abierto al público. Esto incluye la configuración de horas de apertura y cierre, así como la posibilidad de ajustar el horario según días festivos o circunstancias especiales.

- Configuración de los días de operación del parqueadero.
- Definición de las horas de apertura y cierre diarias.
- Posibilidad de ajustar el horario según necesidades.

### 3. Funcionalidades para Usuarios (Conductores de Vehículos)

Los usuarios estándar, que serán los conductores que utilizan el parqueadero, tendrán acceso a varias funcionalidades para gestionar su perfil personal y visualizar los espacios de parqueo disponibles.

#### 3.1. Registro y Gestión de Perfil

Los usuarios podrán registrarse en el sistema mediante su cuenta de Google, creando automáticamente un perfil personal. Desde su perfil, podrán actualizar su información básica, como su nombre y correo electrónico.

- Registro automático mediante Google.
- Edición de perfil: actualización de nombre, correo y otra información personal.

#### 3.2. Visualización de Espacios Disponibles

Los usuarios podrán ver en tiempo real los espacios disponibles en el parqueadero, lo que les permitirá planificar su visita y asegurar que tienen un lugar donde estacionar su vehículo.

- Visualización en tiempo real de los espacios de parqueo disponibles.

### 4. Diseño y Usabilidad

La aplicación sigue los principios de diseño de interfaces centradas en el usuario y la usabilidad, asegurando una navegación fácil y una experiencia coherente en dispositivos de diferentes tamaños (responsive design). Antes de la implementación final, se desarrolló un prototipo en **Figma** para validar el diseño de las interfaces y mejorar la experiencia del usuario.

- Diseño intuitivo y atractivo.
- Prototipo validado en Figma antes de la implementación.
- Interfaz responsive, asegurando una buena experiencia tanto en móviles como en escritorio.

### 5. Publicación y Accesibilidad

La aplicación será publicada en **Firebase Hosting**, lo que permitirá que sea accesible públicamente desde cualquier dispositivo con conexión a internet. Firebase Hosting ofrece un entorno rápido y seguro para servir aplicaciones web.

- Despliegue de la aplicación en Firebase Hosting.
- Accesibilidad pública desde una URL proporcionada por Firebase.

## Tecnologías Utilizadas

- **Angular**: Framework de desarrollo frontend para crear una interfaz de usuario dinámica y moderna.
- **Firebase Authentication**: Para el manejo de la autenticación de usuarios con Google.
- **Firebase Hosting**: Para la publicación y alojamiento de la aplicación web.
- **Figma**: Para el diseño y prototipado de la interfaz de usuario.
- **Visual Studio Code (VS Code)**: Editor de código utilizado para el desarrollo del proyecto.

---

Este proyecto está diseñado para brindar una gestión eficiente y moderna de los parqueaderos públicos, con funcionalidades clave que cubren desde la administración de espacios y contratos, hasta la personalización de perfiles de usuario.
