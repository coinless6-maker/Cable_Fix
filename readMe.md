# CableFix E-commerce App

Full-stack e-commerce app with React frontend and Node.js/Express backend using MySQL. Prerequisites: Node.js, npm, MySQL installed.

Create database:
```cmd
mysql -u root -p -e "DROP DATABASE IF EXISTS cablefix; CREATE DATABASE cablefix CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
```

Import schema:
```cmd
mysql -u root -p cablefix < ./schema.sql
```

Import dummy data:
```cmd
mysql -u root -p cablefix < ./dummy_database.sql
```

Verify database:
```cmd
mysql -u root -p
USE cablefix;
SHOW TABLES;
SELECT * FROM users;
SELECT * FROM products;
```

Install dependencies and run server:
```cmd
cd server
npm install
npm run dev
```

Install dependencies and run client:
```cmd
cd client
npm install
npm run dev
```

Frontend runs on `http://localhost:5173` and backend on `http://localhost:5000`.