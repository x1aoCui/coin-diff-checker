<template>
    <el-col
        v-for="(item,index) in photos"
        v-bind:key="index"
        :span="4"
        ref = "diffList"
    >
      <el-card :body-style="{ padding: '10px'}"  >
        <el-image
            style="width: 100px; height: 100px"
            :src="item.data"
            fit="cover"
        />
        <div style="padding: 0px">
          <span>{{item.name}}</span><br />
          <span v-if="diffList.length>0">Coin Symmetry: {{diffList[index]}}</span>
          <div class="bottom">
            <time class="time">{{ item.date }}</time><br />
            <el-button type="text" class="button" @click="deleteCoin(item.id,index)">Delete</el-button>
          </div>
        </div>
      </el-card>
    </el-col>
</template>

<script>
/* eslint-disable */
import axios from "axios";


export default {
  name: "coinDetail",
  props:{
    photos:{
      data:String,
      name:String,
      date:Number,
      id:String
    },
    diffList: {
      type:Array
    }
  },
  emits:["callRefresh"],
  setup(props, {emit}){

    const deleteCoin = async(_id)=>{
      console.log(_id)
      //delete item in UI,express-loadedList,and moogodb
      const res = await axios.delete("http://localhost:3000/api/bucketListItems/"+_id);
      //or just refresh that
      emit("callRefresh");
    }
    return {deleteCoin}
  }
}
</script>

<style  lang="scss" scoped>
.el-row {
  margin-bottom: 20px;
}
.el-row:last-child {
  margin-bottom: 0;
}
.el-col {
  border-radius: 4px;
}
.bg-purple-dark {
  background: #99a9bf;
}
.bg-purple {
  background: #d3dce6;
}
.bg-purple-light {
  background: #e5e9f2;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
</style>

