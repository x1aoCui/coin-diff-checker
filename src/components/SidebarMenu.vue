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

      <div v-if="item.item.length>0" class="coin_value_div">
        <el-menu-item
            v-for="(insideItem,insideListIndex) in item.item"
            v-bind:key="insideListIndex"
            :index=insideItem.id.toString()
            @click="loadPhoto"
            class="coin_value_item"

        >
          {{ insideItem.name }}

          <el-button type="text"
                     class="delete_coin_value"
                     @click.stop="deleteCoinValue($event)"
                     v-bind:id="insideItem.id.toString()">
            <el-icon>
              <Delete/>
            </el-icon>
          </el-button>
        </el-menu-item>
      </div>
        <el-menu-item :index=item.id.toString()
                      @click="addCoinValue">
                      <el-icon :size="12">
                        <Plus />
                      </el-icon>
                      add-coin-value
        </el-menu-item>
      <el-menu-item :index=item.id.toString()
                    @click="addCoinValue">
                    <el-icon :size="12"><Delete /></el-icon>
                    Delete-Coin_Type
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

  <el-dialog v-model="deleteDialogFormVisible" title="DeleteCoinValue">
    <span>It will remove the value dict and all related the coin pictures</span>
    <template #footer>
        <span class="dialog-footer">
          <el-button @click="deleteDialogFormVisible = false">Cancel</el-button>
          <el-button type="primary" @click="submitDeleteCoinValue">Confirm</el-button>
        </span>
    </template>
  </el-dialog>

</template>

<script >
/* eslint-disable */
import {ref} from "@vue/reactivity";
import {reactive} from "vue";
import {useStore} from "vuex";
import {Plus,Delete} from '@element-plus/icons-vue'



export default {
  name: "SidebarMenu",
  components: {Plus,Delete},
  emits:["loadPhotos","emptyDict"],
  setup(props,{emit}){
    const store = useStore()
    const dialogFormVisible = ref(false)
    const dialogTypeFormVisible = ref(false)
    const deleteDialogFormVisible = ref(false)
    const deleteDictId = ref('')

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

    const deleteCoinValue=(e)=>{
      deleteDictId.value = e.currentTarget.id
      deleteDialogFormVisible.value = true

    }
    const submitDeleteCoinValue = async () => {
      await store.commit('Delete_CoinValue',deleteDictId.value)
      emit('emptyDict')
      deleteDialogFormVisible.value= false
      deleteDictId.value = ''
    }


    const addCoinValue=(key)=>{
      dialogFormVisible.value= true
      form.id = key["index"]
    }
    const submitCoinValue=async ()=>{
      console.log(form)
      let coinIdIndex = form.id;
      let result ={}
      for(let i = 0;i<state.listNav.length;i++){
        if(state.listNav[i].id==coinIdIndex){
          console.log("coin value find")
          result ={
            coinIdIndex:coinIdIndex,
            id: createInt32Id().toString(),
            name: form.name
          }
          await store.commit('ADD_CoinValue',result)
        }
      }

      emit('loadPhotos',result.id)
      form.id=''
      form.name=''
      dialogFormVisible.value= false

    }

    return{
      isCollapse,loadPhoto,state,deleteCoinValue,deleteDialogFormVisible,
      createInt32Id,addCoinValue,dialogFormVisible,form,submitDeleteCoinValue,
      formLabelWidth,submitCoinValue,
      dialogTypeFormVisible,typeForm,submitCoinType
    }
  }
}
</script>

<style lang="scss" scoped>
.coin_value_div{
  .coin_value_item{
    //overwrite ui default components attr
    padding-left: 40px!important;
    padding-right: 20px !important;
    .delete_coin_value{
      height: 80%;
      width: auto;
      aspect-ratio: 1;
      margin-left: auto;
    }
  }
}




</style>