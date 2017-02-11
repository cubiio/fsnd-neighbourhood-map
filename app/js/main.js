/* jshint undef: true, unused: true */
/* globals ko */

// use strict
'use strict';

var locations = [
    {
        name: "Olympia Stadium",
        lat: 48.1731628,
        lng: 11.5444149
    }
];


// Async callback loads Google Map
function initMap() {
    var munich = { 
        lat: 48.1295417,
        lng: 11.5938205
    };

    var map = new google.maps.Map(document.getElementById('js_map'), {
        zoom: 12,
        center: munich
    });

    var olympiaLocation = {
        lat: 48.1731628,
        lng: 11.5444149
    };

    location.marker = new google.maps.Marker({
        // position: olympiaLocation,
        position: {lat: locations.lat, lng: locations.lng},
        map: map
    });
    
    // var olympiaStadium = new google.maps.Marker({
    //     position: olympiaLocation,
    //     map: map
    // });
};

// var ViewModel = function() { };



// }


// var vm = new ViewModel();

// Maps API callback is to initApp
// This function controls execution of the app
var initApp = function() {
    // ko.applyBindings(vm);
    initMap();    
}
