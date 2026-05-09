import {
  DataTypes,
  Model,
  type CreationOptional,
  type ForeignKey,
  type InferAttributes,
  type InferCreationAttributes,
} from 'sequelize';
import sequelize from '../config/database';
import User from './User';

export type PortfolioCategory =
  | 'Frontend'
  | 'Backend'
  | 'Full Stack'
  | 'UI/UX'
  | 'Mobile'
  | 'DevOps';

export type PortfolioStatus = 'approved' | 'pending' | 'rejected';

class Portfolio extends Model<
  InferAttributes<Portfolio>,
  InferCreationAttributes<Portfolio>
> {
  declare id: CreationOptional<number>;
  declare userId: ForeignKey<User['id']>;
  declare title: string;
  declare slug: string;
  declare role: string;
  declare bio: CreationOptional<string>;
  declare location: CreationOptional<string>;
  declare category: CreationOptional<PortfolioCategory>;
  declare avatar: CreationOptional<string>;
  declare coverImage: CreationOptional<string>;
  declare featured: CreationOptional<boolean>;
  declare status: CreationOptional<PortfolioStatus>;
  declare views: CreationOptional<number>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

Portfolio.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
    },
    title: {
      type: DataTypes.STRING(140),
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    role: {
      type: DataTypes.STRING(120),
      allowNull: false,
    },
    bio: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: '',
    },
    location: {
      type: DataTypes.STRING(140),
      allowNull: false,
      defaultValue: '',
    },
    category: {
      type: DataTypes.ENUM(
        'Frontend',
        'Backend',
        'Full Stack',
        'UI/UX',
        'Mobile',
        'DevOps',
      ),
      allowNull: false,
      defaultValue: 'Full Stack',
    },
    avatar: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300',
    },
    coverImage: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=1200',
    },
    featured: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    status: {
      type: DataTypes.ENUM('approved', 'pending', 'rejected'),
      allowNull: false,
      defaultValue: 'pending',
    },
    views: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: 'portfolios',
    modelName: 'Portfolio',
  },
);

User.hasMany(Portfolio, {
  foreignKey: 'userId',
  as: 'portfolios',
});

Portfolio.belongsTo(User, {
  foreignKey: 'userId',
  as: 'owner',
});

export default Portfolio;
