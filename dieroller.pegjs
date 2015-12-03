start =
    additive

additive =
    left:multiplicative _ op:("+"/"-") _ right:additive
        { return {tag:op, left:left, right:right}; }
  / multiplicative

multiplicative =
    left:primary _ op:("*"/"/") _ right:multiplicative
        { return {tag:op, left:left, right:right}; }
  / primary

primary =
    roll
  / "(" additive:additive ")"
      { return additive; }

roll =
	amount:integer? "d" die:integer
    	{
          var a = amount ? amount : { constant: 1 };
        	return {
            roll: {
              amount: a,
              sides: die
            }
          };
      }
    /integer

integer =
    digits:[0-9]+
        { return {constant:parseInt(digits.join(""), 10)}; }

_ "whitespace"
  = [ \t\n\r]*
