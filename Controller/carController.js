const Car = require("../Models/carModel");
const cloudinary = require("../config/cloudinary"); // your cloudinary config

// Create a new car with Cloudinary images
exports.createCar = async (req, res) => {
  try {
    const { body, files } = req;

    // Prepare images data with Cloudinary URLs and public_ids
    const images = files && files.length > 0
      ? files.map(file => ({
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

    // If new images uploaded, prepare their data, else keep old images
    const images = files && files.length > 0
      ? files.map(file => ({
          url: file.path,
          public_id: file.filename,
        }))
      : body.images || [];

    const carData = { ...body, images };

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

    // Delete all images from Cloudinary
    if (car.images && car.images.length > 0) {
      for (const img of car.images) {
        if (img.public_id) {
          await cloudinary.uploader.destroy(img.public_id);
        }
      }
    }

    // Delete the car document
    await car.remove();

    res.status(200).json({ success: true, message: "Car deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// const Car = require("../Models/carModel");

// exports.createCar = async (req, res) => {
//   try {
//     const { body, files } = req;
//     // Check if files exist
//     const imagePaths =
//       files && files.length > 0
//         ? files.map((file) => file.path.replace(/\\/g, "/"))
//         : [];
//     const carData = {
//       ...body,
//       images: imagePaths,
//     };
//     const car = new Car(carData);
//     await car.save();
//     res.status(201).json({
//       success: true,
//       car,
//       message: "Car Listed successfully",
//     });
//   } catch (error) {
//     let errorMessage = error.message;
//     if (error.name === "ValidationError") {
//       errorMessage = Object.values(error.errors)
//         .map((val) => val.message)
//         .join(", ");
//     }
//     res.status(400).json({
//       success: false,
//       error: errorMessage,
//     });
//   }
// };

// exports.getAllCars = async (req, res) => {
//   try {
//     const cars = await Car.find();
//     res.status(200).json(cars);
//   } catch (error) {
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// // Get a single car by ID
// exports.getCarById = async (req, res) => {
//   try {
//     const car = await Car.findById(req.params.id);
//     if (!car)
//       return res.status(404).json({ success: false, message: "Car not found" });
//     res.status(200).json(car);
//   } catch (error) {
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// // Update a car by ID
// exports.updateCar = async (req, res) => {
//   try {
//     const { body, files, params } = req;
//     const carId = params.id; // Assuming the car ID is passed in the route as a parameter

//     // Check if files exist and update image paths if any
//     const imagePaths =
//       files && files.length > 0
//         ? files.map((file) => file.path.replace(/\\/g, "/")) // Convert paths to forward slashes for consistency
//         : [];

//     const carData = {
//       ...body,
//       images: imagePaths.length > 0 ? imagePaths : body.images, // Only update images if new ones are provided, otherwise keep existing ones
//     };
//     // Update the car in the database
//     const updatedCar = await Car.findByIdAndUpdate(carId, carData, {
//       new: true,
//       runValidators: true,
//     });

//     if (!updatedCar) {
//       return res.status(404).json({
//         success: false,
//         message: "Car not found",
//       });
//     }

//     res.status(200).json({
//       success: true,
//       car: updatedCar,
//       message: "Listed Car updated successfully",
//     });
//   } catch (error) {
//     let errorMessage = error.message;
//     if (error.name === "ValidationError") {
//       errorMessage = Object.values(error.errors)
//         .map((val) => val.message)
//         .join(", ");
//     }

//     res.status(400).json({
//       success: false,
//       error: errorMessage,
//     });
//   }
// };

// // Delete a car by ID

// exports.deleteCar = async (req, res) => {
//   try {
//     const car = await Car.findByIdAndDelete(req.params.id);
//     if (!car)
//       return res.status(404).json({ success: false, message: "Car not found" });
//     res
//       .status(200)
//       .json({ success: true, message: "Listed Car deleted successfully" });
//   } catch (error) {
//     res.status(500).json({ success: false, error: error.message });
//   }
// };
