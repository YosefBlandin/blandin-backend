import { Request, Response } from "express"
import { DB } from "../models/index.js"

const { ROLES, User } = DB

const checkDuplicateUsername = (request: Request, response: Response) => {
	User.findOne({
		username: request.body.username
	}).exec()
		.then((user: any) => {
			if (user) {
				response.status(400).send("This username is already in use")
			}
		})
		.catch((error: Error) => {
			response.status(500).send({ message: error.message })
		})
}

const checkDuplicateEmail = (request: Request, response: Response) => {
	User.findOne({
		email: request.body.email
	}).exec()
		.then((user: any) => {
			if (user) {
				response.status(400).send("This email is already in use")
			}
		})
		.catch((error: Error) => {
			response.status(500).send({ message: error.message })
		})
}

export const verifySignUp = {
	checkDuplicateEmail,
	checkDuplicateUsername
}