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
      :collapse="!isCollapse"
      v-for="(item,listIndex) in state.listNav"
      v-bind:key="listIndex"
      :index="listIndex"

  >
    <el-sub-menu :index=listIndex.toString() >
      <template #title >
<!--        can add coin icon later-->
        <el-icon>{{listIndex}}</el-icon>
        <span>{{item.name}}</span>
<!--        <el-button type="text"-->
<!--                   class="delete_coin_button"-->
<!--                   @click.stop="deleteCoinType($event)"-->
<!--                   v-if="isCollapse"-->
<!--                   >-->
<!--          <el-icon>-->
<!--            <Delete/>-->
<!--          </el-icon>-->
<!--        </el-button>-->
      </template>

      <div v-if="item.item.length>0" class="coin_value_div">
        <el-menu-item
            v-for="(insideItem,insideListIndex) in item.item"
            v-bind:key="insideListIndex"
            :index=insideItem.id.toString()
            @click="loadPhoto"
            class="coin_value_item"

        >
          <el-tag class="ml-2" type="primary" size="large">{{ insideItem.name }}</el-tag>


          <el-button type="text"
                     class="delete_coin_value"
                     @click.stop="deleteCoinValue($event)"
                     v-bind:id="insideItem.id.toString()"
                     >
            <el-icon>
              <Delete/>
            </el-icon>
          </el-button>
        </el-menu-item>
      </div>
        <el-menu-item :index=item.id.toString()
                      @click="addCoinValue"

        >
          <el-button type="success"  >
                      <el-icon :size="12">
                        <Plus />
                      </el-icon>
            <div style="width: 100px">Add-coin-value</div>
          </el-button>
        </el-menu-item>

      <el-menu-item :index=item.id.toString()
                    @click="deleteCoinType" >
                <el-button type="info"  plain >
                  <el-icon><Delete/></el-icon>
                  <div style="width: 100px">Delete-coin-type</div>
                </el-button>


      </el-menu-item>

    </el-sub-menu>
    <el-menu-item v-if="listIndex==state.listNav.length-1" @click="dialogTypeFormVisible=true" >
      <el-button type="success"  plain style="width: 100%">
      <el-icon><plus /></el-icon>
        <span v-if="isCollapse">Add Coin Type</span>
      </el-button>
    </el-menu-item>
  </el-menu>



<!-- for coin type input-->
  <el-dialog v-model="dialogFormVisible" title="AddNewCoinValue">
    <el-form :model="form">
      <el-form-item label="Coin value type" :label-width="formLabelWidth" @keydown.enter.prevent="submitCoinValue">
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
    <el-form :model="typeForm" @keydown.enter.prevent="submitCoinType">
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

  <el-dialog v-model="deleteDialogFormVisible" title="DeleteCoinValue" width="25%">
    <span>It will remove the value dict and all related the coin pictures</span>
    <template #footer>
        <span class="dialog-footer">
          <el-button @click="deleteDialogFormVisible = false">Cancel</el-button>
          <el-button type="primary" @click="submitDeleteCoinValue" @keydown.enter="submitDeleteCoinValue">Confirm</el-button>
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

    const deleteCoinType=async (key)=>{
      await store.commit('Delete_CoinType',key["index"])
      emit('emptyDict')
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
      formLabelWidth,submitCoinValue,deleteCoinType,
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
      width: 0%;
      aspect-ratio: 1;
      margin-left: auto;
      margin-right: 10px;
    }
  }
}
.delete_coin_button{
  padding-right: 30px!important;
  height: 80%;
  width: auto;
  aspect-ratio: 1;
  margin-left: auto;
}



</style>