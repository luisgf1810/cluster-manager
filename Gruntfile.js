/**
 * Created by luis on 10/12/14.
 */
module.exports = function (grunt) {
    grunt.initConfig({

        clean: ["srv1", '.tmp'],

        copy: {
            main: {
                expand: true,
                cwd: 'app/',
                src: ['**', '!js/**', '!lib/**', '!**/*.css'],
                dest: 'srv1/'
            }
        },

        rev: {
            files: {
                src: ['srv1/**/*.{js,css}']
            }
        },

        useminPrepare: {
            html: 'app/index.html',
            options: {
                dest: 'srv1'
            }
        },

        usemin: {
            html: ['srv1/index.html']
        },

        uglify: {
            options: {
                report: 'min',
                mangle: false
            }
        },

        sshexec: {
            clear: {
                command: ['cd /usr/share/nginx/html', 'sudo rm -rf srv1'].join("&&"),
                options: {
                    host: 'agdrone.noip.me',
                    username: 'root',
                    "password": "Drone.1945!",
                    agent: process.env.SSH_AUTH_SOCK
                }
            }
        },

        sftp: {
            deploy: {
                files: {
                    "./": "srv1/**"
                },
                options: {
                    "path": "/usr/share/nginx/html/",
                    "host": "agdrone.noip.me",
                    "username": "root",
                    "port": "22",
                    "password": "Drone.1945!",
                    "srcBasePath": "/usr/share/nginx/html/",
                    "createDirectories": true
                }
            }
        }

    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-rev');
    grunt.loadNpmTasks('grunt-usemin');
    grunt.loadNpmTasks('grunt-ssh');

    // Tell Grunt what to do when we type "grunt" into the terminal
    grunt.registerTask('default', [
        'copy', 'useminPrepare', 'concat', 'uglify', 'cssmin', 'rev', 'usemin', 'sshexec', 'sftp'
    ]);
};