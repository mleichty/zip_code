/*
 * Date: 1/29/2017
 * Name: main.js
 * Description: this is the javascript file for the application.
 */
var xmlHttp;  //xmlhttprequest object

//STEP 0: create an XMLHttpRequest object when the web page loads
window.onload = function () {
    xmlHttp = createXmlHttpRequestObject();
};



//STEP 1: this function creates a XMLHttpRequest object. It should work with most types of browsers.
function createXmlHttpRequestObject()
{
    // create a XMLHttpRequest object compatible to most browsers
    if (window.ActiveXObject) {
        return new ActiveXObject("Microsoft.XMLHTTP");
    } else if (window.XMLHttpRequest) {
        return new XMLHttpRequest();
    } else {
        alert("Error creating the XMLHttpRequest object.");
        return false;
    }

}

/******************************************************************************
 * Handle key press event.
 *****************************************************************************/
function handlekeyup(e) {
    //retreieve user input from the textbox
    var zipcode = trim(document.getElementById('zipcode').value);

    //clear all when the zip code box is empty.
    if (zipcode.length === 0) {
        error("");
        clear();
        return;
    }

    //if the zip code does not contain 5 digits, it is not a valid zip.
    if (!zipcode.match(/\b\d{5}\b/g)) {
        error("Zipcode not valid.");
        clear();
        return;
    }

    //if a number key or enter is pressed, call the process function
    var e = e || window.event; // get the event for different browsers
    var keycode = e.which || e.keyCode;
    if ((keycode >= 48 && keycode <= 57) || (keycode >= 96 && keycode <= 105) || keycode === 13) {
        process(zipcode);
    }
    return;
}

/*
 * This function makes asynchronous HTTP request using the XMLHttpRequest object.
 * It passes a zip code to a server-side script for processing.
 * This function is invoked by the handlekeyup function when a keystroke is detected.
 */
function process(zip) {
    //process ajax requests and handle server's responses

    //STEP 2: Define ajax requests. Use a query string to add user input to.
    xmlHttp.open("GET", "zip_lookup.php?zip=" + zip, true);

    //STEP 3: Define function that handles server responses
    //wont' get called until server's response is called back
    xmlHttp.onreadystatechange = function () {
        //STEP 5: Monitor request's progress
        //proceed only if the transaction has completed
        if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
            //retrieve the json document from the server's response
            var zipJSON = JSON.parse(xmlHttp.responseText);
            console.log(zipJSON);
            
            //handle errors if the zipcode does not exist
            if (zipJSON.hasOwnProperty('error') === true) {
                //call the clear function to clear 
                clear();
                //call the error function to show the error message if the zipcode does not exist
                error(zipJSON.error);
            } else {
                //call the display function with the parsed JSON zipcode as the parameter
                display(zipJSON);
                //clear the error message
                error("");
                
            }
        }
    };

    //STEP 4: make the request to the server
    xmlHttp.send(null);

}

/*
 * This function accepts a JSON object containing geographical information
 * and display it in an HTML table.
 */
function display(zip_result) {
    //add data point to inner html
    
    document.getElementById('state').innerHTML = zip_result.state;
    document.getElementById('county').innerHTML = zip_result.county;
    document.getElementById('city').innerHTML = zip_result.primary_city;
    document.getElementById('area-code').innerHTML = zip_result.area_code;
    document.getElementById('population').innerHTML = zip_result.irs_estimated_population;
    document.getElementById('time-zone').innerHTML = zip_result.timezone;
    document.getElementById('latitude').innerHTML = zip_result.latitude;
    document.getElementById('longitude').innerHTML = zip_result.longitude;
    
}

/*
 * This function clears the geographical information in the second column. 
 * This function is invoked by the handlekeyup function when the zip code 
 * a user has entered contains less than 5 digits or when the delete or backspace 
 * key is pressed.
 */
function clear() {
    //clear the geographical information in the HTML table
    //add blank strings that will be clear the table once function is called
    document.getElementById('state').innerHTML = "";
    document.getElementById('county').innerHTML = "";
    document.getElementById('city').innerHTML = "";
    document.getElementById('area-code').innerHTML = "";
    document.getElementById('population').innerHTML = "";
    document.getElementById('time-zone').innerHTML = "";
    document.getElementById('latitude').innerHTML = "";
    document.getElementById('longitude').innerHTML = "";
    
}

//This function displays an error message (the argument) in the div block whose id is "message". 
function error(err) {
    //add your code here to display "err" in a web element whose ID is "message".
    document.getElementById('message').innerHTML = err;
}

/* A home-made trim function that removes leading and
 * trailing white space characters from a string
 */
function trim(str) {
    return str.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
}