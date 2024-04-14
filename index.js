//Firebase Configuration Information
const firebaseConfig = {
    apiKey: "AIzaSyDwMJ7P-M6V0G9WuNAF-wi2kqC_hYfQU7A",
    authDomain: "your-daily-manager.firebaseapp.com",
    databaseURL: "https://your-daily-manager-default-rtdb.firebaseio.com",
    projectId: "your-daily-manager",
    storageBucket: "your-daily-manager.appspot.com",
    messagingSenderId: "1005772940945",
    appId: "1:1005772940945:web:5eae59eeb55036865b0130",
    measurementId: "G-DVZGNW7B05"
  };

//Firebase Initilization
firebase.initializeApp(firebaseConfig);

//Firebase Variables for Firebase Funcitons
const auth = firebase.auth()
const database = firebase.database()

//Register Function (Handles New Users)
function register()
{
    const full_name = document.getElementById('full_name').value
    const email = document.getElementById('email').value
    const password = document.getElementById('password').value

    //If any of the input fields are invalid, function returns and error is shown. Otherwise, the user is added to the database.
    if(email_validation(email) == false)
    {
        alert("Error! Email address is invalid!")
        return
    }
    else if(password_validation(password) == false)
    {
        alert("Error! Password must be 8 characters long with at least one uppercase/lowercase and a symbol.")
        return
    }
    else if(name_validation(full_name) == false)
    {
        alert("Error! You must enter a name!")
        return
    }
    else
    {
        //If the user is succesfully created in Firebase, the 'then' clause executes, otherwise an error is shown.
        auth.createUserWithEmailAndPassword(email, password)
        .then(function()
        {
            //User variables
            var valid_user = auth.currentUser
            var database_ref = database.ref()
            var data =
            {
                full_name : full_name,
                email : email
            }

            //User is added to the realtime database. Set is an asynchronous function so a .then is used to ensure the function executes before page switch.
            database_ref.child('users/' + valid_user.uid).set(data)
            .then(function() {
                alert("Account Successfully Created!")
                window.location.href = "calendar.html"
            })
        })
        .catch(function(error)
        {
            var error_code = error.code
            var error_msg = error.message 
            alert(error_msg)
        })
    }
    
}

//Login functions handles the authentication process of returning users.
function login()
{
    const email = document.getElementById('email').value
    const password = document.getElementById('password').value

    if(email_validation(email) == false || password_validation(password) == false)
    {
        alert("Incorrect email or password. Please try again.")
        return
    }

    //If the user is successfully authenticated, the page is switched, otherwise an error is shown.
    auth.signInWithEmailAndPassword(email, password)
    .then(function()
        {
            alert("Successfully logged in!")
            window.location.href = "calendar.html"
        })
        .catch(function(error)
        {
            var error_code = error.code
            var error_msg = error.message 
            alert(error_msg)
        })
}

//Validates email using regular expression pattern
function email_validation(email)
{
    //Basic email format
    const checker = /^[^@]+@\w+(\.\w+)+\w$/
    return checker.test(email)
}

//Validates password using regular expression pattern
function password_validation(password)
{
    //Strong password format
    const strongPasswordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    return strongPasswordPattern.test(password)
}

//Validates name by checking if its empty
function name_validation(name)
{
    return name.trim().length > 0
}