const socket = io()

const productForm = document.getElementById('createProduct')
const deleteProductForm = document.getElementById('deleteProduct')

productForm.addEventListener('submit', (event) => {
    event.preventDefault()

    const formData = new FormData(event.target)
    const productData = Object.fromEntries(formData)

    socket.emit('newProduct', productData)

    socket.on('productAddedMessage', (message) => {
        Swal.fire(
            message
        )
    })

    event.target.reset()
})
