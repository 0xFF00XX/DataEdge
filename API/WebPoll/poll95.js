
//flat picker (date - time) gloabl configs
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

// flatpciker init HAS TO BE IN FUNCTION AND INITED EVERY MIN or action
const startFlatInput = document.getElementById("flatStart");
const endFlatInput = document.getElementById("flatEnd");

//IP OF LOCAL MACHINE
const ip = "10.0.0.236";
const port = "8000";

//error messages
const groupErrorMessageContainer = document.getElementById("error-message-group");
//init chart
let myChart;

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


// START Function to show the loading spinner
function showLoadingSpinner() {
  document.getElementById('loading-spinner').style.display = 'block';
}
// END Function to show the loading spinner

// START Function to hide the loading spinner
function hideLoadingSpinner() {
  document.getElementById('loading-spinner').style.display = 'none';
}
// END Function to hide the loading spinner


//request time. args -- substract from current year,month etc to use in Last Hour or Last month selections.
//example currDateTime(0,0,0,4,0) -- should return date four hours back.
//START currDateTime
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
//END currDateTime


//init seletors and time pickers
const timeSelector = document.getElementById('selectTimeRange');
const groupSelector = document.getElementById('groupSelector');
const metricSelector = document.getElementById('metricSelector');
const flatTimes = document.getElementById('flatTimes');







//START Event listener to display or hide Time Pickers
timeSelector.addEventListener('change', function() {
  // Check if the "Custom" option is selected
  if (timeSelector.value === 'custom') {
    flatTimes.style.display = "block"; // Show time pickers
  } else {
    flatTimes.style.display = "none"; // Hide time pickers
  }
});
//END Event listener

//START convert BITS to UNITS
function convertBitsToHigherUnits(bits) {
    if (bits >= 1e9) {
        // Convert to Gbits
        return (bits / 1e9).toFixed(2) + ' Gbits';
    } else if (bits >= 1e6) {
        // Convert to Mbits
        return (bits / 1e6).toFixed(2) + ' Mbits';
    } else if (bits >= 1e3) {
        // Convert to Kbits
        return (bits / 1e3).toFixed(2) + ' Kbits';
    } else {
        // Leave as bits
        return bits.toFixed(2) + ' bits';
    }
}
//END convert BITS to UNITS




//
//Start of SUBMIT button action
//
document.getElementById("submitForm").addEventListener("submit", function(event) {
  event.preventDefault(); // Prevent the default form submission
  //clean chart if exists
  if (myChart) myChart.destroy();
  groupErrorMessageContainer.textContent = "";
  //get values of groups and Metrics selectors.
  let groupValue = groupSelector.value;
  let metricValue = { value: metricSelector.value, text: metricSelector.options[metricSelector.selectedIndex].text}
  //setup errror msg
  const timeErrorMessageContainer = document.getElementById("error-message");
  timeErrorMessageContainer.textContent = "";
  //flag to contunie
  let isValid = false;
  let startEpoch = 0;
  let endEpoch = (new Date(currDateTime(0,0,0,0,0)).getTime())/1000;

  if(timeSelector.value === "hour"){
    console.log("last hour");
    startEpoch = (new Date(currDateTime(0,0,0,1,0)).getTime())/1000;
    isValid = true;
  }
  else if (timeSelector.value === "4hours"){
    console.log("last 4 hours");
    startEpoch = (new Date(currDateTime(0,0,0,4,0)).getTime())/1000;
    isValid = true;
  }
  else if (timeSelector.value === "day"){
    console.log("last 24 hours");
    startEpoch = (new Date(currDateTime(0,0,1,0,0)).getTime())/1000;
    isValid = true;
  }
  else if (timeSelector.value === "7days"){
    console.log("last 7 days");
    startEpoch = (new Date(currDateTime(0,0,7,0,0)).getTime())/1000;
    isValid = true;
  }
  else if (timeSelector.value === "month"){
    console.log("last month");
    startEpoch = (new Date(currDateTime(0,1,0,0,0)).getTime())/1000;
    isValid = true;
  }
  else if (timeSelector.value === "custom"){
    console.log("Custom time");
    startEpoch = (new Date(startFlatPicker.selectedDates).getTime())/1000;
    endEpoch = (new Date(endFlatPicker.selectedDates).getTime())/1000;

    //testing for minimum time range. Cant be less than 5 mins
    if((endEpoch - startEpoch) < 300){
      console.log("Less than minimum");
      timeErrorMessageContainer.textContent = "End time is less than 5 minutes from Start Time.";
    }
    else{
      isValid = true;
    }

  }
  else{
    //option not in the list
    console.error("Not in the list");
  }
  //perform calculations and plot with valid time
  if(isValid){


    ///METRICS AND GROUPS SHOULD BE DYNAMIC
    showLoadingSpinner();
    requestData(startEpoch, endEpoch, metricValue, groupValue)
    .then(data => {
      hideLoadingSpinner();
      console.log(data);

      // This code will execute when requestData is complete and data is available
      if(data.length == 0 || data === " "){
        //ERROR NO DATA
        console.error("No data");
        graph(data, metricValue);
        setTable("null",0)
      }
      else{

        graph(data, metricValue)

        //Sort data to process it in the table for max-min and percentiles
        data.sort((a, b) => a[metricValue.value] - b[metricValue.value]);
        // console.log(data);
        setTable(data, metricValue);
      }


      //get 95th percentile
    })
    .catch(error => {
      hideLoadingSpinner();
      // Handle errors such as network issues or authentication problems
      console.error('Error:', error);
    });
    // graph(startEpoch, endEpoch, "max_im_BitsIn", "BIP")


  }


});

//
//END of submit action
//


//
//Start of set table
//
function setTable(data, metric){
  //init table
  var tbody = document.getElementById("tableBody");
  // Remove all rows from the table body
  $("#tableBody tr").remove();

  //populate table
  var newRow = tbody.insertRow();
  // Create cells (columns) for the row
  var cell1 = newRow.insertCell(0);
  var cell2 = newRow.insertCell(1);
  var cell3 = newRow.insertCell(2);
  var cell4 = newRow.insertCell(3);
  var cell5 = newRow.insertCell(4);

  if(data === "null"){


    //populate cells
    cell1.innerHTML = "0";
    cell2.innerHTML = "0";
    cell3.innerHTML = "0";
    cell4.innerHTML = "0";
    cell5.innerHTML = "0";
  }
  else{
    //supply values to output in table rounded up
    const max = convertBitsToHigherUnits(data[data.length-1][metric.value]);
    const min = convertBitsToHigherUnits(data[0][metric.value]);
    const perc95 = convertBitsToHigherUnits(getPerc(data,metric.value, 0.95));
    const perc98 = convertBitsToHigherUnits(getPerc(data,metric.value, 0.98));
    //
    // RAW DATA
    //
    // const max = data[data.length-1][metric];
    // const min = data[0][metric];
    // const perc95 = getPerc(data,metric, 0.95);
    // const perc98 = getPerc(data,metric, 0.98);



    //populate cells
    cell1.innerHTML = metric.text;
    cell2.innerHTML = min;
    cell3.innerHTML = max;
    cell4.innerHTML = perc95;
    cell5.innerHTML = perc98;
  }

}
//END of settable


//Get percentile. Supply sorted array in ascending order,
// used metric and needed percentile in decimal (eg. 0.95)
function getPerc(sortedData,metric, perc){
  const n = sortedData.length;
  // Position in the sorted array of values where the desired quantile falls.
  const h = (n - 1) * perc + 1;
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



function graph(data, metric){
  const timestamps = data.map(item => new Date(item.Timestamp * 1000));
  console.log(timestamps[0]);
  const metrics = data.map(item => item[metric.value])

  const ctx = document.getElementById('interpolationChart');




    console.log(metric.text);
    myChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: timestamps,
        datasets: [
          {
            pointRadius: 0,
            label: metric.text,
            data: metrics,
            borderColor: 'blue',
            borderWidth: 2,
            fill: false,
          },
        ],
      },
      options: {
        animation: false,
        plugins: {
          zoom: {
            pan: {
              enabled: true,
              mode: 'xy',
              scaleMode: 'xy', // 'x' for horizontal, 'y' for vertical, 'xy' for both
            },
            zoom: {
              wheel: {
                enabled: true,
              },
              pinch: {
                enabled: true
              },
              mode: 'xy',
            },
          },
        },
        responsive: true,
        tooltips:{
           mode: 'index',
           intersect: false
        },
        hover: {
           mode: 'index',
           intersect: false
        },
        scales: {
          x: {
              beginAtZero: true,
              type: 'time',
              time: {
              parser: 'YYYY-MM-DD HH:mm',
              tooltipFormat: 'dd-MMM | HH:mm',
              unit: 'hour',
              unitStepSize: 1,
              displayFormats: {
                hour: 'dd-MMM | HH:mm',

              }
            }
          },
          y: {
            beginAtZero: true,
            scaleLabel: {
                display: true,
                labelString: 'Time'
            },
          },
        },
      },
    });


}


//request data from the combined link
function requestData(epochStart, epochEnd, metric, group) {
  return new Promise((resolve, reject) => {
    //ip

    console.log("in request: " +metric.value);
    const url = "http://" + ip + ":" + port + "/odata/api/groups?$top=20000&skip=0&top=20000&resolution=RATE&starttime=" + epochStart + "&endtime=" + epochEnd + "&$format=json&$expand=portmfs&$select=ID,Name,portmfs/Timestamp,portmfs/" + metric.value + "&$filter=((Name eq '" + group + "'))";


    fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      }
    })
    .then(response => response.json())
    .then(data => {
      //all results are
      // console.log(data);
      let array;
      try {
        array = data.d.results[0].portmfs.results;
        const sums = {};

        array.forEach(item => {

          const Timestamp = item.Timestamp;
          const metricValue = item[metric.value];

          if (!sums[Timestamp]) {
            sums[Timestamp] = parseFloat(metricValue);
          } else {
            sums[Timestamp] += parseFloat(metricValue);
          }
        });

        const result = Object.keys(sums).map(Timestamp => ({
          Timestamp,
          [metric.value]: sums[Timestamp]
        }));
        // console.log(result);
        resolve(result);
      } catch (e) {

        groupErrorMessageContainer.textContent = "Received empty data set. Group doesnt exist?";
        $("#tableBody tr").remove();
        reject(e);

      }

     // Resolve the promise with the result data
    })
    .catch(error => {
      reject(error); // Reject the promise with an error if fetch fails
    });
  });
}
// debug
console.log(currDateTime(0,0,0,0,0));
