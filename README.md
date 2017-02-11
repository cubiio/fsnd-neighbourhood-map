# Neighbourhood Map Project 
## About

This is a front end project, part of my Udacity Full Stack Nanodegree.

### Built with:

- HTML and Nunjucks templates
- CSS, Flexbox
- Javascript
- Knockout.js
- Gulp task runner

APIs used:

- [Google Maps APIs   |  Google Developers](https://developers.google.com/maps/)


## Setup instructions 

### Easy

Open `index.html` in your browser. 

### Using Gulp

There are several Gulp tasks in the `gulpfile.js`, and each section is clearly commented as to what the tasks are.

**tl;dr**

The two key tasks are as follows:

```
// default task is for dev 
$ gulp 

// build task to create app in /dist folder
$ gulp build
```

Note, the default `gulp` dev task runs in Chrome Canary. To change this to a different browser, go to browser sync task and edit line 136:

```
// current setting
browser:        'google chrome canary',
// to change to a different browser, e.g.
browser:        'firefox',
browser:        'google chrome',
```


## Credit

Thanks go to [ ] for help, support and coaching

**Sources of info and inspiration:**

- Google Maps API [tutorial](https://developers.google.com/maps/documentation/javascript/adding-a-google-map#key)
- For scaffolding the app with baseline HTML5 and CSS [HTML5 Boilerplate](https://html5boilerplate.com/)
- 


**ToDO: Add more info to README**
- instructions for building the project and running the tool
- Make reference to 3rd party APIs used
