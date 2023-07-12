import express from "express"
import "dotenv/config"
import session from "express-session"
import MongoStore from "connect-mongo"
import pino from "pino"
import mongoose from "mongoose"
import cors from 'cors'
import { DB } from "./models/index.js"
import { allRoutes } from "./routes/index.js"

const app = express()

const logger = pino({
	transport: {
		target: "pino-pretty",
		options: {
			colorize: true
		}
	}
})

const SERVER_PORT = process.env.SERVER_PORT

const { Role } = DB

const initial = () => {
	Role.estimatedDocumentCount()
		.then((count: number) => {
			if (count === 0) {
				new Role({
					name: "admin"
				}).save()
					.then(() => logger.info("Added 'admin' to roles collection"))
					.catch((error: Error) => logger.error("Error", error))

				new Role({
					name: "user"
				}).save()
					.then(() => logger.info("Added 'user' to roles collection"))
					.catch((error: Error) => logger.error("Error", error))
			}
		})
		.catch((error: Error) => logger.error("Error in initial function: " + error.message))
}

const whiteList = [
	'http://localhost:3000',
	'http://localhost:4200',
	'http://localhost:1212'
]

type corsCallback = (firstArgument: Error | null,
	secondArgument?: boolean | undefined) => void

const corsOptions = {
	origin: (origin: string = '', callback: corsCallback) => {
		if (whiteList.indexOf(origin) !== -1 || !origin) {
			callback(null, true)
		} else {
			callback(new Error("Not allowed by CORS"))
		}
	}
}

mongoose.connect(process.env.MONGODB_STRING ?? "")
	.then(() => {
		logger.info("MongoDB is connected")
		initial()
	})
	.catch((error: Error) => logger.error("Error connecting to MongoDB: " + error.message))

app.use(cors(corsOptions))
app.use(express.json())
app.use(
	session(
		{
			secret: "blandin-session",
			resave: false,
			saveUninitialized: false,
			store: new MongoStore({
				mongoUrl: process.env.MONGODB_STRING ?? "",
				ttl: 14 * 24 * 60 * 60,
				autoRemove: 'native'
			})
		}
	)
)
app.use("/", allRoutes)

function onListening() {
	logger.info(`Application running in the ${SERVER_PORT} port`);
}

app.listen(SERVER_PORT, onListening)

