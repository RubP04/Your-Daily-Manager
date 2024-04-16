//Register function that handles new users.
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
        alert("Error! Password must at least contain: 8 characters, 1 uppercase, 1 symbol!")
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
        //Waits for the user to be created in Firebase before proceeding.
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
            //Waits for the date to be set in the database before switching HTML page.
            .then(function() {
                alert("Account Successfully Created!")
                window.location.href = "calendar.html"
            })
        })
        //Handles any potential database errors and displays them.
        .catch(function(error)
        {
            var error_code = error.code
            var error_msg = error.message 
            alert(error_msg)
        })
    }
    
}

//Login function handles the authentication process of returning users.
function login()
{
    const email = document.getElementById('email').value
    const password = document.getElementById('password').value

    //If the email or password are incorrectly formatted, alets the user and prompts the user to try again.
    if(email_validation(email) == false || password_validation(password) == false)
    {
        alert("Incorrect email or password. Please try again.")
        return
    }

    //If the user is successfully authenticated, the page is switched, otherwise an error is shown.
    auth.signInWithEmailAndPassword(email, password)
    //Waits for the authentication process to finish before proceeding to the next page.
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
    const strong_password = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    return strong_password.test(password)
}

//Validates name by checking if its empty
function name_validation(name)
{
    //Cuts off leading or trailing whitespaces.
    return name.trim().length > 0
}