let db = {
  ingredients: {
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
  }
};

async function list() {
  return db.ingredients
};

async function update(changes) {
    db.ingredients = {
    ...db.ingredients,
    ...changes
  };
  return db.ingredients
}


module.exports = {
  list,
  update
}
