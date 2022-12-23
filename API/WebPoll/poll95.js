


//
// get values time, ip, Group date
//
//set fields to value that was submitted.
// var ip = "10.0.0.93";
// var groupName = "";
var FULL_DAY, GROUP_NAME, HOURS_in_DAY, MINS_in_HOUR, SECS_in_MIN, bitsIn, bitsOut, endTime, ip, numberOfDays, numberOfHours, startTime, timeStamp;
GROUP_NAME = "DEL_98_Test";
ip = "10.0.0.93";
HOURS_in_DAY = 24;
MINS_in_HOUR = 60;
SECS_in_MIN = 60;
FULL_DAY = 86400;
startTime = 1669852800;
endTime = 1670479200;
bitsIn = [];
bitsOut = [];
timeStamp = [];
numberOfDays = 0;
numberOfHours = 0;

document.getElementById("submit").addEventListener("click", function(){
    main();
});
function main() {
  // alert("dssdf");
  console.log('submit pressed');
  requestData(1669852800,1670479200,288);
}


function requestData(startTime, endTime, numberOfEntries) {
  url = "http://" + ip + ":8581/odata/api/groups?$top=50&$skip=0&top=" + numberOfEntries.toString() + "&&resolution=RATE&starttime=" + startTime.toString() + "&endtime=" + endTime.toString() + "&$format=json&$expand=portmfs&$select=ID,Name,portmfs/Timestamp,portmfs/im_BitsIn,portmfs/im_BitsOut&$filter=((Name eq '" + GROUP_NAME + "'))";

  let username = 'admin';
  let password = '!DataOverEdge!';
  let auth = btoa(`${username}:${password}`);



  // Authenticate (dummy API)
  console.log('sending request');

  let rest = fetch(url, {
    method:'GET',
  	headers: new Headers({
  		'Authorization': 'Basic ' + auth
    // }
  }),

  })
  .then(response => {
      if (!response.ok) throw new Error(response.status);
      else console.log("resr = " + rest);
      return response.json();
    });



  // console.log(e);



  // document.getElementById("output").innerHTML = data;
}
