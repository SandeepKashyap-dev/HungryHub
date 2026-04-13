const express = require("express");
const router = express.Router();
const Verifytoken=require("../middlewares/Verifytoken");
const { upload } = require("../middlewares/multer");
const {
  registerUser,
  userlogin,
  userprofile,
  updateprofile,
  foodcard,
  addfood,
  allfood,
  updatefood,
  deletefood,
  getAllUsers,
  deleteUser,
  adminlogin,
  adminreg,
  createOrder,
  getUserOrders,
  cancelOrder,
  unifiedLogin,
  rateFoodItem,
} = require("../controllers/auth.controller");

router.post("/user/register", registerUser);
router.post("/user/login", userlogin);
router.post("/login", unifiedLogin);
router.get("/user/userprofile", Verifytoken, userprofile);
router.put("/user/updateprofile", Verifytoken, updateprofile);
router.post("/food/addfood", upload.single("image"), addfood);
router.get("/food/foodcard", foodcard);
router.get("/food/allfood", allfood);
router.put("/food/:id/rate", Verifytoken, rateFoodItem);
router.put("/food/:id", upload.single("image"), updatefood);
router.delete("/food/:id", deletefood);
router.get("/admin/users", getAllUsers);
router.delete("/admin/users/:id", deleteUser);
router.post("/admin/adminlogin", adminlogin);
router.post("/admin/adminreg", adminreg);
router.post("/orders", Verifytoken, createOrder);
router.get("/orders/user", Verifytoken, getUserOrders);
router.put("/orders/:id/cancel", Verifytoken, cancelOrder);


module.exports = router;