const pdf = require('pdf-parse');
const { PDFDocument, rgb } = require('pdf-lib');
const fs = require('fs');

exports.processDocument = async (fileBuffer) => {
  try {
    const data = await pdf(fileBuffer);
    const pageCount = data.numpages;
    const pricePerPage = 2;
    const price = pageCount * pricePerPage;

    return { pageCount, price: parseFloat(price.toFixed(2)) };
  } catch (error) {
    console.error('PDF processing error:', error);
    throw new Error('Failed to process PDF');
  }
};

exports.addTokenToFirstPage = async (fileBuffer, tokenNumber) => {
  try {
    const pdfDoc = await PDFDocument.load(fileBuffer);
    const firstPage = pdfDoc.getPages()[0];

    firstPage.drawText(`Token: ${tokenNumber}`, {
      x: 50,
      y: 750,
      size: 24,
      color: rgb(0, 0, 0),
    });

    const modifiedPdfBytes = await pdfDoc.save();
    const outputPath = `modified_${tokenNumber}.pdf`;
    fs.writeFileSync(outputPath, modifiedPdfBytes);

    return outputPath;
  } catch (error) {
    console.error('Error adding token to PDF:', error);
    throw new Error('Failed to add token to PDF');
  }
};
