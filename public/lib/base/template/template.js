/**
 * Created with JetBrains WebStorm.
 * User: rongwang
 * Date: 13-7-27
 * Time: 下午1:32
 * To change this template use File | Settings | File Templates.
 */


/**
 * 模板渲染类，用来将数据渲染成模板<br>
 * 默认采用jquery渲染，也可以通过创建时候指定渲染模板，并且覆盖部分方法<br>
 * 目前模板只支持渲染（不支持类似EL表达式的东西//TODO，后期应该会提供）
 * @class template
 * @namespace Base
 * @moduel template
 */
BASE.define('X.template.Template',{

    /**
     * 模板<br>
     * 可以是数组也可以是html的字符串,需要替换的对象用{}包裹起来，可以是多级数据
     * @attribute template
     * @type {String|Array}
     */
    template :null,


    /**
     * 渲染引擎，目前是jqury，但是没有用到，很明显后期如果有时间的话会写成自己的实现，或者封装成接口类，
     * 更加明显的是：下面的方法都是基于jquery，等哥有机会的时候重写了,就不在只是依赖jqurey了。。
     */
    renderEngine:BASE.renderEngine,

    /**
     * 创建html（只是生成html）
     * @method createTemplate
     * @param data 渲染数据
     * @return 生成好的html（也就是当前类的HTML）
     */
    createTemplate:function(data){
        //过滤data 判断是否含有{}
        data = this._initData(data);
        return  this._initHtml(data);
    },
    /**
     * 渲染html
     * @method appendTemplate
     * @param data 需要渲染的数据
     * @param render 渲染数据的容器ID
     */
    appendTemplate:function(data,render){
        var html = this.createTemplate(data),
            __$ = this.renderEngine;
        var $render = __$(render?"#"+render:'body')
        $render.append(html);
    },

    /**
     * 得到模板字符串
     * @method getTemplate
     * @return {String} template
     */
    getTemplate:function(){
       var template = this.template;
       if(BASE.Util.isArray(template)){
           return template.join('');
       }else {
            return template;
       }
    },


    _initData:function(data){
        return data;
    },

    _initHtml : function(data){
        var template = this.getTemplate();
        return template.replace(/{\w+(.\w+)*}/g,function(text){
            text = text.substring(1,text.length - 1);
            var att = text.split('.'),attr = data;
            for(var i=0;i<att.length ; i++){
                attr = attr[att[i]];
            }
            return attr;
        })
    }

})