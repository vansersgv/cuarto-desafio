import { promises as fs } from 'fs'
import { v4 as uuidv4 } from 'uuid'

export class CartManager {
    constructor(dataFilePath) {
        this.carts = []
        this.dataFilePath = dataFilePath
        this.loadCarts()
    }

    async createCart() {
        const newCart = {
            id: uuidv4(),
            products: []
        }
        this.carts.push(newCart)

        await this.saveCarts()

        return newCart
    }

    async loadCarts() {
        const existingCarts = await fs.readFile(this.dataFilePath, 'utf-8')
        this.carts = JSON.parse(existingCarts)
    }

    async saveCarts() {
        await fs.writeFile(this.dataFilePath, JSON.stringify(this.carts, null, 2))
    }

    async getCart(cartId) {
        return this.carts.find(cart => cart.id === cartId)
    }

    async addProductToCart(cartId, productId, quantity = 1) {
        const cart = await this.getCart(cartId)

        if (!cart) {
            throw new Error('Carrito no encontrado')
        }

        const existingProduct = cart.products.find(product => product.product === productId)

        existingProduct
            ? (existingProduct.quantity += quantity)
            : cart.products.push({ product: productId, quantity })

        await this.saveCarts()

        return cart
    }
}

export default CartManager

