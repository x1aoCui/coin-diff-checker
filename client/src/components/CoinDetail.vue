<template xmlns:el-col="http://www.w3.org/1999/html">
    <el-col
        v-for="(item,index) in photos"
        v-bind:key="index"
        :span="4"
        ref = "diffList"
        style="padding: 10px"
    >
      <el-card :body-style="{ padding: '10px', height: '220px'}"  >
        <el-row>
          <el-col :span="12">
            <el-image
                style="width: 100px; height: 100px;"
                :src="item.data"
                fit="cover"
            />
          </el-col>
          <el-col :span="12">
            <div v-if="diffList.length>0" >
              <el-row>Coin Symmetry:</el-row>
              <el-row>{{diffList[index]}}</el-row>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <div style="padding: 0px">
            <span>{{item.name}}</span><br />

            <div class="bottom">
              <time class="time">{{ item.date }}</time><br />
              <el-button type="text" class="button" @click="deleteCoin(item.id,index)">Delete</el-button>
            </div>
          </div>
        </el-row>
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
.bottom{
  padding-bottom: 0px;
}
</style>

