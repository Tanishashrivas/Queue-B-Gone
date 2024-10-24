const express = require('express');
const router = express.Router();
const AdminController = require('../controllers/adminController');
const auth = require('../middlewares/auth');
const roleCheck = require('../middlewares/roleCheck');

router.get('/admins', auth, AdminController.getAdmins); 
router.get('/pending-documents', auth, roleCheck(['admin']), AdminController.getPendingDocuments);
router.put('/document/:id', auth, roleCheck(['admin']), AdminController.updateDocumentStatus);
router.get('/dashboard-stats', auth, roleCheck(['admin']), AdminController.getAdminDashboardStats);
router.get('/pending-verifications', auth, roleCheck(['admin']), AdminController.getPendingAdminVerifications);
router.put('/verify/:id', auth, roleCheck(['admin']), AdminController.verifyAdmin);

module.exports = router