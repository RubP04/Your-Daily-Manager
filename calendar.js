var month_indicator = 0
var clicked_flag = null
var events = localStorage.getItem('events') ? JSON.parse(localStorage.getItem('events')) : []
const calendar = document.getElementById('calendar')
const weekdays = docutment.getElementById('weekdays')

function reload()
{
    console.log("Hello WOrld!")
    const curr_date = new Date()
    const curr_day = curr_date.getDay
    const curr_month = curr_date.getMonth
    const curr_year = curr_date.getFullYear
    const month_days = new Date(year, month + 1, 0).getDate()
    const first_day = new Date(year, month, 1)
    const date_string = first_day.toLocaleDateString('en-us', {
        day: 'numeric',
        weekday: 'long',
        month: 'numeric',
        year: 'numeric'
    })
    console.log(date_string)
}

reload()