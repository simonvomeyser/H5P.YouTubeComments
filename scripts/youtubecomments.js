var H5P = H5P || {};

/**
 * Constructor.
 * 
 * @param {object} params Options for this library.
 * @param {string} contentPath The path to our content folder.
 */
H5P.YouTubeComments = (function ($) {

  function C(options, id) {
    this.$ = $(this);
    // Extend defaults with provided options
    this.options = $.extend(true, {}, {
      title: 'YouTube Comments',
      secondsBetween: 2,
      clearCommentsAfter: 0
    }, options);
    // Keep provided id.
    this.id = id;

    // Broke Image Handling
    $('.youtubecomment__authorProfileImage>img').error(function(){
      $(this).attr('src', 'https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg?sz=50');
    });
  };

    /**
     * Attach function called by H5P framework to insert H5P content into page
     * @param {jQuery} $container
     */
    C.prototype.attach = function ($container) {
      var self = this;

      // Add HTML-Elements to interaction window
      $container.addClass('h5p-youtubecomments-interaction-window');
      $container.addClass('h5p-youtubecomments');
      $container.append("<div class='h5p-youtubecomments__head'>"+ self.options.title+"</div>");
      // @todo This should only happen in posters, not in buttons
      // $container.append("<div class='h5p-youtubecomments__hide-button'>&times;</div>").on('click',  function(event) {
      //     $(this).closest('.h5p-youtubecomments-interaction').addClass('h5p-youtubecomments-interaction--fade-out')
      //   });;
      $container.append("<div class='h5p-youtubecomments__body'></div>");

      /**
       * Wait for one second - unfortunatly this is necessary
       */
      setTimeout(function() {
        var videoID = YouTubeHelper.getVideoId($container);
        var APIKEY = 'AIzaSyAJ7W8CQHbwc-liw4yet69yUwiMxtAQk78';
        var $containerInner = $container.find('.h5p-youtubecomments__body');
        $containerInner.append('<div class="h5p-youtubecomments__loading"> <span class="h5p-youtubecomments__loading-span">Loading...</span></div>')

        $.ajax({
          url: 'https://www.googleapis.com/youtube/v3/videos?id='+videoID+'&key='+APIKEY+'&part=snippet,statistics',
        })
        .done(function(apiResponseForVideo) {
          // If there is a video found
          if (apiResponseForVideo.items.length) {
            var video = apiResponseForVideo.items[0]; //Generell Data
            var videoTitle = video.snippet.title; 
            var videoCommentCount = video.statistics.commentCount; 
            // Options from author
            var msBetween = self.options.secondsBetween * 1000; 
            var souldCommentsBeCleared = self.options.clearCommentsAfter > 0; 

            /**
             * Get actual comments
             */
            $.ajax({
              url: 'https://www.googleapis.com/youtube/v3/commentThreads?videoId='+videoID+'&key='+APIKEY+'&part=snippet',
            })
            .always(function(e) {
              $containerInner.children().remove(); // Remove Loading

              /**
               * Iterate through comments, add them to the container
               */
              $.each(e.items, function(index, commentThread) {
                setTimeout(function() {
                if (souldCommentsBeCleared && index % self.options.clearCommentsAfter == 0) {
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
                // Animation
                setTimeout(function() {
                  $('.youtubecomment').addClass('youtubecomment--shown');
                },100);
                }, msBetween * index);                  
              });
              // When there are no comments
              if (e.items.length == 0) {
                $containerInner.append('<p>Keine Kommentare zu diesem Video...</p>')
              }
            });



          } // --END If there is a video found
          // No video found here
          else {
            displayError('Kein Video gefunden', $container);
          } // --END If there is no video found

        }) // --END callback videoApiCall
        .fail(function(e) {
          console.log (e); // To see the YouTube Error
          displayError(null, $container);
        });  // --END Fail callback videoApiCall
      }, 1000); // --END Timeout

    };

    /**
     * Helper function from youTube proof of concept
     */
    var YouTubeHelper = new function() {
      var self = this;

      /**
       * Gets the YouTube Video from the parents
       * @todo there has to be a better way, should be passed by h5pEditor
       * @param  {$(domObject)} $container 
       * @return {String}            
       */
      this.getVideoUrl = function($container) {
        return $container.parents('.h5p-content').find('iframe').attr('src');
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
      errorText = errorText ? errorText : 'Leider ist ein Fehler aufgetreten!';
      $container.append('<div class="youtubecomment__error">'+errorText+'</div>');
    }

    return C;
  })(H5P.jQuery);