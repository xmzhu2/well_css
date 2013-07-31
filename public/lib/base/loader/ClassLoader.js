/**
 * Created with JetBrains WebStorm.
 * User: rongwang
 * Date: 13-7-30
 * Time: 上午9:25
 * To change this template use File | Settings | File Templates.
 */

/**
 * 类加载
 * @class ClassLoader
 * @namespace X
 */
X.define('X.ClassLoader',{

    /**
     * 类加载列表
     * @attribute required
     * @type {Array}
     */
    required:[],

    /**
     * 表示类已经加载，在加载列表中增加当前类
     * @method add
     * @param className 类名
     */
    add:function(className){
        var util = X.Util,
            required = this.required;
        if(util.indexOf(required,className) == -1){
            required.push(className);
        }
    },

    /**
     * 加载js，并处理
     * @method load
     * @param url js地址
     * @param callback 成功加载后回调
     */
    load:function(url,callback){
     //   X.$.getScript(url,callback);
        __devLog('load:'+url)
        X.$.ajax({
            url:url,
            async:false,
            success:function(){

            }
        })

        if(callback) callback();
    },
    /**
     * 加载类<br/>
     * 将类解析成地址，调用load加载
     *
     * todo
     * @method require
     * @param clazzs
     * @param callback
     */
    require:function(clazzs,callback){
        callback = callback || function(){};

        if(clazzs.length == 0){
            callback();
            return ;
        }

        var util = X.Util,
            required = this.required;

        for(var i = 0 ; i<clazzs.length ;i ++){
            var className = clazzs[i];

            __devLog('require:'+className);
            if(util.indexOf(required,className) != -1){
                if(i == clazzs.length -1)  callback();
                return ;
            }else{
                var url = this.getPath(className);
                this.load(url,(i== clazzs.length-1)?callback:null);
            }
        }

    },

    /**
     * 设置classpath<br/>
     * 配置路径，已根目录为路径起点
     * @example
     *  setPath({
     *      'X.templet':'/lib/base/template'
     *  })
     * @method setPath
     * @param path
     */
    setPath:function(path){
        for(var x in path){
            if(path.hasOwnProperty(x)){
                var ns = X.__findNamespace(x+".a") || X.__namespace(x+".a");
                ns.namespace.path = ns.namespace.path || path[x];
            }
        }
    },

    /**
     *
     * @method getPath
     * @param className
     * @return {String}
     */
    getPath:function(className){

        var ns = X.__findNamespace(className),
            path = ns.namespace.path || X.basePath;

        return path +"/"+ns.className +".js";
    }

},function(){
    var loader = X.Loader = new X.ClassLoader();
    X.require = function(a,b){
        loader.require(a,b);
    }
    X.load = loader.load;
    X.setPath = loader.setPath;
    X.getPath = loader.getPath;
})