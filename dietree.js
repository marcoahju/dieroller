// Nodes

//
require('pegjs-require');
// Load grammar
var parser = require('./dieroller.pegjs');



module.exports = {

  // Define node types
  Binop: function (op, left, right){
    this.type = "binop";
  	this.op = op;
    this.left = left;
    this.right = right;

    this.accept = function(visitor) {
        return visitor.visit(this);
    };

  },

  Roll: function (amount, sides){
  	this.type = "roll";
    this.amount = amount;
    this.sides = sides;
    this.rolls = undefined;

    this.accept = function(visitor) {
        return visitor.visit(this);
    };

  },

  Prio: function(expression){
    this.type = "parens";
    this.child = expression;

    this.accept = function(visitor) {
        return visitor.visit(this);
    };
  },

  Constant: function(value){
    this.type = "constant";
    this.value = value;

    this.accept = function(visitor) {
        return visitor.visit(this);
    };
  },

  build: function(expression){
    console.log("Parsing expression " + expression);

    // Build AST-tree
    var _build = function(t, n){
        if(n.type === "binop"){
          return new t.Binop(n.op, _build(t, n.left), _build(t, n.right));
        }
        else if(n.type === "roll"){
          return new t.Roll(_build(t, n.amount), _build(t, n.sides));
        }
        else if(n.type == "parens"){
          return new t.Prio(_build(t, n.expression));
        }
        else if(n.type === "constant"){
          return new t.Constant(n.value);
        } else {
          console.log("Unkown node type!");
        }
    };

    var tree = parser.parse(expression);
    return _build(this, tree.expression);
  }
};
