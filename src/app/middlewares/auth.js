import jwt from 'jsonwebtoken';
import { promisify } from 'util';

import tokenConfig from '../../config/token';

export default async (req, res, next) => {
  const tokenHeader = req.headers.authorization;

  if (!tokenHeader) {
    return res.status(401).json({ error: 'Token not provide.' });
  }

  const [, token] = tokenHeader.split(' ');

  try {
    const decoded = await promisify(jwt.verify)(token, tokenConfig.secret);
    console.log(decoded);

    req.userId = decoded.id;

    return next();
  } catch (error) {
    return res.status(401).json({ error: 'Token invalid.' });
  }
};
