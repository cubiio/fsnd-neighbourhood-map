/* jshint undef: true, unused: true */
/* globals ko, google, $ */

// use strict
'use strict';

// Model START
var locations = [
    {   
        name: 'Olympia Stadium',
        position: {lat: 48.1731628, lng: 11.5444149},
        venueID: '4ade0d2bf964a520286b21e3'
    },
    {
        name: 'Deutsches Museum',
        position: {lat: 48.1298317, lng: 11.583414},
        venueID: '4ade0cd7f964a520596921e3'
    },
    {
        name: 'Marienplatz',
        position: {lat: 48.1373968, lng:11.5753117},
        venueID: '4ade0ccef964a520246921e3'
    },
    {
        name: 'Weißes Bräuhaus',
        position: {lat: 48.1364643, lng: 11.578219},
        venueID: '4b44c33ef964a52078fb25e3'
    },
    {
        name: 'Viktualienmarkt',
        position: {lat: 48.1351179, lng: 11.5761181},
        venueID: '4ade0d12f964a5209c6a21e3'
    },
    {
        name: 'Residenz',
        position: {lat: 48.1418014, lng: 11.5793492},
        venueID: '4bbd0f9a593fef3b03040356'
    },
    {
        name: 'Englischer Garten',
        position: {lat: 48.1642359, lng: 11.6054154},
        venueID: '4ade0cc6f964a520f86821e3'
    },
    {
        name: 'Hofbräuhaus München',
        position: {lat: 48.1376134, lng: 11.5797885},
        venueID: '4ade0ca0f964a5202c6821e3'
    },
    {
        name: 'Der Pschorr',
        position: {lat: 48.1347421, lng: 11.5750694},
        venueID: '4b335a36f964a520d51825e3'
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
    // this.name = ko.observable(data.name);
    // this.position = ko.observable(data.position);
    // this.venueID = ko.observable(data.venueID);
    this.name = data.name;
    this.position = data.position;
    this.venueID = data.venueID;
    this.marker = null;
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

// alerts the user if Google Maps fails to load
function googleError() {
    // console.log('googleError invoked')
    alert('Google Maps has failed to load. Please check your internet connection or try again later.');
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
        // console.log("Failed to get FourSquare info");
        document.getElementById('js_foursquareError').innerHTML += 'Failed to get ' + 
        'venue information from Foursquare. Please check your internet connection, or try again later.';
    }, 8000);

    // standard array to render markers and for Foursquare ajax request
    self.attractions = [];

    // Instantiate objects using the 'Location' Constructor i.e. 
    // creates each locationItem using the 'Location' Constructor
    locations.forEach(function(locationItem) {    
        self.attractions.push(new Location(locationItem));
    });

    // creates location markers for each object in the attractions array
    self.attractions.forEach(function(locationItem) {
        
        locationItem.marker = new google.maps.Marker({
            map: map,
            animation: google.maps.Animation.DROP,
            position: locationItem.position,
        });

        // FourSquare ajax request for venue info
        $.ajax({
            url: 'https://api.foursquare.com/v2/venues/' + locationItem.venueID + fsqClient + fsqClientID + fsqClientSecret + vParam + mParam,
            dataType: "json",
            success: function (data) {
                // console.log('successfully called foursquare ajax func');
                // console.log(data);
                clearTimeout(fsqRequestTimeout);

                // helpers: shortener and confirm valid json responses
                var venueInfo = data.response.venue;

                var description = venueInfo.hasOwnProperty("description") ? venueInfo.description : "";
                if (description != "") {
                    description = venueInfo.description;
                } else {
                    description = "";
                }

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
                    address = "Foursquare has no info at present";
                }

                var rating = venueInfo.hasOwnProperty("rating") ? venueInfo.rating : "";
                if (rating != "") {
                    rating = venueInfo.rating + ' / 10';
                } else {
                    rating = "n/a";
                }

                var tips = venueInfo.tips.hasOwnProperty("groups") ? venueInfo.tips.groups : "";
                if (tips != "") {
                    tips = venueInfo.tips.groups[0].items[0].text;
                } else {
                    tips = "No tip available at present";
                }

                // content for the infowindow if API callback is successful
                locationItem.contentString = '<div class="infowindow">' +
                    '<h2>' + locationItem.name + '</h2>' +
                    '<p>' + description + '</p>' +
                    '<p>Opening hours: ' + openStatus + '</p>' +
                    '<p>Location: ' + address + '</p>' +
                    '<p>Rating: ' + rating + '</p>' +
                    '<p>Best Tip: ' + tips + '</p>' +
                    '<p>Click to read more on <a href="' + venueInfo.canonicalUrl + '?ref=' + fsqClientID + '" target="_blank">Foursquare</a></p>' +
                    '<p>Information powered by Foursquare</p>' +
                    '</div>';

                // config for infowindow if success
                locationItem.infowindow = new google.maps.InfoWindow({
                    content: locationItem.contentString,
                    maxWidth: 300
                });
            }
        });

        // listens for clicks on the marker and then executes... 
        locationItem.marker.addListener('click', function() {
            // console.log('marker clicked!');
            // console.log(this);
            toggleBounce(this);
            locationItem.infowindow.open(map, locationItem.marker);
        });

    });

    console.log('attractions are below');
    console.log(self.attractions);

    // search and filter an array based on user input

    // set-up empty observable array for visible attractions
    self.filteredAttractions = ko.observableArray();

    // populate visible attractions array with objects from attractions array
    self.attractions.forEach(function(locationItem) {
        self.filteredAttractions.push(locationItem);
    });

    console.log('filtered Attractions are below');
    console.log(self.filteredAttractions());

    // set user filter as ko observable
    self.userFilter = ko.observable('');

    // filter function: updates observableArray and 
    // sets visibility of location markers
    self.runAttractionFilter = function() {
        var searchFilter = self.userFilter().toLowerCase();

        // 1. clear the array
        self.filteredAttractions.removeAll();

        // 2. run the filter and only add to the array if a match
        self.attractions.forEach(function(locationItem) {

            // set marker to false i.e. invisible
            locationItem.marker.setVisible(false);

            if(locationItem.name.toLowerCase().indexOf(searchFilter) !== -1) {
                self.filteredAttractions.push(locationItem);
            }
        });

        // for each item in the array, set visibility to true i.e. visible
        self.filteredAttractions().forEach(function(locationItem) {
            locationItem.marker.setVisible(true);
        });
    };

    // Used to toggle CSS class '.open' - false means '.open'
    // is not applied to the menu element. 
    this.toggleDrawer = ko.observable(false);

    // Sets CSS class '.open' to true if false and vice versa.
    this.openDrawer = function() {
        // console.log("hamburgers!");
        self.toggleDrawer( !self.toggleDrawer() );
    };

};
// ViewModel END


// Maps API callback is to initApp
// This function controls execution of the app
var initApp = function() {
    initMap();
    ko.applyBindings(new ViewModel());
};
