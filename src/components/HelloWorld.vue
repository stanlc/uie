<template>
  <div class="hello">
    <div>
      <div class="head clearfix">
        <div style="float:left">
            <el-button type="text" class="topBtn" @click="gethtml">预览</el-button>
            <el-button type="text" class="topBtn">退一步</el-button>
            <el-button type="text" class="topBtn">进一步</el-button>
            <el-button type="text" class="topBtn" @click="form=[]">重置</el-button>
        </div>
        <div style="float:right">
          <el-button type="text" class="topBtn" @click="pageflag=!pageflag">{{pagetype}}</el-button>
            <el-button type="text" class="topBtn" >测试</el-button>
            <el-button type="text" class="topBtn" @click="exportHtml">保存</el-button>
            <el-button type="text" class="topBtn">关闭</el-button>
        </div>
      </div>
      <div class="main">
        <div class="list">
          <ul>
            <li v-for="item in cmdList" :key="item.id">
              <el-button type="text" @click="addComp(item)" :disabled="form.findIndex(e=>e.name===item.cmd_readme)>-1">{{item.cmd_readme}}</el-button>
            </li>
          </ul>
        </div>
        

        <!-- 配置界面 -->
        <div class="uiBox" @click = "boxClick($event)" :class="pagetype">
            <draggable v-model="form" group="people" @start="drag=true" @end="drag=false" id="uibox" >
                <div
                v-for="element in form" 
                :key="element.id"
                style="display:inline">
                <!-- 只有一种指令，默认为按钮 -->
                <button
                tonclick="commonSend(event)"
                :data-cmdName="element.cmdName"
                :style="btnStyle"
                class="sendControlBtn"
                v-if="element.type==='btn'"
                >{{element.name}}</button>
                <!-- 有多种指令 -->
                <button
                tonclick="commonSend(event)"
                :data-cmdName="element.cmdName"
                :style="btnStyle"
                class="sendControlBtn"
                v-else
                >{{element.name}}</button>
                </div>
                <div class="infoBox" v-show="false">
                  <input id="operation" value="test">
                  <input id="product_id" :data-code="cmdCode">
                  <input id="serial_num" value='000d6f000cf65257'>
                  <input id="url" value='/device/deviceControlBySerialNum'>
                  <input id="account" value='C28000'>
                  <input id="token" value='11111111'>
                  <input id="default" value='1'>
                </div>
            </draggable>
        </div>
        <!-- 配置界面 -->

        <div class="editor">
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="全局" name="first">全局</el-tab-pane>
            <el-tab-pane label="属性" name="second">
              <el-form>
                <el-form-item label="组件信息">
                  <el-input v-model="selectWgInfo" @input="changeWgInfo"></el-input>
                </el-form-item>
                <el-form-item label="组件宽度"> 
                   <el-input-number v-model="WgWidth" @change="WidthChange" :min="0" :max="100" :step="5"></el-input-number>
                </el-form-item>
                <el-form-item label="组件内边距"> 
                   <el-input v-model="WgPadding" @change="PaddingChange"></el-input>
                </el-form-item>
                <el-form-item label="组件外边距"> 
                   <el-input v-model="WgMargin" @change="MarginChange"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button @click="remove">删除</el-button>
                </el-form-item>
              </el-form>
            </el-tab-pane>
            <el-tab-pane label="高级" name="third">高级</el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import draggable from 'vuedraggable'
import $ from 'jquery'
import util from '../assets/utils/util'
export default {
  name: 'HelloWorld',
  components: {draggable},
  props: {
    msg: String
  },
  data() {
    return {
      activeName: 'second',
      form:[
      ],
      cmdList:[],
      EditForm:{},
      selectWg:{},
      pageflag:false,
      selectWgInfo:'请选择组件',
      list:[1,2,3,4],
      WgWidth:10,
      rawHtml:'',
      WgPadding:'0px 0px 0px 0px(依次为上、右、下、左，用空格隔开)',
      WgMargin:'0px 0px 0px 0px(依次为上、右、下、左，用空格隔开)',
      btnStyle:`width:15%;padding:5px;
                margin:5px 0 0 5px;background:#78bdf3;
                border:none;border-radius:5px;
                color:#fff;cursor:pointer;`
    }
  },
  computed:{
    pagetype(){
      return this.pageflag===true?'PC':'APP'
    },
    cmdCode(){
      if(sessionStorage.getItem('productCode')){
        return sessionStorage.getItem('productCode')
      }else{
        let a = window.location.href
        return a.substr(a.indexOf('=')+1,a.length-1)
      }
      
    }
  },
  mounted(){
    this.getCmdObject();
  },
  methods: {
    handleClick(tab, event) {
        // console.log(tab, event);
    },
    //获取指令信息
    getCmdObject(){
      this.$http.get('/device/getCmdByCode',{
        params:{
          productCode:this.cmdCode
        }
      }).then(res=>{
        this.cmdList = res.data
      })
    },
    addComp(e){
      if(e.cmdDownParams.length===0){
          this.form.push({
          name:e.cmd_readme,
          cmdName:e.cmd_name,
          id:e.id,
          type:'btn'
        })
      }else{
        let arr = e.cmdDownParams
        this.form.push({
          name:e.cmd_readme,
          cmdName:e.cmd_name,
          obj:arr
        })
        // arr.map(item=>{
        //     this.form.push({
        //     name:e.cmd_readme+item.param_name,
        //     cmdName:item.param_readme,
        //     type:item.param_type
        //   })
        // })
      }
      


      if(this.selectWg){
        // this.selectWg.style.width='200px'
        //设置选择组件的自定义数据
        // this.selectWg.setAttribute('data-cmdname','test')
      }
      
    },
    //获取选择的组件
    boxClick(e){
      if(e.target.innerHTML[0]!=='<'){
        this.selectWg=e.target
        this.selectWgInfo = e.target.innerHTML
        this.WgWidth = this.selectWg.style.width.replace(/%/g,"")
        this.WgPadding = this.selectWg.style.padding
        this.WgMargin = this.selectWg.style.margin
      }
    },
    gethtml(){
      let a = document.getElementById('uibox').innerHTML
      this.rawHtml = a.replace(/tonclick/g, "onclick").replace(/draggable="false"/g,"")//替换tonclick启用点击事件,去除drag属性
      // console.log(this.rawHtml)
    },
    exportHtml(){
      this.gethtml()
      let html = util.exportHtml(this.rawHtml)
      this.$http.post('/uiTemplate/save',{data:html,productCode:this.cmdCode,rawHtml:this.rawHtml}).then(res=>{
        if(res.data.resultDesc==='OK'){
          this.$message({
            type:'success',
            message:'保存成功'
          })
        }
      })
    },
    changeWgInfo(v){
      this.selectWg.innerHTML = v
    },
    WidthChange(){
      if(this.selectWg.style){
        this.selectWg.style.width=this.WgWidth+'%'
      }
    },
    PaddingChange(){
      if(this.selectWg.style){
        this.selectWg.style.padding = this.WgPadding
      }
    },
    MarginChange(){
      if(this.selectWg.style){
        this.selectWg.style.margin = this.WgMargin
      }
    },
    remove(){
      let name = this.selectWg.innerHTML
      let index = this.form.findIndex(item=>item.name===name)
      this.form.splice(index,1)
    }
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .clearfix::after{
    content:'';
    display: block;
    height: 0;
    clear: both;
  }
  .main{
    background: #e2e6ec;
    display: flex;
    justify-content: space-between;
  }
  .list{
    background: #f5f8fa;
    width: 20%;
    height: 90vh;
    overflow-y: scroll;
  }
  .uiBox{
    width: 375px;
    height: 667px;
    background: #fff;
    transition: all ease-in-out 0.5s;
    margin: 0 auto;
    overflow: scroll;
  }
  .PC{
    width: 960px;
    height: 540px;
  }
  .editor{
    background: #f5f8fa;
    width: 20%;
    height: 90vh;
  }
  .topBtn{
    padding: 5px;
  }
  .topBtn:first-of-type{
    margin-left: 10px;
  }
</style>
