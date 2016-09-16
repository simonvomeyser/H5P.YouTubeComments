var H5P = H5P || {};

/**
 * Constructor.
 * 
 * @param {object} params Options for this library.
 * @param {string} contentPath The path to our content folder.
 */
H5P.YouTubeComments = (function ($) {

  /**
   * Constructor
   * @param {[type]} options 
   * @param {[type]} id      
   */
  function C(options, id) {
    this.$ = $(this);
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

    // Add greeting text.
    $container.append('<b>Getting the YouTube Comments!</b>');

  };

    return C;
  })(H5P.jQuery);