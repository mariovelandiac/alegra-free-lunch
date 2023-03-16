const {DynamoDBClient, QueryCommand ,PutItemCommand, UpdateItemCommand} = require('@aws-sdk/client-dynamodb');
const {marshall, unmarshall} = require('@aws-sdk/util-dynamodb')
const config = require('./../config');
const region = config.aws.region;
const Table = config.aws.tableName;
const boom = require('@hapi/boom');

const client = new DynamoDBClient({
  region: region
});


async function insert(data = {}) {
  if (typeof data !== 'object' || data === null) {
    throw boom.conflict('No se puede ingresar ese tipo de dato')
  };
  const params = {
    TableName: Table,
    Item: marshall(data, {
      convertClassInstanceToMap: true
    })
  };
  const command = new PutItemCommand(params);
  const {$metadata} = await client.send(command);
  if ($metadata.httpStatusCode === 200) {
    return 'Created'
  } else {
    throw boom.conflict('Algo ha ocurrido con la base de datos')
  };
};

async function list(partitionKey, limit) {
  if (!limit) {
    limit = 20
  };
  if (typeof partitionKey !== 'string') {
    throw boom.conflict('No se puede ingresar ese tipo de dato')
  };

  const params = {
    TableName: Table,
    ExpressionAttributeValues: {
      ":pk": {
        S: partitionKey
      }
    },
    ExpressionAttributeNames: {
      "#name": "name",
      "#id": "id"
    },
    KeyConditionExpression: "entity = :pk",
    Limit: limit,
    ProjectionExpression: "#name, #id, ingredients, delivered, createdAt, quantitySold, purchased"
  };

  const command = new QueryCommand(params);
  const {Items, $metadata} = await client.send(command);
  if ($metadata.httpStatusCode === 200) {
    const response = [];
    Items.forEach(item => {
      response.push(unmarshall(item))
    });
    return response
  } else {
    throw boom.conflict('Algo ha ocurrido con la base de datos')
  };
};

async function get(partitionKey, sortKey) {
  if (typeof partitionKey !== 'string' || typeof sortKey !== 'string') {
    throw boom.conflict('No se puede ingresar ese tipo de dato')
  };

  const params = {
    TableName: Table,
    ExpressionAttributeNames: {
      "#name": "name"
    },
    ExpressionAttributeValues: {
      ":pk": {
        S: partitionKey
      },
      ":sk": {
        S: sortKey
      }
    },
    KeyConditionExpression: "entity = :pk AND id = :sk",
    ProjectionExpression: "#name, stock, ingredients"
  };
  const command = new QueryCommand(params);
  const {Items, $metadata} = await client.send(command);
  if ($metadata.httpStatusCode === 200) {
    const response = [];
    Items.forEach(item => {
      response.push(unmarshall(item))
    });
    return response[0] // primer y unico elemento encontrado
  } else {
    throw boom.conflict('Algo ha ocurrido con la base de datos')
  };
};

async function getByIndex(partitionKey, sortIndexKey, limit = 20) {
  if (typeof sortIndexKey !== 'string') {
    throw boom.conflict('No se puede ingresar ese tipo de dato')
  };

  const params = {
    TableName: Table,
    ExpressionAttributeNames: {
      "#name": "name",
      "#id": "id"
    },
    IndexName: "delivered-index",
    "ExpressionAttributeValues": {
      ":pk": {
        S: partitionKey
      },
      ":index" : {
        S: sortIndexKey
      },
    },
    limit: limit,
    KeyConditionExpression: "entity = :pk AND delivered = :index",
    ProjectionExpression: "#name, #id"
  };
  const command = new QueryCommand(params);
  const {Items, $metadata} = await client.send(command);
  if ($metadata.httpStatusCode === 200) {
    const response = [];
    Items.forEach(item => {
      response.push(unmarshall(item))
    });
    return response // primer y unico elemento encontrado
  } else {
    throw boom.conflict('Algo ha ocurrido con la base de datos')
  };
};

async function updateDishDelivered(sortKey, delivered) {

  if (typeof sortKey !== 'string') {
    throw boom.conflict('No se puede ingresar ese tipo de dato')
  };

  const params = {
    Key: {
      "entity": {
        S: 'Dish'
      },
      "id" : {
        S: sortKey
      },
    },
    "ExpressionAttributeValues": {
      ":changes": {
        S: delivered
      }
    },
    TableName: Table,
    UpdateExpression: "SET delivered = :changes"
  };

  const command = new UpdateItemCommand(params);
  const {$metadata} = await client.send(command);
  if ($metadata.httpStatusCode === 200) {
    return 'stock updated' // primer y unico elemento encontrado
  } else {
    throw boom.conflict('Algo ha ocurrido con la base de datos')
  };
};

module.exports = {
  list,
  get,
  getByIndex,
  insert,
  updateDishDelivered
}
