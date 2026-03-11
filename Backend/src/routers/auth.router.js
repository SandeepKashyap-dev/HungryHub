const express = require("express");
const router = express.Router();
const Verifytoken=require("../middlewares/Verifytoken");
const {registerUser,userlogin,userprofile,foodcard,addfood,allfood,adminlogin,adminreg,createOrder,getUserOrders}=require("../controllers/auth.controller");


router.post("/user/register",registerUser);
router.post("/user/login",userlogin);
router.get("/user/userprofile",Verifytoken,userprofile);
router.post("/food/addfood",addfood);
router.get("/food/foodcard",foodcard);
router.get("/food/allfood",allfood);
router.post("/admin/adminlogin",adminlogin);
router.post("/admin/adminreg",adminreg);
router.post("/orders",Verifytoken,createOrder);
router.get("/orders/user",Verifytoken,getUserOrders);



module.exports = router;