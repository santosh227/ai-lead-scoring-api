const Offer = require("../models/Offer");

// Create new product offer
const createOffer = async (req, res) => {
  try {
    const { name, value_props, ideal_use_cases } = req.body;

    // Validate required fields
    if (!name || !value_props || !ideal_use_cases) {
      return res.status(400).json({
        error: "Missing required fields: name, value_props, ideal_use_cases",
      });
    }

    if (!Array.isArray(value_props) || !Array.isArray(ideal_use_cases)) {
      return res.status(400).json({
        error: "value_props and ideal_use_cases must be arrays",
      });
    }

    // Deactivate previous offers (only one active at a time)
    await Offer.updateMany({}, { is_active: false });

    // Create new offer
    const offer = new Offer({
      name: name.trim(),
      value_props: value_props.filter((prop) => prop && prop.trim()),
      ideal_use_cases: ideal_use_cases.filter(
        (useCase) => useCase && useCase.trim()
      ),
      is_active: true,
    });

    await offer.save();

    res.status(201).json({
      message: "Offer created successfully",
      data: offer,
      next_step: "Upload leads CSV using POST /api/leads/upload",
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to create offer",
      message: error.message,
    });
  }
};

module.exports = {
  createOffer,
};
