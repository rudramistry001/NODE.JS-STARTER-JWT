
import jwt from 'jsonwebtoken';
import User from '../model/authModel.js'




const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id },process.env.JWT_SECRET_KEY, {
    expiresIn: maxAge,
  });
};


export const register = async (req, res) => {
  try {
    const { fullname, email, password } = req.body;

  if(!fullname){
    return res.status(401).json({ status: 'Error', error: 'Full Name is required.' });
  }
  if(!email){
    return res.status(401).json({ status: 'Error', error: 'Email is required.Please enter email.' });
  }
  if(!password){
    return res.status(401).json({ status: 'Error', error: 'Password is Required.Please Provide Password.' });
    
  }
  const existingUser =await  User.findOne({email})
  if(existingUser){
    return res.status(401).json({ status: 'Error', error: 'This email already exists.Try logging in with this email' });
  }
    const user = await User.create({ fullname, email, password });
    const token = createToken(user._id);

    res.cookie("jwt", token, {
      withCredentials: true,
      httpOnly: false,
      maxAge: maxAge * 1000,
    });

    res.status(200).json({
      user: {
        fullname: user.fullname,
        email: user.email,
        id: user._id,
      },
      created: true
    });
  } catch (err) {
    console.log(err);

    res.status(400).json({ err, created: false, message: 'Error in Registration' });
  }
};





export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.login(email, password);
    const token = createToken(user._id);
    res.cookie("jwt", token, { httpOnly: false, maxAge: maxAge * 1000 });
    res.status(200).json({
      user: {
        fullname: user.fullname,
        email: user.email,
        id: user._id,
      },
      status: true
    });
  } catch (err) {
    res.status(400).json({ error: 'Invalid credentials', status: false });
  }
};
