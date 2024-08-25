const express = require("express");
const router = express.Router();
const User = require("./../models/User");
const { jwtAuthMiddleware, genToken } = require("./../jwt");

router.post("/Signup", async (req, res) => {
  try {
    const data = req.body;
    const temp=User.find({role:"admin"})
    if(temp && data.role=="admin"){
        return res.status(400).json({message:"admin already exists"})
    }
    const newUser = new User(data);
    const SavedUser = await newUser.save();
    console.log("data saved");
    const payload = {
      id: SavedUser.id,
    };
    const token = genToken(payload);
    console.log("token is: ", token);
    res.status(200).send({
      response: SavedUser,
      token: token,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "internal server error" });
  }
});

router.post("/Login", async (req, res) => {
  try {
    const { adhaarCardNumber, password } = req.body;
    const user = await User.findOne({ adhaarCardNumber: adhaarCardNumber });
    if (!user || !(await user.comparePass(password))) {
      return res
        .status(401)
        .json({ error: "Incorrect credentials , please check!" });
    }
    const payload = {
      id: user.id,
    };
    const token = genToken(payload);
    console.log("token is: ", token);
    res.status(200).send({
      token: token,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "internal server error" });
  }
});

router.get("/profile", jwtAuthMiddleware, async (req, res) => {
  try {
    const data = req.user;
    const id = data.userData.id;
   
    const user = await User.findById(id);
    res.status(200).json(user);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "internal server error" });
  }
});

// scipt for  update
router.put("/profile/password", jwtAuthMiddleware, async (req, res) => {
  try {
    // expecting user to remove old pass
    const id = req.user.userData.id;
    const { oldPass, newPass } = req.body;

    const user = await User.findById(id);
    if (!(await user.comparePass(oldPass))) {
      return res
        .status(401)
        .json({ error: "Incorrect password , please check!" });
    }

    user.password = newPass;
    const response = await user.save();
    console.log("password updated");
    res
      .status(200)
      .json({ response: response, message: "password updated successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "internal server error" });
  }
});

module.exports = router;
