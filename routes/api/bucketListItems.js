const { Router } = require('express')
const BucketListItem = require('../../models/BukectListItem')
const multer = require('multer');
const { photoUrl } = require('../../config')
fs = require('fs-extra')
const router = Router()

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, photoUrl)
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now())
    }
});

const upload = multer({storage: storage});


router.get('/', async (req, res) => {
    try {
        const bucketListItems = await BucketListItem.find()
        if (!bucketListItems) throw new Error('No bucketListItems')
        const sorted = bucketListItems.sort((a, b) => {
            return new Date(a.date).getTime() - new Date(b.date).getTime()
        })
        res.status(200).json(sorted)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

// router.post('/uploadphoto', async (req, res) => {
//     const newBucketListItem = new BucketListItem(req.body)
//     try {
//         const bucketListItem = await newBucketListItem.save()
//         if (!bucketListItem) throw new Error('Something went wrong saving the bucketListItem')
//         res.status(200).json(bucketListItem)
//     } catch (error) {
//         res.status(500).json({ message: error.message })
//     }
// })

router.put('/:id', async (req, res) => {
    const { id } = req.params

    try {
        const response = await BucketListItem.findByIdAndUpdate(id, req.body)
        if (!response) throw Error('Something went wrong ')
        const updated = { ...response._doc, ...req.body }
        res.status(200).json(updated)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

router.delete('/:id', async (req, res) => {
    const { id } = req.params
    try {
        const removed = await BucketListItem.findByIdAndDelete(id)
        if (!removed) throw Error('Something went wrong ')
        res.status(200).json(removed)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

//Uploading multiple files
router.post('/uploadphoto', upload.single('picture'), async (req, res) => {

    let img = fs.readFileSync(req.file.path);
    let encode_image = img.toString('base64');

    // Define a JSONobject for the image attributes for saving to database
    let finalImg = {
        description:"test photo11",
        date: Date.now(),
        img: {data:Buffer.from(encode_image, 'base64'),contentType: String}
    };


    const newBucketListItem = new BucketListItem(finalImg)

    try {
        const bucketListItem = await newBucketListItem.save()

        if (!bucketListItem) throw new Error('Something went wrong saving the bucketListItem')
        res.status(200).json(bucketListItem)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

module.exports = router