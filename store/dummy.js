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
  menu: [
    { name: 'Pollo gratinado',
      ingredients: {
        cheese: 2,
        chicken: 1,
        onion: 1,
        potato:2,
      },
    },
    {
      name: 'Bistek de Carne',
      ingredients: {
        ketchup: 2,
        meat: 1,
        tomato: 2,
        rice: 1,
      }
    },
    {
      name: 'Pollo al Limón',
      ingredients: {
        chicken: 1,
        lemon: 2,
        lettuce: 1,
        rice: 1,
      }
    },
    {
      name: 'Bistek gratinado',
      ingredients: {
        cheese: 1,
        meat: 1,
        onion: 1,
        rice: 2,
      }
    },
    {
      name: 'Arroz Mixto',
      ingredients: {
        chicken: 1,
        meat: 1,
        onion: 1,
        rice: 2,
        tomato: 1,
      }
    },
    {
      name: 'Vegetariano',
      ingredients: {
        cheese:2,
        onion: 1,
        potato: 1,
        rice: 1,
        tomato: 1,
      }
    }
  ]
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
    return false
  }
};

async function update(table, changes) {
  if (table ==='ordersToMarket') {
    db[table].push(changes);
    return db[table]
  };

  db[table] = {
    ...db[table],
    ...changes
  };
  return 'db updated'
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
