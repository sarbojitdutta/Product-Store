import express from "express"
import helmet from "helmet"
import morgan from "morgan"
import cors from "cors"
import dotenv from "dotenv"
import productRoute from "./routes/productRoute.js"
import { sql } from "./configs/db.js"

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000
app.use(express.json())
app.use(cors())
app.use(helmet())
app.use(morgan("dev"))

app.use(async (req, res, next) => {
    try{
        const decision = await aj.protect(req, {
            requested: 1,
        })

        if(decision.isDenied()){
            if(decision.reason.isRateLimit()){
                res.status(429).json({
                    success: false,
                    message: "Too many requests"
                })
            }
            else if(decision.reason.isBot()){
                res.status(403).json({
                    success: false,
                    message: "Bot detected"
                })
            }else{
                res.status(401).json({
                    success: false,
                    message: "Unauthorized"
                })
            }
            return 
        }
        if(decision.results.some((result) => result.reason.isBot() && result.reason.isSpoofed())){
            res.status(403).json({
                success: false,
                message: "sppofed Bot detected"
            })
            return
        }
        next()

    }catch(error){
        console.log("Error in app.use",error)
        res.status(500).json({success: false, error: error.message})
        next(error)
    }
})
app.use("/api/routes", productRoute)

async function initDB() {
    try {
        await sql`
        CREATE TABLE IF NOT EXISTS products (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            price DECIMAL(10,2) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            image VARCHAR(255) NOT NULL,
            description VARCHAR(255) NOT NULL
        )
        `

    } catch (error) {
        console.log("error in initDB", error)
    }
}


initDB().then(() => {
    app.listen(PORT, () => {
        console.log("Server is running on port " + PORT)
    })
})