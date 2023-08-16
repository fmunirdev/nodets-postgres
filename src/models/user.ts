import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from 'sequelize';
import bcrypt from 'bcrypt';
import sequelize from '../db';

const SALT_ROUNDS = 12;

interface UserModel
  extends Model<
    InferAttributes<UserModel>,
    InferCreationAttributes<UserModel>
  > {
  id: CreationOptional<string>;
  name: string;
  email: string;
  password: string;
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

User.sync();

export default User;
