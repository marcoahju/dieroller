
require('pegjs-require');

function binop(type, left, right){
	this.type = type;
  this.left = left;
  this.right = right;
}

function roll(amount, die){
	this.type = 'roll';
  this.amount = amount;
  this.die = die;
}

function constant(value){
  this.type = constant;
  this.value = value;
}

//var parser = require('./parser.js');
var parser = require('./dieroller.pegjs');

var ast = parser.parse("d8");

console.log(ast);
