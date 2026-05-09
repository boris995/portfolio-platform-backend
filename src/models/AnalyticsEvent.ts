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

export type AnalyticsEventType =
  | 'portfolio_view'
  | 'github_click'
  | 'live_demo_click'
  | 'project_view';

class AnalyticsEvent extends Model<
  InferAttributes<AnalyticsEvent>,
  InferCreationAttributes<AnalyticsEvent>
> {
  declare id: CreationOptional<number>;
  declare userId: ForeignKey<User['id']> | null;
  declare portfolioId: ForeignKey<Portfolio['id']>;
  declare projectId: ForeignKey<Project['id']> | null;
  declare type: AnalyticsEventType;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

AnalyticsEvent.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
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
    type: {
      type: DataTypes.ENUM(
        'portfolio_view',
        'github_click',
        'live_demo_click',
        'project_view',
      ),
      allowNull: false,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: 'analytics_events',
    modelName: 'AnalyticsEvent',
  },
);

Portfolio.hasMany(AnalyticsEvent, { foreignKey: 'portfolioId', as: 'analyticsEvents' });
AnalyticsEvent.belongsTo(Portfolio, { foreignKey: 'portfolioId', as: 'portfolio' });
Project.hasMany(AnalyticsEvent, { foreignKey: 'projectId', as: 'analyticsEvents' });
AnalyticsEvent.belongsTo(Project, { foreignKey: 'projectId', as: 'project' });
User.hasMany(AnalyticsEvent, { foreignKey: 'userId', as: 'analyticsEvents' });
AnalyticsEvent.belongsTo(User, { foreignKey: 'userId', as: 'user' });

export default AnalyticsEvent;
