import { sql } from "../configs/db.js"
export const getAllProducts = async (req, res) => {
    try {
        const products = await sql` SELECT * FROM products ORDER BY created_at DESC`
        res.status(200).json({ success: true, data: products })
    } catch (error) {
        console.log("Error in getAllProducts", error)
        res.status(500).json({ success: false, error: error.message })
    }
}
export const createProduct = async (req, res) => {
    const { name, price, image } = req.body;

    if (!name || !price || !image) {
        return res.status(400).json({ success: false, message: "All fields are required" });
    }

    try {
        const newProduct = await sql`
      INSERT INTO products (name,price,image)
      VALUES (${name},${price},${image})
      RETURNING *
    `;

        res.status(201).json({ success: true, data: newProduct[0] });
    } catch (error) {
        console.log("Error in createProduct function", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}
export const getProduct = async (req, res) => {
    try {
        const product = await sql` SELECT * FROM products WHERE id = ${req.params.id}`
        res.status(200).json({ success: true, data: product })
    } catch (error) {
        console.log("Error in getProduct", error)
        res.status(500).json({ success: false, error: error.message })
    }
}
export const updateProduct = async (req, res) => {
    try {
        const updated = await sql`
        UPDATE products 
        SET name = ${req.body.name}, 
        price = ${req.body.price}, 
        image = ${req.body.image}, 
        WHERE id = ${req.params.id}
        RETURNING *`

        if (updated.length === 0) {
            return res.status(404).json({ success: false, message: "Product not found" })
        }

        res.status(200).json({ success: true, data: updated })
    } catch (error) {
        console.log("Error in updateProduct", error)
        res.status(500).json({ success: false, error: error.message })
    }
}

export const deleteProduct = async (req, res) => {
    try {
        const deleted = await sql`
        DELETE FROM products WHERE id = ${req.params.id} RETURNING * 
        `
        res.status(200).json({ success: true, data: deleted })

    } catch (error) {
        console.log("Error in deleteProduct", error)
        res.status(500).json({ success: false, error: error.message })
    }
}