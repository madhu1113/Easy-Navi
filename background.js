console.log("Madhu Priya from backgroun-js");

var dictionary = {};

function return_redundancy(domain){
  if(dictionary[domain] == null){
    return {};
  } else {
    return dictionary[domain].redundancy;
  }
}

function return_history_of_events(domain){
  if(dictionary[domain] == null){
    return {"count": 0};
  } else {
    return dictionary[domain].history_of_events;
  }
}

chrome.runtime.onMessage.addListener(function (msg, sender, callback) {
  if (msg.from === "from-content-script"){
      if (msg.subject == "push-data"){
          dictionary[msg.domain] = {
            "redundancy": msg.redundancy,
            "history_of_events": msg.history_of_events
          };
          console.log("Am i collecting?", msg);
      } else {
          // Fetch Data
          callback(return_redundancy(msg.domain));
      }
  } else if (msg.from == "from-popup"){
      if (msg.subject == "pull-history") {
        callback(return_history_of_events(msg.domain));
      } else {
          dictionary[msg.domain] = {
            "redundancy": {},
            "history_of_events": {"count": 0}
          };
      }
  }


});
console.log("Madhu Priya from backgroun-js");
