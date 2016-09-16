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
      title: 'YouTube Comments'
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
      $container.addClass('h5p-youtubecomments-interaction-window');

      $container.addClass('h5p-youtubecomments');
      $container.append("<div class='h5p-youtubecomments__head'>"+ self.options.title+"</div>");
      $container.append("<div class='h5p-youtubecomments__hide-button'>&times;</div>").on('click',  function(event) {
          $(this).closest('.h5p-youtubecomments-interaction').addClass('h5p-youtubecomments-interaction--fade-out')
          console.log ($(this).closest('.h5p-youtubecomments-interaction')); //Debug
          /* Act on the event */
        });;
      $container.append("<div class='h5p-youtubecomments__body'></div>");

      setTimeout(function() {
        var videoID = YouTubeHelper.getVideoId($container);
        var APIKEY = 'AIzaSyAJ7W8CQHbwc-liw4yet69yUwiMxtAQk78';
        var $containerInner = $container.find('.h5p-youtubecomments__body');

        $.ajax({
          url: 'https://www.googleapis.com/youtube/v3/videos?id='+videoID+'&key='+APIKEY+'&part=snippet,statistics',
        })
        .done(function(apiResponseForVideo) {
          // If there is a video found
          if (apiResponseForVideo.items.length) {
            var video = apiResponseForVideo.items[0]; //Generell Data
            var videoTitle = video.snippet.title; 
            var videoCommentCount = video.statistics.commentCount; 

            $.ajax({
              url: 'https://www.googleapis.com/youtube/v3/commentThreads?videoId='+videoID+'&key='+APIKEY+'&part=snippet',
            })
            .always(function(e) {
              $.each(e.items, function(index, commentThread) {
                setTimeout(function() {
                if (index % 3 == 0) {
                  $containerInner.children().remove();
                }
                comment = commentThread.snippet.topLevelComment.snippet;
                $containerInner.prepend(
                  ' \
                  <div class="youtubecomment"> \
                    <div class="youtubecomment__authorProfileImage"> \
                     <img src="'+comment.authorProfileImageUrl+'" alt=""/> \
                    </div> \
                    <div class="youtubecomment__text"> \
                     <b>'+comment.authorDisplayName+': </b><br/>' + comment.textDisplay+' \
                    </div> \
                  </div>');
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