const path = require("path");
const Document = require("../models/Document");
const fs = require("fs");
const {
  processDocument,
  addTokenToFirstPage,
} = require("../utils/pdfProcessor");
const { generateUniqueToken } = require("../utils/tokenGenerator");
const { initiatePayment, verifyPayment } = require("../utils/paymentGateway");

exports.uploadDocument = async (req, res) => {
  try {
    const fileBuffer = req.file.buffer; // Multer stores the PDF in buffer
    const userId = req.user.id;
    const adminId = req.body.adminId;

    const { pageCount, price } = await processDocument(fileBuffer);

    const tokenNumber = generateUniqueToken();

    const originalPdfDir = path.join(__dirname, "../uploads/originals/");

    if (!fs.existsSync(originalPdfDir)) {
      fs.mkdirSync(originalPdfDir, { recursive: true });
    }

    const originalPdfPath = path.join(
      originalPdfDir,
      `${userId}-${Date.now()}-${req.file.originalname}`
    );

    fs.writeFileSync(originalPdfPath, fileBuffer);

    const document = new Document({
      user: userId,
      admin: adminId,
      fileName: req.file.originalname,
      pageCount,
      price,
      tokenNumber,
      fileUrl: originalPdfPath,
    });

    await document.save();

    const modifiedPdfBuffer = await addTokenToFirstPage(
      fileBuffer,
      tokenNumber
    );

    const modifiedPdfDir = path.join(__dirname, "../uploads/modified/");

    // Create the modified directory if it doesn't exist
    if (!fs.existsSync(modifiedPdfDir)) {
      fs.mkdirSync(modifiedPdfDir, { recursive: true });
    }

    const modifiedPdfPath = path.join(
      modifiedPdfDir,
      `${document._id}-modified.pdf`
    );

    // Write the modified PDF to the defined path
    fs.writeFileSync(modifiedPdfPath, modifiedPdfBuffer);

    document.modifiedPdfPath = modifiedPdfPath;
    await document.save();

    res
      .status(201)
      .json({
        document,
        message: "Document uploaded and token added successfully",
      });
  } catch (error) {
    console.error("Document upload error:", error);
    res.status(500).json({ error: "Document upload failed" });
  }
};

exports.addTokenToDocument = async (req, res) => {
  try {
    const { documentId } = req.body;
    const document = await Document.findOne({
      _id: documentId,
      user: req.user.id,
    });

    if (!document) return res.status(404).json({ error: "Document not found" });

    const modifiedPdfPath = await addTokenToFirstPage(
      req.file.buffer,
      document.tokenNumber
    );

    res
      .status(200)
      .json({ message: "Token added to document", modifiedPdfPath });
  } catch (error) {
    console.error("Add token to document error:", error);
    res.status(500).json({ error: "Failed to add token to document" });
  }
};

exports.getDocuments = async (req, res) => {
  try {
    const documents = await Document.find({ user: req.user.id }).sort({
      createdAt: -1,
    });
    res.json(documents);
  } catch (error) {
    console.error("Fetch documents error:", error);
    res.status(500).json({ error: "Failed to fetch documents" });
  }
};

exports.getDocumentById = async (req, res) => {
  try {
    const document = await Document.findOne({
      _id: req.params.id,
      user: req.user.id,
    });
    if (!document) return res.status(404).json({ error: "Document not found" });

    res.json(document);
  } catch (error) {
    console.error("Fetch document error:", error);
    res.status(500).json({ error: "Failed to fetch document" });
  }
};

exports.initiatePayment = async (req, res) => {
  try {
    const { documentId } = req.body;
    const document = await Document.findOne({
      _id: documentId,
      user: req.user.id,
    });
    if (!document) return res.status(404).json({ error: "Document not found" });

    const paymentDetails = await initiatePayment(
      document.price,
      `Payment for document ${document.tokenNumber}`
    );
    res.json(paymentDetails);
  } catch (error) {
    console.error("Payment initiation error:", error);
    res.status(500).json({ error: "Failed to initiate payment" });
  }
};

exports.confirmPayment = async (req, res) => {
  try {
    const { documentId, paymentId } = req.body;
    const document = await Document.findOne({
      _id: documentId,
      user: req.user.id,
    });
    if (!document) return res.status(404).json({ error: "Document not found" });

    const paymentVerified = await verifyPayment(paymentId);
    if (paymentVerified) {
      document.status = "processing";
      document.paymentStatus = "paid";
      await document.save();
      res.json({ message: "Payment confirmed and document status updated" });
    } else {
      res.status(400).json({ error: "Payment verification failed" });
    }
  } catch (error) {
    console.error("Payment confirmation error:", error);
    res.status(500).json({ error: "Failed to confirm payment" });
  }
};
