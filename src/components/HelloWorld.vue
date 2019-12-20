<template>
  <div class="hello">
    <div>
      <div class="head clearfix">
        <div style="float:left">
            <el-button type="text" class="topBtn" @click="gethtml">预览</el-button>
            <el-button type="text" class="topBtn">退一步</el-button>
            <el-button type="text" class="topBtn">进一步</el-button>
            <el-button type="text" class="topBtn">刷新</el-button>
        </div>
        <div style="float:right">
          <el-button type="text" class="topBtn" @click="pageflag=!pageflag">{{pagetype}}</el-button>
            <el-button type="text" class="topBtn">测试</el-button>
            <el-button type="text" class="topBtn" @click="exportHtml">保存</el-button>
            <el-button type="text" class="topBtn">关闭</el-button>
        </div>
      </div>
      <div class="main">
        <div class="list">
          <ul>
            <li v-for="item in cmdList" :key="item.id">
              <el-button @click="addComp(item)">{{item.cmd_readme}}</el-button>
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
                <button
                tonclick="commonSend(event)"
                style="width:15%;padding:0px;margin:0px;"
                :data-cmdName="element.cmdName"
                >{{element.name}}</button>
                </div>
                <div class="infoBox" v-show="false">
                  <input id="operation" value="test">
                  <input id="product_id" :data-code="cmdCode">
                  <input id="serial_num" value='000d6f0004c7ebfb'>
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
    }
  },
  computed:{
    pagetype(){
      return this.pageflag===true?'PC':'APP'
    },
    cmdCode(){
      let a = window.location.href
      return a.substr(a.indexOf('=')+1,a.length-1)
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
      console.log(e)
      this.form.push({
        name:e.cmd_readme,
        cmdName:e.cmd_name,
      })
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
      console.log(this.rawHtml)
    },
    exportHtml(){
      let html = util.exportHtml(this.rawHtml)
      this.$http.post('/uiTemplate/save',{data:html,productCode:this.cmdCode}).then(res=>{
        console.log(res.data)
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
  }
  .uiBox{
    width: 375px;
    height: 667px;
    background: #111;
    transition: all ease-in-out 0.5s;
    margin: 0 auto;
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
