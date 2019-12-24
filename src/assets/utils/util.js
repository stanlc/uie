
export default{
    exportHtml(e){
        return `<!DOCTYPE html>
        <html>
        
        <head>
            <meta charset="UTF-8">
            <title>设备测试</title>
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/element-ui@2.13.0/lib/theme-chalk/index.css">
            <script src="http://libs.baidu.com/jquery/2.0.0/jquery.min.js"></script>
        </head>
        <body>
        <div id="msgBox" style="width: 300px;
            height: 100px;
            position: absolute;
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
        `+`<div id="app">`+e+`</div>`+
        `</body>

        <!-- import Vue before Element -->
        <script src="https://cdn.jsdelivr.net/npm/vue"></script>
        <!-- import JavaScript -->
        <script src="https://cdn.jsdelivr.net/npm/element-ui@2.13.0/lib/index.js"></script>
      
        <script>
        var FLAG = "false";
        getCmdParams = function(thisDom){
                let id = thisDom.getAttribute("data-id")
                var operation =  thisDom.getAttribute("data-cmdName");
                var paramsArray = $("#"+id).serializeArray();
                var map = {};
                $.each(paramsArray, function () {
                    map[this.name] = this.value
                });
                var array =  {
                    operation:operation,
                    controlParams:map
                };
                return array;
            };
    
             commonSend = function(event) {
                let id = event.target.getAttribute("data-id")
                if(FLAG === "false"){
                    var serial_num = $("#serial_num").val();
                    var product_code = $("#product_id").attr("data-code");
                    var operation = event.target.getAttribute("data-cmdName");//cmd_name
                    var paramsArray =  $("#"+id).serializeArray();
                    var token = $("#token").val();
                    var url = $("#url").val();
                    var account = $("#account").val();
                    var flag = true;
                    $.each(paramsArray, function () {
                        //做参数验证暂时做非空验证
                        if (this.value == "") {
                            var param_name = $("#" + this.name).parent().prev().text();
                            msg(param_name + "不能为空", "#" + button.id);
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
                                    msg("操作成功");
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
    </script>
    <script>
        new Vue({
        el: '#app',
        data: function() {
            return { visible: false }
        }
        })
    </script>
    </html>`
       
     }
        }