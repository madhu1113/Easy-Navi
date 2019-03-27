
// History is a internal javscript object. Do not disturb.
// renamed history as log.

var log = {};
var navigation = {"count": 0};
var prev_entry = {"content": "", "href": ""};
var trigger = false;

var url = window.location.href;
var arr = url.split("/");
var domain = arr[0] + "//" + arr[2];

setInterval(function(){

  var active = document.activeElement;
  var new_entry = {
    "href": active.href,
    "content": active.innerHTML,
    "type": active.nodeName
  };

  // Only covers Anchor tags, and imgs within anchor tags.
  if (new_entry.type == "A" && prev_entry.content != new_entry.content)
  {
      // temp.innerHTML, temp.href
      trigger = true;
      console.log("-------------------");
      console.log(new_entry);
      prev_entry = new_entry;


      var key = navigation["count"];
      var key_string = key + "";
      navigation[key_string] = new_entry;
      navigation["count"] = key + 1;

      if (new_entry.href in log){
        log[new_entry.href].push(new_entry.content);
      } else {
        log[new_entry.href] = [new_entry.content];
      }
      console.log(navigation);
      // Every time there is an update to log. Background page is updated.
      chrome.runtime.sendMessage({
        "from": "from-content-script",
        "subject": "push-data",
        "navigation": navigation,
        "log": log,
        "domain": domain
      });
  }

}, 1000);


chrome.runtime.sendMessage({
  "from": "from-content-script",
  "subject": "pull-data",
  "domain": domain
}, function (json) {
    console.log("I have been injected. I am taking log data from background js");
    console.log(json);
    log = json;

    // Code for deleting elements

    $('a').each(function(i){
        var href = $(this).attr('href');
        var content = $(this).html();
        if (href in log){
            if(log[href].includes(content)){
              $(this).remove();
            } else {
              console.log(href, " not there in", log);
            }

        }
    });

});
