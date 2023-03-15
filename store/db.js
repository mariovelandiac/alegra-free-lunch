const {DynamoDBClient, PutItemCommand} = require('@aws-sdk/client-dynamodb');
const Table = 'alegra-test';

const client = new DynamoDBClient({
  region: 'sa-east-1'
});


async function insertDish(data = {}, entity) {
  const Item = {};
  const ingredientsType = {}
  const ingredientsArray = Object.entries(data.ingredients);
  ingredientsArray.forEach(item => {
    ingredientsType[item[0]] = {
      N: item[1].toString()
    }
  })
  const dataArray = Object.entries(data);
  dataArray.forEach(item => {
    if (typeof item[1] === 'string') {
      Item[item[0]] = {
        S: item[1]
     }
    }
    if (typeof item[1] == 'object') {
      Item[item[0]] = {
        M: {...ingredientsType}
     }
    }
  });
  Item.entity = {S: entity}
  const params = {
    TableName: Table,
    Item: {...Item}
  };
  console.log(params.Item.ingredients)
  try {
    const command = new PutItemCommand(params);
    const response = await client.send(command);
    return response
  } catch (e) {
    console.log(e)
  }
};

module.exports = {
  insert: insertDish
}
