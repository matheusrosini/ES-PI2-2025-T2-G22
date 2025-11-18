// Feito por Matheus Rosini
const express = require('express');
const router = express.Router();
const controller = require('../controllers/instituicaoController');
const { authMiddleware } = require('../middlewares/authmiddleware');

// Todas as rotas da entidade instituicao devem ser protegidas:
router.get('/', authMiddleware, controller.getAllInstituicoes);
router.post('/', authMiddleware, controller.createInstituicao);
router.get('/:id', authMiddleware, controller.getInstituicaoById);
router.put('/:id', authMiddleware, controller.updateInstituicao);
router.delete('/:id', authMiddleware, controller.deleteInstituicao);

module.exports = router;
