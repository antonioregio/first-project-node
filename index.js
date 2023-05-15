const express = require('express')
const uuid = require('uuid')
const port = 3000
const app = express()
app.use(express.json())

const clients = []

const checkUserId = (request, response, next) => {
    const { id } = request.params
    
    const index = clients.findIndex(client => client.id === id)

    if(index < 0){
        return response.status(404).json({ error: "User not found"})
    }

    request.clientIndex = index
    request.clientId = id

    next()
}

app.get('/order', (request, response) => {
    
    return response.json(clients)
}) 

app.get('/order/:id', checkUserId, (request, response) => {
    const index = request.clientIndex

    return response.json(clients[index])
})

app.post('/order', (request, response) => {
    const {order, clienteName, price, status} = request.body

    const client = {id:uuid.v4(), order, clienteName, price, status}

    clients.push(client)

    return response.status(201).json(client)
}) 

app.put('/order/:id', checkUserId ,(request, response) => {
    const { order, clienteName, price, status} = request.body
    const index = request.clientIndex
    const id = request.clientId

    const updatedClient = { id, order, clienteName, price, status }
    
    clients[index] = updatedClient

    return response.json(updatedClient)
})

app.patch('/order/:id', checkUserId,(request, response) => {
    const index = request.clientIndex

    console.log(clients[index])

    clients[index].status = "Pronto";

    return response.json(clients[index])
})

app.delete('/order/:id', checkUserId, (request, response) => {
    const index = request.clientIndex

    clients.splice(index,1)

    return response.status(204).json()
})

app.listen(port, () => {
    console.log(`Server started on port ${port}`)
})

