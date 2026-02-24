const express = require("express")
const cors = require("cors")
require("dotenv").config()

const pool = require("./db")

const app = express()

app.use(cors())
app.use(express.json())

// Create table automatically
async function createTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100),
      email VARCHAR(100)
    )
  `)
}
createTable()

// 🔹 CREATE USER
app.post("/users", async (req, res) => {
  const { name, email } = req.body

  const result = await pool.query(
    "INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *",
    [name, email]
  )

  res.json(result.rows[0])
})

// 🔹 READ USERS
app.get("/users", async (req, res) => {
  const result = await pool.query(
    "SELECT * FROM users ORDER BY id DESC"
  )

  res.json(result.rows)
})

// 🔹 UPDATE USER
app.put("/users/:id", async (req, res) => {
  const { id } = req.params
  const { name, email } = req.body

  const result = await pool.query(
    "UPDATE users SET name=$1, email=$2 WHERE id=$3 RETURNING *",
    [name, email, id]
  )

  res.json(result.rows[0])
})

// 🔹 DELETE USER
app.delete("/users/:id", async (req, res) => {
  const { id } = req.params

  await pool.query("DELETE FROM users WHERE id=$1", [id])

  res.json({ message: "User deleted successfully" })
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log("Server running on port", PORT)
})