/**
 * @auther xmzhu2
 * 用来处理OO对象，创建和生成类
 */

(function(export_){

    var _$ =  export_.Ember.Object,
        createMethod = 'extend',
        produceMethod ='create',

        util = export_._||{},
        $  = renderEngine = export_.$ ;
    var console = _$.Logger || export_.console;
    var ajax = $.ajax;

    /**
     * 基础类，专注与类的创建和生产<br/>
     * 采用的类框架目前是Ember，可以通过配置去完成修改生成框架<br/>
     * 可以采用X代替
     * @class BASE
     * @static
     */
    var base = export_.BASE||{};

    /**
     * 工具类<br/>
     * 默认采用的是<a href='javascript:void(0)' onclick="window.open('http://underscorejs.org')">UNDERSCORE.js</a>
     * <br/>如果没有引入，则为空对象，并且后续可能会为他新加入的功能。
     * @attribute Util
     * @type _
     */
    base.Util = util;

    /**
     * 控制台
     * @attribute console
     * @type {*}
     */
    base.console = console;

    /**
     * 渲染引擎<br/>
     * 替换引擎必须要有jquery的渲染方法
     * @default jQuery
     * @attribute renderEngine
     * @type {*|Function}
     */
    base.renderEngine = base.$ = renderEngine;

    /**
     * 用来创建对象的框架实体
     * @attribute _$
     * @default Ember.Object
     * @type {Ember.Object}
     * @private
     */
    base._$ = _$;

    /**
     * 用来创建对象框架生成类的方法名称
     * @attribute createMethod
     * @default 'entend'
     * @type {String}
     */
    base.createMethod = createMethod;

    /**
     * 创建出来类生成实体对象的方法
     * @attribute produceMethod
     * @default 'create'
     * @type {String}
     */
    base.produceMethod = produceMethod;

    /**
     * 当前页面origin
     * @attribute BasePath
     * @type {String}
     */
    base.basePath = export_.location.origin;

    /**
     * 定义一个对象，允许继承<br/>
     * 默认采用Ember框架做类实现，也可以通过配置自由定义<br/>
     * 为每个生成的类都默认生成了一个 <span style="color:red">produce</span>方法，用来创建实体
     * @method define
     * @static
     * @param {String} className 创建类名
     * @param {Object} config 创建参数
     * @param {Function} callback创建类完成后的回调
     */
    base.define = function(className,config,callback){

        __devLog('define : '+className);

        config = config || {};
        var ns = __namespace(className);
        var baseClass = __getClass(config.extend);
        //todo 这里需要根据requires自动加载需要的类（模块--此功能待定）
        config.requires = config.requires || [];
        if(config.extend)
            config.requires.push(config.extend);
        base.require(config.requires, function () {
            base.__define(ns, baseClass, config, callback);
            base.Loader.add(className);

            __devLog('define end: '+className);


        })
    };

    //初始化没有load时候默认的require方法
    base.require = function(args,callback){
        callback();
    }

    /**
     * 定义一个类
     * @method __define
     * @param ns 命名空间
     * @param baseClass 基础类
     * @param config 参数
     * @param callback 回调
     * @private
     */
    base.__define = function(ns,baseClass,config,callback){
        //创建类
        var pC = ns.namespace[ns.className] = baseClass[createMethod](config);
        //为类提供产生实例的方法 //todo 这里需要提供一个类的实例管理器
        pC.produce = function(conf,callback){
            var createObj = pC[produceMethod](conf);
            if(callback) callback;
            return createObj;
        }

        //完成后回调
        if(callback) callback();
    }

    /**
     * 同jquery的ajax，采用其实现
     * @method ajax
     * @type {*}
     */
    base.ajax = ajax;

    /**
     * 得到父类
     * @param className
     * @return {*}
     * @private
     */
    function __getClass(className){
        var _ns;
        if(className && (_ns = __findNamespace(className))){
            return _ns.namespace[_ns.className];
        }
        return _$;
    }

    /**
     * 通过类名找到类的命名空间<span style='color:red'>（未公开）</span>
     *
     * @method findNamespace
     * @param {String} className 类名称
     * @param {Object} scrop 作用域
     * @return {Object} 命名空间{namespace:'',className:''}
     * @private
     */
    function __findNamespace(className,scrop){
        var _namespaceArr = className.split('.');
        var _namespace = scrop || export_;
        for(var i = 0 ; i < _namespaceArr.length -1 ; i++){
            if(!(_namespace = _namespace[_namespaceArr[i]])){
                return false ;
            }
        }
        return {namespace:_namespace,className:_namespaceArr[_namespaceArr.length -1]};;
    }

    /**
     * 用来分割和保存命名空间 <span style='color:red'>（未公开）</span><br/>
     *(如果有就返回已经存在的，如果没有就生成一个命名空间)
     * @method namespace
     * @param {String} className 类名称
     * @return {Object} 命名空间{namespace:'',className:''}
     * @private
     */
    function __namespace(className,scrop){
        var _namespaceArr = className.split('.');
        var _namespace = scrop || export_;
        for(var i = 0 ; i < _namespaceArr.length - 1 ; i++){
            _namespace = _namespace[_namespaceArr[i]]?_namespace[_namespaceArr[i]]:(_namespace[_namespaceArr[i]]={});
        }
        return {namespace:_namespace,className:_namespaceArr[_namespaceArr.length -1]};
    }

    /*私有方法*/
    base.__getClass = __getClass;
    base.__findNamespace =__findNamespace;
    base.__namespace = __namespace;

    function __devLog(text){
        if(base.dev && console){
            console.log(text);
        }
    }
    base.emptyFn = function(){};
    export_.__devLog =__devLog;
    export_.BASE = base;
    export_.X = base;



})(window)