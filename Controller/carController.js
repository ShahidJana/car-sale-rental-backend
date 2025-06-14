const Car = require("../Models/carModel");
const cloudinary = require("../config/cloudinary"); // your cloudinary config

// Create a new car with Cloudinary images
exports.createCar = async (req, res) => {
  try {
    const { body, files } = req;

    // Prepare images data with Cloudinary URLs and public_ids
    const images =
      files && files.length > 0
        ? files.map((file) => ({
            url: file.path,
            public_id: file.filename,
          }))
        : [];

    const carData = { ...body, images };

    const car = new Car(carData);
    await car.save();

    res.status(201).json({
      success: true,
      car,
      message: "Car listed successfully",
    });
  } catch (error) {
    let errorMessage = error.message;
    if (error.name === "ValidationError") {
      errorMessage = Object.values(error.errors)
        .map((val) => val.message)
        .join(", ");
    }
    res.status(400).json({
      success: false,
      error: errorMessage,
    });
  }
};

// Get all cars
exports.getAllCars = async (req, res) => {
  try {
    const cars = await Car.find();
    res.status(200).json(cars);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get a car by ID
exports.getCarById = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car)
      return res.status(404).json({ success: false, message: "Car not found" });
    res.status(200).json(car);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Update a car by ID
exports.updateCar = async (req, res) => {
  try {
    const { body, files, params } = req;
    const carId = params.id;

    let allImages = [];

    if (files && files.length > 0) {
      const uploaded = files.map((file) => ({
        url: file.path,
        public_id: file.filename,
      }));
      allImages.push(...uploaded);
    }

    if (body.images) {
      const rawImages = Array.isArray(body.images)
        ? body.images
        : [body.images];

      rawImages.forEach((item) => {
        try {
          const parsed = JSON.parse(item);
          if (parsed.url && parsed.public_id) {
            allImages.push(parsed);
          }
        } catch (err) {
          // If not JSON (e.g., file path), skip
        }
      });
    }

    const { images, ...restBody } = body;
    const carData = { ...restBody, images: allImages };

    const updatedCar = await Car.findByIdAndUpdate(carId, carData, {
      new: true,
      runValidators: true,
    });

    if (!updatedCar) {
      return res.status(404).json({
        success: false,
        message: "Car not found",
      });
    }

    res.status(200).json({
      success: true,
      car: updatedCar,
      message: "Car updated successfully",
    });
  } catch (error) {
    let errorMessage = error.message;
    if (error.name === "ValidationError") {
      errorMessage = Object.values(error.errors)
        .map((val) => val.message)
        .join(", ");
    }
    res.status(400).json({
      success: false,
      error: errorMessage,
    });
  }
};

// Delete a car by ID and delete its images from Cloudinary
exports.deleteCar = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);

    if (!car) {
      return res.status(404).json({ success: false, message: "Car not found" });
    }
    // Delete images from Cloudinary
    if (Array.isArray(car.images)) {
      for (const img of car.images) {
        if (img.public_id) {
          try {
            await cloudinary.uploader.destroy(img.public_id);
          } catch (err) {
            console.warn(
              `Failed to delete image ${img.public_id}:`,
              err.message
            );
          }
        }
      }
    }

    // Remove the car from DB
    await Car.findByIdAndDelete(req.params.id); // OR: await car.remove();
    res
      .status(200)
      .json({ success: true, message: "Car deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
