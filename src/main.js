import express from 'express'
import multer from 'multer'
import { engine } from 'express-handlebars'
import { Server } from 'socket.io'
import routerProd from './routes/products.routes.js'
import routerCart from './routes/carts.routes.js'
import { __dirname } from './path.js'
import { ProductManager } from './controllers/productManager.js'
import path from 'path'

const app = express()
const PORT = 8080
const productManager = new ProductManager('src/models/products.json')

// Server
const server = app.listen(PORT, () => {
    console.log(`Server on PORT: ${PORT}
http://localhost:${PORT}`)
})

const io = new Server(server)

// configuración
const imageStorageConfig = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'src/public/img')
    },

    filename: (req, file, cb) => {
        cb(null, `${Date.now()}${file.originalname}`)
    }
})

// Middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.engine('handlebars', engine())
app.set('view engine', 'handlebars')
app.set('views', path.resolve(__dirname, './views'))

const imageUpload = multer({ storage: imageStorageConfig })

// Socket.io conection
io.on("connection", (socket) => {
    console.log("Connection with Socket.io")

    socket.on('load', async () => {
        const products = await productManager.getProducts()

        socket.emit('products', products)
    })

    socket.on('newProduct', async (productData) => {
        await productManager.addProduct(productData)

        socket.emit('productAddedMessage', "Producto agregado exitosamente")
    })
})

// Routes
app.use('/static', express.static(path.join(__dirname, '/public')))
app.use('/static/realtimeproducts', express.static(path.join(__dirname, '/public')))
app.use('/api/products', routerProd)
app.use('/api/carts', routerCart)

// Handlebars
app.get('/static', (req, res) => {
    res.render("home", {
        pathCSS: "home",
        pathJS: "home"
    })
})

app.get('/static/realtimeproducts', (req, res) => {
    res.render("realTimeProducts", {
        pathCSS: "realTimeProducts",
        pathJS: "realTimeProducts"
    })
})

app.post('/upload', imageUpload.single('product'), (req, res) => {
    res.status(200).send("Upload Image")
})