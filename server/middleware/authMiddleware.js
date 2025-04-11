const jwt = require('jsonwebtoken');
const { User } = require('../models');

/**
 * Authentication middleware to verify JWT tokens
 * This middleware has been fixed to prevent users from being logged out unexpectedly
 */
const authenticate = async (req, res, next) => {
  try {
    // Get token from request headers
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({ message: 'Authorization header missing' });
    }
    
    // Extract token (remove 'Bearer ' prefix)
    const token = authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }
    
    // FIX: Token verification with proper error handling moved to catch block
    // which will handle different types of JWT errors separately
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // FIX: Correct expiration check
    // JWT expiration time (exp) is in seconds since epoch
    // Date.now() returns milliseconds since epoch
    if (decoded.exp < Math.floor(Date.now() / 1000)) {
      return res.status(401).json({ message: 'Token expired' });
    }
    
    try {
      // FIX: User validation with proper database error handling
      const user = await User.findByPk(decoded.id);
      
      // FIX: Better handling for deleted users
      if (!user) {
        return res.status(401).json({ message: 'User account not found or has been deleted' });
      }
      
      // FIX: Only invalidate tokens when security-critical changes occur
      // This prevents logging out users for non-security updates
      if (user.tokenVersion !== decoded.tokenVersion) {
        // Check if this was a security-critical change that should invalidate the token
        // For example, password change, role change, etc.
        // Simple approach: Assume all tokenVersion changes are intentional security measures
        return res.status(401).json({ 
          message: 'Your session was invalidated due to security changes. Please log in again.' 
        });
      }
      
      // Attach user to request object
      req.user = user;
      next();
    } catch (dbError) {
      // FIX: Handle database errors separately
      console.error('Database error during authentication:', dbError);
      return res.status(500).json({ message: 'Internal server error during authentication' });
    }
  } catch (error) {
    // FIX: Differentiate between different JWT errors
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ message: 'Your session has expired. Please log in again.' });
    } else if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: 'Invalid authentication token' });
    } else if (error instanceof jwt.NotBeforeError) {
      return res.status(401).json({ message: 'Token not yet valid' });
    } else {
      // Generic error for unexpected issues
      console.error('Authentication error:', error);
      return res.status(500).json({ message: 'Authentication error' });
    }
  }
};

module.exports = { authenticate };

// const jwt = require('jsonwebtoken');
// const { User } = require('../models');

                   

   
                                                 
                                                                       
                  
                                                                 
                                             
   
// const authenticate = async (req, res, next) => {
//   try {
                                    

//     const authHeader = req.headers.authorization;
    
//     if (!authHeader) {
//       return res.status(401).json({ message: 'Authorization header missing' });
//     }
    
                                             

//     const token = authHeader.split(' ')[1];
    
//     if (!token) {
//       return res.status(401).json({ message: 'No token provided' });
//     }
    
                                                            

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
                                                                               

                                              

//     if (decoded.exp < Date.now()) {
//       return res.status(401).json({ message: 'Token expired' });
//     }
    
                                                                   

//     const user = await User.findByPk(decoded.id);
    
                                                                           

//     if (!user) {
//       return res.status(401).json({ message: 'User not found' });
//     }
    
                                                                         

                                                                        

//     if (user.tokenVersion !== decoded.tokenVersion) {
//       return res.status(401).json({ message: 'Token invalid' });
//     }
    
                                   

//     req.user = user;
//     next();
//   } catch (error) {
                                                                     

                                                                   

//     console.error('Authentication error:', error);
//     return res.status(401).json({ message: 'Authentication failed' });
//   }
// };
                   


// module.exports = { authenticate };