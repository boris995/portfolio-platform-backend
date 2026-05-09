import {
  DataTypes,
  Model,
  type CreationOptional,
  type InferAttributes,
  type InferCreationAttributes,
} from 'sequelize';
import sequelize from '../config/database';

export type CmsContentStatus = 'draft' | 'published' | 'archived';

class CmsPage extends Model<
  InferAttributes<CmsPage>,
  InferCreationAttributes<CmsPage>
> {
  declare id: CreationOptional<number>;
  declare title: string;
  declare slug: string;
  declare excerpt: CreationOptional<string>;
  declare content: CreationOptional<string>;
  declare status: CreationOptional<CmsContentStatus>;
  declare seoTitle: CreationOptional<string | null>;
  declare seoDescription: CreationOptional<string | null>;
  declare featuredImageUrl: CreationOptional<string | null>;
  declare publishedAt: CreationOptional<Date | null>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

CmsPage.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING(180),
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING(140),
      allowNull: false,
      unique: true,
    },
    excerpt: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT('long'),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('draft', 'published', 'archived'),
      allowNull: false,
      defaultValue: 'draft',
    },
    seoTitle: {
      type: DataTypes.STRING(180),
      allowNull: true,
    },
    seoDescription: {
      type: DataTypes.STRING(260),
      allowNull: true,
    },
    featuredImageUrl: {
      type: DataTypes.STRING,
      allowNull: true,
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
    tableName: 'cms_pages',
    modelName: 'CmsPage',
  },
);

export default CmsPage;
