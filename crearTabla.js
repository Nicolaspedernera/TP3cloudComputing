var AWS = require("aws-sdk");

AWS.config.update({
  region: "us-west-2",
  endpoint: "http://localhost:8000"
});

var dynamodb = new AWS.DynamoDB();

var params = {
    TableName: 'Envio',
    KeySchema: [
        {AttributeName: 'id',KeyType: 'HASH',}
    ],
    AttributeDefinitions: [
        {AttributeName: 'id',AttributeType: 'S',},
        {AttributeName: 'pendiente',AttributeType: 'S',},
    ],
    ProvisionedThroughput: {
        ReadCapacityUnits: 1, 
        WriteCapacityUnits: 1, 
    },
    GlobalSecondaryIndexes: [
        { 
            IndexName: 'EnviosPendientesIndex', 
            KeySchema: [
                {AttributeName: 'id',KeyType: 'HASH'},
                {AttributeName: 'pendiente', KeyType: 'RANGE'}
            ],
            Projection: {
                ProjectionType: 'ALL'
            },
            ProvisionedThroughput: {
                ReadCapacityUnits: 1,
                WriteCapacityUnits: 1,
            },
        },
    ],
};
dynamodb.createTable(params, function(err, data) {
    if (err) {
        console.error("No se puede crear la tabla. Error:", JSON.stringify(err, null, 2));
    } else {
        console.log("Tabla creada:", JSON.stringify(data, null, 2));
    }
});