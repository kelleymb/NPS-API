'use strict';

const apiKey = '71HJgdC6d35RrzSb0op2eXaFYuFvWRCohCG1NoAw';
const searchUrl = 'https://developer.nps.gov/api/v1/parks';

//.map() - generate 'key: value' array using this method
//encodeURIComponent()-converts string to URL safe format, connects key:value pair
//join each array item with '&'
function formatQueryParams(params) {
    const queryItems = Object.keys(params)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
        return queryItems.join('&');
}

//clear search results on DOM, if any
//iterate through search results
//append search results to DOM to include: park name, description, url
function displayResults(responseJson) {
    console.log(responseJson);
    $('.list-results').empty();
    for (let i=0; i<responseJson.data.length; i++) {
        $('.list-results').append(`
        <li><a href="${responseJson.data[i].url}" target="_blank"><h3>${responseJson.data[i].fullName}</h3></a></li>
        <p>${responseJson.data[i].description}</p>
        `);
    }
    if (responseJson.total === '0') {
        $('.user-error').text('Oops! Please search by state abbreviation.');
        return;
    }
}

//define parameters as described by NPS API
//make a call to the NPS API to retrieve data from user input
//format response into JSON format
//if any errors, display on DOM
function getSearchResults(query, limit = 10) {
    
    const params = {
        api_key: apiKey,
        stateCode: query,
        limit,
    };

    // const options = {
    //     headers: new Headers({
    //         "X-Api-Key": apiKey})
    // };

    const queryString = formatQueryParams(params);
    const url = searchUrl + '?' + queryString;

    console.log(url);

    fetch(url)
        .then(response => {
            if (response.ok) {
                return response.json()
            }
            throw new Error (response.statusText);
        })
        .then(responseJson => displayResults(responseJson))
        .catch(error => {
            $('.js-error-message').text(`Oops! Something went wrong: ${error.message}`);
        });
    }


//watch search form for user input
//prevent default behavior on user click
function formSubmit() {
    $('form').submit(event => {
        event.preventDefault();
        const userInput = $('#state').val().replace(/\s/g, "");
        const maxResults = $('#max-results').val();
        getSearchResults(userInput, maxResults);
    });
}

$(formSubmit);