## TP3cloudComputing
Proyecto creado en Node utilizando AWS DynamoDB, AWS Lambda y AWS API Gateway (Pedernera,Nicolas)

**Legajo:** 42646

**Ejecutar los siguientes comandos:**

    docker network create awslocal
    docker run -p 8000:8000 --network awslocal --name dynamodb amazon/dynamodb-local -jar DynamoDBLocal.jar -sharedDb
    npm install
    node crearTabla.js
    sam local start-api --docker-network awslocal


