import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

function generateAccessToken(userPayload: any) {
  return jwt.sign(userPayload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRATION,
  });
}

const generateRefreshToken = async (userPayload: any) => {
  const refreshToken: string = jwt.sign(
    userPayload,
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRATION,
    }
  );

  return await prisma.user
    .update({
      where: {
        username: userPayload.username,
      },
      data: {
        refreshToken: refreshToken,
      },
    })
    .then(() => {
      return refreshToken;
    })
    .catch((e: any) => {
      throw new Error(e.message);
    });
};

router.post("/login", async (req: any, res: any) => {
  const userReq = {
    username: req.body.username,
    password: req.body.password,
  };

  prisma.user
    .findFirstOrThrow({
      where: {
        username: userReq.username,
      },
    })
    .then((user) => {
      bcrypt
        .compare(userReq.password, user.password)
        .then(() => {
          const userPayload = {
            username: user.username,
            id: user.id,
          };

          const accessToken = generateAccessToken(userPayload);
          generateRefreshToken(userPayload).then((refreshToken) => {
            res.json({
              username: user.username,
              id: user.id,
              access_token: accessToken,
              refresh_token: refreshToken,
            });
          });
        })
        .catch((e: Error) => {
          throw e;
        });
    })
    .catch((e: Error) => {
      res.status(404).send({ error: e.message });
    });
});

router.post("/refresh", (req: any, res: any) => {
  prisma.user
    .findFirstOrThrow({
      where: {
        id: req.body.id,
        refreshToken: req.body.token,
      },
    })
    .then((user) => {
      jwt.verify(
        req.body.token,
        process.env.REFRESH_TOKEN_SECRET,
        (err: Error) => {
          if (err) {
            console.error(err);
            return res.sendStatus(403);
          }

          const userPayload = {
            username: user.username,
            id: user.id,
          };

          generateRefreshToken(userPayload)
            .then((refreshToken) => {
              prisma.user
                .update({
                  where: {
                    id: user.id,
                  },
                  data: {
                    refreshToken,
                  },
                })
                .then(() => {
                  const accessToken = generateAccessToken({
                    user: user.username,
                  });
                  res.json({ accessToken: accessToken, refreshToken });
                })
                .catch((e: Error) => {
                  throw e;
                });
            })
            .catch((e: Error) => {
              console.error(e);
              res.status(400).send({ error: e.message });
            });
        }
      );
    })
    .catch((e: Error) => {
      res.status(404).send({ error: e.message });
    });
});

module.exports = router;
