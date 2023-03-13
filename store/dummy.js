let db = {
  stock: {
    cheese: 5,
    chicken: 5,
    lemon: 5,
    lettuce: 5,
    ketchup: 5,
    meat: 5,
    onion: 5,
    potato: 5,
    rice: 5,
    tomato: 5,
  },
  dishQueue: [],
  dishHistory: [],
  ordersToMarket: [],
};

async function list(table) {
  return db[table]
};

async function get(table, id) {
  const items = db[table];
  const element = items.find(item => item.id === id);
  return element
};

async function insert(table, item) {
  try {
    db[table].push(item);
    return 'item created'
  } catch (e) {
    console.log(e);
    return false
  }
};

async function update(table, changes) {
    db[table] = {
    ...db[table],
    ...changes
  };
  return db[table]
};

async function remove(table, id) {
  const items = db[table];
  const index = items.findIndex(item => item.id === id);
  if (index === -1) {
    return false
  }
  items.splice(index,1);
  return 'item deleted'
};


module.exports = {
  list,
  get,
  update,
  insert,
  remove
};
