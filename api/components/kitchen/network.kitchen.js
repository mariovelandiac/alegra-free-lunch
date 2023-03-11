const express = require('express');
const router = express.Router();
const response = require('../../../network/response');
const controller = require('./index');

router.get('/make-dish', makeDish);

// FUNCIONES DEL CRUD

async function makeDish(req, res) {
  try {
    const dish = await controller.makeDish();
    response.sucess(req,res, dish, 200);
  } catch (e) {
    console.log(e)
    response.error(req, res,e.message, 500);
  };
};



module.exports = router;
