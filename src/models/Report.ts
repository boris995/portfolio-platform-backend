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

export type ReportStatus = 'open' | 'resolved';

class Report extends Model<
  InferAttributes<Report>,
  InferCreationAttributes<Report>
> {
  declare id: CreationOptional<number>;
  declare portfolioId: ForeignKey<Portfolio['id']>;
  declare reporterId: ForeignKey<User['id']>;
  declare reason: string;
  declare details: CreationOptional<string>;
  declare status: CreationOptional<ReportStatus>;
  declare resolvedAt: CreationOptional<Date | null>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

Report.init(
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
    reporterId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
    },
    reason: {
      type: DataTypes.STRING(180),
      allowNull: false,
    },
    details: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: '',
    },
    status: {
      type: DataTypes.ENUM('open', 'resolved'),
      allowNull: false,
      defaultValue: 'open',
    },
    resolvedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: 'reports',
    modelName: 'Report',
  },
);

Portfolio.hasMany(Report, {
  foreignKey: 'portfolioId',
  as: 'reports',
});

Report.belongsTo(Portfolio, {
  foreignKey: 'portfolioId',
  as: 'portfolio',
});

User.hasMany(Report, {
  foreignKey: 'reporterId',
  as: 'reports',
});

Report.belongsTo(User, {
  foreignKey: 'reporterId',
  as: 'reporter',
});

export default Report;
