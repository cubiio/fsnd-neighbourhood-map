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
    },
    {
        name: 'BMW Museum',
        position: {lat: 48.1767861, lng: 11.5591494},
        venueID: '4ade0cdaf964a520666921e3'
    },
    {
        name: 'SEA LIFE München',
        position: {lat: 48.1737757, lng: 11.5561206},
        venueID: '4ade0cd6f964a520536921e3'
    },
    {
        name: 'Chinese Tower',
        position: {lat: 48.1525646, lng: 11.5919791},
        venueID: '54fafbcd498e724a96bbded2'
    }
];
// Model END


// global var for initMap()
var map;

// Async callback to Google Maps API
function initMap() {
    var munich = { 
        // lat: 48.1295417,
        // lng: 11.5938205
        lat: 48.1499011,
        lng: 11.5497244
    };

    map = new google.maps.Map(document.getElementById('js_map'), {
        zoom: 13,
        center: munich,
        gestureHandling: 'cooperative'
    });
}

// Constructor for each location i.e. venue displayed on the map
var Location = function(data) {
    this.name = data.name;
    this.position = data.position;
    this.venueID = data.venueID;
    this.marker = null;
    this.favourite = false;
};


// alerts the user if Google Maps fails to load
function googleError() {
    alert('Google Maps has failed to load. Please check your internet connection or try again later.');
}


// ViewModel START
var ViewModel = function() {

    var self = this;

    // config for FourSquare ajax request
    var fsqClient = '?client_id=';
    var fsqClientID = 'IUPLCEDVWLKOD5HK2MGBV2AX3LUXULEBJ3R5SBBHWNYLPM5T';
    var fsqClientSecret = '&client_secret=FHY1LCHZ0K5OG3WRPZHF4VRR4WFMH304FA2ICGTD4SENJRUR';
    var vParam = '&v=20170215';
    var mParam = '&m=foursquare';

    var infowindow = new google.maps.InfoWindow({
        maxWidth: 250,
    });

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
            dataType: "json"
        }).done(function (data) {

            // helpers: shortener and confirm valid json responses
            var venueInfo = data.response.venue;

            var description = venueInfo.hasOwnProperty("description") ? venueInfo.description : "";

            var openStatus = venueInfo.hasOwnProperty("hours") ? venueInfo.hours.status : "Foursquare has no info at present";

            var address = venueInfo.location.hasOwnProperty("formattedAddress") ? venueInfo.location.formattedAddress : "Foursquare has no info at present";

            var rating = venueInfo.hasOwnProperty("rating") ? venueInfo.rating + ' / 10' : "No rating available";

            var tips = venueInfo.tips.hasOwnProperty("groups") ? venueInfo.tips.groups[0].items[0].text : "No tip available at present";

            // content for the infowindow if API callback is successful
            locationItem.contentString = '<div class="infowindow">' +
                '<div class="info_wrapper">' +
                    '<h2>' + locationItem.name + '</h2>' +
                    '<p>' + description + '</p>' +
                    '<p>Opening hours: ' + openStatus + '</p>' +
                    '<p>Location: ' + address + '</p>' +
                    '<p>Rating: ' + rating + '</p>' +
                    '<p>Best Tip: ' + tips + '</p>' +
                    '<p>Click to read more on <a href="' + venueInfo.canonicalUrl + '?ref=' + fsqClientID + '" target="_blank">Foursquare</a></p>' +
                    '<p class="foursquare-attribution">Information powered by Foursquare</p>' +
                '</div>' +  // end info_wrapper
                '</div>'; // end infowindow div class

            // config for infowindow if successful
            locationItem.infowindow = new google.maps.InfoWindow({
                content: locationItem.contentString
            });

        // error handling for foursquare ajax request
        }).fail(function() {
            document.getElementById('js_foursquare-error').innerHTML = 'Failed to get ' + 
            'venue information from Foursquare. Please check your internet connection, or try again later.';
        });

        // listens for clicks on the marker and then executes... 
        google.maps.event.addDomListener(locationItem.marker, 'click', function() {
            bounceMarker(this);
            infowindow.open(map, locationItem.marker);
            infowindow.setContent(locationItem.contentString);
        });

        // listens for right clicks on the marker
        google.maps.event.addDomListener(locationItem.marker, 'rightclick', function() {
            self.favouriteAttractions(locationItem);
        });

    });

    this.displayInfo = function(locationItem) {
        var marker = locationItem.marker;
        bounceMarker(marker);
        infowindow.open(map, locationItem.marker);
        infowindow.setContent(locationItem.contentString);
    };

    function bounceMarker(marker) {
        if (marker.getAnimation() !== null) {
            marker.setAnimation(null);
        } else {
            marker.setAnimation(google.maps.Animation.BOUNCE);
            setTimeout(function() {
                marker.setAnimation(null);
            }, 2100);  // 3 bounces then stops
        }
    }

    // search and filter an array based on user input

    // set-up empty observable array for visible attractions
    self.filteredAttractions = ko.observableArray();

    // populate visible attractions array with objects from attractions array
    self.attractions.forEach(function(locationItem) {
        self.filteredAttractions.push(locationItem);
    });

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
        self.toggleDrawer( !self.toggleDrawer() );
    };

    // manage favourites

    // set-up empty observable array for favourite attractions
    self.favAttractions = ko.observableArray();

    // this.favourite = ko.observable(false);

    this.favouriteAttractions = function(locationItem) {

        self.favAttractions.removeAll();

        // toggle favourite from truthy to falsy, or vice versa
        if (locationItem.favourite == false) {
            locationItem.favourite = true;
        } else {
            locationItem.favourite = false;
        }

        // add to observable array if favourite is truthy
        self.attractions.forEach(function(locationItem) {

            if(locationItem.favourite == true) {
                self.favAttractions.push(locationItem);
            }
        });
    };

};
// ViewModel END


// Maps API callback is to initApp
// This function controls execution of the app
var initApp = function() {
    initMap();
    ko.applyBindings(new ViewModel());
};