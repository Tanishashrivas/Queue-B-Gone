const express = require('express');
const router = express.Router();
const documentController = require('../controllers/documentController');
const upload = require('../middlewares/uploadManager');
const auth = require('../middlewares/auth');

router.post('/upload', auth, upload.single('pdf'), documentController.uploadDocument);
router.get('/', auth, documentController.getDocuments);
router.get('/:id', auth, documentController.getDocumentById);
router.post('/initiate-payment', auth, documentController.initiatePayment);
router.post('/confirm-payment', auth, documentController.confirmPayment);

module.exports = router;