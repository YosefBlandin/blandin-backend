import mongoose, { Model, Mongoose } from "mongoose"
import { User } from "./user.model.js"
import { Role } from "./role.model.js"

mongoose.Promise = global.Promise

interface IUser {
	username: String,
	email: String,
	password: String,
	roles: {
		type: number,
		ref: string
	}
}

interface IRole {
	name: string
}

type dbType = {
	mongoose: Mongoose,
	User: Model<IUser>,
	Role: Model<IRole>,
	ROLES: string[]
}

export const DB: dbType = {
	mongoose: mongoose,
	User: User,
	Role: Role,
	ROLES: ["user", "admin"]
}



