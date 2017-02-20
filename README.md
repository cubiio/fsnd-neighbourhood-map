# Neighbourhood Map Project 
## About

This is front end project is part of my Udacity Full Stack Nanodegree.

### Design and Functionality

- MVVM design paradigm, using [Knockout.js](http://knockoutjs.com/) organisational library
- Utilises Google Maps API to render a map of Munich, Germany
- Users can select (left mouse click) a location marker and it will display information on the location (info powered by Foursquare API)
- Users can search for locations, and the location list and markers will update based on the search
- Users can select (right mouse click) a location marker and it will be added to the favourites list
- Production quality code in the `/dist` folder, including minification, uglification and cache busting


### Technology Colophon

- HTML and Nunjucks templates
- CSS and Flexbox
- Javascript
- Knockout.js
- jQuery (for Ajax calls to Google Maps and Foursquare APIs)
- Gulp task runner

### 3rd Party APIs

- [Google Maps APIs](https://developers.google.com/maps/)
- [Foursquare for Developers](https://developer.foursquare.com/)


## Setup instructions 

### Easy

Download or clone the project. 

Option 1 - use the development code in the `/app` folder - open `index.html` in your browser.

Option 2 - use the production code in the `/dist` folder - open `index.html` in your browser. Note, ordinarily I wouldn’t upload `/dist` to GitHub, however for this project as part of the Udacity code review I did.


### Using Gulp

The Gulp task to run the dev server with live reload is

```
$ gulp
```

Run this command from the repo root directory, after having cloned/downloaded the repo to your local machine.

Note, the default `gulp` dev task runs the server in _Chrome Canary_. To change this to a different browser, open the `config.js` file and change the browserSync settings: edit line 4 to see your dev browser of choice:

```
// current setting
browser:        'google chrome canary',
// to change to a different browser, e.g.
browser:        'firefox',
browser:        'google chrome',
```

There are other Gulp tasks in the `gulpfile.js` file, and each section is clearly commented as to what the tasks are.

The other key task to call out is to build the ‘production’ version of the code which uglifies, minifies and cache busts the code into the `/dist` folder

```
$ gulp build
```



## Credit

Thanks go to Karol, Udacity forum mentor and 1:1 coach for help. Also not forgetting other forum members for their comments, support and older posts which provided guidance and provoked thought in my own design and development of the app.

### How I built this app

My blog post [Building a Neighbourhood Map](https://cubiio.github.io/2017/02/18/building_map_project/), whilst written as part of my own education, is also available for those interested on how I developed this app. It includes more detail on my findings, learnings, frustrations and celebrations on building this app. 


### Document Sources and Attribution:

#### Documentation

- Google Maps API [tutorial](https://developers.google.com/maps/documentation/javascript/adding-a-google-map#key)
- Scaffolding the app with [HTML5 Boilerplate](https://html5boilerplate.com/)
- [Knockout : Home](http://knockoutjs.com/)
- [Foursquare for Developers](https://developer.foursquare.com/)

#### Attribution

**Managing Foursquare JSON responses**

Resolve the issue where Foursquare does not always have the info for each venue e.g. one venue has a description and a price range, another venue does not. This caused the affected infowindows to not open when clicked on, and throw an error in the console.

Solution:

- Per this forum post: [Udacity forum post](https://discussions.udacity.com/t/difficulties-integrating-foursquare/183539/7), use ‘hasOwnProperty`
- [MDN: hasOwnProperty](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Object/hasOwnProperty)
- For example:

``` javascript
var venues = result.response.hasOwnProperty(“venues”) ? result.response.venues : “”;

if (venues !=  “”) {
  …
} else {
  …
}
```


**Google API error handling**

- [Udacity Forum re onError](https://discussions.udacity.com/t/handling-google-maps-in-async-and-fallback/34282#onerror)
- [GlobalEventHandlers.onerror - Web APIs | MDN](https://developer.mozilla.org/en/docs/Web/API/GlobalEventHandlers/onerror)


**User filtered array and favourites list**

These challenges are covered in more detail on my blogpost. In summary, I used the below sources to try several ways of solving these challenges. In particular, this [KO map example](https://codepen.io/prather-mcs/pen/KpjbNN) from one of the Udacity forum mentors to create a user filtered array (rendered as a list) gave me lots to think about. I wrote it out using pen and paper (old school, I know) how it worked, slept on it, then worked on implementing my own version to create a user filtered array and a favourites list. More detail on this process in my blogpost.

The key links are:

- [Udacity forum re user input to filter an array](https://discussions.udacity.com/t/how-to-implement-knockout-into-the-project/181122)
- [Utility functions in KnockoutJS - Knock Me Out](http://www.knockmeout.net/2011/04/utility-functions-in-knockoutjs.html)
- [Array.prototype.indexOf() - JavaScript | MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf)
