/* jshint undef: true, unused: true */
/* globals ko */

// use strict
'use strict';

// Model:
var locations = [
    {   
        name: "Olympia Stadium",
        position: {lat: 48.1731628, lng: 11.5444149}
    },
    {
        name: "Deutsches Museum",
        position: {lat: 48.1298317, lng: 11.583414}
    },
    {
        name: "Marienplatz",
        position: {lat: 48.1373968, lng:11.5753117}
    },
    {
        name: "Frauenkirche",
        position: {lat: 48.1386346, lng: 11.5734886}
    },
    {
        name: "Viktualienmarkt",
        position: {lat: 48.1351179, lng: 11.5761181}
    },
    {
        name: "Residenz",
        position: {lat: 48.1418014, lng: 11.5793492}
    },
    {
        name: "Englischer Garten",
        position: {lat: 48.1642359, lng: 11.6054154}
    },
    {
        name: "Hofbräuhaus München",
        position: {lat: 48.1376134, lng: 11.5797885}
    }
];

// global var for initMap()
var map;

// Async callback loads Google Map
function initMap() {
    console.log('initMap invoked');
    var munich = { 
        // lat: 48.1295417,
        // lng: 11.5938205
        lat: 48.1499011,
        lng: 11.5497244
    };

    map = new google.maps.Map(document.getElementById('js_map'), {
        zoom: 13,
        center: munich
    });
};

// Constructor 
var Location = function(data) {
    this.name = data.name;
    this.marker = new google.maps.Marker({
        map: map,
        animation: google.maps.Animation.DROP,
        position: data.position,
    });
    this.marker.addListener('click', function() {
        console.log('marker clicked!');
        console.log(this);
        toggleBounce(this);
    });
};

// helpers
function toggleBounce(marker) {
    if (marker.getAnimation() !== null) {
        marker.setAnimation(null);
    } else {
        marker.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(function() {
            marker.setAnimation(null);
        }, 2100);  // 3 bounces then stops
    }
};

var ViewModel = function() { 
    console.log('ViewModel invoked');

    var self = this;

    // observable array for all 'attractions' i.e. items in locations object literal
    this.attractions = ko.observableArray();

    // Push each locationItem via the Constructor, this creates the markers
    locations.forEach(function(locationItem) {
        self.attractions.push(new Location(locationItem));
    });
    console.log(this.attractions());


    /////////////////////////
    // responsive menu / list

    // Used to toggle CSS class '.open' - false means '.open'
    // is not applied to the nav element. 
    this.toggleDrawer = ko.observable(false);

    // Sets CSS class '.open' to true if false and vice versa.
    this.openDrawer = function() {
        console.log("hamburgers!")
        self.toggleDrawer( !self.toggleDrawer() );
    };

};


// Maps API callback is to initApp
// This function controls execution of the app
var initApp = function() {
    initMap();
    ko.applyBindings(new ViewModel());
    // vm = new ViewModel();
    // ko.applyBindings(vm);
}
