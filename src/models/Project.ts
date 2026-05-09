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

class Project extends Model<
  InferAttributes<Project>,
  InferCreationAttributes<Project>
> {
  declare id: CreationOptional<number>;
  declare portfolioId: ForeignKey<Portfolio['id']>;
  declare title: string;
  declare description: CreationOptional<string>;
  declare tech: CreationOptional<string[]>;
  declare image: CreationOptional<string | null>;
  declare githubUrl: CreationOptional<string | null>;
  declare liveUrl: CreationOptional<string | null>;
  declare views: CreationOptional<number>;
  declare likes: CreationOptional<number>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

Project.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    portfolioId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: Portfolio,
        key: 'id',
      },
    },
    title: {
      type: DataTypes.STRING(140),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: '',
    },
    tech: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [],
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    githubUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    liveUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    views: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
    },
    likes: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: 'projects',
    modelName: 'Project',
  },
);

Portfolio.hasMany(Project, {
  foreignKey: 'portfolioId',
  as: 'projects',
});

Project.belongsTo(Portfolio, {
  foreignKey: 'portfolioId',
  as: 'portfolio',
});

export default Project;
