
console.log("background ");

var dictionary = {};

function return_log(domain){
  if(dictionary[domain] == null){
    return {};
  } else {
    return dictionary[domain].log;
  }
}

function return_navigation(domain){
  if(dictionary[domain] == null){
    return {"count": 0};
  } else {
    return dictionary[domain].navigation;
  }
}

chrome.runtime.onMessage.addListener(function (msg, sender, callback) {
  if (msg.from === "from-content-script"){
    if (msg.subject == "push-data"){
        dictionary[msg.domain] = {
          "log": msg.log,
          "navigation": msg.navigation
        };
        console.log("Am i collecting?");
        console.log(msg.log);
    } else {
      // Fetch Data
      callback(return_log(msg.domain));
    }
  } else if (msg.from == "from-popup") {
    // Popup.js
    console.log("popup polled");
    callback(return_navigation(msg.domain));
  }

});
