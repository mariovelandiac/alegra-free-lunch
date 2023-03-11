function selectOneDish() {

  const dishes = [
    'gratinChicken',
    'steak',
    'lemonChicken',
    'gratinMeat',
    'mixedRice',
    'veggie'
  ];

  const dishesDetail = {
    gratinChicken: {
      name: 'Pollo gratinado',
      ingredients: {
        cheese: 2,
        chicken: 1,
        onion: 1,
        potato:2,
      },
    },
    steak: {
      name: 'Bistek de Carne',
      ingredients: {
        ketchup: 2,
        meat: 1,
        tomato: 2,
        rice: 1,
      }
    },
    lemonChicken: {
      name: 'Pollo al Limón',
      ingredients: {
        chicken: 1,
        lemon: 2,
        lettuce: 1,
        rice: 1,
      }
    },
    gratinMeat: {
      name: 'Bistek gratinado',
      ingredients: {
        cheese: 1,
        meat: 1,
        onion: 1,
        rice: 2,
      }
    },
    mixedRice: {
      name: 'Arroz Mixto',
      ingredients: {
        chicken: 1,
        meat: 1,
        onion: 1,
        rice: 2,
        tomato: 1,
      }
    },
    veggie: {
      name: 'Vegetariano',
      ingredients: {
        cheese:2,
        onion: 1,
        potato: 1,
        rice: 1,
        tomato: 1,
      }
    }

  };

  const amountOfDishes = 6; // cantidad e platos entre los que se puede escoger
  const randomNumber = getRandomNumber(amountOfDishes); // este número estará entre 0 y 5, que son los espacios disponibles por el array dishes
  const dish = dishes[randomNumber];
  const dishDetail = dishesDetail[dish];
  const details = dishDetail;


  return {
    dish,
    details
  }
};

function getRandomNumber(max) {
  const number = Math.floor((max)*Math.random());
  return number;
}

module.exports = selectOneDish;
