
export default{
    exportHtml(e,bc,size){
        return `<!DOCTYPE html>
        <html>
        
        <head>
            <meta charset="UTF-8">
            <title>设备测试</title>
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/element-ui@2.13.0/lib/theme-chalk/index.css">
            <script src="http://libs.baidu.com/jquery/2.0.0/jquery.min.js"></script>
        </head>
        <body>
        <div style="background:url(${bc});background-size:cover;background-repeat:no-repeat;${size};position:relative;text-align:center;"
        >
        <div id="msgBox" style="width: 300px;
            height: 100px;
            overflow:auto;
            position: absolute;
            z-index:9;
            display:none;
            top: 10%;
            left: 50%;
            margin-left: -150px;
            text-align: center;
            line-height: 45px;
            border-radius: 5px;
            background: #fff;
            box-shadow: 1px 1px 3px #888888;">
            <p style="margin:0 auto;" class="msg">msg</p>
        </div>
        `+`<div id="app">
            <div id="nickName" class="modal" @click="if($event.target.id==='nickName'){$('#nickName').fadeOut(500);
            nickName=''}">
                <div>    
                    <span>别名：</span><input v-model="nickName"/>
                    <button @click="changeNickName">确认</button>
                </div>
            </div>`+e+`</div>`+
        `</div>
        </body>

        <!-- import Vue before Element -->
        <script src="https://cdn.jsdelivr.net/npm/vue"></script>
        <!-- import JavaScript -->
        <script src="https://cdn.jsdelivr.net/npm/element-ui@2.13.0/lib/index.js"></script>
        
        <script>
        var FLAG = "false";
        var operation = '';
        getCmdParams = function(thisDom){
                let id = thisDom.getAttribute("data-id")
                var operation =  thisDom.getAttribute("data-cmdName");
                var title = thisDom.child[1].innerHTML
                var paramsArray = $("#"+id).serializeArray();
                var map = {};
                $.each(paramsArray, function () {
                    map[this.name] = this.value
                });
                var array =  {
                    operation:operation,
                    controlParams:map,
                    title:title
                };
                return array;
            };
    
             commonSend = function(event) {
                let id = event.target.getAttribute("data-id")
                var curIndex = event.target.getAttribute("data-index")
                if(FLAG === "false"){
                    var serial_num = $("#serial_num").val();
                    var product_code = $("#product_id").attr("data-code");
                    operation = event.target.getAttribute("data-cmdName");//cmd_name
                    var paramsArray =  $("#"+id).serializeArray();
                    var token = $("#token").val();
                    var url = $("#url").val();
                    var account = $("#account").val();
                    var flag = true;
                    $.each(paramsArray, function () {
                        //做参数验证暂时做非空验证
                        if (this.value == "") {
                            var param_name = $("#" + this.name).parent().prev().text();
                            msg("参数不能为空");
                            flag = false;
                            return false;
                        }
                    });
                    //参数验证通过发送指令
                    if (flag) {
                        var params = $("#"+id).serializeObject();
                        $.ajax({
                            url: url,
                            data: JSON.stringify({
                                serial_num: serial_num,
                                productId: product_code,
                                operation: operation,
                                controlParams: encodeURIComponent(JSON.stringify(params)),
                                account: account
                            }),
                            async: true,
                            dataType: "json",
                            contentType: "application/json",
                            type: "post",
                            success: function (data) {
                                if (data.code === 0||data.code === "0") {
                                    msg("操作成功"+'<br>'+JSON.stringify(data));
                                } else if (data.code == "-2") {
                                    msg("设备无应答");
                                } else if (data.code == "AA") {
                                    msg("发送控制指令失败" );
                                } else {
                                    msg("控制失败," + data.message)
                                }
                            }
                        })
                    }
                }
            }
        function getField(flag,array,json){
            FLAG = flag;
            $("#serial_num").val(json.serial_num);
            $("#url").val(json.url);
            $("#account").val(json.account);
            myVue.getNickName();
        }
        $.fn.serializeObject = function () {
            var o = {};
            var a = this.serializeArray();
            $.each(a, function () {
                if (o[this.name]) {
                    if (!o[this.name].push) {
                        o[this.name] = [o[this.name]];
                    }
                    o[this.name].push(this.value || "");
                } else {
                    o[this.name] = this.value || "";
                }
            });
            return o;
        };
        function msg(status) {
            $("#msgBox").fadeIn()
            $('p.msg').html(status)
            $("#msgBox").fadeOut(2000)
        }
        
        // 长按修改别名方法
        var loop = 1
        var flag2 = true
        holdDown = function (e)//鼠标按下时触发
        {
            flag2 = false
            curIndex = e.target.getAttribute('data-index')
            time=setInterval(function()
                {
                    loop = 0;
                    clearInterval(time);//便不再继续重复此函数 （clearInterval取消周期性执行）
                    let name
                    if(e.target.tagName==='SPAN'){
                        name = e.target.innerHTML
                    }else{
                        name = e.target.getElementsByTagName('span')[0].innerHTML
                    }
                    myVue.nickName = name
                    $('.subCommond').hide()
                    $('#nickName').fadeIn(500)
                    
                },500);
                return false;
        };
        function holdUp(e)
        {
            clearInterval(time);//如果按下时间不到500毫秒便弹起，
            setTimeout(()=>{loop=1},0)
            let target = e.target
            if(e.target.tagName==='SPAN' || e.target.tagName==='IMG'){
                target = e.target.parentNode
            }
            let level = target.getAttribute('data-level')
            let id = target.getAttribute('data-id')
            if(loop!==0){
                if(level==='first'){
                    commonSend(event)
                }else{
                    $('#nickName').hide()
                    $('.subCommond').hide()
                     $('#'+id).show()
                     myVue.subDialogVisible = true
                }
               
            }
            return false
        };
    </script>
    <script>
        var myVue = new Vue({
        el: '#app',
        data: function() {
            return {
                visible: false,
                curIndex:0,
                nickName:'',
                form:[],
                nickNameList:[],
                serialNum:'0',
                subDialogVisible:false
            }
        },
        created(){
            
        },
        mounted(){
           
        },
        methods:{
            //获取别名
            getNickName(){
                let s = $("#serial_num").val()
                $.ajax({
                    url: '/uiTemplate//getRemark?serialNum='+s,
                    async: true,
                    dataType: "json",
                    contentType: "application/json",
                    type: "get",
                    success: function (data) {
                        if(data.resultCode==='1'){
                            myVue.form = JSON.parse(data.resultContent)
                            setTimeout(()=>{myVue.upadateNickName()},100) 
                        }
                        
                    }
                })  
                
            },
            //设置按钮的别名
            changeNickName(){
                this.curIndex = window.curIndex
                this.form[this.curIndex]=this.nickName
                this.upadateNickName()
                $.ajax({
                            url: '/uiTemplate//saveRemark',
                            data: JSON.stringify({
                                serialNum:$("#serial_num").val(),
                                remark:JSON.stringify(this.form)
                            }),
                            async: true,
                            dataType: "json",
                            contentType: "application/json",
                            type: "post",
                            success: function (data) {
                                if (data.resultCode === '1') {
                                    msg("保存成功");
                                } else {
                                    msg("保存失败")
                                }
                            }
                        })
            },
            //更新别名
            upadateNickName() {
                
                let arr = [...document.getElementsByClassName('parentBtn')]
                arr.map((item,index)=>{
                    this.form.map((e,i)=>{
                        if(index===i){
                            let name
                            if(item.tagName==='SPAN'){
                                name = item.innerHTML
                                item.innerHTML = e?e:name
                            }else{
                                name = item.getElementsByTagName('span')[0].innerHTML
                                item.getElementsByTagName('span')[0].innerHTML = e?e:name
                            }
                           
                        }
                    })
                })
                
                $('#nickName').fadeOut(500)
                this.nickName=''
                
            },
        }
        })
    </script>
    <style>
          #nickName{
              display: none;
              
          }
          .subCommond{
            display:none;
            position:absolute;
            width:80%;
            height:90vh;
            margin:10%;
            z-index: 9;
            text-align:center;
            padding:15px;
          }
          .commondBox{
            background: #fff;
            position:relative;
            padding: 10px;
            margin: 0 auto;
          }
          .subCommond form {
            margin: 5px 0;
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
          .modal{
              width:100vw;
              height:100vh;
              background:rgba(0,0,0,0.5);
              position: absolute;
              z-index:2;
          }
          .modal div{
              display:flex;
              justify-content:center;
              margin:30% auto;
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
    </style>
    </html>`
       
     }
        }