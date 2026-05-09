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

class Favorite extends Model<
  InferAttributes<Favorite>,
  InferCreationAttributes<Favorite>
> {
  declare id: CreationOptional<number>;
  declare userId: ForeignKey<User['id']>;
  declare portfolioId: ForeignKey<Portfolio['id']>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

Favorite.init(
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
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: 'favorites',
    modelName: 'Favorite',
    indexes: [{ unique: true, fields: ['userId', 'portfolioId'] }],
  },
);

User.belongsToMany(Portfolio, {
  through: Favorite,
  foreignKey: 'userId',
  otherKey: 'portfolioId',
  as: 'favoritePortfolios',
});

Portfolio.belongsToMany(User, {
  through: Favorite,
  foreignKey: 'portfolioId',
  otherKey: 'userId',
  as: 'favoritedBy',
});

Favorite.belongsTo(Portfolio, {
  foreignKey: 'portfolioId',
  as: 'portfolio',
});

Favorite.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
});

export default Favorite;
