const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');

exports.handler = async (event) => {
    var dynamodb = new AWS.DynamoDB({
        apiVersion: '2012-08-10',
        endpoint: 'http://dynamodb:8000',
        region: 'us-west-2',
        credentials: {
            accessKeyId: '2345',
            secretAccessKey: '2345'
        }
    });
    var docClient = new AWS.DynamoDB.DocumentClient({
        apiVersion: '2012-08-10',
        service: dynamodb
    });
    
    switch (event.httpMethod) {
        case "POST":
            if (event.path === "/envios") {
                let body = JSON.parse(event.body)
                if (!body.destino || !body.email) {
                    return {
                        statusCode: 400,
                        headers: { "content-type": "application/json" },
                        body: JSON.stringify({
                            Mensaje: "Error",
                            Ejemplo: {
                                destino: "Cordoba",
                                email: "ejemplo@gmail.com"
                            }
                        })
                    }
                }
                let params = {
                    TableName: 'Envio',
                    Item: {
                        id: uuidv4(),
                        fechaAlta: new Date().toISOString(),
                        destino: body.destino,
                        email: body.email,
                        pendiente: new Date().toISOString(),
                    }
                };

                try {
                    await docClient.put(params).promise()
                    return {
                        statusCode: 201,
                        headers: { "content-type": "application/json" },
                        body: JSON.stringify(params.Item)
                    };
                } catch {
                    return {
                        statusCode: 400,
                        headers: { "content-type": "text/plain" },
                        body: "No se creo el envio"
                    };
                }

            }
        case "GET":
            if (event.path === "/envios/pendientes") {
                let params = {
                    TableName: 'Envio',
                    IndexName: 'EnviosPendientesIndex'
                };

                try {
                    const envios = await docClient.scan(params).promise()
                    return {
                        statusCode: 200,
                        headers: { "content-type": "application/json" },
                        body: JSON.stringify(envios)
                    }
                } catch (err) {
                    console.log(err)
                    return {
                        statusCode: 400,
                        headers: { "content-type": "text/plain" },
                        body: "No se obtuvo los envios pendientes."
                    };
                }

            }
        case "PUT":
            if (event.path === `/envios/${event.pathParameters.idEnvio}/entregado`) {

                const idEnvio = (event.pathParameters || {}).idEnvio || false;
                let params = {
                    TableName: "Envio",
                    Key: {
                        id: idEnvio
                    },
                    UpdateExpression: "remove pendiente",
                    ConditionExpression: "attribute_exists(pendiente)",
                    ReturnValues: "UPDATED_NEW"
                };

                try {
                    await docClient.update(params).promise()
                    return {
                        statusCode: 200,
                        headers: { "content-type": "text/plain" },
                        body: `El envio id: ${idEnvio} fue entregado.`
                    };
                } catch {
                    return {
                        statusCode: 400,
                        headers: { "content-type": "text/plain" },
                        body: `Error para actualizar ${idEnvio}.`
                    };
                }
            }

        default:
            return {
                statusCode: 400,
                headers: { "content-type": "text/plain" },
                body: `Método ${httpMethod} no soportado.`
            };
    }

}