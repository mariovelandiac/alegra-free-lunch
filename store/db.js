const {DynamoDBClient, PutItemCommand} = require('@aws-sdk/client-dynamodb');
const Table = 'alegra-test';

const client = new DynamoDBClient({
  region: 'sa-east-1'
});


async function insert(data = {}, entity) {
  data.entity = entity;
  console.log(data)
  const params = {
    TableName: Table,
    Item: {
      entity: {
        S: 'dish'
      },
      id: {
        S: 'test'
      }
    }
  };
  try {
    const command = new PutItemCommand(params);
    const response = await client.send(command);
    return response
  } catch (e) {
    console.log(e)
  }
};

module.exports = {
  insert
}
