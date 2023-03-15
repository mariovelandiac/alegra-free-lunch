const Joi = require("joi");


const id = Joi.string();
const name = Joi.string()
const cheese = Joi.number().integer();
const chicken = Joi.number().integer();
const lemon = Joi.number().integer();
const lettuce = Joi.number().integer();
const ketchup = Joi.number().integer();
const meat = Joi.number().integer();
const onion = Joi.number().integer();
const potato = Joi.number().integer();
const rice = Joi.number().integer();
const tomato = Joi.number().integer();
const delivered = Joi.string();
const createdAt = Joi.date();


const getIngredientsSchema = Joi.object({
  id: id.required(),
  name: name.required(),
  ingredients: {
    cheese,
    chicken,
    lemon,
    lettuce,
    ketchup,
    meat,
    onion,
    potato,
    rice,
    tomato
  },
  delivered,
  createdAt
});


module.exports = getIngredientsSchema
