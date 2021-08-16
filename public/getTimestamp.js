

var minutesToAdd=1;
var currentDate = new Date();
var futureDate = new Date(currentDate.getTime() + minutesToAdd*60000);

console.log(futureDate);