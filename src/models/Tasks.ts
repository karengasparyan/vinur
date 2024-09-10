import { DataTypes, Model } from 'sequelize';
import db from '../options/db';
import { Users } from './index';
import { TaskPriority, TaskStatus } from '../types/Tasks';

export default class Tasks extends Model {
  public declare id: string;

  public declare assignee_id: string;

  public declare reporter_id: string;

  public declare title: string;

  public declare description: string;

  public declare priority: TaskPriority;

  public declare status: TaskStatus;

  public declare due_date: Date;

  public declare time_tracking: number; //hours

  public declare readonly created_at: Date;

  public declare readonly updated_at: Date;
}

Tasks.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4
    },
    assignee_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    reporter_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    title: {
      type: DataTypes.STRING(128),
      allowNull: false,
      validate: {
        min: 3
      }
    },
    description: {
      type: DataTypes.STRING(512),
      allowNull: true,
      defaultValue: null
    },
    priority: {
      type: DataTypes.NUMBER(),
      defaultValue: TaskPriority.MEDIUM,
      validate: {
        isIn: [Object.values(TaskPriority)]
      }
    },
    status: {
      type: DataTypes.STRING(16),
      defaultValue: TaskStatus.TO_DO,
      validate: {
        isIn: [Object.values(TaskStatus)]
      }
    },
    due_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    time_tracking: {
      type: DataTypes.NUMBER(),
      defaultValue: null,
      allowNull: true
    }
  },
  {
    sequelize: db,
    tableName: 'tasks',
    modelName: 'Tasks'
  }
);

Users.hasMany(Tasks, {
  foreignKey: 'assignee_id',
  as: 'tasks',
  onUpdate: 'cascade',
  onDelete: 'cascade'
});

Tasks.belongsTo(Users, {
  foreignKey: 'assignee_id',
  as: 'user',
  onUpdate: 'cascade',
  onDelete: 'cascade'
});
