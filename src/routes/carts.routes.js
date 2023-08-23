import { Router } from 'express'
import CartManager from '../controllers/cartManager.js'

const routerCart = Router()
const cartManager = new CartManager('src/models/carts.json')

// Ruta para crear un nuevo carrito
routerCart.post('/', async (req, res) => {
    const newCart = await cartManager.createCart()

    const response = newCart
        ? res.status(200).send("Carrito agregado exitosamente")
        : res.status(400).send("El carrito ya existe")

    return response
})

// Ruta para agregar un producto a un carrito
routerCart.post('/:cid/product/:pid', async (req, res) => {
    const cartId = req.params.cid
    const productId = req.params.pid
    const { quantity } = req.body

    const updatedCart = await cartManager.addProductToCart(cartId, productId, quantity)
    res.json(updatedCart.products)
})

// Ruta para obtener los productos de un carrito específico
routerCart.get('/:cid', async (req, res) => {
    const cartId = req.params.cid
    const cart = await cartManager.getCart(cartId)

    if (!cart) {
        res.status(404).send("Carrito no encontrado")

        return
    }

    res.send(cart.products)
})


export default routerCart