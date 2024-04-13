//Variables containing the HTML elements.
var mins_element = document.querySelector('#minutes')
var secs_element = document.querySelector('#seconds')
var millisecs_element = document.querySelector('#milliseconds')
var start_but = document.querySelector('#start')
var stop_but = document.querySelector('#stop')
var reset_but = document.querySelector('#reset')
//Variables to represent time values.
var minutes = 0
var seconds = 0
var milliseconds = 0
var timerInterval
//Event listeners for stopwatch buttons.
start_but.addEventListener('click', start)
stop_but.addEventListener('click', stop)
reset_but.addEventListener('click', reset)

//Strart function that handles the start function of the stopwatch.
function start()
{
    //Ensures that the time associated with the stopwatch is initially zero.
    clearInterval(timerInterval)
    //Begins the stopwatch timer through interval function.
    timerInterval = setInterval(function() {
        milliseconds++
        //If time threshhold is passed, appropriate time value is updated accordingly.
        if(milliseconds >= 100)
        {
            milliseconds = 0
            seconds++
        }
        if(seconds >= 60)
        {
            seconds = 0
            minutes++
        }
        if(minutes >= 99)
        {
            stop()
        }
        update()
    }, 10); //Interval set to 10 milliseconds for milliseconds precision
}

//Stop function that essentially pauses the timer.
function stop()
{
    clearInterval(timerInterval)
}

//Reset function that clears the timer and resets all the time-associated variables to zero.
function reset()
{
    clearInterval(timerInterval)
    minutes = 0
    seconds = 0
    milliseconds = 0
    update()
}

//Update function that ensures the timer is diplaying the appropriately formatted time.
function update()
{
    //These ternary operators + vars ensure that the time shows abides to common timing format principles.
    var padded_mins = (minutes < 10 ? '0' : '') + minutes
    var padded_secs = (seconds < 10 ? '0' : '') + seconds
    var padded_millisecs = (milliseconds < 10 ? '0' : '') + milliseconds
    mins_element.textContent = padded_mins
    secs_element.textContent = padded_secs
    millisecs_element.textContent = padded_millisecs
}

function back()
{
    window.location.href = "calendar.html"
}
