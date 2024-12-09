MARTIN SANTOS

En la consola de tu IDE coloca los siguientes pasos, para poder levantar el proyecto correctamente:

1. **Clonar el repositorio de Git Hub en tu PC:**

    ```
    git clone https://github.com/etec-integration-project/etec-pi-2024-backend-Martin-Santos.git
    ```
2. **Navega al directorio del mismo proyecto:**

    ```
    cd etec-pi-2024-backend-Martin-Santos
    ```

3. **Crear la red de docker**
    ```
    docker network create santos-app-network
    ```

3. **Iniciar los contenedores de docker y el proyecto:**
    Colocar los siguientes comandos en el mismo orden:
    ```
    docker compose up -d db 
    docker compose up -d --build app 
    docker compose down app
    docker compose up --build
    ```
4. **Acceder a la aplicación:**

    Cuando los contenedores de Docker estén en funcionamiento (debes asegurarte que la consola de tu IDE muestre: "ready for connections"). Luego abre tu navegador y coloca el siguiente link en el buscador:
   `http://localhost:3000/ping` para  ver la consulta que realiza el codigo del BackEnd a la base datos. Que en este caso es una consulta NOW() la cual muestra un json con la informacion de la fecha y hora
   del ultimo acceso a la misma.

5. **Peticiones mediante Curl**

    En una nueva terminal colocar los siguietes comandos:

    Para registrar un usuario:
    ```
    curl -X POST http://localhost:3000/autenticacion/registrar \
    -H "Content-Type: application/json" \
    -d '{
        "username": "user_test",
        "password": "password_test"
        }'
    ```
    Para logearse:
    ```
    curl -X POST http://localhost:3000/autenticacion/iniciar-sesion \
    -H "Content-Type: application/json" \
    -d '{
        "username": "user_test",
        "password": "password_test"
        }'
    ```
    Para ver los usuarios registrados:
    ```
    curl -X GET http://localhost:3000/autenticacion/usuarios
    ```

## **Parar el proyecto y los contenedores de Docker**

Para detener la ejecución, solo presiona "Ctrl + C" en la terminal donde anteriormente ya ejecutaste el comando `docker-compose up --build`. Esto va a detener los contenedores y posteriormente dejará de utilizar los puertos que el proyecto requiere para fucionar.

