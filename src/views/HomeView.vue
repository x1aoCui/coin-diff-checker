<template>

<div id="home">
  <el-container>
    <!-- 侧边栏 -->
    <el-aside width="220px">
  <!-- 侧边栏 -->
      <sidebar-menu
          @loadPhotos = "loadphoto"
      />
    </el-aside>
    <el-container>
      <!-- 顶部 -->
      <el-header  height="150px">
<!--        <el-upload action="#" list-type="picture-card" :auto-upload="false">-->
<!--          <el-icon><Plus /></el-icon>-->

<!--          <template #file="{ file }">-->
<!--            <div>-->
<!--              <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />-->
<!--              <span class="el-upload-list__item-actions">-->
<!--          <span-->
<!--              class="el-upload-list__item-preview"-->
<!--              @click="handlePictureCardPreview(file)"-->
<!--          >-->
<!--            <el-icon><zoom-in /></el-icon>-->
<!--          </span>-->

<!--          <span-->
<!--              v-if="!disabled"-->
<!--              class="el-upload-list__item-delete"-->
<!--              @click="handleRemove(file)"-->
<!--          >-->
<!--            <el-icon><Delete /></el-icon>-->
<!--          </span>-->
<!--        </span>-->
<!--            </div>-->
<!--          </template>-->
<!--        </el-upload>-->

        <el-col :span="4">
            <input type="file" name="file" ref="file" multiple v-on:change="handleFileUpload($event)" enctype="multipart/form-data" />
            <el-image
              style="width: 100px; height: 100px"
              v-if="photoPreview"
              :src ="photoPreview"
              fit="cover"
            />
          <br/>

        </el-col>
        <button v-on:click="submitFile()">Submit</button>
        <button v-on:click="compareAllCoins()">Compare</button>
        <el-col :span="20">

        </el-col>
      </el-header>
      <!-- 主页面 -->
      <el-main> Your localtion :{{ dictIndex }}
        <el-row >
          <coin-detail
              :photos=photos
              :diff-list=diffList
              @callRefresh="callRefresh"
          />
        </el-row>

      </el-main>
    </el-container>
  </el-container>

</div>


</template>

<script>
/* eslint-disable */
import {ref} from "@vue/reactivity";
import {onMounted, reactive} from "vue";
import axios from "axios";
import FormData from 'form-data'
import CoinDetail from "@/components/CoinDetail";
import SidebarMenu from "@/components/SidebarMenu";


export default {
  name: 'HomeView',
  components: {SidebarMenu, CoinDetail},
  setup(){
    const diffList = ref([])
    const photos = ref([])
    const files = ref([])
    const photoPreview= ref("")
    const dictIndex = ref("")

    // mongodb part
    onMounted( async ()=>{
      // const res = await axios.get("http://localhost:3000/api/bucketListItems/");
      // items.value = res.data;
      // console.log(items.value)

    })
    const compareAllCoins = async () =>{
      diffList.value = []

      //compute in the backend
      let formData = new FormData();
      formData.append(files.value[0].name, files.value[0]);
      const res = await axios.post("http://localhost:3000/api/bucketListItems/compareCoin",
          formData,
          {
            mode: 'cors',
            headers: {
              'Content-Type': 'multipart/form-data',
            }
          }
      )
      diffList.value = res.data
    }
    const handleFileUpload = (event) =>{
      console.log("changed")
      files.value = []
      let uploadedFiles = event.target.files;
      for( let i = 0; i < uploadedFiles.length; i++ ){
        files.value.push( uploadedFiles[i] );
      }
      //photo preview part
      photoPreview.value = URL.createObjectURL(files.value[0])

    }
    const getPhotos = async(dictIndex)=> {
      console.log(dictIndex)
      //clear temp lists, later use a function to clean all
      diffList.value = []
      photos.value = []
      const res = await axios.post("http://localhost:3000/api/bucketListItems/getphoto",{dictIndex: dictIndex},
          )
      for(let i = 0; i<res.data.length;i++){
        let photoBase64Data = _arrayBufferToBase64(res.data[i].img.data.data)
        photos.value.push({
          data:returnBase64Photos(photoBase64Data),
          name:res.data[i].description,
          date:res.data[i].date,
          id:res.data[i]._id
        })
      }
    }

    const submitFile=async ()=>{
      if (dictIndex.value.length!=0&&files.value.length!=0){

        const formData = new FormData();
        for( let i = 0; i < files.value.length; i++ ){
          let file = files.value[i];
          formData.append(file.name, file);
        }
        formData.append("key_index",dictIndex.value)
        console.log(formData)
        files.value = []
        await axios.post( 'http://localhost:3000/api/bucketListItems/uploadphoto',
            formData,
            {

              headers: {
                'Content-Type': 'multipart/form-data',
              }
            }
        ).then(function(){
          console.log('SUCCESS!!');
        })
            .catch(function(){
              console.log('FAILURE!!');
            });
      }

    }


    //以后用for绑定多个
    //判断文件夹的index来检索数据库数据
    const loadphoto = (keyIndex) => {

        dictIndex.value = keyIndex
        getPhotos(dictIndex.value)
    }

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
      return window.btoa( binary );
    }

    const callRefresh=async ()=>{
      await getPhotos(dictIndex.value)
    }

    return{
      handleFileUpload,
      submitFile,files,loadphoto,photos,compareAllCoins,diffList,
      photoPreview,callRefresh,dictIndex
    }
  }

}
</script>

<style lang="scss" scoped>
.home{

  .el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
    min-height: 100%;
  }
}
</style>

// async function removeItem(item,index) {
//   const res = await axios.delete("http://localhost:3000/api/bucketListItems/"+item._id);
//   this.items.splice(index,1)
//   console.log(res)
// }