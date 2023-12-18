const Cart=require("../Models/Cart")
const {validationResult}=require("express-validator")
const HttpError = require("../Models/http-error")
const { find } = require("../Models/Medicine")

const createCart = async (req, res, next) => {
    try {
      console.log(req.body);
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        console.log(errors);
        throw new HttpError(
          "Invalid inputs passed, please try again with valid inputs",
          422
        );
      }
      const { name, medicines } = req.body;
      
      // Check if a cart with the given name already exists
      const existingCart = await Cart.findOne({ name: name });
      
      if (existingCart) {
        // Update the existing cart's medicines
        existingCart.medicines.push(...medicines);
        await existingCart.save();
        res.status(200).json({ cart: existingCart });
      } else {
        // Create a new cart
        const createdCart = new Cart({
          name,
          medicines,
        });
        await createdCart.save();
        res.status(200).json({ cart: createdCart });
      }
    } catch (err) {
      console.log(err);
      const error = new HttpError(
        "Something went wrong adding cart, please try again later",
        500
      );
      return next(error);
    }
  };
  
const getCartByName=async(req,res,next)=>{
    const name=req.params.name
    let cart
    try{
        cart= await Cart.findOne({name:name})

    }catch(err){
        const error=new HttpError(
            "Something went wrong, could not get the cart, please try again",500
        )
        return next(error)
    }
    res.json({cart})
}
const deleteMedicineFromCart = async (req, res, next) => {
    const { cartId, medicineId } = req.params; // Destructure cartId and medicineId

    try {
        // Assuming you have a Cart model that contains an array of medicines
        const cart = await Cart.findById(cartId);

        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        // Find the index of the medicine with the given medicineId
        const medicineIndex = cart.medicines.findIndex(
            (medicine) => medicine._id.toString() === medicineId
        );
        
        if (medicineIndex === -1) {
            return res.status(404).json({ message: "Medicine not found in the cart" });
        }

        // Remove the medicine from the cart's array
        cart.medicines.splice(medicineIndex, 1);

        // Save the updated cart
        await cart.save();

        res.status(200).json({ message: "Medicine deleted from the cart" });
    } catch (err) {
        const error = new HttpError(
            "Something went wrong, could not delete the medicine from the cart, please try again",
            500
        );
        return next(error);
    }
};
const deleteCartById = async (req, res, next) => {
  
  
  let cart;
  try {
    
    const cartId = req.params.cartId;
    console.log(cartId)
    cart = await Cart.findOne({ _id: cartId });
    
  } catch (err) {
    console.log(err)
    const error = new HttpError(
      "Something went wrong, could not find the cart, please try again",
      500
    );
    return next(error);
  }
  if (!cart) {
    const error = new HttpError("no cart found", 500);
    return next(error);
  }
  try {
    await cart.deleteOne();
  } catch (err) {
    const error = new HttpError(
      "Something went could not delete the cart, please try again",
      500
    );
    return next(error);
  }
  res.status(200).json({ message: "The cart successfully deleted" });
};

  
exports.createCart=createCart
exports.getCartByName=getCartByName
exports.deleteMedicineFromCart=deleteMedicineFromCart
exports.deleteCartById=deleteCartById