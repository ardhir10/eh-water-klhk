<p align="center"><img src="http://grootech.id/frontAsset/img/logo_groot.png"></p>



## E+H WATER KLHK

### Requirement

1. Laragon (Min Version  Apache 2.4, PHP 7.2) : https://laragon.org/download/
2. Composer (Min Version 1.10.20) : https://getcomposer.org/download/
3. Node Js (Min Version 12.18.3) : https://nodejs.org/en/download/
4. Posgresql (Min Version 12) : https://www.enterprisedb.com/download-postgresql-binaries

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/ardhir10/eh-water-klhk.git
   ```
2. Install Vendor packages
   ```sh
   composer install
   
   create file .env copy from .env-example
   ```
3. Install modbus_driver
   ```JS
   go to folder DriverGateway/modbus_driver
   ``` 
   ```sh
   run npm install
   create file env.json copy from env.example.json
   
   configure file env.json
   {
     "host": "localhost",
     "user": "postgres",
     "database": "database_name",
     "password": "password",
     "port": 5432
   }
   ```
4. Install websocket_driver NPM packages
   ```JS
   go to folder  DriverGateway/websocket_driver
   ``` 
   ```sh
   npm install
   create file env.json copy from env.example.json
   
   configure file env.json
   {
   	"port": 1010
   }
   ```
 ### Running
 Production mode need install <a href="https://www.npmjs.com/package/pm2" target="_blank">pm2</a> &  <a href="https://www.npmjs.com/package/pm2-windows-startup" target="_blank">pm2-windows-startup</a>
 1. Run Websocket
     ```JS
     go to folder  DriverGateway/websocket_driver
     run start-websocket (no-pm2).bat (Development)
     run start-websocket (no-pm2).bat (Production)
     ``` 
 2. Run Modbus Driver
     ```JS
     go to folder  DriverGateway/modbus_driver
     run start-modbus-system (no-pm2).bat (Development)
     run start-modbus-system (no-pm2).bat (Production)
     ``` 
