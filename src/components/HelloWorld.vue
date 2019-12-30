<template>
  <div class="hello">
    <div>
      <div class="head clearfix">
        <div style="float:left">
            <!-- <el-button type="text" class="topBtn" @click="gethtml">预览</el-button>
            <el-button type="text" class="topBtn">退一步</el-button>
            <el-button type="text" class="topBtn">进一步</el-button> -->
            <el-button type="text" class="topBtn" @click="form=[]">重置</el-button>
        </div>
        <div style="float:right">
            <el-button type="text" class="topBtn" @click="pageflag=!pageflag">{{pagetype}}</el-button>
            <el-button type="text" class="topBtn" @click="showTest">预览</el-button>
            <el-button type="text" class="topBtn" @click="exportHtml">保存</el-button>
            <!-- <el-button type="text" class="topBtn">关闭</el-button> -->
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
        
        <!-- 测试窗口 -->
        <div id="testWindow" class="textBox" v-show="testShow">
          <el-button icon="el-icon-close" @click="testShow=false" class="close"></el-button>
          <div id="testBox" class="uiBox" :class="pagetype">

          </div>
        </div>
        <!-- 测试窗口 -->

        <!-- 配置界面 -->
        <div class="uiBox" id="uiBox" @click = "boxClick($event)" :class="pagetype" :style="`background-image:url(${bcImg});position:relative`">
            
                <div
                v-for="(element,index) in form" 
                :key="element.id"
                style="display:inline"
                @mousedown="move"
                >
                <!-- 只有一种指令，默认为按钮 -->
                <button
                
                tonmousedown="holdDown(event)" 
                tonmouseup="holdUp(event)"
                :data-cmdName="element.cmdName"
                :style="element.btnStyle"
                :data-index='index'
                data-level='first'
                class="sendControlBtn parentBtn"
                v-if="element.type==='btn'"
                >{{element.name}}</button>
                <!-- 有多种指令 -->
                <template v-else>
                    <button data-level='second' tonmousedown="holdDown(event)" tonmouseup="holdUp(event)" ontouchstart="holdDown(event)" ontouchend="holdUp(event)" :data-index='index' :data-cmdName="element.cmdName" :data-id='element.id' :style="element.btnStyle" class="parentBtn">{{element.name}}</button>
                    <div :id="element.id" class="subCommond">
                    <a :tonclick="`$('#${element.id}').hide()`">X</a>
                      <div style="margin:0 auto" >
                        <form  :id="element.cmdName" >
                          <div v-for="item in element.obj" :key="item.param_key">
                            <span style="float:left">{{item.param_name}}:</span>
                            <div class="commondInput">
                              <input :name="item.param_key" autocomplete="off"/>
                            </div>
                          </div>
                        </form>
                        <button
                          :tonclick="`$('#${element.id}').hide();`+'commonSend(event);'"
                          :data-cmdName="element.cmdName"
                          :data-id="element.cmdName"
                          :style="element.btnStyle"
                          class="sendControlBtn"
                          >发送</button>
                      </div>
                    </div>
                </template>

              
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
        </div>
        <!-- 配置界面 -->

        <div class="editor">
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="全局" name="first">
              <div class="selectImgEmpty" @click="selectBc($event)">
                <span>无主题</span>
              </div>
              <div class="selectImg" @click="selectBc($event)" v-for="item in bcImgList" :key="item.id">
                <img :src="item.resource_data?item.resource_data:''" />
              </div>
            </el-tab-pane>
            <el-tab-pane label="属性" name="second">
              <el-form>
                <el-form-item label="组件信息">
                  <el-input v-model="selectWgInfo" @input="changeWgInfo"></el-input>
                </el-form-item>
                <el-form-item label="显示文字">
                  <el-switch
                    v-model="showText"
                    active-color="#13ce66"
                    inactive-color="#ff4949"
                    @change="changeText">
                  </el-switch>
                </el-form-item>
                <el-form-item label="文字颜色">
                  <el-color-picker v-model="textColor" @change="colorPick"></el-color-picker>
                </el-form-item>
                <el-form-item label="按钮图标">
                   <btn-selector :options="btnImgList" :value="selectedBtnImg" @selected="btnImgSelected"></btn-selector>
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
import BtnSelector from '../components/BtnSelector'
export default {
  name: 'HelloWorld',
  components: {draggable,BtnSelector},
  props: {
    msg: String
  },
  data() {
    return {
      activeName: 'second',
      form:[
      ],
      cmdList:[],
      bcImgList:[],
      btnImgList:[],
      selectedBtnImg:'',
      EditForm:{},
      selectWg:{},
      selectIndex:0,
      bcImg:'',
      btnImg:'',
      canMove : false,
      textColor:'#fff',
      pageflag:true,
      testShow:false,
      selectWgInfo:'请选择组件',
      list:[1,2,3,4],
      WgWidth:10,
      rawHtml:'',
      WgPadding:'0px 0px 0px 0px(依次为上、右、下、左，用空格隔开)',
      WgMargin:'0px 0px 0px 0px(依次为上、右、下、左，用空格隔开)',
      btnStyle:{
        width:'15%',
        padding:'5px',
        margin:'5px 0 0 5px',
        background:'#78bdf3',
        border:'none',
        'border-radius':'5px',
        color:'#fff',
        cursor:'pointer',
        transition:'width ease-in 0.5s,height ease-in 0.5s',
        'background-size':'cover',
        position:'relative'
      },
      pageData:{
        title:'测试',
        bcImg:'0',
        wgList:[],
        size:''
      },
      showText:true,         
    }
  },
  computed:{
    pagetype(){
      return this.pageflag===true?'Pc':'Mobile'
    },
    cmdCode(){
      if(sessionStorage.getItem('productCode')){
        return sessionStorage.getItem('productCode')
      }else{
        let a = window.location.href
        return a.substr(a.indexOf('=')+1,a.length-1)
      }
      
    },
  },
  mounted(){
    this.getCmdObject();
    this.getimg();
    this.getBtnImg();
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
          type:'btn',
          method:'commonSend(event)',
          btnStyle:Object.assign({},this.btnStyle),
        })
      }else{
        let arr = e.cmdDownParams
        this.form.push({
          name:e.cmd_readme,
          cmdName:e.cmd_name,
          btnStyle:Object.assign({},this.btnStyle),
          id:e.id,
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
      
      this.pageData.wgList = this.form
      
    },
    //获取选择的组件
    boxClick(e){
      if(e.target.innerHTML[0]!=='<'){
        this.selectWg=e.target
        this.selectIndex = e.target.getAttribute('data-index')
        this.selectWgInfo = this.form[this.selectIndex].name
        this.WgWidth = this.form[this.selectIndex].btnStyle.width.replace(/%/g,"")
        this.WgPadding = this.form[this.selectIndex].btnStyle.padding
        this.WgMargin = this.form[this.selectIndex].btnStyle.margin
      }
    },
    gethtml(){
      let a = document.getElementById('uiBox').innerHTML
      this.rawHtml = a.replace(/tonclick/g, "onclick").replace(/tonmousedown/g, "onmousedown").replace(/tonmouseup/g, "onmouseup").replace(/draggable="false"/g,"")//替换tonclick启用点击事件,去除drag属性
      // console.log(this.rawHtml)
    },
    //获取背景图片
    getimg(){
      this.$http.get('/device/getTemplateByType?type=img').then(res=>{
        this.bcImgList = res.data
      })
    },
    //获取按钮背景图片
    getBtnImg(){
      this.$http.get('/device/getTemplateByType?type=buttonImg').then(res=>{
        this.btnImgList = res.data
      })
    },
    exportHtml(){
      this.gethtml()
      let size = this.pagetype==='PC'?'width:100vw;height:100vh;':'width:750px;height:1334px;'
      let html = util.exportHtml(this.rawHtml,size)
      //console.log(html)
      this.$http.post('/uiTemplate/save',{data:html,productCode:this.cmdCode,rawHtml:this.rawHtml,type:this.pageflag?'pc':'mobile'}).then(res=>{
        if(res.data.resultDesc==='OK'){
          this.$message({
            type:'success',
            message:'保存成功'
          })
        }
      })
    },
    changeWgInfo(v){
      this.form[this.selectIndex].name = v
    },
    WidthChange(){
      if(this.selectWg.style){
        this.form[this.selectIndex].btnStyle.width=this.WgWidth+'%'
      }
    },
    PaddingChange(){
      if(this.selectWg.style){
        this.form[this.selectIndex].btnStyle.padding = this.WgPadding
      }
    },
    MarginChange(){
      if(this.selectWg.style){
        this.form[this.selectIndex].btnStyle.margin = this.WgMargin
      }
    },
    //是否显示按钮文字
    changeText(e){
      if(this.selectWg.style){
        this.form[this.selectIndex].btnStyle.color = e?'rgba(255,255,255,1)':'rgba(0,0,0,0)'
      }
    },
    colorPick(e){
      if(this.selectWg.style){
        this.form[this.selectIndex].btnStyle.color = e
      }
    },
    remove(){
      let name = this.selectWg.innerHTML
      let index = this.form.findIndex(item=>item.name===name)
      this.form.splice(index,1)
    },
    showTest(){
      this.gethtml()
      document.getElementById('testBox').innerHTML = this.rawHtml
      document.getElementById('testBox').style['background-image']=`url(${this.bcImg})`
      this.testShow = true;
    },
    close(e){
      // console.log(e)
      this.e = false
    },
    //选择背景图片
    selectBc(e){
      // e.target.style.border = 'solid 2px blue'
      this.bcImg = e.target.src
      this.pageData.bcImg = e.target.src
    },
    btnImgSelected(e){
      if(e.resource_data){
        this.selectedBtnImg = e.resource_data
      }else{
        // this.selectWg.style.background = '#78bdf3'
        this.selectedBtnImg = ''
        
      }
      if(this.selectWgInfo!=='请选择组件'){
        if(e.resource_data){
          this.selectWg.style['background-image']=`url(${e.resource_data})`
        }else{
          this.selectWg.style.background = '#78bdf3'
        }
      }
    },
    //拖拽改变定位
    move(e){
      let uiBox = document.getElementById('uiBox')
      let target = e.target
      target.style.position = 'absolute'
      let orgX= e.pageX; 
      let orgY= e.pageY;
      let curX = target.style.left?target.style.left:'0'
      let curY = target.style.top?target.style.top:'0'
      this.canMove = true 
      document.onmousemove = (e)=>{       //鼠标按下并移动的事件
              //用鼠标的位置减去鼠标相对元素的位置，得到元素的位置
              
              if(this.canMove){
                  // let left = target.offsetLeft +Math.round( ( e.pageX - orgX ) / 10 ) * 10;  
                  // let top = target.offsetTop +Math.round( ( e.pageY - orgY ) / 10 ) * 10;  
                  // console.log(orgX+'--'+orgY+'---'+left+'--'+top)
                  //移动当前元素
                  let xBoundary =(uiBox.offsetWidth- target.offsetWidth)/uiBox.offsetWidth*100
                  let yBoundary =(uiBox.offsetHeight- target.offsetHeight)/uiBox.offsetHeight*100
                  let x = parseInt(curX.replace(/%/g,""))  + (e.pageX-orgX)/uiBox.offsetWidth*100
                  if(x>xBoundary){x=xBoundary}else if(x<0){x=0}
                  
                  let y = parseInt(curY.replace(/%/g,"")) + (e.pageY-orgY)/uiBox.offsetHeight*100
                  if(y>yBoundary){y=yBoundary}else if(y<0){y=0}
                  target.style.left =x + '%';
                  target.style.top =y + '%';
                  console.log(x+'-'+y)
              }
          };
        document.onmouseup = (e) => {
          document.onmousemove = null
          this.canMove = false
        };
      // console.log(uiBox.offsetLeft)
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
    background-color: #fff ;
    transition: all ease-in-out 0.5s;
    margin: 0 auto;
    overflow: scroll;
    background-size: cover !important;
    position: relative;
    
  }
  .Pc{
    width: 960px;
    height: 540px;
  }
  .editor{
    background: #f5f8fa;
    width: 20%;
    height: 90vh;
    padding: 10px;
  }
  .topBtn{
    padding: 5px;
  }
  .topBtn:first-of-type{
    margin-left: 10px;
  }
  .textBox{
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    top: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.5);
    z-index: 9;
  }
  .close{
    position: absolute;
    z-index: 10;
    top:0;
    right: 0;
  }
  .selectImg{
    width: 60px;
    height: 60px;
    background: #111;
    display: inline-block;
    color: #fff;
    cursor: pointer;
    margin: 5px;
  }
  .selectImgEmpty{
    width: 60px;
    height: 60px;
    line-height: 60px;
    background: #fff;
    display: inline-block;
    text-align: center;
    color: #111;
    cursor: pointer;
    margin: 5px;
    vertical-align: top;
    text-align: center;
  }
  .selectImgEmpty span{
    margin:0 auto;
    
  }
  .selectImg img{
    display: block;
    width: 100%;
    height: 100%;
  }
  .subCommond{
    display:none;
    position:absolute;
    top:20%;
    left:50%;
    width:30%;
    height:20%;
    margin-left:-15%;
    background:rgb(226, 221, 221);
    text-align:center;
    padding:15px;
  }
  .subCommond a{
    position:absolute;
    top:0;
    right:0;
    cursor:pointer;  
  }
  .commondInput{
    float: right;
  }
</style>
