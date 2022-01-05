var express = require('express');
var router = express.Router();
const controller = require('../../controllers/api/moviesController')

router.get('/', controller.getAll);
router.get('/:id', controller.getOne);
router.post('/', controller.create);
router.put('/update/:id', controller.update);
router.delete('/delete/:id', controller.delete);


module.exports = router