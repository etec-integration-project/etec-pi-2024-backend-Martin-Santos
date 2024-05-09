MARTIN SANTOS

Abrir la carpeta del proyecto en una nueva venta de Visual Studio.
Una vez alli abrir la consola aplicando la combinacion de teclas Ctrl + j, una vez abierta poner el siguiente comando: 
- docker compose up --build -d

     
Luego de que el servicio se haya levantado abrir la aplicacion Postman si Usted la tiene instalada, y colocar la siguiente url con la ruta /ping para que devuelva un JSON una consulta con la fecha del ultimo acceso a la base de datos:  
- Via Postman
- localhost:3000/ping
