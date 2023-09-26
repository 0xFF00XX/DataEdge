
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
//example currDateTime(0,0,0,4,0) -- should return date four hours back.
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

      errorMessageContainer.textContent = "End time difference below zero!";
    }
    else{
      isValid = true;
    }
  }
  //perform calculations and plot with valid time
  if(isValid){
    requestData(startEpoch, endEpoch, "max_im_BitsIn", "DEL_98_Test")
    .then(data => {
      // This code will execute when requestData is complete and data is available
      console.log(data);
      console.log("last line " + data[data.length-1].Timestamp);

      //getting last key
      const metricKey = "max_im_BitsIn"
      data.sort((a, b) => b[metricKey] - a[metricKey]);
      console.log(data);
      
      console.log(get95perc(data,metricKey));

      //get 95th percentile
    })
    .catch(error => {
      // Handle errors such as network issues or authentication problems
      console.error('Error:', error);
    });
    // graph(startEpoch, endEpoch, "max_im_BitsIn", "BIP")


  }


});
function get95perc(sortedData,metric){
const n = sortedData.length;

// Position in the sorted array of values where the desired quantile falls.
const h = (n - 1) * 0.95 + 1;

// Rounding to the nearest integer
const h_floor = Math.floor(h);

// Get the value below h for each dictionary
const vArray = sortedData.map(item => item[metric]);

const v = vArray[h_floor - 1];

// Calculates the "fractional" part of the H value, which represents how far the quantile is between the elements at indices h - 1 and h.
const e = Math.round((h - h_floor)* 1000)/1000;
// console.log(e, h, h_floor, v);
// If e is not 0, interpolate values for each dictionary
let result = v;
if (e !== 0) {
  result += e * (vArray[h_floor] - v);
  // console.log(result);
}

return result;

}
function graph(epochStart, epochEnd, metric, group){

}
//request data from the combined link
function requestData(epochStart, epochEnd, metric, group) {
  return new Promise((resolve, reject) => {
    const ip = "127.0.0.1";
    const port = "8000";
    const url = "http://" + ip + ":" + port + "/odata/api/groups?$top=20000&skip=0&top=20000&resolution=RATE&starttime=" + epochStart + "&endtime=" + epochEnd + "&$format=json&$expand=portmfs&$select=ID,Name,portmfs/Timestamp,portmfs/" + metric + "&$filter=((Name eq '" + group + "'))";

    //metric mappings. needed to generate table depending on the seleted metric
    const metricMappings = {
          max_im_BitsIn: "max_im_BitsIn",
          im_BitsIn: "im_BitsIn",
          // Add more metric mappings as needed
        };

        // Use the metric parameter to dynamically get the property name from the mapping
    const property = metricMappings[metric] || metric; // Use the mapping or fallback to metric itself



    fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      }
    })
    .then(response => response.json())
    .then(data => {
      //all results are
      console.log(data);
      const array = data.d.results[0].portmfs.results;
      const sums = {};

      array.forEach(item => {
        const { Timestamp, [property]: metricValue } = item;
        if (!sums[Timestamp]) {
          sums[Timestamp] = parseFloat(metricValue);
        } else {
          sums[Timestamp] += parseFloat(metricValue);
        }
      });

      const result = Object.keys(sums).map(Timestamp => ({
        Timestamp,
        [property]: sums[Timestamp]
      }));

      resolve(result); // Resolve the promise with the result data
    })
    .catch(error => {
      reject(error); // Reject the promise with an error if fetch fails
    });
  });
}
// debug
console.log(currDateTime(0,0,0,0,0));
