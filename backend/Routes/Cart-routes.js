const express = require("express");
const { check } = require("express-validator");
const router = express.Router();
const cartControllers = require("../Controllers/Cart-controllers");

router.get("/get/:name", cartControllers.getCartByName);

router.post(
  "/create",
  [
    check("name").notEmpty(),
    
    check("medicines").notEmpty(),
  ],
  cartControllers.createCart
);
router.delete("/deleteCart/:cartId",cartControllers.deleteCartById)
router.delete("/delete/:cartId/:medicineId",cartControllers.deleteMedicineFromCart)
module.exports = router;
