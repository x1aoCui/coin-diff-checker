const { Schema, model } = require('mongoose')
//data type? with photo
const ListNavItemSchema = new Schema({
    id: {
        type: String,
        required: true
    },
    name:{
        type: String,
    },
    item: {
        type: Array,
        default: []
    }
})

const ListNavItem = model('listNavItem', ListNavItemSchema)

module.exports = ListNavItem