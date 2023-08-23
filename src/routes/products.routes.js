import { Router } from 'express'
import { ProductManager } from '../controllers/productManager.js'

const productManager = new ProductManager('src/models/products.json')

const routerProd = Router()

// Ruta para conseguir todos los productos
routerProd.get('/', async (req, res) => {
    const { limit } = req.query

    const allProducts = await productManager.getProducts()
    const limitedProducts = allProducts.slice(0, limit)

    res.status(200).send(limitedProducts)
})

// Ruta para obtener un producto específico por ID
routerProd.get('/:pid', async (req, res) => {
    const { pid } = req.params
    const product = await productManager.getProductById(pid)

    product
        ? res.status(200).json(product)
        : res.status(404).send("El producto no existe")
})

// Ruta para agregar un nuevo producto
routerProd.post('/', async (req, res) => {
    const response = await productManager.addProduct(req.body)

    return res.status(response.status ? 200 : 400).send(response.message)
})


// Ruta para actualizar un producto
routerProd.put('/:pid', async (req, res) => {
    const isProductUpdated = productManager.updateProduct(req.params.pid, req.body)

    const response = isProductUpdated
        ? res.status(200).send("Producto actualizado con éxito")
        : res.status(404).send("Producto no encontrado")

    return response
})

// Ruta para eliminar un producto
routerProd.delete('/:pid', async (req, res) => {
    const isProductDeleted = productManager.deleteProduct(req.params.pid)

    const response = isProductDeleted
        ? res.status(200).send("Producto eliminado con éxito")
        : res.status(404).send("Producto no encontrado")

    return response
})

export default routerProd