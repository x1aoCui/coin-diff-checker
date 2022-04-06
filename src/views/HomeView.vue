<template>

<div id="home">
  <el-container>
    <!-- 侧边栏 -->
    <el-aside width="220px">
  <!-- 侧边栏 -->
      <sidebar-menu
          @loadPhotos = "loadphoto"
          @emptyDict = "cleanDictInfo"
      />
    </el-aside>
    <el-container>
      <!-- 顶部 -->
      <el-header  height="150px">
        <UploadHeader
            :dict-index="dictIndex"
            @updateCoinDiffList = "updateDiffList"
            @callRefreshBySubmit = "callRefresh"
        />
      </el-header>
      <!-- 主页面 -->
      <el-main> Your localtion :{{ dictPath }}
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
import CoinDetail from "@/components/CoinDetail";
import SidebarMenu from "@/components/SidebarMenu";
import {Plus} from "@element-plus/icons-vue";
import UploadHeader from "@/components/UploadHeader";
import {useStore} from "vuex";



export default {
  name: 'HomeView',
  components: {SidebarMenu, CoinDetail,Plus,UploadHeader},
  setup(){

    const photos = ref([])
    const diffList = ref([])
    const dictIndex = ref("")
    const dictPath = ref('')
    const store = useStore()

    // mongodb part
    onMounted( async ()=>{
      // const res = await axios.get("http://localhost:3000/api/bucketListItems/");
      // items.value = res.data;
      // console.log(items.value)
    })

    const updateDiffList = (data) => {
      diffList.value = data
    }

    const getLocation = (dictIndex) =>{
      let listNav = store.state.listNav
      for(let i =0;i<listNav.length;i++){
        if(listNav[i].item.length>0){
          for(let j=0;j<listNav[i].item.length;j++){
            if(listNav[i].item[j].id==dictIndex){
              dictPath.value = `${listNav[i].name} \/ ${listNav[i].item[j].name}`
            }
          }
        }

      }
    }

    const getPhotos = async(dictIndex)=> {
      console.log(dictIndex)
      getLocation(dictIndex)
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
      console.log("called")
      await getPhotos(dictIndex.value)

    }
    const cleanDictInfo = () =>{
      dictPath.value = ""
      photos.value=[]

    }


    return{
      loadphoto,photos,diffList,cleanDictInfo,
      callRefresh,dictIndex,updateDiffList,getLocation,dictPath
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