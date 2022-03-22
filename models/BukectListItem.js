const { Schema, model } = require('mongoose')
//data type? with photo
const BucketListItemSchema = new Schema({
    description: {
        type: String,
        required: true
    },
    img:{
        data:Buffer,
        contentType:String
    },
    date: {
        type: Date,
        default: Date.now
    }
})

const BucketListItem = model('bucketListItem', BucketListItemSchema)

module.exports = BucketListItem