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
      $container.append('<b>Getting the YouTube Comments!</b>');
      $container.addClass('h5p-youtubecomments-interaction-window');

      setTimeout(function() {
        var videoID = YouTubeHelper.getVideoId($container);
        var APIKEY = 'AIzaSyAJ7W8CQHbwc-liw4yet69yUwiMxtAQk78';
        $.ajax({
          url: 'https://www.googleapis.com/youtube/v3/videos?id='+videoID+'&key='+APIKEY+'&part=snippet,statistics',
        })
        .done(function(apiResponseForVideo) {
          // If there is a video found
          if (apiResponseForVideo.items.length) {
            var video = apiResponseForVideo.items[0]; //Generell Data
            var videoTitle = video.snippet.title; 
            var videoCommentCount = video.statistics.commentCount; 
            $container.append("<div><b>Video Titel</b>: "+videoTitle+"</div>");
            $container.append("<div><b>Anzahl Kommentare</b>: "+videoCommentCount+"</div>");

            $.ajax({
              url: 'https://www.googleapis.com/youtube/v3/commentThreads?videoId='+videoID+'&key='+APIKEY+'&part=snippet',
            })
            .always(function(e) {
              $.each(e.items, function(index, commentThread) {
                $container.children().remove();
                setTimeout(function() {
                if (index % 3 == 0) {
                  $container.children().remove();
                }
                comment = commentThread.snippet.topLevelComment.snippet;
                $container.append('<div class="comment"> <div class="authorProfileImage"> <img src="'+comment.authorProfileImageUrl+'" alt=""/> </div> <div class="text"> <b>'+comment.authorDisplayName+': </b><br/>' + comment.textDisplay+'</div> </div>');
                }, 2000 * index);                  
              });
            });



          } // --END If there is a video found
          // No video found
          else {
            this.displayError('Kein Video gefunden', $container);
          } // --END If there is no video found

        }) // Done callback videoApiCall
        .fail(function(e) {
          var errorText = e.responseJSON.error.message;
          this.displayError(errorText, $container);
        });  // Fail callback videoApiCall
      }, 1000);

      // Add greeting text.

    };

    var YouTubeHelper = new function() {
      var self = this;

      /**
       * Gets the YouTube Video from the parents
       * @todo there has to be a better way, should be passed by h5pEditor
       * @param  {$(domObject)} $container 
       * @return {String}            
       */
      this.getVideoUrl = function($container) {
        return $container.parents('.h5p-video-wrapper').find('iframe').attr('src');
      }

      this.getVideoId = function($container) {
        return self.videoUrlToId(self.getVideoUrl($container))
      }

      /**
       * Use so to get the ID of the video
       * @param {[String]} in emebd format: https://www.youtube.com/embed/-RxoROBOoWE?...
       * @return {[String]} 
       */
      this.videoUrlToId = function (url) {
        id = url
          //cleans everything before embed
          .replace(/.*embed\//g,'') 
          //cleans everything after ?
          .replace(/\?.*/g,'');

        return id;
      };
    }

    
    this.displayError = function(errorText, $container) {
      $container.append('<div class="error">Leider ist ein Fehler aufgetreten! :(</div>');
      console.log (errorText); //Debug
      this.setTimeout(function () {
        $container.remove();
      }, 3000)
    }


    return C;
  })(H5P.jQuery);