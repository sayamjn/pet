const Pet = require('../models/Pet');
const Application = require('../models/Application');

const getPets = async (req, res) => {
  try {
    const { search, species, breed, age, page = 1 } = req.query;
    const limit = 20;
    const skip = (page - 1) * limit;

    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { breed: { $regex: search, $options: 'i' } }
      ];
    }

    if (species) {
      query.species = species;
    }

    if (breed) {
      query.breed = breed;
    }

    if (age) {
      query.age = parseInt(age);
    }

    const pets = await Pet.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Pet.countDocuments(query);

    res.json({
      success: true,
      data: {
        pets,
        pagination: {
          page: parseInt(page),
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        message: 'Server error while fetching pets',
        code: 'SERVER_ERROR'
      }
    });
  }
};

const getPetById = async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);

    if (!pet) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Pet not found',
          code: 'PET_NOT_FOUND'
        }
      });
    }

    res.json({
      success: true,
      data: { pet }
    });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Pet not found',
          code: 'PET_NOT_FOUND'
        }
      });
    }

    res.status(500).json({
      success: false,
      error: {
        message: 'Server error while fetching pet',
        code: 'SERVER_ERROR'
      }
    });
  }
};

const createPet = async (req, res) => {
  try {
    const { name, species, breed, age, description, photoUrl } = req.body;

    const pet = await Pet.create({
      name,
      species,
      breed,
      age,
      description,
      photoUrl,
      status: 'available'
    });

    res.status(201).json({
      success: true,
      data: { pet }
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        error: {
          message: Object.values(error.errors).map(e => e.message).join(', '),
          code: 'VALIDATION_ERROR'
        }
      });
    }

    res.status(500).json({
      success: false,
      error: {
        message: 'Server error while creating pet',
        code: 'SERVER_ERROR'
      }
    });
  }
};

const updatePet = async (req, res) => {
  try {
    const { name, species, breed, age, description, photoUrl } = req.body;

    const pet = await Pet.findById(req.params.id);

    if (!pet) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Pet not found',
          code: 'PET_NOT_FOUND'
        }
      });
    }

    if (name !== undefined) pet.name = name;
    if (species !== undefined) pet.species = species;
    if (breed !== undefined) pet.breed = breed;
    if (age !== undefined) pet.age = age;
    if (description !== undefined) pet.description = description;
    if (photoUrl !== undefined) pet.photoUrl = photoUrl;

    await pet.save();

    res.json({
      success: true,
      data: { pet }
    });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Pet not found',
          code: 'PET_NOT_FOUND'
        }
      });
    }

    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        error: {
          message: Object.values(error.errors).map(e => e.message).join(', '),
          code: 'VALIDATION_ERROR'
        }
      });
    }

    res.status(500).json({
      success: false,
      error: {
        message: 'Server error while updating pet',
        code: 'SERVER_ERROR'
      }
    });
  }
};

const deletePet = async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);

    if (!pet) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Pet not found',
          code: 'PET_NOT_FOUND'
        }
      });
    }

    const applications = await Application.countDocuments({ pet: req.params.id });

    if (applications > 0) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Cannot delete pet with existing applications',
          code: 'HAS_APPLICATIONS'
        }
      });
    }

    await Pet.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      data: {
        message: 'Pet deleted successfully'
      }
    });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Pet not found',
          code: 'PET_NOT_FOUND'
        }
      });
    }

    res.status(500).json({
      success: false,
      error: {
        message: 'Server error while deleting pet',
        code: 'SERVER_ERROR'
      }
    });
  }
};

const updatePetStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!['available', 'pending', 'adopted'].includes(status)) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Status must be available, pending, or adopted',
          code: 'INVALID_STATUS'
        }
      });
    }

    const pet = await Pet.findById(req.params.id);

    if (!pet) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Pet not found',
          code: 'PET_NOT_FOUND'
        }
      });
    }

    pet.status = status;
    await pet.save();

    res.json({
      success: true,
      data: { pet }
    });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Pet not found',
          code: 'PET_NOT_FOUND'
        }
      });
    }

    res.status(500).json({
      success: false,
      error: {
        message: 'Server error while updating pet status',
        code: 'SERVER_ERROR'
      }
    });
  }
};

module.exports = {
  getPets,
  getPetById,
  createPet,
  updatePet,
  deletePet,
  updatePetStatus
};
