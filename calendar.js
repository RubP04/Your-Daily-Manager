var month_indicator = 0
var clicked_flag = null
var events = localStorage.getItem('events') ? JSON.parse(localStorage.getItem('events')) : []
const calendar = document.getElementById('calendar')
const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

function reload()
{
    const curr_date = new Date()
    const curr_day = curr_date.getDay()
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

    document.getElementById('display_month').innerText = `${curr_date.toLocaleDateString('en-us', { month: 'long' })} ${curr_year}`;

    for(var i = 1; i <= padding + month_days; i++)
    {
        const day_square = document.createElement('div')
        day_square.classList.add('day')

        if(i > padding)
        {
            day_square.innerText = i - padding
            day_square.addEventListener('click', ()=> console.log('click'))
        }
        else
        {
            day_square.classList.add('padding')
        }

        calendar.appendChild(day_square)
    }
}

function timer()
{
    window.location.href = "timer.html"
}

reload()