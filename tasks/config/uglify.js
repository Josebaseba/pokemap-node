/**
 * `uglify`
 *
 * ---------------------------------------------------------------
 *
 * Minify client-side JavaScript files using UglifyJS.
 *
 * For usage docs see:
 *   https://github.com/gruntjs/grunt-contrib-uglify
 *
 */
 module.exports = function(grunt) {
   var version = grunt.file.readJSON('package.json').version;

   grunt.config.set('uglify', {
     dist: {
       src: ['.tmp/public/concat/production.js'],
       dest: '.tmp/public/min/production.' + version + '.min.js'
     }
   });

   grunt.loadNpmTasks('grunt-contrib-uglify');
 };
