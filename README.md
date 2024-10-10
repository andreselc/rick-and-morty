# Rick & Morty API
Desarrollo de una API REST para gestión de personajes y episodios de Rick y Morty.

## Recursos utliizados

1. NodeJS para el desarrollo de la API.
2. Prisma para la gestión de la base de datos.
3. PostgreSQL como motor de base de datos.

## Ejecución local de proyecto

1. Clonar el repositorio utilizando el comando:

```bash
 git clone https://github.com/andreselc/rick-and-morty.git
```

2. Instalar las dependencias con `npm install`
3. Crear un archivo `.env` en la raíz del proyecto con las siguientes variables de entorno:

```bash
DATABASE_URL="postgresql://usuario:contraseña@localhost:5432/nombre_base_de_datos"
```

4. Ejecutar el comando `npx prisma migrate dev` para crear las tablas en la base de datos.

5. Ejecutar el comando `npm run start:dev` para iniciar el servidor en modo desarrollo.

6. Acceder a la URL `http://localhost:3000/docs` para probar la API.

## Modelo de datos

![Modelo E-R](rick-and-morty-api/../images/ModeloER-RickMorty.png)

## Autor

- ### [@Andrés López](https://github.com/andreselc) [![linkedin](https://img.shields.io/badge/linkedin-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/andres-lopez-644338281/)

