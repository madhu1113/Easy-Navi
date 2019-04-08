
// History is a internal javscript object. Do not disturb.
// renamed history as log.

console.log("Madhu Priya from content-script");

var redundancy = {};
var history_of_events = {"count": 0};
var prev_entry = {"content": "", "href": ""};
var trigger = false;

var url = window.location.href;
var arr = url.split("/");
var domain = arr[2];

console.log("domain -> ", domain);

setInterval(function(){

  var active = document.activeElement;

  // Only covers Anchor tags, and imgs within anchor tags.
  if (active.tagName == "A" && prev_entry.content != active.innerHTML)
  {

      var new_entry = {
        "href": active.href,
        "content": active.innerHTML,
        "type": active.nodeName
      };
      // temp.innerHTML, temp.href

      console.log("element on focus", active);
      trigger = true;
      console.log("-------------------");
      console.log(new_entry);
      console.log("-------------------");
      prev_entry = new_entry;


      var key = history_of_events["count"];
      var key_string = key + "";
      history_of_events[key_string] = new_entry;
      history_of_events["count"] = key + 1;

      console.log("history_of_events", history_of_events);

      if (new_entry.href in redundancy){
        redundancy[new_entry.href].push(new_entry.content);
      } else {
        redundancy[new_entry.href] = [new_entry.content];
      }

      console.log("redundancy", redundancy);

      // Every time there is an update to log. Background page is updated.
      // msg = ;
      chrome.runtime.sendMessage({
        "from": "from-content-script",
        "subject": "push-data",
        "history_of_events": history_of_events,
        "redundancy": redundancy,
        "domain": domain
      });
  }

}, 10);

var deletions = {};

chrome.runtime.sendMessage({
  "from": "from-content-script",
  "subject": "pull-data",
  "domain": domain
  }, function (json) {
    console.log("I have been injected. I am taking redundancy data from background js");
    redundancy = json;

    // Code for deleting elements

    counter = 1;

    $('a').each(function(i){

        counter = counter + 1;
        var href = $(this).prop("href");
        var content = $(this).html();

        //if(counter == 2){
            if (href in redundancy){
                 // $(this).remove();
                if(redundancy[href].includes(content)){
                  $(this).remove();
                  deletions[href] = content;
                  console.log($(this), " there in", redundancy);
                } else {
                   console.log($(this), content, " not there in", redundancy);
                }
            } else {
                 console.log($(this), href, " not there in", redundancy);
            }
        //}
    });
});

chrome.runtime.onMessage.addListener(function (msg, sender, callback) {
    if (msg.from == "from-popup" && msg.subject == "pull-deletions"){
        console.log("deletions", deletions);
        callback(deletions);
    }
});
