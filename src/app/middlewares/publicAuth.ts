import { NextFunction, Request, Response } from 'express';
import config from '../../config';
import { verifyToken } from '../../helper/tokenHelper';

const publicAuth =
  () => async (req: Request, res: Response, next: NextFunction) => {
    try {
      //get authorization token
      const token = req.headers.authorization as string;

      let verifiedUser = null;

      if (token) {
        verifiedUser = verifyToken(
          token,
          config.crypto.accessTokenSecret as string,
        );
      }

      if (verifiedUser) {
        req.user = verifiedUser?._doc;
      } else {
        req.user = null;
      }

      next();
    } catch (error) {
      next(error);
    }
  };

export default publicAuth;
