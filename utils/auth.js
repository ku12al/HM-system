const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const generateToken = (userId, isAdmin) => {
  return jwt.sign({ userId, isAdmin }, process.env.JWT_SECRET);
};

const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};
const authMiddleware = async (req, res, next) => {
  const authHeader = req.header('Authorization');

  if (!authHeader) {
        return res.status(401).json({ msg: 'Authorization header missing' });
  }

  const token = authHeader.replace('Bearer ', '');

  try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log(decoded);
        req.user = await User.findById(decoded.userId); // Attach user to request

        if (!req.user) {
              return res.status(401).send({ msg: 'User not found' });
        }

        next();
  } catch (error) {
        res.status(401).send({ msg: 'Please authenticate' });
  }
};

const verifySession = (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).json({ msg: 'Authorization header missing' });
  }
  next();
};

module.exports ={
  generateToken,
  verifyToken,
  authMiddleware,
  verifySession
}
