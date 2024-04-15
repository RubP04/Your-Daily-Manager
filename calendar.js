//Variables for application logic.
var month_indicator = 0
var clicked_flag = null
var events = []
//Variables to store date and event logic.
const calendar = document.getElementById('calendar')
const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const modal = document.getElementById('modal')
const new_event = document.getElementById('new_event')
const delete_event = document.getElementById('delete_event')
const event_title = document.getElementById('event_title')
//Variables used to store user-created event information.
var event_id 
var event_date
//Dictionary to store all the user-created events with their respective Firebase identification key.
created_events ={}

//Open_modal function handles the displaying of appropriate windows in the UI.
function open_modal(date)
{
    //Variables to store the date/event of the clicked square.
    clicked_flag = date
    const event = events.find(e=>e.date == clicked_flag)

    //If the day that is clicked has an associated event, then the delete modal is displayed.
    if(event)
    {
        document.getElementById('event_text').innerText = event.title
        delete_event.style.display = 'block'
    }
    //Otherwise, if there is no event for the day, the new event modal is displayed.
    else
    {
        new_event.style.display = 'block'
    }

    modal.style.display = 'block'
}

//Reload function handles the calendar logic and the display of user-created events.
function reload()
{
    //Firebase user variables.
    var valid_user = auth.currentUser
    var user_id = valid_user.uid
    const curr_date = new Date()

    //If the month indicator is not 0, we are in a differnet month and should populate the calendar accordingly.
    if(month_indicator != 0)
    {
        curr_date.setMonth(new Date().getMonth() + month_indicator)
    }

    //Create a reference to the user's events in the database
    var events_ref = database.ref('users/' + user_id + '/events');

    //Fetch the events data from the database
    events_ref.once('value', function(snapshot) {
        events = [];
        //Captures each created events ID and date, pushes them onto the database and inside the dictionary.
        snapshot.forEach(function(childSnapshot) {
            var event = childSnapshot.val();
            var event_id = childSnapshot.key;
            events.push(event);
            created_events[user_id + '-' + event.date] = event_id;
        });

        //Variables used to determine the date.
        const curr_day = curr_date.getDate()
        const curr_month = curr_date.getMonth()
        const curr_year = curr_date.getFullYear()
        //These will accurately retrieve the number of days for a given month and the current day.
        const month_days = new Date(curr_year, curr_month + 1, 0).getDate()
        const first_day = new Date(curr_year, curr_month, 1)
        //Formats the date.
        const date_string = first_day.toLocaleDateString('en-us', {
            day: 'numeric',
            weekday: 'long',
            month: 'numeric',
            year: 'numeric'
        })
        //Calculates number of padding days required(days that belong to a next/previous month).
        const padding = weekdays.indexOf(date_string.split(', ')[0])

        //Formats the display month in 'Month Year' format.
        document.getElementById('display_month').innerText = `${curr_date.toLocaleDateString('en-us', {month: 'long' })} ${curr_year}`;
        calendar.innerHTML = ''

        //Forloop that iterates all the days in a month.
        for(var i = 1; i <= padding + month_days; i++)
        {
            //Creates the day sqaures visuals.
            const day_square = document.createElement('div')
            day_square.classList.add('day')
            const day_string = `${curr_month + 1}/${i - padding}/${curr_year}`

            //If our day is not a padding day, we must populate it accordingly.
            if(i > padding)
            {
                day_square.innerText = i - padding
                const event = events.find(e => e.date == day_string)

                //Highlights the current day.
                if(i - padding == curr_day && month_indicator == 0)
                {
                    day_square.id = 'current_day'
                }
                //Displays events for assosciated days.
                if(event)
                {
                    const event_div = document.createElement('div')
                    event_div.classList.add('event')
                    event_div.innerText = event.title
                    day_square.appendChild(event_div)
                }

                //Event listener for all the days.
                day_square.addEventListener('click', ()=> open_modal(day_string))
            }
            //Padding day.
            else
            {
                day_square.classList.add('padding')
            }

            //Days are added to the calendar.
            calendar.appendChild(day_square)
        }
    })
}

//Close_modal handles the functionality of clearing the display by closing modals.
function close_modal()
{
    event_title.classList.remove('error')
    new_event.style.display = 'none'
    delete_event.style.display = 'none'
    modal.style.display = 'none'
    event_title.value = ''
    clicked_flag = null
    reload()
}

//Save_modal function handles the functionality of adding an event to the Firebase database.
function save_modal()
{
    //Function runs as long as the event title input box is not empty.
    if(event_title.value)
    {
        //Firebase user authentication.
        var valid_user = auth.currentUser
        var user_id = valid_user.uid
        //Reference to the authenticated users events.
        var events_ref = database.ref('users/' + user_id + '/events')
        
        //Adds the event to the Firebase database with event date and name.
        events_ref.push({
            date: clicked_flag,
            title: event_title.value
        //Waits for the event to be added before closing the modal window.
        }) .then((snapshot) => {
            close_modal();
        })
    }
    else
    {
        event_title.classList.add('error')
    }
}

//Delete_modal function handles the deletion of events from the Firebase database.
function delete_modal()
{
    //Firebase user authentication.
    var valid_user = auth.currentUser;
    var user_id = valid_user.uid;

    //If a sqaure is clicked, the date associated with the sqaure is retrieved and used to acess the event for that day.
    if (clicked_flag) 
    {
        const event_ref = database.ref('users/' + user_id + '/events/' + created_events[user_id + '-' + clicked_flag]);

        //This handles event deletion from the Firebase database.
        event_ref.remove()
            .then(() => {
                close_modal();
            })
            .catch((error) => {
                console.error("Error deleting event:", error);
            });
    } 
    else 
    {
        console.error("No event selected to delete.");
    }
}

//This function handles the addition of event listeners for all of the interface's buttons.
function buttons_clicked()
{
    //When certain buttons are clicked, they execute their expected respective functionality.
    document.getElementById('next').addEventListener('click', ()=> {
        month_indicator++
        reload()
    })
    document.getElementById('back').addEventListener('click', ()=> {
        month_indicator--
        reload()
    })
    document.getElementById('cancel').addEventListener('click', close_modal)
    document.getElementById('save').addEventListener('click', save_modal)
    document.getElementById('cancel_delete').addEventListener('click', close_modal)
    document.getElementById('confirm_delete').addEventListener('click', delete_modal)
}

//Function that handles timer button functionality. It switches the HTML page when clicked.
function timer()
{
    window.location.href = "timer.html"
}

//Logout function that handles exit functionality. Function will wait for the user to be signed out on Firebase and will then switch the HTML page.
function logout()
{
    //Waits for successful sign out.
    auth.signOut().then(function() {
        //Successful sign out.
        alert("Signed out successfully!");
        window.location.href = "index.html"
    }).catch(function(error) {
        //Error during sign out.
        console.error("Error signing out:", error);
    });
}

//Necessary functions are called. The reload functions is called once Firebase has finished authenticating the user.
buttons_clicked()
auth.onAuthStateChanged(function(user) {
    if (user) {
        reload();
    }
});