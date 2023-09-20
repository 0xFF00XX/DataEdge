
//flat picker configs
const config = {
  enableTime: true,
  time_24hr : true,
  // maxDate: "today",
  //below function explained below
  defaultDate: currDateTime(0,0,0,0,0),
  maxDate: currDateTime(0,0,0,0,0),
  dateFormat: "d-m-Y H:i",
  altInput: true,
  altFormat: "F j, Y @ H:i",
  minuteIncrement: 1
}

// flatpciker init
const startFlatInput = document.getElementById("flatStart");
const endFlatInput = document.getElementById("flatEnd");
// flatpicker setup
const endFlatPicker = flatpickr(endFlatInput,config);
const startFlatPicker = flatpickr(startFlatInput, {
  enableTime: true,
  time_24hr : true,
  defaultDate: currDateTime(0,0,0,0,5),
  maxDate: currDateTime(0,0,0,0,0),
  dateFormat: "d-m-Y H:i",
  altInput: true,
  altFormat: "F j, Y @ H:i",
  minuteIncrement: 1,
  onChange: function(selectedDates, dateStr, instance){
      endFlatPicker.set("minDate", dateStr);

  // Constrain the maxDate of the start date picker to today's date
      startFlatPicker.set("maxDate", currDateTime(0,0,0,0,0));
  },
  });



//request time. args -- substract from current year,month etc to use in Last Hour or Last month selections.
//example currDateTime(0,0,0,-4,0) -- should return date four hours back.
function currDateTime(year,month,date,hour,mins){
  var now = new Date();
  var currentYear = now.getFullYear() - year;
  var currentMonth = now.getMonth() - month;
  var currentDay = now.getDate() - date;
  var currentHour = now.getHours() - hour;
  var currentMinute = now.getMinutes() - mins;
  // Create a date object with the current date and time
  console.log();

  var currentDateAndTime = new Date(currentYear, currentMonth, currentDay, currentHour, currentMinute);
  return currentDateAndTime
}

// hide date - time selector if not Custom range
const selector = document.getElementById('selectTimeRange');
const flatTimes = document.getElementById('flatTimes');
selector.addEventListener('change', function() {
  // Check if the "Custom" option is selected
  if (selector.value === 'custom') {
    flatTimes.style.display = "block"; // Show time pickers
  } else {
    flatTimes.style.display = "none"; // Hide time pickers
  }
});



document.getElementById("submitForm").addEventListener("submit", function(event) {
  event.preventDefault(); // Prevent the default form submission

  const errorMessageContainer = document.getElementById("error-message");
  errorMessageContainer.textContent = "";
  let isValid = false;
  let startEpoch =0 ;
  let endEpoch =0;

  if(selector.value === "hour"){
    console.log("last hour");
  }
  else if (selector.value === "4hours"){
    console.log("last 4 hours");
  }
  else if (selector.value === "day"){
    console.log("last 24 hours");
  }
  else if (selector.value === "7days"){
    console.log("last 7 days");
  }
  else if (selector.value === "month"){
    console.log("last month");
  }
  else{
    startEpoch = (new Date(startFlatPicker.selectedDates).getTime())/1000;
    endEpoch = (new Date(endFlatPicker.selectedDates).getTime())/1000;

    //testing for minimum
    if(((endEpoch - startEpoch) < 300) && ((endEpoch - startEpoch) >= 0)){
      console.log("Less than minimum");
      errorMessageContainer.textContent = "End time is less than 5 minutes from Start Time.";
    }
    else if((endEpoch - startEpoch) < 0){

      errorMessageContainer.textContent = "End time below zero!";
    }
    else{
      isValid = true;
    }
  }
  //perform calculations and plot with valid time
  if(isValid){
    requestData(startEpoch, endEpoch, "max_im_BitsIn", "DEL_98_Test")
    // graph(startEpoch, endEpoch, "max_im_BitsIn", "BIP")
    console.log(startEpoch);
  }


});

function graph(epochStart, epochEnd, metric, group){

}
function requestData(epochStart, epochEnd, metric, group){
  const ip = "127.0.0.1";
  const port = "8000"
  url= "http://"+ip+":"+port+"/odata/api/groups?$top=20000&skip=0&top=20000&resolution=RATE&starttime="+epochStart+"&endtime="+epochEnd+"&$format=json&$expand=portmfs&$select=ID,Name,portmfs/Timestamp,portmfs/"+metric+"&$filter=((Name eq '"+group+"'))"

  const username = 'admin';
  const password = '!DataOverEdge!';
  const base64Credentials = btoa(`${username}:${password}`);
  const headers = new Headers({
    'Authorization': `Basic ${base64Credentials}`,
    'Content-Type': 'application/json', // Set the content type based on the expected response
  });

  const request = new Request(url, {

  });

  fetch(request)
  .then((response) => response.json())
  .then(data => {
    // Check if the response status is OK (status code 200)
    // if (!response.ok) {
    //   throw new Error('Network response was not ok');
    // }
    // else{
    const array = data.d.results[0].portmfs.results;

    const listElement = document.getElementById('graph');
    array.forEach(item => {
    const listItem = document.createElement('li');
    listItem.textContent = `${item.name} - $${item.price}`;
    listElement.appendChild(listItem);
    });
      console.log('Received JSON data:', data.d.results[0].portmfs.results);

      // Parse the JSON response
      // return response.json();
      // console.log(response.json());
    // }

  })
  .catch(error => {
    // Handle errors such as network issues or authentication problems
    console.error('Error:', error);
  });


  console.log(JSON.stringify(url, null, 4));
}
// debug
console.log(currDateTime(0,0,0,0,0));
