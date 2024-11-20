// controllers/adminController.js
const Document = require('../models/Document');
const User = require('../models/user');

exports.getAdmins = async (req, res) => {
  try {
    const admins = await User.find({ role: 'admin' }).select('-password'); // Fetch all admins without passwords
    res.json(admins);
  } catch (error) {
    console.error("Fetch admins error:", error);
    res.status(500).json({ error: "Failed to fetch admins" });
  }
};

exports.getAdminById = async (req, res) => {
  try {
    const adminId = req.params.id; 
    
    const admin = await User.findById(adminId).select('-password');
    
    if (!admin) {
      return res.status(404).json({ error: "Admin not found" });
    }
    
    res.json(admin);
  } catch (error) {
    console.error("Fetch admin by ID error:", error);
    res.status(500).json({ error: "Failed to fetch admin" });
  }
};

exports.getPendingDocuments = async (req, res) => {
  try {
    const documents = await Document.find({ status: 'processing' })
      .sort({ createdAt: 1 })
      .populate('user', 'email mobileNumber');
    res.json(documents);
  } catch (error) {
    console.error('Fetch pending documents error:', error);
    res.status(500).json({ error: 'Failed to fetch pending documents' });
  }
};

exports.updateDocumentStatus = async (req, res) => {
  try {
    const { documentId, status } = req.body;
    const document = await Document.findByIdAndUpdate(documentId, { status }, { new: true });
    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }
    res.json(document);
  } catch (error) {
    console.error('Update document status error:', error);
    res.status(500).json({ error: 'Failed to update document status' });
  }
};

exports.getAdminDashboardStats = async (req, res) => {
  try {
    const totalDocuments = await Document.countDocuments();
    const pendingDocuments = await Document.countDocuments({ status: 'processing' });
    const completedDocuments = await Document.countDocuments({ status: 'completed' });
    const totalRevenue = await Document.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $group: { _id: null, total: { $sum: '$price' } } }
    ]);

    res.json({
      totalDocuments,
      pendingDocuments,
      completedDocuments,
      totalRevenue: totalRevenue[0]?.total || 0
    });
  } catch (error) {
    console.error('Fetch admin stats error:', error);
    res.status(500).json({ error: 'Failed to fetch admin dashboard stats' });
  }
};

exports.getPendingAdminVerifications = async (req, res) => {
  try {
    const pendingAdmins = await User.find({ role: 'admin', verificationStatus: 'pending' });
    res.json(pendingAdmins);
  } catch (error) {
    console.error('Fetch pending admin verifications error:', error);
    res.status(500).json({ error: 'Failed to fetch pending admin verifications' });
  }
};

exports.verifyAdmin = async (req, res) => {
  try {
    const { adminId, verificationStatus } = req.body;
    const admin = await User.findByIdAndUpdate(adminId, { verificationStatus }, { new: true });
    if (!admin) {
      return res.status(404).json({ error: 'Admin not found' });
    }
    res.json(admin);
  } catch (error) {
    console.error('Verify admin error:', error);
    res.status(500).json({ error: 'Failed to verify admin' });
  }
};