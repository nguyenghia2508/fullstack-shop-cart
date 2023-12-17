import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../../config/auth.config';
import User from '../../models/User';

const tokenDecode = (req: Request) => {
  const bearerHeader = req.headers['authorization']

  if (bearerHeader) {
    const bearer = bearerHeader.split(' ')[1]
    try {
      const tokenDecoded = jwt.verify(
        bearer,
        config.secret
      ) as JwtPayload
      return tokenDecoded
    } catch {
      return false
    }
  } else {
    return false
  }
}

const verifyToken = async  (req: Request, res: Response, next: NextFunction) => {
  const tokenDecoded = tokenDecode(req)
  if (tokenDecoded) {
    const user = await User.findById(tokenDecoded.id)
    if (!user) return res.status(401).json({verify:false,message:'Unathorized'})
    req.user = user
    next()
  } else {
    res.json({verify:false,message:'Unathorized user'})
  }
};

const authJwt = {
  verifyToken
};

export default authJwt;