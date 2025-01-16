const user = await User.findOne({ email });
const token = generateToken(user._id);

res.json({
  token,
  user: {
    _id: user._id,
    username: user.username,
    email: user.email,
    isAdmin: user.isAdmin
  }
}); 