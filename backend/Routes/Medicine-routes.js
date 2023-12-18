const express = require("express");
const { check } = require("express-validator");
const router = express.Router();
const medicineControllers = require("../Controllers/Medicine-controllers");

router.get("/allmedicines", medicineControllers.getAllMedicines);
router.get("/get/:id", medicineControllers.getMedicineById);
router.post("/getMany", medicineControllers.getMedicinePricesByName);
router.post(
  "/createMedicine",
  [
    check("medicineName").notEmpty(),
    check("power").notEmpty(),
    check("quantity").notEmpty(),
    check("generic").notEmpty(),
    check("price").notEmpty(),
    check("description").notEmpty(),
  ],
  medicineControllers.createMedicine
);
router.patch("/update/:id", [
  check("medicineName").notEmpty(),
  check("power").notEmpty(),
  check("quantity").notEmpty(),
  check("generic").notEmpty(),
  check("price").notEmpty(),
  check("description").notEmpty(),
],medicineControllers.updateMedicineById);
router.patch("/buy/:medicineName", [
  check("quantity").notEmpty(),
],medicineControllers.updateMedicineQuantity);
router.delete("/delete/:id",medicineControllers.deleteMedicineById)
module.exports=router
