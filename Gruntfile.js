var lodash = require('lodash');

module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concurrent: {
      devel: {
        tasks: ['connect:demo', 'watch'],
        options: {
          limit: 2,
          logConcurrentOutput: true
        }
      },
      test: {
        tasks: ['connect:test', 'protractor'],
        options: {
          limit: 2,
          logConcurrentOutput: true
        }
      }
    },

    smq: {
      bootstrap: {
        src: 'tmp/gitbucketTest.css',
        dest: 'tmp/sqm',
        basename: 'gitbucket'
      }
    },

    clean: {
      dev: ['tmp', 'dist', 'demo/assets']
    },

    copy: {
    },

    less: {
    },

    concat: {
      css: {
      },
      js: {
        files: {
          'src/main/webapp/assets/common/js/framework.test.js': ['src/main/webapp/assets/vendors/fastclick/lib/fastclick.js'
            ,'src/main/webapp/assets/vendors/setimmediate/setImmediate.js'
            ,'src/main/webapp/assets/vendors/webcomponents.js/webcomponents.js'
            ,'src/main/webapp/assets/vendors/requestAnimationFrame/app/requestAnimationFrame.js'
            ,'src/main/webapp/assets/vendors/zeroclipboard/dist/ZeroClipboard.js'
            ,'src/main/webapp/assets/vendors/jquery/dist/jquery.js'
            ,'src/main/webapp/assets/vendors/jquery-placeholder/jquery.placeholder.js'
            ,'src/main/webapp/assets/vendors/selector-set/selector-set.js'
            ,'src/main/webapp/assets/vendors/jquery-selector-set/jquery.selector-set.js'
            ,'src/main/webapp/assets/vendors/jquery-pjax/jquery.pjax.js'
            ,'src/main/webapp/assets/vendors/jquery-timeago/jquery.timeago.js'
            ,'src/main/webapp/assets/common/js/observe.js'
            ,'src/main/webapp/assets/common/js/githubSupport.js'
            ,'src/main/webapp/assets/common/js/facebox.js'
            ,'src/main/webapp/assets/common/js/fileHelper.js'
            ,'src/main/webapp/assets/common/js/navigation.js'
            ,'src/main/webapp/assets/common/js/menu.js'
            ,'src/main/webapp/assets/common/js/throttledInput.js'
            ,'src/main/webapp/assets/common/js/performTransition.js'
            ,'src/main/webapp/assets/common/js/helper.js']
        }
      }
    },

    uglify: {
      minify: {
        options: {
          report: 'min'
        },
        files: {
          'src/main/webapp/resources/js/glutton-angular-ui.min.js': ['dist/js/glutton-angular-ui.js'],
          'src/main/webapp/resources/js/glutton-angular-ui.migrate.min.js': ['dist/js/glutton-angular-ui.migrate.js'],
          'src/main/webapp/resources/js/glutton-angular-ui.gestures.min.js': ['dist/js/glutton-angular-ui.gestures.js'],
          'src/main/webapp/resources/js/glutton-angular-ui.core.min.js': ['dist/js/glutton-angular-ui.core.js'],
          'src/main/webapp/resources/js/glutton-angular-ui.components.min.js': ['dist/js/glutton-angular-ui.components.js']
        }
      }
    },

    cssmin: {
      minify: {
        options: {
          report: 'min'
        },
        expand: true,
        cwd: 'src/main/webapp/resources/css/',
        src: ['*.css', '!*.min.css'],
        dest: 'src/main/webapp/resources/css/',
        ext: '.min.css'
      }
    },

    watch: {
      all: {
        files: 'src/**/*',
        tasks: ['build']
      }
    },

    connect: {
      demo: {
        options: {
          hostname: '0.0.0.0',
          port: 3000,
          base: ['.', 'demo'],
          keepalive: true
        }
      },
      migrate: {
        options: {
          hostname: '0.0.0.0',
          port: 3002,
          base: ['.', 'test/migrate'],
          keepalive: true
        }
      },
      test: {
        options: {
          hostname: '0.0.0.0',
          port: 3001,
          base: ['.', 'test'],
          keepalive: true
        }
      }

    },

    'split-hover': {
      all: {
        src: 'tmp/sqm/glutton-angular-ui-base.css',
        dest: 'tmp/hover.css'
      }
    },

    jshint: {
      all: ['Gruntfile.js', 'src/main/js/**/*.js']
    },

    protractor: {
      options: {
        configFile: 'test/conf.js',
        keepAlive: false,
        noColor: false,
        args: {}
      },
      all: {}
    }

  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-concurrent');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-protractor-runner');


  grunt.task.loadTasks('tasks');

  grunt.registerTask('build', [ 'clean:dev',
                                'concat']);

  grunt.registerTask('test', ['concurrent:test']);

  grunt.registerTask('fulltest', ['build', 'jshint', 'concurrent:test']);

  grunt.registerTask('default', [ 'build',
                                  'concurrent:devel']);

};
