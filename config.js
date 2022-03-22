//personallization
//way to config -> mongod ->mongosh-> RUN npm run dev
//-> get result in console client in port 8080 and server in 3000


module.exports = {
    mongoUrl: process.env.MONGO_URI||"mongodb://localhost:27017",
    PORT: process.env.PORT || 3000,
    photoUrl: 'C:\\Users\\cuixi\\Desktop'
}

//memo https://serversideup.net/uploading-files-vuejs-axios/
//id 改成文件夹id 存入mongodb