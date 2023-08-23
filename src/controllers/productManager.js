import { promises as fs } from 'fs'
import { v4 as uuidv4 } from 'uuid'

export class ProductManager {
    constructor(dataFilePath) {
        this.products = []
        this.dataFilePath = dataFilePath
    }

    async getProducts() {
        const existingProducts = JSON.parse(await fs.readFile(this.dataFilePath, 'utf-8'))

        return existingProducts
    }

    async getProductById(id) {
        const existingProducts = JSON.parse(await fs.readFile(this.dataFilePath, 'utf-8'))
        const foundProduct = existingProducts.find(product => product.id == id)

        return foundProduct || null
    }

    async addProduct(newProduct) {
        const requiredStringFields = ['title', 'description', 'code', 'category']
        const requiredNumberFields = ['price', 'stock']

        const response = {
            status: false,
            message: ''
        }

        if (
            requiredStringFields.some(field => !newProduct[field]) ||
            requiredNumberFields.some(field => !(newProduct[field] >= 0))
        ) {
            response.message = "Validación fallida. Producto no agregado."

            return response
        }

        const existingProducts = JSON.parse(await fs.readFile(this.dataFilePath, 'utf-8'))

        if (existingProducts.some(product => product.code === newProduct.code)) {
            response.message = "El producto ya existe. Producto no agregado."

            return response
        }

        newProduct.status = true

        existingProducts.push(newProduct)

        newProduct.id = uuidv4()
        newProduct.thumbnails ??= []

        await fs.writeFile(this.dataFilePath, JSON.stringify(existingProducts))

        response.status = true
        response.message = "Producto agregado exitosamente."

        return response
    }

    async updateProduct(id, updatedProduct) {
        const existingProducts = JSON.parse(await fs.readFile(this.dataFilePath, 'utf-8'))
        const productIndex = existingProducts.findIndex(product => product.id === id)

        if (productIndex === -1) {
            return false
        }

        existingProducts[productIndex] = { ...existingProducts[productIndex], ...updatedProduct }

        await fs.writeFile(this.dataFilePath, JSON.stringify(existingProducts))

        return true
    }

    async deleteProduct(id) {
        const existingProducts = JSON.parse(await fs.readFile(this.dataFilePath, 'utf-8'))
        const updatedProducts = existingProducts.filter(product => product.id !== id)

        await fs.writeFile(this.dataFilePath, JSON.stringify(updatedProducts))

        return JSON.parse(fs.readFileSync(this.dataFilePath, "utf-8"))
    }
}

export default ProductManager