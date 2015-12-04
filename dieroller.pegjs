start =
    expression:additive {return {expression : expression}}

additive =
    left:multiplicative _ op:("+"/"-") _ right:additive
        { return {type: "binop", op:op, left:left, right:right}; }
  / multiplicative

multiplicative =
    left:primary _ op:("*"/"/") _ right:multiplicative
        { return {type: "binop", op:op, left:left, right:right}; }
  / primary

primary =
    roll
  / "(" expression:additive ")"
      { return {type: "parens", expression:expression}; }

roll =
	amount:integer? "d" die:integer
    	{
          var a = amount ? amount : { type:"constant", value: 1 };
        	return {
              type: "roll",
              amount: a,
              sides: die
          };
      }
    /integer

integer =
    digits:[0-9]+
        { return {type:"constant", value:parseInt(digits.join(""), 10)}; }

_ "whitespace"
  = [ \t\n\r]*
