import { Schema, model } from "mongoose";

interface IUser {
	username: String,
	email: String,
	password: String,
	roles: {
		type: number,
		ref: string
	}
}

export const User = model(
	"User",
	new Schema<IUser>({
		username: String,
		email: String,
		password: String,
		roles: [
			{
				type: Schema.Types.ObjectId,
				ref: "Role"
			}
		]
	})
)
