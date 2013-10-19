module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.initConfig({
    mochaTest: {
      test: {
        options: {
          reporter: 'spec'
        },
        src: ['test/specs/*.js']
      }
    }
  });

  grunt.registerTask('test', function() {
    var done = this.async();

    process.env.NODE_ENV = 'test';
    require('./test/server');

    grunt.task.run('mochaTest');

    done();
  });

  grunt.registerTask('default', 'test');
};
