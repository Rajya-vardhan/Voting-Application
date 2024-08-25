const express = require("express");
const router = express.Router();
const Candidate = require("./../models/Candidate");
const User = require("./../models/User");
const { jwtAuthMiddleware, genToken } = require("./../jwt");

const checkAdmin = async (userId) => {
  try {
    const user = await User.findById(userId);
    return user.role == "admin";
  } catch (err) {
    // console.log(err)
    return false;
  }
};
// admin related tasks : adding , updating and deleting candidates

router.post("/", jwtAuthMiddleware, async (req, res) => {
  try {
    const id = req.user.userData.id;
    const isAdmin = await checkAdmin(id);
    if (!isAdmin) {
      return res
        .status(403)
        .json({ message: "You are not authorized to perform this action" });
    }
    const data = req.body;
    const newCandidate = new Candidate(data);
    const SavedCandidate = await newCandidate.save();
    console.log("data saved");
    res.status(200).send({
      response: SavedCandidate,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "internal server error" });
  }
});

router.put("/:candidateId", jwtAuthMiddleware, async (req, res) => {
  try {
    const userid = req.user.userData.id;
    const isAdmin = await checkAdmin(userid);
    if (!isAdmin) {
      return res
        .status(403)
        .json({ message: "You are not authorized to perform this action" });
    }
    const id = req.params.candidateId;
    const Updatedata = req.body;

    const response = await Candidate.findByIdAndUpdate(id, Updatedata, {
      new: true,
      runValidators: true,
    });
    if (!response) {
      res.status(404).json({ error: "person not found" });
    }
    console.log("Data updated");
    res.status(200).json(response);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "internal server error" });
  }
});

router.delete("/:candidateId", jwtAuthMiddleware, async (req, res) => {
  try {
    const userid = req.user.userData.id;
    const isAdmin = await checkAdmin(userid);
    if (!isAdmin) {
      return res
        .status(403)
        .json({ message: "You are not authorized to perform this action" });
    }
    const id = req.params.candidateId;
    const response = await Candidate.findByIdAndDelete(id);
    if (!response) {
      res.status(404).json({ error: "person not found" });
    }
    console.log("Data deleted");
    res.status(200).json(response);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "internal server error" });
  }
});


router.get('/',async (req,res)=>{
    try{
      const data=await Candidate.find();
      res.status(200).json(data);
    }catch(err){
        console.log(err);
        res.status(500).json({ error: "internal server error" }) 
    }
})



router.post('/vote/:candidateId',jwtAuthMiddleware,async (req,res)=>{
     const userId=req.user.userData.id
     const Id=req.params.candidateId
     try{
        const candidate=await Candidate.findById(Id)
        if(!candidate){
            return res.status(404).json({error:"Candidate not found"})
        }
        const user=await User.findById(userId)
        if(!user){
            return res.status(404).json({error:"User not found"}) 
        }
        if(user.isVoted){
            return res.status(400).json({error:"You have already voted"})
        }
        if(user.role=="admin"){
            return res.status(403).json({error:"Admin cannot vote"})
        }

        // now user can cast a vote 

        candidate.votes.push({user:userId})
        candidate.voteCount++
        await candidate.save();

        user.isVoted=true
        await user.save()
        res.status(200).json({message:"Voted successfully"})
     }catch(err){
        console.log(err);
        res.status(500).json({ error: "internal server error" }) 
     }
})



router.get('/vote/count',async (req,res)=>{
    try{
    //   sorting and loading 
      const result=await Candidate.find().sort({voteCount:'desc'})
    //   mapping the data
      const record=result.map(data=>{
        return{
            party:data.party,
            count:data.voteCount
        }
      })
      res.status(200).json(record)
    }catch(err){
        console.log(err);
        res.status(500).json({ error: "internal server error" })  
    }
})

module.exports = router;
