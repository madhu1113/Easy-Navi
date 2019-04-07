
console.log("Madhu Priya from popup");

var totalContent = "";

chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
  var currTab = tabs[0];
  if (!currTab) {
    return;
  } // Sanity check

    console.log(currTab);

    var url = currTab.url;
    var arr = url.split("/");
    var domain = arr[2];
    console.log(domain);


    chrome.runtime.sendMessage({
      "from": "from-popup",
      "subject": "pull-history",
      "domain": domain
      }, function (json) {
        console.log("Fetching data from background");

        var content = "";
        $.each(json, function(key, value) {
            if(key != "count"){
              content = content + "<li> "+ key +": "+ value.href +"</li>";
            }
        });

        $("#navigated").html(content);

        console.log(content);
        console.log(json);

    });

    chrome.tabs.sendMessage(currTab.id, {
      "from": "from-popup",
      "subject": "pull-deletions",
      "domain": domain
      }, function (json) {
        console.log("Fetching deletions from content");

        var content = "";
        $.each(json, function(key, value) {
            if(key != "count"){
              content = content + "<li> "+ key +": "+ value +"</li>";
            }
        });

        $("#deleted").html(content);

        console.log(content);
        console.log(json);

    });

    $("#clearme").click(function(){
      chrome.runtime.sendMessage({
        "from": "from-popup",
        "subject": "clear-history",
        "domain": domain
        });
    });

});
