let messages = []
let count = 0

const data = {
  channels: [],
  matches: [],
  regexMatches: [],
  ignored: [],
  notifications: false
}
const client = new tmi.Client({
	connection: { reconnect: true }
});

createChannelSettings = function(channel) {
  browser.storage.get({channels})
}

// read settings from localStorage
chrome.storage.sync.get(Object.keys(data), (newData) => {
  Object.assign(data, newData)
  chrome.storage.sync.set(data)
})



// update data object when browser storage is updated

function updateDataObject(changes) {
  Object.keys(changes).forEach((key) => {
    // if channels
    if (key === "channels") {
      const channels = changes[key].newValue
      channels.forEach((channel) => {
        if (!client.getChannels().includes(channel)) {
          client.join(channel).then((data) => {
            console.log(`Joining ${channel}`)
            // create channel setting if not exist
            if (!Object.keys(data).includes(channel)) {
              const cSettings = {[channel]: {
                notifications: false,
                ignored: [],
                matches: [],
                regexMatches: []
              }}
              chrome.storage.sync.set(cSettings)
            }
          })
        }
      })
      client.getChannels().forEach((channel) => {
        if (!channels.includes(channel)) {
          client.part(channel).then((data) => {
            console.log(`Leaving ${channel}`)
          })
        }
      })
    }
    // end if
    data[key] = changes[key].newValue
  })
}

if (window.navigator.vendor != "Google Inc.") {
  chrome.storage.onChanged.addListener((changes) => {
    updateDataObject(changes)
  })
}

function updateNotificationCount(by) {
  chrome.browserAction.setBadgeText({
    text: (messages.length > 0) ? messages.length.toString() : null
  })
}

client.connect().then(() => {
  data.channels.forEach((channel) => {
    client.join(channel).then((data) => {
      console.log(channel)
    }).catch((err) => console.log(err))
  })
}).catch((err) => console.log(err))

function matchedTerm(message, channel, tags) {
  return new Promise((res, rej) => {
    if (data.ignored.includes(tags['display-name'].toLowerCase())) {
      return rej("Ignored User")
    }
    
    const msg = message.toLowerCase().split(" ")
    // Match regex
    data.regexMatches.forEach((t) => {
      //TODO: Allow changing of flags
      if(message.match(new RegExp(t, 'gi'))) {
        return res(t)
      }
    })
    // Match normal
    data.matches.forEach((t) => {
      if (msg.includes(t) || msg.includes("@" + t)) {
        return res(t)
      }
    })
    // Per Channel Matches
    console.log('Data object', data)
    chrome.storage.sync.get([channel], (d) => {
      const data = d[channel]
      const matches = data.matches
      const regexMatches = data.regexMatches
      console.log(matches, regexMatches)
      // Match regex
      regexMatches.forEach((t) => {
        //TODO: Allow changing of flags
        
        if(message.match(new RegExp(t, 'gi'))) {
          console.log('---- this ran x2')
          return res(t)
        }
      })
      // Match normal
      matches.forEach((t) => {
        if (msg.includes(t) || msg.includes("@" + t)) {
          console.log("----- this also ran x3")
          return res(t)
        }
      })
      return rej("No match found")
    })
  })
}

client.on('message', (channel, tags, message, self) => {
  console.log(tags.emotes)
  matchedTerm(message, channel, tags).then((matchedTerm) => {
    console.log(`matched with ${matchedTerm}`)
    if (data.notifications) {
      const notification = {
        "type": "basic",
        "iconUrl": "icons/icon-48.png",
        "title": `${tags['display-name']} said your name in ${channel}`,
        "message": message
      }
      chrome.notifications.create(notification)
    }
    messages.push({
      id: count,
      channel: channel,
      user: tags['display-name'],
      message: message,
      matchedTerm: matchedTerm,
      emotes: tags.emotes,
      time: Date.now()
    })
    count++
    updateNotificationCount()
  })
  // if (matchedTerm(message)) {

  // }
});

let portFromCS;

function connected(p) {
  portFromCS = p;
  portFromCS.postMessage(messages);
  portFromCS.onMessage.addListener(function(m) {
    portFromCS.postMessage({greeting: "In background script, received message from content script:" + m.greeting});
  });
}

chrome.runtime.onConnect.addListener(connected);
chrome.runtime.onMessage.addListener(notify);



function generateSaveJSON() {
  return {
    channels: client.getChannels(),
    ignored,
    notifications,
    matches,
    regexMatches,
  }
}

function removeMessage(id, sendResponse) {
  messages = messages.filter((el) => {
    return el.id != id
  })
  sendResponse(messages)
}

function join(message, sender, sendResponse) {

}


function loadSettings(message, sender, sendResponse) {
  const newSettings = message.settings
  chrome.storage.sync.clear(() => {
    chrome.storage.sync.set(newSettings, () => console.log("Settings updated"))
  })
}

function notify(message, sender, sendResponse) {
  switch(message.type) {
    case "reload":
      sendResponse(messages)
      break
    case "clear":
      messages = []
      sendResponse(messages)
      updateNotificationCount()
      break
    case "remove":
      removeMessage(message.id, sendResponse)
      updateNotificationCount()
      break
    case "save":
      sendResponse(generateSaveJSON())
      break
    case "load":
      loadSettings(message, sender, sendResponse)
      break
  }
}