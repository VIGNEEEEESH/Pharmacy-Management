const HttpError = require("../Models/http-error");
const Medicine = require("../Models/Medicine");
const { validationResult } = require("express-validator");

const createMedicine = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      throw new HttpError("Invalid inputs passed, please check your data", 422);
    }
    const { medicineName, power, quantity, generic, price, description } =
      req.body;
    const existingMedicine= await Medicine.find({medicineName:medicineName})
    if(existingMedicine.length>0){
      console.log(existingMedicine)
      const error=new HttpError(
        "The medicine already exists, try using other name"
      )
      return next(error)
      
    }
    const createdMedicine = new Medicine({
      medicineName,
      power,
      quantity,
      generic,
      price,
      description,
    });
    await createdMedicine.save();
    res.status(201).json({ Medicine: createdMedicine });
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      "Something went wrong, could not create a medicine, try again later",
      500
    );
    return next(error);
  }
};

const getAllMedicines = async (req, res, next) => {
  let medicines;
  try {
    medicines = await Medicine.find({});
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      "Something went wrong, could not fetch the medicines, please try again",
      500
    );
    return next(error);
  }
  res.json({ medicines: medicines });
};
const getMedicineById = async (req, res, next) => {
    let medicine;
    try {
        const id=req.params.id
      medicine = await Medicine.find({_id:id});
    } catch (err) {
      console.log(err);
      const error = new HttpError(
        "Something went wrong, could not fetch the medicine, please try again",
        500
      );
      return next(error);
    }
    res.json({ medicine: medicine });
  };
  const getMedicinePricesByName = async (req, res, next) => {
    try {
      const medicineNames = req.body.medicineNames;
      const prices = [];
  
      for (const medicineName of medicineNames) {
        const medicine = await Medicine.findOne({ medicineName: medicineName });
        if (medicine) {
          prices.push({
            medicineName: medicineName,
            price: medicine.price,
            quantity:medicine.quantity
          });
        }
      }
  
      res.status(200).json(prices);
    } catch (err) {
      console.error(err);
      const error = new HttpError(
        "Something went wrong, could not fetch the medicine prices, please try again",
        500
      );
      return next(error);
    }
  };
  
  
  

const updateMedicineById = async (req, res, next) => {
  const errors = validationResult(req);
  console.log(errors);
  if (!errors.isEmpty()) {
    throw new HttpError("Invalid inputs passed, please check your data", 422);
  }
  const { medicineName, power, quantity, generic, price, description } =
    req.body;
  const id = req.params.id;
  let medicine;
  try {
    medicine = await Medicine.findOne({ _id: id });
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find the medicine to update , please try again",
      500
    );
    return next(error);
  }
  (medicine.medicineName = medicineName),
    (medicine.power = power),
    (medicine.quantity = quantity),
    (medicine.generic = generic),
    (medicine.price = price),
    (medicine.description = description);

  try {
    await medicine.save();
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      "Something went wrong, could not update the medicine, please try again",
      500
    );
    return next(error);
  }
  res.status(200).json({ medicine: medicine });
};
const updateMedicineQuantity = async (req, res, next) => {
  const errors = validationResult(req);
  console.log(errors);
  if (!errors.isEmpty()) {
    throw new HttpError("Invalid inputs passed, please check your data", 422);
  }
  const { quantity } = req.body;
  const medicineName = req.params.medicineName;
  let medicine;
  try {
    medicine = await Medicine.findOne({ medicineName: medicineName });
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find the medicine to update quantity, please try again",
      500
    );
    return next(error);
  }

  console.log(medicine);

  // Check if the new quantity is valid (not negative)
  if (medicine.quantity - quantity < 0) {
    const error = new HttpError(
      "Invalid quantity update, quantity cannot go below zero",
      422
    );
    return next(error);
  }

  medicine.quantity = medicine.quantity - quantity;

  try {
    await medicine.save();
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      "Something went wrong, could not update the medicine's quantity, please try again",
      500
    );
    return next(error);
  }
  res.status(200).json({ medicine: medicine });
};

const deleteMedicineById = async (req, res, next) => {
  
  
  let medicine;
  try {
    console.log(req.params.id)
    const id = req.params.id;
    medicine = await Medicine.findOne({ _id: id });
  } catch (err) {
    console.log(err)
    const error = new HttpError(
      "Something went wrong, could not find the medicine, please try again",
      500
    );
    return next(error);
  }
  if (!medicine) {
    const error = new HttpError("no Medicinew found", 500);
    return next(error);
  }
  try {
    await medicine.deleteOne();
  } catch (err) {
    const error = new HttpError(
      "Something went could not delete the medicine, please try again",
      500
    );
    return next(error);
  }
  res.status(200).json({ message: "The Medicine successfully deleted" });
};

exports.createMedicine = createMedicine;
exports.getAllMedicines = getAllMedicines;
exports.getMedicineById = getMedicineById;
exports.getMedicinePricesByName=getMedicinePricesByName
exports.updateMedicineById = updateMedicineById;
exports.updateMedicineQuantity = updateMedicineQuantity;
exports.deleteMedicineById = deleteMedicineById;
