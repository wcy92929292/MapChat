"use strict";
var BookItem = function(text) {
	if(text) {
		// 解析json
		var obj=JSON.parse(text);
		this.time = obj.time;
		this.mylng = obj.mylng;
		this.mylat = obj.mylat;
		this.message = obj.message;
		this.account=obj.account;
	}else {
		this.time ="";
		this.mylng = "";
		this.mylat = "";
		this.message = "";
		this.account="";
	}
};

// 给BookItem对象添加toString方法,把json对象 序列化为字符串，才能上链存储
BookItem.prototype ={
	toString :function() {
		return JSON.stringify(this);
	}
};

// 将书籍使用map的方式上链保存,map的名字为BookMap
var Connotations = function (){
	LocalContractStorage.defineMapProperty(this,"BookMap",{
		parse: function (text) {
            return new BookItem(text);
        },
        stringify: function (o) {
            return o.toString();
        }
        
    });
    LocalContractStorage.defineProperty(this, "size",null);
}


Connotations.prototype ={
	init: function(){
		// 初始化工作，该属性为保存书籍的数目
		this.size=0;
	},
	//提交书籍的接口 参数为键值对map，key为作者名字，value为书籍内容
	submit: function(time,mylng,mylat,message){
		//调用该接口的人为该书籍所属的星云账户
		var from= Blockchain.transaction.from;
        var bookItem = new BookItem();
        
		bookItem.time=time;
		bookItem.mylng=mylng;
		bookItem.mylat=mylat;
		bookItem.account=from;
		bookItem.message=message;

		this.BookMap.put(this.size,bookItem);
		this.size=this.size+1;
		return this.BookMap.get(this.size-1);
	},
	//取全部的书籍
	getAllBook:function(){
		var arr=[];
		for(var i=0;i<this.size;i++){
			arr.push(this.BookMap.get(i));
		}
		return arr;
	}
};
module.exports = Connotations;
