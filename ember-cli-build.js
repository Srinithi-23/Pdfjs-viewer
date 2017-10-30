/* eslint-env node */
const EmberApp = require('ember-cli/lib/broccoli/ember-app');
//var Funnel = require('broccoli-funnel');
module.exports = function(defaults) {

  var app = new EmberApp(defaults, {
      storeConfigInMeta:false// Add options here
  });

  // var extraAssets = new Funnel('bower_components/pdfjs-dist', {
  //     srcDir: '/',
  //     include: ['/build/pdf.worker.js'],
  //     destDir: '/assets/pdf'
  //  });

  app.import('bower_components/pdfjs-dist/build/pdf.js');
  app.import('bower_components/pdfjs-dist/web/pdf_viewer.js');
  app.import('bower_components/pdfjs-dist/web/pdf_viewer.css');
  app.import('bower_components/pdfjs-dist/web/compatibility.js');

  var pickFiles = require('broccoli-static-compiler'),trees = [];

      trees.push(
                pickFiles('bower_components/pdfjs-dist/build', {
                		srcDir: '/',
                        files: [ 'pdf.worker.js' ], // No I18N
        	                destDir: '/assets/pdf/'
                	})
	        );

      trees.push(
                pickFiles('bower_components/pdfjs-dist/web', {
                  srcDir: '/',
                    files: [ 'images/*.*' ], // No I18N
                      destDir: '/assets/'
                  })
          );

  // Use `app.import` to add additional libraries to the generated
  // output files.
  //
  // If you need to use different assets in different
  // environments, specify an object as the first parameter. That
  // object's keys should be the environment name and the values
  // should be the asset to use in that environment.
  //
  // If the library that you are including contains AMD or ES6
  // modules that you would like to import into your application
  // please specify an object with the list of modules as keys
  // along with the exports of each module as its value.

  return app.toTree(trees);
};
