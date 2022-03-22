<template>

<div id="home">
  <el-container>
    <!-- 侧边栏 -->
    <el-aside width="220px">
  <!-- 侧边栏 -->
  <el-radio-group v-model="isCollapse" style="margin-bottom: 20px">
    <el-radio-button :label="false">expand</el-radio-button>
    <el-radio-button :label="true">collapse</el-radio-button>
  </el-radio-group>
  <el-menu
          default-active="2"
          class="el-menu-vertical-demo"
          :collapse="isCollapse"
          @open="handleOpen"
          @close="handleClose"
  >
    <el-sub-menu index="1">
      <template #title>
        <el-icon>1</el-icon>
        <span>Navigator One</span>
      </template>
      <el-menu-item-group>
        <template #title><span>Group One</span></template>
        <el-menu-item index="1-1">item one</el-menu-item>
        <el-menu-item index="1-2">item two</el-menu-item>
      </el-menu-item-group>
      <el-menu-item-group title="Group Two">
        <el-menu-item index="1-3">item three</el-menu-item>
      </el-menu-item-group>
      <el-sub-menu index="1-4">
        <template #title><span>item four</span></template>
        <el-menu-item index="1-4-1">item one</el-menu-item>
      </el-sub-menu>
    </el-sub-menu>
    <el-menu-item index="2">
      <el-icon>2</el-icon>
      <template #title>Navigator Two</template>
    </el-menu-item>
    <el-menu-item index="3" disabled>
      <el-icon>3</el-icon>
      <template #title>Navigator Three</template>
    </el-menu-item>
    <el-menu-item index="4">
      <el-icon>4</el-icon>
      <template #title>Navigator Four</template>
    </el-menu-item>
  </el-menu>
    </el-aside>
    <el-container>
      <!-- 顶部 -->
      <el-header height="100px">header
        <form action="http://localhost:3000/api/bucketListItems/uploadphoto" method="POST" enctype="multipart/form-data">
        <input type="file" name="picture" accept="image/*" value="" required @change="onFileChanged"/>
        <button type="submit" />
        </form>
<!--        <el-button @click="addItem"> clickkkkkkkkkkkkkkk</el-button>-->
      </el-header>
      <!-- 主页面 -->
      <el-main>主页面</el-main>
    </el-container>
  </el-container>

</div>


</template>

<script>
import {users} from "../assets/users";
import {ref} from "@vue/reactivity";
import {onMounted} from "vue";
import axios from "axios";



export default {
  name: 'HomeView',
  setup(){
    const isCollapse = ref(true)
    const handleOpen = (key, keyPath) => {
      console.log(key, keyPath)
    }
    const handleClose = (key, keyPath) => {
      console.log(key, keyPath)
    }
    const userList = users["users"]

    // mongodb part
    const items = ref([]);
    onMounted( async ()=>{
      // const res = await axios.get("http://localhost:3000/api/bucketListItems/");
      // items.value = res.data;
      // console.log(items.value)

    })

    async function addItem() {
      const res = await axios.post("http://localhost:3000/api/bucketListItems/uploadphoto",
          {description:"pushed photo"})
      console.log(res)
    }

    async function removeItem(item,index) {
      const res = await axios.delete("http://localhost:3000/api/bucketListItems/"+item._id);
      this.items.splice(index,1)
      console.log(res)
    }



    return{
      userList,handleClose,handleOpen,isCollapse,items,addItem,removeItem
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
