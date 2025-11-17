const express = require("express");
const router = express.Router();
<<<<<<< Updated upstream
<<<<<<< Updated upstream
const turmaController = require("../controllers/turmaController");

// Rotas da turma
router.get("/", turmaController.getAllTurmas);
router.get("/:id", turmaController.getTurmaById);
router.post("/", turmaController.createTurma);
router.put("/:id", turmaController.updateTurma);
router.delete("/:id", turmaController.deleteTurma);

=======
=======
>>>>>>> Stashed changes
<<<<<<< HEAD
const turmaController = require('../controllers/turmaController');
const { requireAuth } = require('../middlewares/authmiddleware');

router.use(requireAuth);
=======
const turmaController = require("../controllers/turmaController");
>>>>>>> e249d8c62d75e513def498a3b74a01006d08ff49

// Rotas da turma
router.get("/", turmaController.getAllTurmas);
router.get("/:id", turmaController.getTurmaById);
router.post("/", turmaController.createTurma);
router.put("/:id", turmaController.updateTurma);
router.delete("/:id", turmaController.deleteTurma);

<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
module.exports = router;
