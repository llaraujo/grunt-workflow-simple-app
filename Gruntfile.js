module.exports = function(grunt) {

  "use strict";

  var async = require('async');

  /*
   * Package.json
   */
  var pkg = require('./package.json'),
      config = require('./project.json');

  /*
   *  Environments
   */
   var developerConfig = config.environment.developer;

  /*
   * Load modules in package.json
   */
  async.forEach(Object.keys(pkg.devDependencies), function (item, callback){

    if( item.indexOf('grunt-') > -1) {
      grunt.loadNpmTasks(item);
    }

    callback();

  },function() {});

  /*≈≈
   *  Grunt config (Alphabetical order)
   */
  grunt.initConfig({

    clean: {

      general: developerConfig.modules.clean.general,

      dist: developerConfig.modules.clean.dist

    },

    compass: {

      dev: {
        options:  {
          environment:      'development',
          force:            true,
          noLineComments:   false,
          relativeAssets:   true,
          trace:            true,
          outputStyle:      'expanded',
          importPath:       developerConfig.modules.compass.importPath,
          cssDir:           developerConfig.modules.compass.css,
          fontsDir:         developerConfig.path.assets.font,
          imageDir:         developerConfig.path.assets.img,
          javascriptsDir:   developerConfig.path.assets.js,
          sassDir:          developerConfig.path.assets.sass

        }
      },

      dist: {
        options:  {
          environment:      'development',
          force:            true,
          noLineComments:   true,
          relativeAssets:   true,
          trace:            true,
          outputStyle:      'compressed',
          importPath:       developerConfig.modules.compass.importPath,
          cssDir:           developerConfig.modules.compass.css,
          fontsDir:         developerConfig.path.assets.font,
          imageDir:         developerConfig.path.assets.img,
          javascriptsDir:   developerConfig.path.assets.js,
          sassDir:          developerConfig.path.assets.sass

        }
      }

    },

    connect: {
      server: {
        options: {
          protocol:   developerConfig.modules.connect.protocol,
          base:       developerConfig.modules.connect.base,
          port:       developerConfig.modules.connect.port,
          hostname:   developerConfig.modules.connect.hostname,
          livereload: developerConfig.modules.connect.livereload,
          open:       developerConfig.modules.connect.protocol + '://' + developerConfig.modules.connect.hostname + ':' + developerConfig.modules.connect.port,
          debug:      developerConfig.modules.connect.debug
        }
      }
    },

    copy: {

      dist: {
        files: [

          {
            expand: true,
            cwd: developerConfig.modules.copy.assets + '/',
            src: '**',
            dest: 'dist/assets/',
            // flatten: true,
            filter: 'isFile'
          },
          {
            expand: true,
            cwd: developerConfig.path.templates + '/',
            src: '*.html',
            dest: 'dist/templates/',
            filter: 'isFile'
          },
          {
            expand: true,
            cwd: developerConfig.path.app + '/',
            src: [
              '.htaccess',
              '.htpasswd',
              '.htgroup',
              '*.html'
            ],
            dest: 'dist/',
            filter: 'isFile'
          }

        ]
      }

    },

    jshint: {
      files: [
        'Gruntfile.js',
        developerConfig.path.assets.js + '/**/*.js'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    uglify: {

      dev: {

        options: {
          beautify:         false,
          compress:         false, // não ativar pq esta trocando (function(){}()) para !function(){}();
          mangle:           false,
          report:           'gzip',
          preserveComments: 'none'
        },

        files: developerConfig.modules.uglify.dev.files

      },

      vendors: {

        options: {
          beautify:         false,
          compress:         false, // não ativar pq esta trocando (function(){}()) para !function(){}();
          mangle:           false,
          report:           'gzip',
          preserveComments: 'none'
        },

        files: developerConfig.modules.uglify.vendors.files

      }

    },

    watch: {

      compass: {
        options: {
          livereload: true,
          debounceDelay: 250
        },
        files: [
          developerConfig.path.assets.sass + '/**/*.sass'
        ],
        tasks: ['compass:dev']
      },

      jsSource: {
        options: {
          livereload: true,
          debounceDelay: 400
        },
        files: '<%= jshint.files %>',
        tasks: [
          'uglify:dev',
          'jshint'
        ]
      },

      jsMin: {
        options: {
          livereload: true,
          debounceDelay: 400
        },
        files: developerConfig.modules.uglify.js + '/*.js',
        tasks: [
          'jshint'
        ]

      },

      statics: {
        options: {
          livereload: true,
          debounceDelay: 250
        },
        files: [
          developerConfig.path.app + '/*.{html,jshintrc}',
          developerConfig.path.templates + '/*.html'
        ]
      }

    }

  });



  grunt.registerTask('default', 'default', function() {

    console.log('\nRotina default do grunt.');

  });

  grunt.registerTask('server', 'server', function() {

    console.log('\nRotina server do grunt.');

    grunt.task.run([
      'clean:general',
      'compass:dev',
      'uglify',
      'connect',
      'watch'
    ]);

  });

  grunt.registerTask('dist', 'dist', function() {

    console.log('\nRotina dist do grunt.');

    grunt.task.run([
      'clean:dist',
      'compass:dist',
      'uglify',
      'copy:dist',
      'clean:general'
    ]);

  });


};
