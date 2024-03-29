const express = require('express');
const router = express.Router();
const response = require('./../network/response');
const controller = require('./index');

router.get('/make-dish', makeDish);
router.get('/dish-queue', dishQueue);
router.get('/dish-history', dishHistory);
router.get('/menu', getMenu);

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
    const {limit} = req.query;
    const dishQueue = await controller.getHistory(limit);
    response.success(req,res, dishQueue, 200);
  } catch (e) {
    next(e)
  };
};

async function getMenu(req, res, next) {
  try {
    const {limit} = req.query;
    const dishQueue = await controller.getMenu(limit);
    response.success(req,res, dishQueue, 200);
  } catch (e) {
    next(e)
  };
};



module.exports = router;
