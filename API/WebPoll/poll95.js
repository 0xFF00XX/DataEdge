
//flat picker configs
const config = {
  enableTime: true,
  time_24hr : true,
  // maxDate: "today",
  defaultDate: currDateTime(),
  maxDate: currDateTime(),
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
  defaultDate: currDateTime(),
  maxDate: currDateTime(),
  dateFormat: "d-m-Y H:i",
  altInput: true,
  altFormat: "F j, Y @ H:i",
  minuteIncrement: 1,
  onChange: function(selectedDates, dateStr, instance){
      endFlatPicker.set("minDate", dateStr);

  // Constrain the maxDate of the start date picker to today's date
      startFlatPicker.set("maxDate", currDateTime());
  },
  });




function currDateTime(){
  var now = new Date();
  var currentYear = now.getFullYear();
  var currentMonth = now.getMonth();
  var currentDay = now.getDate();
  var currentHour = now.getHours();
  var currentMinute = now.getMinutes();
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
  if (selector.value === 'Custom') {
    flatTimes.style.display = "block"; // Show time pickers
  } else {
    flatTimes.style.display = "none"; // Hide time pickers
  }
});



document.getElementById("submitForm").addEventListener("submit", function(event) {
  event.preventDefault(); // Prevent the default form submission

  const startEpoch = (new Date(startFlatPicker.selectedDates).getTime())/1000;
  const endEpoch = (new Date(endFlatPicker.selectedDates).getTime())/1000;

  graph(startEpoch, endEpoch, "max_im_BitsIn", "BIP")
  console.log(startEpoch);

});

function graph(epochStart, epochEnd, metric, group){

}
function requestData(epochStart, epochEnd, metric, group){
  
}
// debug
console.log(currDateTime());
