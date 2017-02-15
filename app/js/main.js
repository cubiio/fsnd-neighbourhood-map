/* jshint undef: true, unused: true */
/* globals ko, google, $ */

// use strict
'use strict';

// Model START
var locations = [
    {   
        name: "Olympia Stadium",
        position: {lat: 48.1731628, lng: 11.5444149},
        venueID: '4ade0d2bf964a520286b21e3'
    },
    {
        name: "Deutsches Museum",
        position: {lat: 48.1298317, lng: 11.583414},
        venueID: '4ade0cd7f964a520596921e3'
    },
    {
        name: "Marienplatz",
        position: {lat: 48.1373968, lng:11.5753117},
        venueID: '4ade0ccef964a520246921e3'
    },
    {
        name: "Weißes Bräuhaus",
        position: {lat: 48.1364643, lng: 11.578219},
        venueID: '4b44c33ef964a52078fb25e3'
    },
    {
        name: "Viktualienmarkt",
        position: {lat: 48.1351179, lng: 11.5761181},
        venueID: '4ade0d12f964a5209c6a21e3'
    },
    {
        name: "Residenz",
        position: {lat: 48.1418014, lng: 11.5793492},
        venueID: '4bbd0f9a593fef3b03040356'
    },
    {
        name: "Englischer Garten",
        position: {lat: 48.1642359, lng: 11.6054154},
        venueID: '4ade0cc6f964a520f86821e3'
    },
    {
        name: "Hofbräuhaus München",
        position: {lat: 48.1376134, lng: 11.5797885},
        venueID: '4ade0ca0f964a5202c6821e3'
    },
    {
        name: "Frauenkirche",
        position: {lat: 48.1386346, lng: 11.5734886},
        venueID: '51fdf87c498e22659ee3cf52'
    }

];
// Model END


// global var for initMap()
var map;

// Async callback to Google Maps API
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
}

// Constructor for each location i.e. venue displayed on the map
var Location = function(data) {
    this.name = ko.observable(data.name);
    this.position = ko.observable(data.position);
    this.venueID = ko.observable(data.venueID);
    this.marker = ko.observable('');
    this.infowindow = ko.observable('');
};

// helper function(s)

// config for location marker animation
function toggleBounce(marker) {
    if (marker.getAnimation() !== null) {
        marker.setAnimation(null);
    } else {
        marker.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(function() {
            marker.setAnimation(null);
        }, 2100);  // 3 bounces then stops
    }
}

// ViewModel START
var ViewModel = function() { 
    console.log('ViewModel invoked');

    var self = this;

    // config for FourSquare ajax request
    var fsqClient = '?client_id=';
    var fsqClientID = 'IUPLCEDVWLKOD5HK2MGBV2AX3LUXULEBJ3R5SBBHWNYLPM5T';
    var fsqClientSecret = '&client_secret=FHY1LCHZ0K5OG3WRPZHF4VRR4WFMH304FA2ICGTD4SENJRUR';
    var vParam = '&v=20170215';
    var mParam = '&m=foursquare';
    var fsqRequestTimeout = setTimeout(function(){
        console.log("Failed to get FourSquare info");
    }, 8000);

    // observable array for all 'attractions' i.e. items in locations object literal
    this.attractions = ko.observableArray();

    // Instantiate objects using the 'Location' Constructor i.e. 
    // creates each locationItem using the 'Location' Constructor
    locations.forEach(function(locationItem) {
        
        // creates an array with each 'locationItem'
        self.attractions.push(new Location(locationItem));

        // creates a location marker
        locationItem.marker = new google.maps.Marker({
            map: map,
            animation: google.maps.Animation.DROP,
            position: locationItem.position,
        });

        // FourSquare ajax request for venue info
        $.ajax({
            url: 'https://api.foursquare.com/v2/venues/' + locationItem.venueID + fsqClient + fsqClientID + fsqClientSecret + vParam + mParam,
            data: {
                // insert data requirements here
            },
            dataType: "json",
            success: function (data) {
                // console.log('successfully called foursquare ajax func');
                console.log(data);
                clearTimeout(fsqRequestTimeout);

                // helpers: shortener and confirm valid json responses
                var venueInfo = data.response.venue;

                var openStatus = venueInfo.hasOwnProperty("hours") ? venueInfo.hours : "";
                if (openStatus !=  "") {
                  openStatus = venueInfo.hours.status;
                } else {
                  openStatus = "Foursquare has no info at present";
                }

                var address = venueInfo.location.hasOwnProperty("formattedAddress") ? venueInfo.location.formattedAddress : "";
                if (address != "") {
                    address = venueInfo.location.formattedAddress;
                } else {
                    address = "Foursquare has not info at present";
                }

                var rating = venueInfo.hasOwnProperty("rating") ? venueInfo.rating : "";
                if (rating != "") {
                    rating = venueInfo.rating + ' / 10';
                } else {
                    rating = "n/a"
                }

                var tips = venueInfo.tips.hasOwnProperty("groups") ? venueInfo.tips.groups : "";
                if (tips != "") {
                    tips = venueInfo.tips.groups[0].items[0].text;
                } else {
                    tips = "No tip available at present";
                }

                // var fsqUrl = venueInfo.hasOwnProperty("canonicalUrl") ? venueInfo.canonicalUrl : "";
                // if (fsqUrl != "") {
                //     fsqUrl = venueInfo.canonicalUrl;
                // } else {
                //     fsqUrl = ""
                // }

                // content for the infowindow
                locationItem.contentString = '<div class="infowindow">' +
                    '<h2>' + locationItem.name + '</h2>' +
                    // '<p>Description: ' + locationItem.description + '</p>' +
                    '<p>Opening hours: ' + openStatus + '</p>' +
                    '<p>Location: ' + address + '</p>' +
                    '<p>Rating: ' + rating + '</p>' +
                    '<p>Best Tip: ' + tips + '</p>' +
                    '<p>More venue <a href="' + venueInfo.canonicalUrl + '?ref=' + fsqClientID + '" target="_blank">info</a></p>' +
                    '<p>Information powered by Foursquare</p>' +
                    '</div>';

                // config for the infowindow
                locationItem.infowindow = new google.maps.InfoWindow({
                    content: locationItem.contentString,
                    // content: self.buildInfoWindow(),
                    maxWidth: 300
                });
            }  //, 
            // error: // TODO add error handling for ajax request
        });

        // listens for clicks on the marker and then executes... 
        locationItem.marker.addListener('click', function() {
            console.log('marker clicked!');
            // console.log(this);
            toggleBounce(this);
            locationItem.infowindow.open(map, locationItem.marker);
        });
    });
    // console.log(this.attractions());

    // Used to toggle CSS class '.open' - false means '.open'
    // is not applied to the menu element. 
    this.toggleDrawer = ko.observable(false);

    // Sets CSS class '.open' to true if false and vice versa.
    this.openDrawer = function() {
        // console.log("hamburgers!");
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
};
