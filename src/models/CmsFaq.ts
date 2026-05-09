import {
  DataTypes,
  Model,
  type CreationOptional,
  type InferAttributes,
  type InferCreationAttributes,
} from 'sequelize';
import sequelize from '../config/database';
import type { CmsContentStatus } from './CmsPage';

class CmsFaq extends Model<
  InferAttributes<CmsFaq>,
  InferCreationAttributes<CmsFaq>
> {
  declare id: CreationOptional<number>;
  declare question: string;
  declare answer: string;
  declare category: CreationOptional<string>;
  declare sortOrder: CreationOptional<number>;
  declare status: CreationOptional<CmsContentStatus>;
  declare publishedAt: CreationOptional<Date | null>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

CmsFaq.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    question: {
      type: DataTypes.STRING(240),
      allowNull: false,
    },
    answer: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: '',
    },
    sortOrder: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
    },
    status: {
      type: DataTypes.ENUM('draft', 'published', 'archived'),
      allowNull: false,
      defaultValue: 'draft',
    },
    publishedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: 'cms_faqs',
    modelName: 'CmsFaq',
  },
);

export default CmsFaq;
