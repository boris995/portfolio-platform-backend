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
import User from './User';

class RecentView extends Model<
  InferAttributes<RecentView>,
  InferCreationAttributes<RecentView>
> {
  declare id: CreationOptional<number>;
  declare userId: ForeignKey<User['id']>;
  declare portfolioId: ForeignKey<Portfolio['id']>;
  declare viewedAt: CreationOptional<Date>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

RecentView.init(
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
    viewedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: 'recent_views',
    modelName: 'RecentView',
    indexes: [{ unique: true, fields: ['userId', 'portfolioId'] }],
  },
);

User.hasMany(RecentView, { foreignKey: 'userId', as: 'recentViews' });
RecentView.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Portfolio.hasMany(RecentView, { foreignKey: 'portfolioId', as: 'recentViews' });
RecentView.belongsTo(Portfolio, { foreignKey: 'portfolioId', as: 'portfolio' });

export default RecentView;
