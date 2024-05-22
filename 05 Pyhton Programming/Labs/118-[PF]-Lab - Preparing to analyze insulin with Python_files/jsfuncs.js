/*
This file to be included in every document via navbar and accesible in every page.
Do not include onclick/event handlers here, only functions.
*/


/*
==============================================================================
Adds a parameter to the URL without reloading the page. Useful for creating shareable links i.e. for dashboards.
------------------------------------------------------------------------------ 
Input Variables:
    - key: (string) the query  
    - value: (string) the query parameter
Output:
    - none
Notes:
    This affects the browser history state, and will create a new entry.
==============================================================================
*/
function insertUrlParam(key, value) {
    let currentUrl = new URL(window.location.href);
    currentUrl.searchParams.set(key, value);
    // Set the new URL in the browser without reloading the page.
    window.history.replaceState({}, document.title, currentUrl.toString());
}

/*
==============================================================================
Removes multiple parameters from the URL without reloading the page. Useful for creating shareable links i.e. for dashboards.
------------------------------------------------------------------------------ 
Input Variables:
    - key: ( [strings], or "string") the queries
Output:
    - true/false if query exists (and thus, removed)
Notes:
    This affects the browser history state, and will create a new entry.
==============================================================================
*/
function removeUrlParam(keys) {
    let currentUrl = new URL(window.location.href);
    //convert to array if single value passed
    if (!Array.isArray(keys)) {
        keys = [keys];
    }
    for (const key of keys) {
        currentUrl.searchParams.delete(key);
    }
    // Set the new URL in the browser without reloading the page.
    window.history.replaceState({}, document.title, currentUrl.toString());
}


/*
==============================================================================
Get value of a query parameter from url.
------------------------------------------------------------------------------ 
Input Variables:
    - key: (string) the query param
Output:
    - the value if found, else null
==============================================================================
*/
function getUrlParam(key) {
    const urlParams = new URLSearchParams(window.location.search);
    let value = urlParams.get(key);
    return value;
}