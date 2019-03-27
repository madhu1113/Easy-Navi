


setInterval(function(){
    chrome.tabs.query({
      active: true,
      currentWindow: true
    }, function (tabs) {
      // Sends a message to the content-script running on that tab !!
        var url = tabs[0].url;
        var arr = url.split("/");
        var domain = arr[0] + "//" + arr[2];

        chrome.runtime.sendMessage({
          "from": "from-popup",
          "domain": domain
        }, function(json){
            console.log(json);
          // $("#fillme").
        });
    });
}, 1000);
