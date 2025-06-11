const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
 
  const token = req.header('x-auth-token'); 

 
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }


  try {
  
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    
    req.user = decoded.user; 
    next(); 
  } catch (err) {
    console.error('Token verification failed:', err.message);
    if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ msg: 'Token is expired, authorization denied' });
    }
    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({ msg: 'Token is not valid, authorization denied' });
    }
    res.status(500).json({ msg: 'Server Error during token verification' });
  }
};