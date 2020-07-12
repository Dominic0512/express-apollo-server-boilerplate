import mongoose from "mongoose";
import crypto from "crypto";
import jwt from "jsonwebtoken";

import dotenv from "dotenv";
dotenv.config();

const { JWT_SECRET } = process.env;

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      lowercase: true,
      unique: true,
      required: [true, "can't be blank"],
      match: [/\S+@\S+\.\S+/, "is invalid"],
      index: true,
    },
    hashedPassword: {
      type: String,
      required: true,
    },
    salt: {
      type: String,
      required: true,
    },
    lastActiveAt: {
      type: Date,
    },
  },
  { timestamps: true }
);


UserSchema.methods.validPassword = function (password) {
  const hash = crypto
    .pbkdf2Sync(password, this.salt, 10000, 512, "sha512")
    .toString("hex");
  return this.hash === hash;
};

UserSchema.methods.setPassword = function (password) {
  this.salt = crypto.randomBytes(16).toString("hex");
  this.hashedPassword = crypto
    .pbkdf2Sync(password, this.salt, 10000, 512, "sha512")
    .toString("hex");
};

UserSchema.methods.generateJWT = function () {
  const today = new Date();
  let exp = new Date(today);
  exp.setDate(today.getDate() + 60);

  return jwt.sign(
    {
      id: this._id,
      email: this.email,
      exp: parseInt(exp.getTime() / 1000),
    },
    JWT_SECRET
  );
};

UserSchema.methods.login = function () {
  const profile = Object.assign({}, this._doc);
  delete profile.hashedPassword;
  delete profile.salt;
  profile.token = this.generateJWT();
  return profile;
};

UserSchema.methods.profile = function () {
  const profile = Object.assign({}, this._doc);
  delete profile.hashedPassword;
  delete profile.salt;
  return profile;
};

UserSchema.statics.decodeJWT = function (token) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, JWT_SECRET, (error, decodedToken) => {
      if (error) {
        return reject(error);
      }

      if (!decodedToken.exp || !decodedToken.iat) {
        return reject(new Error(`Token had no 'exp' or 'iat' payload`));
      }

      resolve(decodedToken);
    });
  });
};

export default mongoose.model("User", UserSchema);
