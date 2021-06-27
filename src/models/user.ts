import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from '../loaders/sequelize';


export interface UserAtrributes {
    id: number
    username: string
    password: string
}

export interface UserCreationAttributes extends Optional<UserAtrributes, "id"> { }

export interface UserInstance
    extends Model<UserAtrributes, UserCreationAttributes>,
    UserAtrributes { }


const UserModel = sequelize.define<UserInstance>("User", {
    id: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER.UNSIGNED,
    },
    username: {
        unique: true,
        allowNull: false,
        type: DataTypes.STRING,
    },
    password: {
        allowNull: false,
        type: DataTypes.STRING
    }
}, {
    timestamps: true
});

export default UserModel;

