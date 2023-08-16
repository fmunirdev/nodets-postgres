import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from 'sequelize';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import sequelize from '../db';

const SALT_ROUNDS = 12;

export interface UserModel
  extends Model<
    InferAttributes<UserModel>,
    InferCreationAttributes<UserModel>
  > {
  id: CreationOptional<string>;
  name: string;
  email: string;
  password: string;
  comparePassowrd(candidate: string): Promise<boolean>;
  generateToken(): Promise<string>;
}

const User = sequelize.define<UserModel>(
  'User',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, unique: true, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
  },
  {
    hooks: {
      async beforeSave(user) {
        user.password = await bcrypt.hash(user.password, SALT_ROUNDS);
      },
    },
  },
);

User.prototype.comparePassowrd = async function (candidate: string) {
  return await bcrypt.compare(candidate, this.password);
};

User.prototype.generateToken = function () {
  return jwt.sign(
    {
      id: this.id,
      username: this.email,
      exp: Math.floor(Date.now() / 1000) + 900, // 15 minutes
    },
    process.env.JWT_SECRET as jwt.Secret,
  );
};

// User.sync();

export default User;
