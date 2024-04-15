var month_indicator = 0
var clicked_flag = null
var events = []
const calendar = document.getElementById('calendar')
const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const modal = document.getElementById('modal')
const new_event = document.getElementById('new_event')
const delete_event = document.getElementById('delete_event')
const event_title = document.getElementById('event_title')
var event_id 
var event_date
created_events ={}

function open_modal(date)
{
    clicked_flag = date
    const event = events.find(e=>e.date == clicked_flag)

    if(event)
    {
        document.getElementById('event_text').innerText = event.title
        delete_event.style.display = 'block'
    }
    else
    {
        new_event.style.display = 'block'
    }

    modal.style.display = 'block'
}

function reload()
{
    var valid_user = auth.currentUser
    var user_id = valid_user.uid
    const curr_date = new Date()

    if(month_indicator != 0)
    {
        curr_date.setMonth(new Date().getMonth() + month_indicator)
    }

    // Create a reference to the user's events in the database
    var events_ref = database.ref('users/' + user_id + '/events');

    // Fetch the events data from the database
    events_ref.once('value', function(snapshot) {
        events = []; // Clear the events array
        snapshot.forEach(function(childSnapshot) {
            var event = childSnapshot.val();
            var event_id = childSnapshot.key;
            events.push(event); // Add each event to the events array
            created_events[user_id + '-' + event.date] = event_id;
        });

        const curr_day = curr_date.getDate()
        const curr_month = curr_date.getMonth()
        const curr_year = curr_date.getFullYear()
        const month_days = new Date(curr_year, curr_month + 1, 0).getDate()
        const first_day = new Date(curr_year, curr_month, 1)
        const date_string = first_day.toLocaleDateString('en-us', {
            day: 'numeric',
            weekday: 'long',
            month: 'numeric',
            year: 'numeric'
        })
        const padding = weekdays.indexOf(date_string.split(', ')[0])

        document.getElementById('display_month').innerText = `${curr_date.toLocaleDateString('en-us', {month: 'long' })} ${curr_year}`;
        calendar.innerHTML = ''

        for(var i = 1; i <= padding + month_days; i++)
        {
            const day_square = document.createElement('div')
            day_square.classList.add('day')
            const day_string = `${curr_month + 1}/${i - padding}/${curr_year}`

            if(i > padding)
            {
                day_square.innerText = i - padding
                const event = events.find(e => e.date == day_string)

                if(i - padding == curr_day && month_indicator == 0)
                {
                    day_square.id = 'current_day'
                    console.log("Current day ID set:", day_square.id);
                }
                if(event)
                {
                    const event_div = document.createElement('div')
                    event_div.classList.add('event')
                    event_div.innerText = event.title
                    day_square.appendChild(event_div)
                }

                day_square.addEventListener('click', ()=> open_modal(day_string))
            }
            else
            {
                day_square.classList.add('padding')
            }

            calendar.appendChild(day_square)
        }
    })
}

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

function save_modal()
{
    if(event_title.value)
    {
        var valid_user = auth.currentUser
        var user_id = valid_user.uid

        // Create a reference to the user's events in the database
        var events_ref = database.ref('users/' + user_id + '/events')
        
        // Add the event data to the database
        events_ref.push({
            date: clicked_flag,
            title: event_title.value
        }) .then((snapshot) => {
            close_modal();
        })
    }
    else
    {
        event_title.classList.add('error')
    }
}

function delete_modal()
{
    var valid_user = auth.currentUser;
    var user_id = valid_user.uid;

    if (clicked_flag) {
        // Get a reference to the event in the database
        const event_ref = database.ref('users/' + user_id + '/events/' + created_events[user_id + '-' + clicked_flag]);
        console.log(created_events[clicked_flag])

        // Delete the event from the database
        event_ref.remove()
            .then(() => {
                // Event deleted successfully
                close_modal();
            })
            .catch((error) => {
                // An error occurred while deleting the event
                console.error("Error deleting event:", error);
            });
    } else {
        console.error("No event selected to delete.");
    }
}

function buttons_clicked()
{
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

function timer()
{
    window.location.href = "timer.html"
}

function logout()
{
    auth.signOut().then(function() {
        // Sign-out successful.
        // Redirect or perform any other necessary actions after logout
        console.log("User signed out successfully");
        window.location.href = "index.html"
    }).catch(function(error) {
        // An error happened.
        console.error("Error signing out:", error);
    });
}

buttons_clicked()
auth.onAuthStateChanged(function(user) {
    if (user) {
        reload();
    }
});