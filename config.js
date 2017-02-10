const config = {

	fonts: {
		src: 'app/fonts**/*',
		dest: 'dist/fonts'
	},

	html: {
		src: 'app/*.html'
	},

	js: {
	    src: 'app/js/**/*.js'
	  },

	jscs: {
		dest: 'app/js',
		options: {
			// enables the linter to fix errors
			fix: true,
			configPath: '.jscsrc'	
		}
	},

	jshint: {
   	reporterOptions: {
	   	// toggle for warning & info notifications
     	ignoreWarning: true,
    	ignoreInfo: true
  	}
	},

	sass: {
		src: 'app/scss/**/*.scss',
		dest: 'app/css/',
		options: {
			includePaths: [
				'app/bower_components',
				'node_modules'
			]
		}
	},

	scsslint: {
		config: '.scss-lint.yml'
	},

	sprites: {
		src: 'app/images/sprites/**/*',
		imgDest: 'app/images',
		scssDest: 'app/scss',
		options: {
			cssName: '_sprites.scss', // CSS file
			imgName: 'sprites.png', 	// image file
			imgPath: 'app/images/sprites.png'
			// include if creating retina images; meet 2 conditions
			// 1 - same no. of retina and non-retina imgs
			// 2 - retina imgs twice size of non-retina
			// retinaSrcFilter: 'app/images/sprites/*@x2.png',
			// retinaImgName: 'sprites@2x.png',
			// retinaImgPath: 'app/images/@2x.png'
		}
	},

	surge: {
		project: 'dist/',                       // folder for Surge content
		domain: 'http://add-name.surge.sh/'  	// amend url
	},

	useref: {
		src: 'app/*.html',
		dest: 'dist'
	},

	psi: {
		site: 'http://www.example.com'			// amend url for new project
		// key: 
	}

};

module.exports = config;