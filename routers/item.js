const express = require('express')
const Item = require('../models/item')
const Auth = require('../middleware/auth')

const router = new express.Router()


// We create a new item from the request body and the owner from the user object on our request, remember, we added that in the auth middleware.
router.post('/items',Auth, async(req, res) => {
    try {
    const newItem = new Item({
        ...req.body,
        owner: req.user._id
    })
       await newItem.save()
       res.status(201).send(newItem)
    } catch (error) {
    res.status(400).send({message: "error"})
    }
})

// We find the item using the id provided in the request and send back the item, otherwise, we send back an error
router.get('/items/:id', async(req, res) => {
    try{
       const item = await Item.findOne({_id: req.params.id})
    if(!item) {
       res.status(404).send({error: "Item not found"})
    }
       res.status(200).send(item)
    } catch (error) {
       res.status(400).send(error)
    }
})


// We get all items by providing an empty object to find.
router.get('/items', async(req, res) => {
    try {
      const items = await Item.find({})
      res.status(200).send(items)
    } catch (error) {
      res.status(400).send(error)
    }
})


// First we get the fields to be updated using Object.keys, and saving them in updates then we specify the fields
// that can be updated, in our case name, description category and price.

// Then we loop through the allowedupdates making sure each of the fields to be updated is present in the allowedupdates, if not such update is not allowed and we throw an error.
router.patch('/items/:id', Auth, async(req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'description', 'category', 'price']

    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
       if(!isValidOperation) {
         return res.status(400).send({ error: 'invalid updates'})
    }
    try {
      const item = await Item.findOne({ _id: req.params.id})

      if(!item){
          return res.status(404).send()
      }

      updates.forEach((update) => item[update] = req.body[update])
      await item.save()
      res.send(item)

    } catch (error) {
    res.status(400).send(error)
    }
})

// We find and delete the item using the id provided in the request. If the item exists, it will be returned 
// and we can check if any item is returned. If yes, we send back the item but if no item was found, we send back an error.
router.delete('/items/:id', Auth, async(req, res) => {
    try {
    const deletedItem = await Item.findOneAndDelete( {_id: req.params.id} )
       if(!deletedItem) {
        res.status(404).send({error: "Item not found"})
    }
       res.send(deletedItem)
    } catch (error) {
       res.status(400).send(error)
    }
})
