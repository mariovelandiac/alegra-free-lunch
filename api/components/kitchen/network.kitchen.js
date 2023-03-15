const express = require('express');
const router = express.Router();
const response = require('../../../network/response');
const controller = require('./index');

router.get('/make-dish', makeDish);
router.get('/dish-queue', dishQueue);
router.get('/dish-history', dishHistory)

// FUNCIONES DEL CRUD

async function makeDish(req, res, next) {
  try {
    const dish = await controller.makeDish();
    response.success(req,res, dish, 200);
  } catch (e) {
    next(e)
  };
};

async function dishQueue(req, res, next) {
  try {
    const dishQueue = await controller.getQueue();
    response.success(req,res, dishQueue, 200);
  } catch (e) {
    next(e)
  };
};

async function dishHistory(req, res, next) {
  try {
    const dishQueue = await controller.getHistory();
    response.success(req,res, dishQueue, 200);
  } catch (e) {
    next(e)
  };
};



module.exports = router;
