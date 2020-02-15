<template>
  <div class="hello">
    <div>
      <div class="head clearfix">
        <div style="float:left">
            <el-button type="text" class="topBtn" @click="goBack" ref="backBtn" :disabled="this.commondStack.length===1">退一步</el-button>
            <el-button type="text" class="topBtn" @click="goForward" :disabled="this.historyStack.length<1">进一步</el-button>
            <el-button type="text" class="topBtn" @click="form=[]">重置</el-button>
        </div>
        <div style="float:right">
            <el-dialog
              title="提示"
              :visible.sync="dialogVisible"
              width="30%"
              >
              <span>切换前请先保存</span>
              <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="dialogVisible = false;exportHtml();pageflag=!pageflag;getTeamplate();">确 定</el-button>
              </span>
            </el-dialog>
            <el-button type="text" class="topBtn" @click="dialogVisible=true">{{pagetype}}</el-button>
            <el-button type="text" class="topBtn" @click="showTest">预览</el-button>
            <el-button type="text" class="topBtn" @click="exportHtml">保存</el-button>
            <!-- <el-button type="text" class="topBtn">关闭</el-button> -->
        </div>
      </div>
      <div class="main">
        <div class="list">
          <el-collapse >
            <el-collapse-item title="指令组件" name="1">
              
                <ul>
                  <li v-for="item in cmdList" :key="item.id">
                    <el-button type="text" @click="addComp(item)" :disabled="form.findIndex(e=>e.name===item.cmd_readme)>-1">{{item.cmd_readme}}</el-button>
                  </li>
                </ul>
            
            </el-collapse-item>
            <el-collapse >
              <el-collapse-item title="装饰组件" name="2">
                <el-button type="text" @click="addComp('box')" >添加装饰组件</el-button>
              </el-collapse-item>
            </el-collapse>
          </el-collapse>
         </div>
        
        <!-- 测试窗口 -->
        <div id="testWindow" class="textBox" v-show="testShow">
          <el-button icon="el-icon-close" @click="testShow=false" class="close"></el-button>
          <div id="testBox" class="uiBox" :class="pagetype">

          </div>
        </div>
        <!-- 测试窗口 -->

        <!-- 配置界面 -->
        
        <div class="uiBox" id="uiBox" @click = "boxClick($event)" :class="pagetype" :style="`background-image:url(${bcImg});position:relative;`" >
            <div class="grid" :class="pagetype"></div>
            <div class="wgBox" :class="pagetype">
                <div
                v-for="(element,index) in form" 
                :key="element.id"
                style="display:inline;height:100%"
                @mousedown="move"
                @click.shift="multiSelect"
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
                >
                <img :src="element.iconUrl" :class="element.iconPosition">
                <span>{{element.name}}</span></button>
                <!-- 有多种指令 -->
                <template v-else>
                    <button data-level='second' tonmousedown="holdDown(event)" tonmouseup="holdUp(event)" ontouchstart="holdDown(event)" ontouchend="holdUp(event)" :data-index='index' :data-cmdName="element.cmdName" :data-id='element.id' :style="element.btnStyle" class="parentBtn">
                      <img :src="element.iconUrl" :class="element.iconPosition">
                      <span>{{element.name}}</span>
                      </button>
                    <div :id="element.id" class="subCommond" >
                      <a :onclick="`$('#${element.id}').hide();`" icon="el-icon-circle-close">X</a>
                      <div class="commondBox">
                        <div v-for="val in element.obj.param_val" :key="val.key">{{val}}</div>
                        <el-form label-width="80px" :id="element.cmdName">
                          <el-form-item :label="item.param_name" v-for="item in element.obj" :key="item.param_key">
                            <select v-model="select" v-if="item.param_type==='array'" :name="item.param_key">
                              <option v-for="a in JSON.parse(item.param_val)" :key="a.key" :value="a.value" :label="a.key"></option>
                            </select>
                            <el-input v-model="input" :placeholder="item.param_readme" :name="item.param_key" v-if="item.param_type==='string'"></el-input>
                          </el-form-item>
                        </el-form>
                            <button
                              :tonclick="`$('#${element.id}').hide();`+'commonSend(event);'"
                              :data-cmdName="element.cmdName"
                              :data-id="element.cmdName"
                              :style="subBtnStyle"
                              class="sendControlBtn"
                              >发送
                            </button>
                      </div>
                    </div>
                </template>

              
                </div>
            </div>
            
                <div class="infoBox" v-show="false">
                  <input id="operation" value="test">
                  <input id="product_id" :data-code="cmdCode">
                  <input id="serial_num" value='0' >
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
              <el-collapse >
                <el-collapse-item title="系统背景" name="1">
                  <div class="selectImgEmpty" @click="selectBc($event)">
                    <span>无主题</span>
                  </div>
                  <div class="selectImg" @click="selectBc($event)" v-for="item in bcImgList" :key="item.id">
                    <img :src="item.resource_data?item.resource_data:''" />
                  </div>
                </el-collapse-item>
                <el-collapse-item title="用户背景">
                  <div class="selectImg" @click="selectBc($event)" v-for="item in userImgList" :key="item.id">
                    <img :src="item.resource_data?item.resource_data:''" />
                  </div>
                  <el-upload
                    class="upload-demo"
                    ref="upload"
                    action="string"
                    accept="image/jpeg,image/png,image/jpg"
                    list-type="picture-card"
                    :before-upload="onBeforeUploadImage"
                    :http-request="UploadImage"
                    :on-change="fileChange"
                    :file-list="fileList"
                  > 
                    <el-button size="small" type="primary">添加图片</el-button>
                    <div slot="tip" class="el-upload__tip">只能上传jpg/jpeg/png文件，且不超过500kb</div>
                  </el-upload>
                  <el-button size="small" type="primary" @click="uploadBc">点击上传</el-button>
                </el-collapse-item>
                <el-collapse-item title="纯色背景">
                  <el-color-picker
                    v-model="bcColor"
                    @change="changeBcColor">
                  </el-color-picker>
                </el-collapse-item>
              </el-collapse>
              
              
            </el-tab-pane>
            <el-tab-pane label="属性" name="second">
              <el-collapse>
                <el-collapse-item title="外观设置">
                  <el-form>
                    <el-form-item label="组件名称">
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
                  </el-form>
                  <el-form :inline="true">
                    <el-form-item label="文字颜色">
                      <el-color-picker v-model="textColor" @change="colorPick"></el-color-picker>
                    </el-form-item>
                    <el-form-item label="组件颜色">
                      <el-color-picker v-model="btnColor" @change="colorBtnPick"></el-color-picker>
                    </el-form-item>
                    <el-form-item label="装饰组件背景">
                        <btn-selector :options="bcImgList" :value="selectedBoxImg" @selected="boxImgSelected"></btn-selector>
                      </el-form-item>
                  </el-form>
                </el-collapse-item>
                <el-collapse-item title="图标设置">
                  <el-form :inline="true">
                        <el-collapse>
                          <el-collapse-item title="系统图标">
                            <btn-selector :options="btnImgList" :value="selectedBtnImg" @selected="btnImgSelected"></btn-selector>
                          </el-collapse-item>
                          <el-collapse-item title="用户图标">
                            <btn-selector :options="userBtnList" :value="selectedBtnImg" @selected="btnImgSelected"></btn-selector>
                          </el-collapse-item>
                        </el-collapse>
                      <el-form-item label="图标位置">
                        <el-switch
                          v-model="btnIcon"
                          active-text="上"
                          inactive-text="左"
                          active-color="#13ce66"
                          inactive-color="#ff4949"
                          @change="changeIconPosition">
                        </el-switch>
                      </el-form-item>
                  </el-form>
                </el-collapse-item>
                <el-collapse-item title="位置大小">
                  <el-form>
                    <el-form-item label="组件宽度"> 
                      <el-input-number v-model="WgWidth" @change="WidthChange" :min="0" :max="100" :step="1"></el-input-number>
                    </el-form-item>
                    <el-form-item label="组件高度"> 
                      <el-input-number v-model="WgHeight" @change="HeightChange" :min="1" :max="100" :step="1"></el-input-number>
                    </el-form-item>
                    <el-form-item label="组件圆角"> 
                      <el-input-number v-model="WgBorderRadius" @change="RadiusChange" :min="0" :max="100" :step="1"></el-input-number>
                    </el-form-item>
                  </el-form>
                  <el-form :inline="true">
                    <el-form-item >
                      <el-button type="primary" @click="pgUp" :disabled="form[selectIndex] && form[selectIndex].btnStyle['z-index']>=8">上移一层</el-button>
                    </el-form-item>
                    <el-form-item>
                      <el-button type="primary" @click="pgDown" :disabled="form[selectIndex] && form[selectIndex].btnStyle['z-index']===0">下移一层</el-button>
                    </el-form-item>
                  </el-form>
                </el-collapse-item>
              </el-collapse>
              <el-collapse>
                <el-collapse-item title="批量修改">
                  <el-form>
                    <el-form-item label="组件宽度"> 
                      <el-input-number v-model="multiWgWidth" @change="multiWidthChange" :min="0" :max="100" :step="1"></el-input-number>
                    </el-form-item>
                    <el-form-item label="组件高度"> 
                      <el-input-number v-model="multiWgHeight" @change="multiHeightChange" :min="1" :max="100" :step="1"></el-input-number>
                    </el-form-item>
                    <el-form-item>
                      <el-button @click="multiMove('left')" ref="moveLeft" type="primary" size="small" :disabled="selectWgList.length<2" class="el-icon-caret-left"></el-button>
                      <el-button @click="multiMove('right')" type="primary" size="small" :disabled="selectWgList.length<2" class="el-icon-caret-right"></el-button>
                      <el-button @click="multiMove('top')" type="primary" size="small" :disabled="selectWgList.length<2" class="el-icon-caret-top"></el-button>
                      <el-button @click="multiMove('bottom')" type="primary" size="small" :disabled="selectWgList.length<2" class="el-icon-caret-bottom"></el-button>
                    </el-form-item>
                    <el-form-item>
                      <el-button @click="horizontaAlign" type="primary" :disabled="selectWgList.length<2">水平对齐</el-button>
                      <el-button @click="verticalAlign" type="primary" :disabled="selectWgList.length<2">垂直对齐</el-button>
                    </el-form-item>
                  </el-form>
                </el-collapse-item>
              </el-collapse>
              <el-form>
                <el-form-item>
                  <el-button @click="remove" type="danger" :disabled="canDel">删除</el-button>
                </el-form-item>
              </el-form>
            </el-tab-pane>
            <el-tab-pane label="高级" name="third">
              <el-form>
                <el-form-item label="显示网格">
                    <el-switch
                      v-model="showGrid"
                      active-color="#13ce66"
                      inactive-color="#ff4949"
                      @change="changeGrid">
                    </el-switch>
                </el-form-item>
              </el-form>
            </el-tab-pane>
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
import { setTimeout } from 'timers'
export default {
  name: 'HelloWorld',
  components: {draggable,BtnSelector},
  // props: {
  //   msg: String
  // },
  data() {
    return {
      activeName: 'second',
      form:[],
      commondStack:[],
      historyStack:[],
      indexFlag:true,
      cmdList:[],
      bcImgList:[],
      userImgList:[],
      userBtnList:[],
      btnImgList:[],
      fileList:[],
      uploadImg:{},
      uploadData:'',
      selectedBtnImg:'',
      selectedBoxImg:'',
      EditForm:{},
      selectWg:{},
      selectWgList:[],
      selectIndex:0,
      bcImg:'',
      bcColor:'',
      btnImg:'',
      canMove : false,
      dialogVisible:false,
      textColor:'#fff',
      btnColor:'#78bdf3',
      pageflag:true,
      testShow:false,
      showGrid:false,
      canDel:true, 
      selectWgInfo:'请选择组件',
      list:[1,2,3,4],
      WgWidth:10,
      WgHeight:10,
      multiWgWidth:10,
      multiWgHeight:10,
      rawHtml:'',
      input:'',
      select:'',
      WgBorderRadius:'5%',
      WgPadding:'0px 0px 0px 0px(依次为上、右、下、左，用空格隔开)',
      WgMargin:'0px 0px 0px 0px(依次为上、右、下、左，用空格隔开)',
      btnStyle:{
        width:'15%',
        height:'5%',
        padding:'5px',
        'background-color':'#78bdf3',
        'background-image':'',
        'background-repeat':'no-repeat',
        border:'none',
        'border-radius':'5px',
        color:'#fff',
        cursor:'pointer',
        'border-radius':'5px',
        transition:'width ease-in 0.5s,height ease-in 0.5s',
        'background-size':'cover !important',
        '-webkit-appearance':'button',
        'z-index': 5,
        top:'',
        left:'',
        position:''
      },
      subBtnStyle:{
        width:'25%',
        height:'5%',
        margin:'5px 0',
        padding:'5px',
        'background-color':'#78bdf3',
        'background-repeat':'no-repeat',
        border:'none',
        'border-radius':'5px',
        color:'#fff',
        cursor:'pointer',
        'border-radius':'5px',
        position:'relative',
        '-webkit-appearance':'button',
      },
      pageData:{
        title:'测试',
        bcImg:'0',
        wgList:[],
        size:{}
      },
      showText:true, 
      brothersinfo:[], 
      wgLeft:'',
      wgTop:'',  
      moveTarget:'',  
      dialogImageUrl: '',
      uploadDialogVisible: false,
      disabled: false,
      btnIcon:false,
      //多选标志
      mutilSelect:false,
    }
  },
  computed:{
    pagetype(){
      return this.pageflag?'Pc':'Mobile'
    },
    cmdCode(){
      if(sessionStorage.getItem('productCode')){
        return sessionStorage.getItem('productCode')
      }else{
        let arr = this.getQuery() 
        return arr[0].substr(arr[0].indexOf('=')+1,arr[0].length-1)
      }
      
    },
    account(){
      if(sessionStorage.getItem('account')){
        return sessionStorage.getItem('account')
      }else{
        let arr = this.getQuery() 
        return arr[1].substr(arr[1].indexOf('=')+1,arr[1].length-1)
      }
    }
  },
  watch:{
    //监听页面操作，压入操作栈
    form:{
      handler(val,oldVal){
        if(this.indexFlag){
          //深拷贝后再压入
          Object.assign([],Object.values(val))
          let a = JSON.stringify(Object.values(val)) 
          this.commondStack.push(JSON.parse(a))
          this.stackIndex = this.commondStack.length-1
        }
      },
      deep: true
    }
  },
  mounted(){
    // this.subBtnStyle = Object.assign({},this.btnStyle)
    this.getBtnImg();
    this.getimg();
    this.getTeamplate();
    this.getCmdObject();
  },
  methods: {
    handleClick(tab, event) {
        // console.log(tab, event);
    },
    //获取已保存模板
    getTeamplate(){
      this.$http.get('/uiTemplate/getRawHtml',{
        params:{
          productCode:this.cmdCode,
          type:this.pageflag?'pc':'mobile'
        }
      }).then(res=>{
        if(res.data.form){
          this.form= res.data.form
          this.bcImg = res.data.bcImg
          this.$forceUpdate();
          // document.getElementById('uiBox').innerHTML = res.data
        }
        
      })
    },
    //获取指令信息
    getCmdObject(){
      this.$http.get('/device/getCmdByCode',{
        params:{
          productCode:this.cmdCode,
        }
      }).then(res=>{
        this.cmdList = res.data
      })
    },
    addComp(e){
      if(e==='box'){
        this.form.push({
          name:'装饰组件',
          cmdName:'',
          type:'btn',
          btnStyle:{
            width:'30%',
            height:'30%',
            padding:'5px',
            'background-color':'rgba(255,255,255,0.5)',
            'background-image':'',
            'background-repeat':'no-repeat',
            border:'none',
            'border-radius':'5px',
            color:'rgba(0,0,0,0)',
            cursor:'pointer',
            'border-radius':'5px',
            transition:'width ease-in 0.5s,height ease-in 0.5s',
            'background-size':'cover !important',
            '-webkit-appearance':'button',
            'z-index': 2,
            top:'',
            left:'',
            position:''
          }
        })
      }else if(e.cmdDownParams.length===0){
          this.form.push({
          name:e.cmd_readme,
          cmdName:e.cmd_name,
          id:e.id,
          type:'btn',
          method:'commonSend(event)',
          btnStyle:Object.assign({},this.btnStyle),
          iconUrl:'',
          iconPosition:'leftIcon',
        })
      }else{
        let arr = e.cmdDownParams
        this.form.push({
          name:e.cmd_readme,
          cmdName:e.cmd_name,
          btnStyle:Object.assign({},this.btnStyle),
          id:e.id,
          obj:arr,
          iconUrl:'',
          iconPosition:'leftIcon',
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
      if(e.target.tagName==='BUTTON'){
        //去除其他按钮的选中标志
        // Array.from(document.getElementsByClassName('parentBtn')).map(item=>{item.classList.remove('selected')})
        // e.stopPropagation();
        this.selectWg=e.target
        //添加选中标志
       
        this.canDel = false
        this.selectIndex = e.target.getAttribute('data-index')
        if(this.form.length>=1){
          this.selectWgInfo = this.form[this.selectIndex].name
          this.WgWidth = this.form[this.selectIndex].btnStyle.width.replace(/%/g,"")
          this.WgHeight = this.form[this.selectIndex].btnStyle.height.replace(/%/g,"")
          this.WgPadding = this.form[this.selectIndex].btnStyle.padding
          this.WgMargin = this.form[this.selectIndex].btnStyle.margin
          this.showText = this.form[this.selectIndex].btnStyle.color!=='rgba(0,0,0,0)'
          this.textColor = this.form[this.selectIndex].btnStyle.color
          this.WgBorderRadius =parseInt(this.form[this.selectIndex].btnStyle['border-radius']) 
          this.btnColor =  this.form[this.selectIndex].btnStyle['background-color']
          let btnImg = this.form[this.selectIndex].iconUrl
          this.selectedBtnImg = btnImg && btnImg.length>1?btnImg:''
          this.btnIcon = this.form[this.selectIndex].iconPosition==='leftIcon'?false:true
        }
      }else{
        return false;
        this.canDel = true
      }
    },
    multiSelect(){
      
      setTimeout(()=>{
          this.selectWg.classList.add('selected')
          let item = this.form[this.selectIndex]
          let index = this.selectWgList.indexOf(item)
          if(index===-1){
            this.selectWgList.push(item)
            // console.log(this.selectWgList)
          }else{
            this.selectWgList.splice(index,1)
            this.selectWg.classList.remove('selected')
            // console.log(this.selectWgList)
          }
      },0)
    },
    gethtml(){
      this.showGrid = false
      $('.grid').hide()
      // let a = document.getElementById('uiBox').innerHTML.replace("grid"," ")
      this.rawHtml = document.getElementById('uiBox').innerHTML.replace(/tonclick/g, "onclick").replace(/tonmousedown/g, "onmousedown").replace(/tonmouseup/g, "onmouseup").replace(/draggable="false"/g,"")//替换tonclick启用点击事件,去除drag属性
      // console.log(this.rawHtml)
    },
    //获取背景图片
    getimg(){
      this.$http.get('/resource/getTemplateByType',{
        params:{
          type:'img',
          account:this.account
        }
      }).then(res=>{
        this.bcImgList = res.data.sys
        this.userImgList = res.data.user
      })
    },
    //获取按钮背景图片
    getBtnImg(){
      this.$http.get('/resource/getTemplateByType',{
        params:{
          type:'buttonImg',
          account:this.account
        }
      }).then(res=>{
        this.btnImgList = res.data.sys
        this.userBtnList = res.data.user
        this.getTeamplate()
      })
    },
    exportHtml(){
      this.gethtml()
      let size = this.pagetype==='Pc'?'width:100vw;height:100vh;':'width:375px;height:667px;'
      let html = util.exportHtml(this.rawHtml,this.bcImg,size)
      // console.log(html)
      this.$http.post('/uiTemplate/save',{data:html,productCode:this.cmdCode,rawHtml:JSON.stringify({form:this.form,bcImg:this.bcImg}),type:this.pageflag?'pc':'mobile'}).then(res=>{
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
    multiWidthChange(){
      if(this.selectWgList.length>0){
          this.selectWgList.map(item=>{
          item.btnStyle.width=this.multiWgWidth+'%'
        })
      }
      
    },
    HeightChange(){
      if(this.selectWg.style){
        this.form[this.selectIndex].btnStyle.position = 'absolute'
        this.form[this.selectIndex].btnStyle.height=this.WgHeight+'%'
      }
    },
    //批量修改
    multiHeightChange(){
      if(this.selectWgList.length>0){
          this.selectWgList.map(item=>{
          item.btnStyle.height=this.multiWgHeight+'%'
        })
      }
    },
    multiMove(dre){
      let that = this
      this.moveTarget = ''
      switch (dre){
        case 'left':if(this.selectWgList.length>0){
                this.selectWgList.map(item=>{
                if(parseInt(item.btnStyle.left)===0){
                  return 
                }else{
                  item.btnStyle.left=parseInt(item.btnStyle.left)-1+'%'
                }
                
              })
            } break;
        case 'right':if(this.selectWgList.length>0){
                this.selectWgList.map(item=>{
                if(parseInt(item.btnStyle.left)>80){
                  return 
                }else{
                  item.btnStyle.left=parseInt(item.btnStyle.left)+1+'%'
                }
              })
            } break;
        case 'top':if(this.selectWgList.length>0){
                this.selectWgList.map(item=>{
                if(parseInt(item.btnStyle.top)===0){
                  return 
                }else{
                  item.btnStyle.top=parseInt(item.btnStyle.top)-1+'%'
                }
              })
            } break;
        case 'bottom':if(this.selectWgList.length>0){
                this.selectWgList.map(item=>{
                if(parseInt(item.btnStyle.top)>80){
                  return 
                }else{
                  item.btnStyle.top=parseInt(item.btnStyle.top)+1+'%'
                }
              })
            } break;
      }
      
    },
    //多选对齐
    horizontaAlign(){
      this.moveTarget = ''
      let left = this.selectWgList[0].btnStyle.left
      if(this.selectWgList.length>0){
          this.selectWgList.map(item=>{
          item.btnStyle.left=left
        })
      }
    },
    verticalAlign(){
      this.moveTarget = ''
      let top = this.selectWgList[0].btnStyle.top
      if(this.selectWgList.length>0){
          this.selectWgList.map(item=>{
          item.btnStyle.top=top
        })
      }
    },
    RadiusChange(){
      if(this.selectWg.style){
        this.form[this.selectIndex].btnStyle['border-radius']=this.WgBorderRadius+'%'
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
    changeGrid(){
      if(this.showGrid){
        $('.grid').show()
      }else{
        $('.grid').hide()
      }
    },
    colorPick(e){
      if(this.selectWg.style){
        this.form[this.selectIndex].btnStyle.color = e
      }
    },
    colorBtnPick(e){
      if(this.selectWg.style){
        this.form[this.selectIndex].btnStyle['background-color'] = e
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
    changeBcColor(val){
      let uibox = document.getElementById('uiBox')
      uibox.style['background-image']=''
      uibox.style.background = val
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
          this.form[this.selectIndex].iconUrl = e.resource_data
          // this.form[this.selectIndex].btnStyle['background-image']=`url(${e.resource_data})`
          // this.form[this.selectIndex].btnStyle['background-size'] = 'cover !important'
        }else{
          this.form[this.selectIndex].iconUrl = ''
        }
      }
    },
    boxImgSelected(e){
        if(e.resource_data){
          this.selectedBoxImg = e.resource_data
        }else{
          // this.selectWg.style.background = '#78bdf3'
          this.selectedBoxImg = ''
          
        }
        if(this.selectWgInfo==='装饰组件'){
          if(e.resource_data){
            this.form[this.selectIndex].btnStyle['background-image'] = `url(${e.resource_data})`
            this.$forceUpdate()
            // this.form[this.selectIndex].btnStyle['background-image']=`url(${e.resource_data})`
            // this.form[this.selectIndex].btnStyle['background-size'] = 'cover !important'
          }else{
            this.form[this.selectIndex].btnStyle['backgroud-image']  = ''
          }
        }
    },
    changeIconPosition(val){
      if(val){
        this.form[this.selectIndex].iconPosition = 'topIcon'
      }else{
        this.form[this.selectIndex].iconPosition = 'leftIcon'
      }
    },
    //拖拽改变定位
    move(e){
      //阻止子元素事件
      if(e.target.tagName!=='BUTTON'){
        return false
      }
      let uiBox = document.getElementById('uiBox')
      let grid = document.getElementsByClassName('grid')[0]
      grid.style['background-size'] = uiBox.offsetWidth/100+'px '+uiBox.offsetWidth/100+'px'
      let target = e.target
      let orgX= e.pageX; 
      let orgY= e.pageY;
      let oriX = target.offsetLeft/uiBox.offsetWidth*100 + '%' 
      let oriY = target.offsetTop/uiBox.offsetHeight*100 + '%' 
      let curX = target.style.left?target.style.left:oriX
      let curY = target.style.top?target.style.top:oriY
      let that = this
      // let childs=target.parentNode.parentNode.children
      //             let brothers=[]
      //             for(let i=0;i<childs.length;i++){
      //                 if(childs[i]!==target.parentNode)
      //                     brothers.push(childs[i])
      //             }
      //             console.log(brothers)
      //             this.brothersinfo = []
      //             brothers.forEach(function(item){
      //                 that.brothersinfo.push({'left':item.offsetLeft/uiBox.offsetWidth*100+'%','top':item.offsetTop/uiBox.offsetHeight*100+'%','text':item.innerText})
      //             })
      //             console.log(this.brothersinfo)
      this.canMove = true 
      document.onmousemove = (e)=>{       //鼠标按下并移动的事件
              //用鼠标的位置减去鼠标相对元素的位置，得到元素的位置
              
              
              if(this.canMove){
                  //获取兄弟节点的top,left,width(400),height(300)  
                  // target.style.left = target.offsetWidth/uiBox.offsetWidth*100+'%'
                  //移动当前元素
                  this.moveTarget = e.target
                  target.style.position = 'absolute'
                  let xBoundary =(uiBox.offsetWidth- target.offsetWidth)/uiBox.offsetWidth*100
                  let yBoundary =(uiBox.offsetHeight- target.offsetHeight)/uiBox.offsetHeight*100
                  let a = 10/uiBox.offsetWidth*100
                  let b = 10/uiBox.offsetHeight*100
                  let x = parseInt(curX)  + Math.round(( e.pageX - orgX )/uiBox.offsetWidth*100) 
                  if(x>xBoundary){x=xBoundary}else if(x<0){x=0}
                  let y = parseInt(curY) + Math.round(( e.pageY - orgY )/uiBox.offsetHeight*100) 
                  if(y>yBoundary){y=yBoundary}else if(y<0){y=0}
                  
                  target.style.left =x + '%';
                  target.style.top =y + '%';
                  this.wgLeft = `${x}%` 
                  this.wgTop = `${y}%`
                  if(target.getAttribute('data-index')){
                      let index = target.getAttribute('data-index')
                      if(this.form[index].btnStyle){
                        this.form[index].btnStyle.position = 'absolute'
                      }
                      
                    }
                  
              }
          };
        document.onmouseup = (e) => {
          if( this.moveTarget!==''){
            let index =this.moveTarget.getAttribute('data-index')
            if(this.form.length>1){
              this.form[index].btnStyle.left = this.wgLeft?this.wgLeft:this.form[index].btnStyle.left
              this.form[index].btnStyle.top = this.wgTop?this.wgTop:this.form[index].btnStyle.top
            }
          }
          document.onmousemove = null
          this.canMove = false
        };
      // console.log(uiBox.offsetLeft)
    },
    //前进后退
    goBack(){
      this.indexFlag=false;
      let len = this.commondStack.length
      let len2 = this.historyStack.length
      if(len>1){
        let arr = JSON.stringify(this.commondStack.pop()) 
        this.historyStack.push(JSON.parse(arr))
        if(JSON.stringify(this.form) === arr){
          arr = JSON.stringify(this.commondStack.pop()) 
          this.historyStack.push(JSON.parse(arr)) 
        }
        this.form=JSON.parse(arr)
      }
      setTimeout(()=>{this.indexFlag=true},0)
    },
    goForward(){
      this.indexFlag=false;
      let len = this.historyStack.length
      if(len>1){
        this.commondStack.push(this.historyStack.pop())
      }
      let arr =this.historyStack.pop()
      this.form = arr 
      this.commondStack.push(arr)
      setTimeout(()=>{this.indexFlag=true},0)
    },
    //上传图片方法
    onBeforeUploadImage(file) {
      const isIMAGE = file.type === 'image/jpeg' || 'image/jpg' || 'image/png'
      const isLt1M = file.size / 1024 / 1024 < 1
      if (!isIMAGE) {
        this.$message.error('上传文件只能是图片格式!')
      }
      if (!isLt1M) {
        this.$message.error('上传文件大小不能超过 1MB!')
      }
      return isIMAGE && isLt1M
      console.log('a'+this.uploadImg)
    },
    UploadImage(param){
      // const formData = new FormData()
      // formData.append('file', param.file)
      // if(this.uploadImg.resource_data!==''){
      //   this.$http.post('/resource/resourceInsert',this.uploadImg).then(response => {
      //     console.log('上传图片成功')
      //     param.onSuccess()  // 上传成功的图片会显示绿色的对勾
      //     // 但是我们上传成功了图片， fileList 里面的值却没有改变，还好有on-change指令可以使用
      //   }).catch(response => {
      //     console.log('图片上传失败')
      //     param.onError()
      //   })
      // }
    },
    uploadBc(){
        this.$http.post('/resource/resourceInsert',this.uploadImg).then(response => {
          this.$message({
            type:'success',
            message:'上传成功'
          })
          this.getimg();
          this.$refs.upload.clearFiles()
        }).catch(response => {
          this.$message({
            type:'error',
            message:'上传失败'
          })
        })
    },
    fileChange(file){
      this.$refs.upload.clearFiles() //清除文件对象
      this.logo = file.raw // 取出上传文件的对象，在其它地方也可以使用
      this.fileList = [{name: file.name, url: file.url}] // 重新手动赋值filstList， 免得自定义上传成功了, 而fileList并没有动态改变， 这样每次都是上传一个对象
      this.uploadImg.resource_name = file.name
      this.uploadImg.resource_type = 'img'
      this.uploadImg.resource_readme = '用户上传图片'
      this.uploadImg.update_user=this.account
      var This = this;
      //this.imageUrl = URL.createObjectURL(file.raw);
      var reader = new FileReader();
      reader.readAsDataURL(file.raw);
      reader.onload =function(e){ 
        this.result // 这个就是base64编码了
        This.uploadImg.resource_data = this.result
      }
      
    },
    //调整层级
    pgUp(){
      let z = this.form[this.selectIndex].btnStyle['z-index']
      if(z===8){
        return 
      }else{
        this.form[this.selectIndex].btnStyle['z-index']++
      }
    },
    pgDown(){
      let z = this.form[this.selectIndex].btnStyle['z-index']
      if(z===0){
        return 
      }else{
        this.form[this.selectIndex].btnStyle['z-index']--
      }
    },
    getQuery(){
        let a = window.location.href
        return a.split("&"); 
    }

  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  html,body{
    height: 100%;
  }
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
    background-size: cover !important;
    position: relative;
  }
  .wgBox{
    width: 375px;
    height: 667px;
    position: relative;
  }
  .grid{
    width: 100%;
    height: 100%;
    background-image: linear-gradient(90deg, rgba(200, 0, 0, 0.15) 10%, rgba(0, 0, 0, 0) 10%),linear-gradient(rgba(200, 0, 0, 0.15) 10%, rgba(0, 0, 0, 0) 10%);
    background-size: 10px 10px;
    position: absolute;
    top: 0;
    z-index:0;
    display: none;
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
    overflow: scroll;
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
    z-index: 9;
    text-align:center;
    padding:15px;
  }
  .commondBox{
    background: #fff;
    padding: 10px;
    margin: 0 auto;
  }
 
  .subCommond a{
    position:absolute;
    z-index: 10;
    top:15px;
    right:15px;
    cursor:pointer;  
  }
  .commondInput{
    float: right;
  }
  .paramReadme{
    display: none;
  }
  .clearfix:after{
    content:"\20";
    display: block;
    height: 0;
    clear: both;
    zoom:1;
  }
  .leftIcon{
    vertical-align: middle;
    width: 30%;
    max-height: 100%;
    margin-right: 5%;
  }
  .topIcon{
    width: 30%;
    max-height: 100%;
    margin:5% auto;
    display: block;
  }
  .selected{
    border: red solid 2px !important;
  }
</style>
