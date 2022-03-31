<template>
  <el-radio-group v-model="isCollapse" style="margin-bottom: 20px">
    <el-radio-button :label="false">expand</el-radio-button>
    <el-radio-button :label="true">collapse</el-radio-button>
  </el-radio-group>
  <el-menu v-if="state.listNav.length===0">
    <el-menu-item  @click="dialogTypeFormVisible=true" >
      <el-icon><plus /></el-icon>
      <span>Add Coin Type</span>
    </el-menu-item>
  </el-menu>
  <el-menu
      v-else
      default-active="2"
      class="el-menu-vertical-demo"
      :collapse="isCollapse"
      v-for="(item,listIndex) in state.listNav"
      v-bind:key="listIndex"

  >
    <el-sub-menu :index=listIndex.toString()>
      <template #title>
        <el-icon>{{listIndex}}</el-icon>
        <span>{{item.name}}</span>
      </template>

      <div v-if="item.item.length>0">

        <el-menu-item
            v-for="(insideItem,insideListIndex) in item.item"
            v-bind:key="insideListIndex"
            :index=insideItem.id.toString()
            @click="loadPhoto">
          {{ insideItem.name }}
        </el-menu-item>
      </div>

        <el-menu-item :index=item.id.toString()
                      @click="addCoinValue">
                      <el-icon :size="20">
                        <Plus />
                      </el-icon>
                      add-coin-value
        </el-menu-item>
    </el-sub-menu>
    <el-menu-item v-if="listIndex==state.listNav.length-1" @click="dialogTypeFormVisible=true" >
      <el-icon><plus /></el-icon>
        <span>Add Coin Type</span>
    </el-menu-item>
  </el-menu>



<!-- for coinvalue type input-->
  <el-dialog v-model="dialogFormVisible" title="AddNewCoinValue">
    <el-form :model="form">
      <el-form-item label="Coin value type" :label-width="formLabelWidth">
        <el-input v-model="form.name" autocomplete="off" />
      </el-form-item>

    </el-form>
    <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogFormVisible = false">Cancel</el-button>
          <el-button type="primary" @click="submitCoinValue">Confirm</el-button>
        </span>
    </template>
  </el-dialog>

  <el-dialog v-model="dialogTypeFormVisible" title="AddNewCoinType">
    <el-form :model="typeForm">
      <el-form-item label="Coin  type" :label-width="formLabelWidth">
        <el-input v-model="typeForm.name" autocomplete="off" />
      </el-form-item>

    </el-form>
    <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogTypeFormVisible = false">Cancel</el-button>
          <el-button type="primary" @click="submitCoinType">Confirm</el-button>
        </span>
    </template>
  </el-dialog>

</template>

<script >
/* eslint-disable */
import {ref} from "@vue/reactivity";
import {reactive} from "vue";
import {useStore} from "vuex";
import {Plus} from '@element-plus/icons-vue'


export default {
  name: "SidebarMenu",
  components: {Plus},
  emits:["loadPhotos"],
  setup(props,{emit}){
    const store = useStore()
    const dialogFormVisible = ref(false)
    const dialogTypeFormVisible = ref(false)
    const form = reactive({
      name: '',
      id:''
    })
    const typeForm = reactive({
      name: ''
    })
    const formLabelWidth = '140px'
    const state = reactive({
      listNav: store.state.listNav
    })
    const isCollapse = ref(true)
    const loadPhoto = (key) => {
      console.log(key["index"])

      emit('loadPhotos',key["index"])
    }
    const createInt32Id=()=> {
      // if you need to fit into 32 bits (int in SQL)
      return Math.floor((Date.now() * Math.random()) / 1000);
    }

    const submitCoinType = () => {
      let result ={
        id: createInt32Id().toString(),
        name: typeForm.name
      }
      store.commit('ADD_CoinType',result)
      dialogTypeFormVisible.value= false
      typeForm.name = ''
    }


    const addCoinValue=(key)=>{
      dialogFormVisible.value= true
      form.id = key["index"]
    }
    const submitCoinValue=()=>{
      console.log(form)
      let coinIdIndex = form.id;
      for(let i = 0;i<state.listNav.length;i++){
        if(state.listNav[i].id==coinIdIndex){
          console.log("coin value find")
          let result ={
            coinIdIndex:coinIdIndex,
            id: createInt32Id().toString(),
            name: form.name
          }
          store.commit('ADD_CoinValue',result)
        }
      }
      form.id=''
      form.name=''
      dialogFormVisible.value= false
    }

    return{
      isCollapse,loadPhoto,state,
      createInt32Id,addCoinValue,dialogFormVisible,form,
      formLabelWidth,submitCoinValue,
      dialogTypeFormVisible,typeForm,submitCoinType
    }
  }
}
</script>

<style scoped>

</style>