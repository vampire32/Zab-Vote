const User = require('../Model/User');

// Get all users
exports.getUser = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Get a user by roll no
exports.getUserByRollno = async (req, res) => {
  const { rollno } = req.params; 
  try {
    const user = await User.findOne({ rollno }); 
    if (!user) {
      return res.status(404).json({ msg: "User not found" }); 
    }
    res.json(user); // Send the found user
  } catch (err) {
    res.status(500).json({ msg: err.message }); 
  }
};
exports.getUserByPhone = async (req, res) => {
  const { phoneno } = req.params; 
  try {
    const user = await User.findOne({ phoneno  }); 
    if (!user) {
      return res.status(404).json({ msg: "User not found" }); 
    }
    res.json(user); // Send the found user
  } catch (err) {
    res.status(500).json({ msg: err.message }); 
  }
};
exports.getUserByfingerprint = async (req, res) => {
  const { fingerprint } = req.params; 
  try {
    const user = await User.findOne({ fingerprint }); 
    if (!user) {
      return res.status(404).json({ msg: "User not found" }); 
    }
    res.json(user); // Send the found user
  } catch (err) {
    res.status(500).json({ msg: err.message }); 
  }
};


// Add a new user
exports.addUser = async (req, res) => {
  const { firstname,lastname, rollno,phoneno,fingerprint } = req.body;

  try {
  
    const existingUser = await User.findOne({rollno});

    if (existingUser) {
      return res.status(400).json({ msg: 'User with this phone number already exists' });
    }

    // Create a new user if the phone number does not exist
    const newUser = new User({
      firstname,
      lastname,
      rollno,
      phoneno,
      fingerprint,
    });

    await newUser.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
};

exports.updateUser = async (req, res) => {
  const { rollno } = req.params; 
  const { firstname, lastname, phoneno, fingerprint } = req.body; 

  try {

    const existingUser = await User.findOne({ rollno });

    if (!existingUser) {
      return res.status(404).json({ msg: 'User not found' });
    }

   
    existingUser.firstname = firstname || existingUser.firstname;
    existingUser.lastname = lastname || existingUser.lastname;
    existingUser.phoneno = phoneno || existingUser.phoneno;
    existingUser.fingerprint = fingerprint || existingUser.fingerprint;

 
    await existingUser.save();

    res.status(200).json({ msg: 'User updated successfully', user: existingUser });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};