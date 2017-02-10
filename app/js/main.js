/* jshint undef: true, unused: true */
/* globals ko */

// use strict
'use strict';

// Async callback loads Google Map
function initMap() {
    var munich = { 
        lat: 48.1295417,
        lng: 11.5938205
    };

    var deutschesMuseumLocation = {
        lat: 48.1298317,
        lng: 11.583414
    };

    var olympiaLocation = {
        lat: 48.1731628,
        lng: 11.5444149
    };
    
    var map = new google.maps.Map(document.getElementById('js_map'), {
        zoom: 12,
        center: munich
    });
    
    // var marker = new google.maps.Marker({
    //     position: munich,
    //     map: map
    // });

    var deutschesMuseum = new google.maps.Marker({
        position: deutschesMuseumLocation,
        map: map
    });

    var olympiaStadium = new google.maps.Marker({
        position: olympiaLocation,
        map: map
    });
}
