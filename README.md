MARTIN SANTOS

En la consola de tu IDE lleva a cabo los siguientes pasos para poder levantar el proyecto correctamente:

1. **Clonar el repositorio de Git Hub en tu PC:**

    ```
    git clone https://github.com/etec-integration-project/etec-pi-2024-backend-Martin-Santos.git
    ```
2. **Navega al directorio del mismo proyecto:**

    ```
    cd etec-pi-2024-backend-Martin-Santos
    ```
3. **Iniciar los contenedores y el proyecto:**

    ```
    docker-compose up --build -d 
    ```
4. **Accede a la aplicación:**

    Una vez que los contenedores de Docker estén en funcionamiento (asegurarse que la consola del IDE muestre: "ready for connection"), abrir tu navegador y coloca el siguiente enlace en el buscador:
   `http://localhost:3000/ping` para poder ver la consulta que realiza el codigo del BackEnd a la base datos. Que en este caso es una consulta NOW() la cual muestra un json con la informacion de la fecha y hora
   del ultimo acceso a la misma.

## **Parar el proyecto y los contenedores de Docker**

Para detener la ejecución, simplemente presiona "Ctrl + C" en la terminal donde anteriormente ya ejecutaste el comando `docker-compose up`. Esto detendrá los contenedores y en consecuencia dejará de utilizar los puertos utilizados.

