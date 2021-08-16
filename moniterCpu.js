var exec = require("child_process").exec;

// Server monitering function 
function getProcessPercent() {
  setInterval(() => {
    // GET current node process id.  // replace nodemon with node if you use node app.js to run server
    let killed = false;
    var cmd2 = `ps aux|grep "node app.js"|head -n1 |tr -s ' ' |cut -f2 -d ' '`
    exec(cmd2, function (err, processId) {
      try {
        if (err) {
          console.log("Command `ps aux` returned an error!");
        } else {
         let  pid = parseInt(processId);
          console.log('procesId:'+pid);
          //linux command to get cpu percentage for the specific Process Id.
          var cmd = `ps up ${pid} | tail -n1 | tr -s ' ' | cut -f3 -d' '`;

          //executes the command and returns the percentage value
          exec(cmd, function (err, percentValue) {
            if (err) {
              console.log("Command `ps` returned an error!");
            } else {
              let cpuUsage = parseFloat(percentValue)
              console.log(`Current Node server CPU Usage is : ${cpuUsage}%`); 

              if (parseInt(cpuUsage) > 70) {

                exec(`kill -9 "${pid}"`);
                killed = true;

                console.log("Cpu is greater than"+cpuUsage+"%");
              }
              if(killed==true){
              exec(`node app.js`,function(err,res){
                console.log(res);
                console.log(err+"er");
              })
            }
            }
          });
        }
      } catch (e) {
        console.log(e);
      }
    });





  }, 1000);
}


getProcessPercent();


