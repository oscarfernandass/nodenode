const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const userModel=require('./User');
const Story=require('./Story');
const bodyParser=require("body-parser");
const axios=require("axios");
const app = express();
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

mongoose.connect("mongodb+srv://oscar:oscar%40546@cluster0.nbn0hpp.mongodb.net/learner")
.then(() => {
  console.log("Connected to the database");
});


app.get("/users", async (req, res) => {
  try {
    // Fetch all users from the database
    const users = await userModel.find();

    if (users.length > 0) {
      // If users are found, return them as a response
      res.json(users);
    } else {
      // If no users are found, return a 404 status with a message
      res.status(404).json({ message: "No users found" });
    }
  } catch (error) {
    // If there's an error, return a 500 status with an error message
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/login",(req,res)=>{
  const{userName,password}=req.body;
  userModel.findOne({userName:userName})
  .then(user=>{
    if(user){
      if(user.password===password){
        res.json("success");
      }
      else{
        res.json("incorrect");
      }
    }
    else{
      res.json("not exist");
    }
  })
})

app.post('/register', (req, res) => {
  const newUser = req.body;
  newUser.testMarks = []; // Initialize testMarks as an empty array
  newUser.voiceTestMarks = []; // Similarly initialize voiceTestMarks
  newUser.feedback = "Empty feedback";
  newUser.notification=[];

  userModel.create(newUser)
    .then(user => res.json(user))
    .catch(err => res.json(err));
});


app.get("/user/:userName", (req, res) => {
  const userName = req.params.userName;

  userModel.findOne({ userName: userName })
    .then(user => {
      if (user) {
        res.json(user);
      }
    })
    .catch(err=>res.json(err))
  })


  app.put("/story/update-email", (req, res) => {
    const { username, newEmail } = req.body;
  
    // Find the user's story by username and update its email
    Story.findOneAndUpdate(
      { username: username },
      { email: newEmail },
      { new: true } // Return the updated document
    )
      .then(updatedStory => {
        if (updatedStory) {
          res.json({ message: "Email updated successfully", story: updatedStory });
        } else {
          res.status(404).json({ message: "User's story not found" });
        }
      })
      .catch(err => {
        console.error("Error updating email:", err);
        res.status(500).json({ error: "Internal server error" });
      });
  });
  

  app.put("/user/update-feedback", (req, res) => {
    const { username, feedback } = req.body;
  
    // Find the user by username and update the feedback
    userModel.findOneAndUpdate(
      { userName: username },
      { feedback: feedback },
      { new: true } // Return the updated document
    )
      .then(updatedUser => {
        if (updatedUser) {
          res.json({ message: "Feedback updated successfully", user: updatedUser });
        } else {
          res.status(404).json({ message: "User not found" });
        }
      })
      .catch(err => {
        console.error("Error updating feedback:", err);
        res.status(500).json({ error: "Internal server error" });
      });
  });
  


  app.put("/user/update-test-marks", async (req, res) => {
    const { username, testMarks } = req.body;
  
    try {
      // Find the user by username
      const user = await userModel.findOne({ userName: username });
  
      if (user) {
        // Ensure user.testMarks is initialized as an array
        user.testMarks = user.testMarks || [];
        
        // Add the testMarks to the array
        user.testMarks.push(testMarks);
        
        // Save the updated user document
        await user.save();
  
        res.status(200).json({ message: "Test marks added successfully" });
      } else {
        res.status(404).json({ message: "User not found" });
      }
    } catch (error) {
      console.error("Error updating test marks:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  
  
  
  
  
  
  
  app.put("/user/update-voice-test-marks", async (req, res) => {
    const { username, voiceTestMarks } = req.body;
  
    try {
      // Find the user by username
      const user = await userModel.findOne({ userName: username });
  
      if (user) {
        // Ensure user.testMarks is initialized as an array
        user.voiceTestMarks = user.voiceTestMarks || [];
        
        // Add the testMarks to the array
        user.voiceTestMarks.push(voiceTestMarks);
        
        // Save the updated user document
        await user.save();
  
        res.status(200).json({ message: "Test marks added successfully" });
      } else {
        res.status(404).json({ message: "User not found" });
      }
    } catch (error) {
      console.error("Error updating test marks:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });
  
  
  


  
app.listen(3001, () => {
  console.log("Server is Running");
});
