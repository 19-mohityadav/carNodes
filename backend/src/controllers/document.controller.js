const documentService = require('../services/document.service');

const addDocument = async (req, res, next) => {
  try {
    const document = await documentService.addDocumentMetadata(req.params.id, req.body, req.user);
    res.status(201).json({
      success: true,
      message: 'Vehicle document metadata created successfully',
      data: { document }
    });
  } catch (error) {
    next(error);
  }
};

const getDocuments = async (req, res, next) => {
  try {
    const documents = await documentService.getDocumentsByVehicleId(req.params.id);
    res.status(200).json({
      success: true,
      message: 'Vehicle document metadata retrieved successfully',
      data: { documents }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addDocument,
  getDocuments
};
