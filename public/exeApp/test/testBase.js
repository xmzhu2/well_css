/**
 * Created with JetBrains WebStorm.
 * User: rongwang
 * Date: 13-7-27
 * Time: 上午11:50
 * To change this template use File | Settings | File Templates.
 */
X.dev = true;

BASE.define('xmzhu.Test',{
    say:function(text){
        console.log(text);
    }
})

BASE.define('xmzhu.Test1',{
    extend:'xmzhu.Test'
});

var test = xmzhu.Test1.produce({
    sayH:function(){
        console.log(X.getPath('xmzhu.Test1'));
    }
});

X.setPath({
    'X.template':'/lib/base/template'
})
X.require(['X.template.Template'],function(){
    alert('X.template.Template load success');
});


var template = X.template.Template.produce({
    template:'<div>{test.a}</div>'
})

var data = {test:{a:'tes1t'}}

template.appendTemplate(data);



