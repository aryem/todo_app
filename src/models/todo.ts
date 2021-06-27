import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from '../loaders/sequelize';


export interface TodoAttributes {
    id: number
    title: string
    description: string
    isActive: boolean
}

export interface TodoCreationAttributes extends Optional<TodoAttributes, "id"> { }

export interface TodoInstance
    extends Model<TodoAttributes, TodoCreationAttributes>,
    TodoAttributes { }


const TodoModel = sequelize.define<TodoInstance>("Todo", {
    id: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER.UNSIGNED,
    },
    title: {
        allowNull: false,
        type: DataTypes.STRING,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
}, {
    timestamps: true
});

export default TodoModel;

