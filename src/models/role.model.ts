import { Schema, model } from "mongoose";

interface IRole {
	name: string
}

export const Role = model(
	"Role",
	new Schema<IRole>({
		name: String
	})
)
