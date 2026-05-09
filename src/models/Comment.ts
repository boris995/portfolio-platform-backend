import {
  DataTypes,
  Model,
  type CreationOptional,
  type ForeignKey,
  type InferAttributes,
  type InferCreationAttributes,
} from 'sequelize';
import sequelize from '../config/database';
import Portfolio from './Portfolio';
import Project from './Project';
import User from './User';

class Comment extends Model<
  InferAttributes<Comment>,
  InferCreationAttributes<Comment>
> {
  declare id: CreationOptional<number>;
  declare userId: ForeignKey<User['id']>;
  declare portfolioId: ForeignKey<Portfolio['id']>;
  declare projectId: ForeignKey<Project['id']> | null;
  declare body: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

Comment.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: { model: User, key: 'id' },
    },
    portfolioId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: { model: Portfolio, key: 'id' },
    },
    projectId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      references: { model: Project, key: 'id' },
    },
    body: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: 'comments',
    modelName: 'Comment',
  },
);

User.hasMany(Comment, { foreignKey: 'userId', as: 'comments' });
Comment.belongsTo(User, { foreignKey: 'userId', as: 'author' });
Portfolio.hasMany(Comment, { foreignKey: 'portfolioId', as: 'comments' });
Comment.belongsTo(Portfolio, { foreignKey: 'portfolioId', as: 'portfolio' });
Project.hasMany(Comment, { foreignKey: 'projectId', as: 'comments' });
Comment.belongsTo(Project, { foreignKey: 'projectId', as: 'project' });

export default Comment;
