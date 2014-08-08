
if (typeof window !== 'undefined' && typeof exports === 'undefined') {
    if (typeof window.utils !== 'object') window.utils = {};
}

if (typeof exports !== 'undefined') {
    var _ = require('underscore');
}

(function(exports) {
    //
    // Message Text Formatting
    //
    exports.format = function(text, plugins) {
        // TODO: Fix these regexes
        var imagePattern = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|][.](jpe?g|png|gif)\s*$)/i;
        var linkPattern = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
        var youtubePattern = /\b((https?\:\/\/)?(www\.)?((?:youtube\.com\/(?:(?:(?:.*?)watch\?v=)|(?:v\/)))|(?:youtu\.be\/)))([-a-zA-Z0-9_]+)(?:[\?\&].*?)?(\n|\.|\0|\s)/ig;
        var mentionPattern = /@(.+?)\b/g;
        text = text.replace(mentionPattern, '<span class="mention-color">@$1</span>');

        if (text.match(imagePattern)) {
            text = text.replace(imagePattern, '<a class="thumbnail" href="$1" target="_blank"><img src="$1" alt="$1" /></a>');
        }
        else if (text.match(youtubePattern)) {
            youtubeLink = text;
            youtubeId = youtubeLink.split("v=")[1].substring(0, 11);
            $.ajax({
                 async: false,
                 type: 'GET',
                 url: 'http://gdata.youtube.com/feeds/api/videos/'+youtubeId+'?v=2&alt=jsonc',
                 success: function(data) {
                    text = '<div class="youtube">\
                    <i class="icon-youtube"></i>\
                    <a href="'+youtubeLink+'" target="_blank" >\
                      <img src="'+data.data.thumbnail.sqDefault+'">\
                    <span>\
                      <strong> '+data.data.title+'</strong><br>\
                    '+data.data.description.substring(0, 140)+'...\
                    </span>\
                    </a></div>';
                 }
            });
        } else {
            text = text.replace(linkPattern, '<a href="$1" target="_blank">$1</a>');
        }

        if (plugins) {
            // emotes
            _.each(plugins.emotes, function(emote, keyword) {
                var image = '<img class="emote" src="' + encodeURI(emote) + '" title="'+ encodeURI(keyword) + '" alt="' + encodeURI(keyword) + '" />';
                text = text.replace(new RegExp('\\B' + keyword + '\\b', 'g'), image);
            });
            // replacements
            _.each(plugins.replacements, function(replacement) {
                text = text.replace(new RegExp(replacement.regex, 'g'), replacement.template);
            });
        }
        return text;
    }
})(typeof exports === 'undefined' ? window.utils.message = {} : exports);
