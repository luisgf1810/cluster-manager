/**
 * Created by luis on 10/12/14.
 */
module.exports = function (grunt) {
    grunt.initConfig({

        clean: ["deploy", '.tmp'],

        copy: {
            main: {
                expand: true,
                cwd: 'app/',
                src: ['**', '!scripts/**', '!lib/**', '!**/*.css'],
                dest: 'deploy/'
            }
        },

        rev: {
            files: {
                src: ['deploy/**/*.{scripts,css}']
            }
        },

        useminPrepare: {
            html: 'app/index.html',
            options: {
                dest: 'deploy'
            }
        },

        usemin: {
            html: ['deploy/index.html']
        },

        uglify: {
            options: {
                report: 'min',
                mangle: false
            }
        },

        docker_io: {
            options: {
                dockerFileLocation: './container',
                buildName: 'ClusterManager',
                tag: 'latest',
                pushLocation: '',
                username: 'process.env.USER',
                push: false,
                force: true
            }
        }

        /*sshexec: {
            clear: {
                command: ['cd /usr/share/nginx/html', 'sudo rm -rf deploy'].join("&&"),
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
                    "./": "deploy/**"
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
        }*/

    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-rev');
    grunt.loadNpmTasks('grunt-usemin');
    grunt.loadNpmTasks('grunt-docker-io');
    //grunt.loadNpmTasks('grunt-ssh');

    // Tell Grunt what to do when we type "grunt" into the terminal
    grunt.registerTask('default', [
        'copy', 'useminPrepare', 'concat', 'uglify', 'cssmin', 'rev', 'usemin', 'docker-io', /*'sshexec', 'sftp'*/
    ]);
};