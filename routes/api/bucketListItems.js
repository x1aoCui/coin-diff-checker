const { Router } = require('express')
const BucketListItem = require('../../models/BukectListItem')
const multer = require('multer');
const { photoUrl } = require('../../config')
fs = require('fs-extra')
const Resemblejs = require('resemblejs')
const router = Router()
const multiparty = require('multiparty');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, photoUrl)
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now())
    }
});

const upload = multer({storage: storage});
var loadedPhotoList = [];

router.get('/getphoto', async (req, res) => {
    try {
        const bucketListItems = await BucketListItem.find()
        if (!bucketListItems) throw new Error('No bucketListItems')
        const sorted = bucketListItems.sort((a, b) => {
            return new Date(a.date).getTime() - new Date(b.date).getTime()
        })
        loadedPhotoList = bucketListItems
        // console.log(loadedPhotoList[0]._id.toString())
        res.status(200).json(sorted)

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

router.post('/compareCoin', async (req, res) => {
    let form = new multiparty.Form();
    let resultList = [];
    form.parse(req, function(err, fields, files) {
        Object.keys(files).forEach(async function(name) {
            /*console.log(files[name][0].path);*/
            let img = fs.readFileSync(files[name][0].path);
            let encode_image = img.toString('base64');
              for(let i = 0; i<loadedPhotoList.length;i++){
                Resemblejs(returnBase64Photos(encode_image))
                    .compareTo(returnBase64Photos(_arrayBufferToBase64(loadedPhotoList[i].img.data)))
                    .ignoreColors()
                    .onComplete(function (data) {
                      resultList.push((100-data.rawMisMatchPercentage)/100)

                    });
              }
            res.send(resultList)
        });

    });

})

router.post('/uploadphoto', async (req, res) => {

    const form = new multiparty.Form();
    form.parse(req, function(err, fields, files) {
        Object.keys(files).forEach(async function(name) {
            /*console.log(files[name][0].path);*/
                let img = fs.readFileSync(files[name][0].path);
                let encode_image = img.toString('base64');
                let finalImg = {
                    description:name,
                    date: Date.now(),
                    img: {data:Buffer.from(encode_image.toString('base64'), 'base64'),contentType: String},
                    value:files[name].value
                };
                const newBucketListItem = new BucketListItem(finalImg)
    try {
        const bucketListItem = await newBucketListItem.save()

        if (!bucketListItem) throw new Error('Something went wrong saving the bucketListItem')
        //res.status(200).json(bucketListItem)
    } catch (error) {
        //res.status(500).json({ message: error.message })
    }

        });

    });

})

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

const returnBase64Photos = (photoBase64Data) =>{
    return `data:image/jpeg;base64,${photoBase64Data}`
}

const _arrayBufferToBase64 = (buffer) => {
    let binary = '';
    let bytes = new Uint8Array( buffer );
    let len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode( bytes[ i ] );
    }
    return btoa( binary );
}
module.exports = router