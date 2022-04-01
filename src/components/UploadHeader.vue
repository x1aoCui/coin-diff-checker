<template>
  <el-row>
    <el-button type="primary" @click="$refs.file.click()">Upload
        <el-icon  class="el-icon--right"><Upload /></el-icon>
      <input  type="file" name="file" ref="file" multiple v-on:change="handleFileUpload($event)" enctype="multipart/form-data" style="display:none"/>
    </el-button>
    <el-button-group class="ml-4">
      <el-button v-on:click="submitFile()" :span="2">Submit</el-button>
      <el-button v-on:click="compareAllCoins()" :span="2">Compare</el-button>
    </el-button-group>
  </el-row>
    <el-row class="demo-image" :gutter="10" v-if="photoPreview.length>0">
      <div v-for="(photoPre,index) in photoPreview"
           v-bind:key="index" >
        <el-col :span="4">
        <el-image  style="width: 100px; height: 100px" :src="photoPre" :fit="fill" :preview-src-list="photoPreview"/>
        </el-col>
      </div>
    </el-row>
</template>

<script >

import FormData from "form-data";
import axios from "axios";
import {ref} from "@vue/reactivity";
import {Upload} from "@element-plus/icons-vue";

export default {
  name: "UploadHeader",
  components: {Upload},
  props:{
    dictIndex: String
  },
  setup(props,{emit}){
    const files = ref([])
    const photoPreview= ref([])



    const handleFileUpload = (event) =>{
      files.value = []
      photoPreview.value = []
      let uploadedFiles = event.target.files;
      for( let i = 0; i < uploadedFiles.length; i++ ){
        files.value.push( uploadedFiles[i] );
        photoPreview.value.push(URL.createObjectURL(files.value[i]));
      }
    }
    const compareAllCoins = async () =>{
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
      emit('updateCoinDiffList',res.data)
    }
    const submitFile=async ()=>{
      if (props.dictIndex.length!=0&&files.value.length!=0){

        const formData = new FormData();
        for( let i = 0; i < files.value.length; i++ ){
          let file = files.value[i];
          formData.append(file.name, file);
        }
        formData.append("key_index",props.dictIndex)
        photoPreview.value=[]
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
    return{submitFile,compareAllCoins,handleFileUpload,photoPreview}
}
}
</script>

<style scoped>
.demo-image .block {
  padding: 30px 0;
  text-align: center;
  border-right: solid 1px var(--el-border-color);
  display: inline-block;
  width: 20%;
  box-sizing: border-box;
  vertical-align: top;
}
.demo-image .block:last-child {
  border-right: none;
}
.demo-image .demonstration {
  display: block;
  color: var(--el-text-color-secondary);
  font-size: 14px;
  margin-bottom: 20px;
}
</style>