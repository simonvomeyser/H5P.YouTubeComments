var H5P = H5P || {};

/**
 * Constructor.
 * 
 * @param {object} params Options for this library.
 * @param {string} contentPath The path to our content folder.
 */
// H5P.YouTubeComments = function (params, id) {
// 	console.log ("YTComment!"); //Debug
//   this.text = params.text === undefined ? '<em>New text</em>' : params.text;
// };
H5P.YouTubeComments = (function ($) {

  function C(options, id) {
    this.$ = $(this);
    // Extend defaults with provided options
    this.options = $.extend(true, {}, {
      greeting: 'Hello world!',
      image: null
    }, options);
    // Keep provided id.
    this.id = id;
  };

    /**
     * Attach function called by H5P framework to insert H5P content into
     * page
     *
     * @param {jQuery} $container
     */
    C.prototype.attach = function ($container) {
      var self = this;
      console.log ("Attach!")

      setTimeout(function() {
        console.log (this.YouTubeHelper.videoUrlToId(videoUrl))

      }, 1000);
      // Add greeting text.
      $container.append('<b>Getting the YouTube Comments!</b>');

    };

    this.YouTubeHelper = new function() {

        /**
         * Gets the YouTube Video from the parents
         * @todo there has to be a better way, should be passed by h5pEditor
         * @param  {$(domObject)} $container 
         * @return {String}            
         */
        this.getYouTubeVideo = function($container) {
          return $container.parents('.h5p-video-wrapper').find('iframe').attr('src');
        }

        /**
         * Use so to get the ID of the video
         * @param {[String]} in emebd format: https://www.youtube.com/embed/-RxoROBOoWE?...
         * @return {[String]} 
         */
        this.videoUrlToId = function (url) {
          console.log ("cleaning" + url); //Debug
          id = url
            //cleans everything before embed
            .replace(/.*embed\//g,'') 
            //cleans everything after ?
            .replace(/\?.*/g,'');

          return id;
        };
    }



    return C;
  })(H5P.jQuery);