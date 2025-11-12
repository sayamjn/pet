const Application = require('../models/Application');
const Pet = require('../models/Pet');

const createApplication = async (req, res) => {
  try {
    const { petId } = req.body;
    const userId = req.user.userId;

    if (!petId) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Pet ID is required',
          code: 'MISSING_PET_ID'
        }
      });
    }

    const pet = await Pet.findById(petId);

    if (!pet) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Pet not found',
          code: 'PET_NOT_FOUND'
        }
      });
    }

    if (pet.status !== 'available') {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Pet is not available for adoption',
          code: 'PET_NOT_AVAILABLE'
        }
      });
    }

    const existingApplication = await Application.findOne({
      user: userId,
      pet: petId
    });

    if (existingApplication) {
      return res.status(409).json({
        success: false,
        error: {
          message: 'You have already applied for this pet',
          code: 'DUPLICATE_APPLICATION'
        }
      });
    }

    const application = await Application.create({
      user: userId,
      pet: petId,
      status: 'pending'
    });

    const populatedApplication = await Application.findById(application._id)
      .populate('pet')
      .populate('user', '-password');

    res.status(201).json({
      success: true,
      data: { application: populatedApplication }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        message: 'Server error while creating application',
        code: 'SERVER_ERROR'
      }
    });
  }
};

const getMyApplications = async (req, res) => {
  try {
    const userId = req.user.userId;

    const applications = await Application.find({ user: userId })
      .populate('pet')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: { applications }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        message: 'Server error while fetching applications',
        code: 'SERVER_ERROR'
      }
    });
  }
};

const getAllApplications = async (req, res) => {
  try {
    const { status } = req.query;

    const query = {};
    if (status) {
      query.status = status;
    }

    const applications = await Application.find(query)
      .populate('user', '-password')
      .populate('pet')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: { applications }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        message: 'Server error while fetching applications',
        code: 'SERVER_ERROR'
      }
    });
  }
};

const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const applicationId = req.params.id;

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Status must be approved or rejected',
          code: 'INVALID_STATUS'
        }
      });
    }

    const application = await Application.findById(applicationId).populate('pet');

    if (!application) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Application not found',
          code: 'APPLICATION_NOT_FOUND'
        }
      });
    }

    if (application.status !== 'pending') {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Application has already been processed',
          code: 'ALREADY_PROCESSED'
        }
      });
    }

    application.status = status;
    await application.save();

    if (status === 'approved') {
      const pet = await Pet.findById(application.pet._id);
      if (pet) {
        pet.status = 'adopted';
        await pet.save();
      }
    }

    const updatedApplication = await Application.findById(applicationId)
      .populate('user', '-password')
      .populate('pet');

    res.json({
      success: true,
      data: { application: updatedApplication }
    });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Application not found',
          code: 'APPLICATION_NOT_FOUND'
        }
      });
    }

    res.status(500).json({
      success: false,
      error: {
        message: 'Server error while updating application',
        code: 'SERVER_ERROR'
      }
    });
  }
};

module.exports = {
  createApplication,
  getMyApplications,
  getAllApplications,
  updateApplicationStatus
};
