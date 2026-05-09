import {
  DataTypes,
  Model,
  type CreationOptional,
  type InferAttributes,
  type InferCreationAttributes,
} from 'sequelize';
import sequelize from '../config/database';

export type ContactSubmissionStatus = 'new' | 'read' | 'archived';

class ContactSubmission extends Model<
  InferAttributes<ContactSubmission>,
  InferCreationAttributes<ContactSubmission>
> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare email: string;
  declare subject: CreationOptional<string>;
  declare message: string;
  declare status: CreationOptional<ContactSubmissionStatus>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

ContactSubmission.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(120),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(180),
      allowNull: false,
      validate: { isEmail: true },
    },
    subject: {
      type: DataTypes.STRING(180),
      allowNull: false,
      defaultValue: '',
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('new', 'read', 'archived'),
      allowNull: false,
      defaultValue: 'new',
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: 'contact_submissions',
    modelName: 'ContactSubmission',
  },
);

export default ContactSubmission;
