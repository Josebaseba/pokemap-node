/**
 * Compress CSS files.
 *
 * ---------------------------------------------------------------
 *
 * Minify the intermediate concatenated CSS stylesheet which was
 * prepared by the `concat` task at `.tmp/public/concat/production.css`.
 *
 * Together with the `concat` task, this is the final step that minifies
 * all CSS files from `assets/styles/` (and potentially your LESS importer
 * file from `assets/styles/importer.less`)
 *
 * For usage docs see:
 *   https://github.com/gruntjs/grunt-contrib-cssmin
 *
 */
 module.exports = function(grunt) {
    var version = grunt.file.readJSON('package.json').version;

    grunt.config.set('cssmin', {
      dist: {
        src: ['.tmp/public/concat/production.css'],
        dest: '.tmp/public/min/production.' + version + '.min.css'
      }
    });

    grunt.loadNpmTasks('grunt-contrib-cssmin');
 };
