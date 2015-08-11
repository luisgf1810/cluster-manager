module.exports = {
  options: {
    cleanup: true,
    keepUnstable: false
  },
  dist: {
    files: [
      { src: '<%= dist %>/release/*.{scripts,css,svg,woff,ttf,eot}', dest: '<%= dist %>/release/' }
    ]
  }
};
