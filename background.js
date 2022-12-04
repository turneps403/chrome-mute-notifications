chrome.alarms.create("1min_badge_refresh", {
  periodInMinutes: 1
});

const minSilence = 60;

const setBadge = (num) => {
    chrome.action.setBadgeText({text: num ? num.toString() : ""});
    if (num <= 10) {
      chrome.action.setBadgeBackgroundColor({color: "#FFB6C1"});
    } else if (num <= 20) {
      chrome.action.setBadgeBackgroundColor({color: "#FFFACD"});
    } else {
      chrome.action.setBadgeBackgroundColor({color: "#B0C4DE"});
    }
}

const unlockNotification = () => {
  chrome.storage.session.set({'hasStoppedAt': 0}, () => {
    setBadge(0);
    chrome.contentSettings['notifications'].clear({});
    chrome.action.setIcon({
      'path': {
        '16': 'images/volume-16.png',
        '24': 'images/volume-24.png',
        '32': 'images/volume-32.png',
        '64': 'images/volume-64.png'
      }
    });
    console.log("notification is unLoked");
  });
}

const lockNotification = () => {
  chrome.storage.session.set({'hasStoppedAt': Date.now() + minSilence * 60_000}, () => {
    setBadge(minSilence);
    chrome.contentSettings['notifications'].set({
      'primaryPattern': '<all_urls>',
      'setting': 'block'
    });
    chrome.action.setIcon({
      'path': {
        '16': 'images/volume-mute-16.png',
        '24': 'images/volume-mute-24.png',
        '32': 'images/volume-mute-32.png',
        '64': 'images/volume-mute-64.png'
      }
    });
    console.log("after lockNotification");
  });
}

chrome.alarms.onAlarm.addListener(function(alarm) {
  if (alarm.name === "1min_badge_refresh") {
    chrome.storage.session.get(['hasStoppedAt'], function(data) {
      if (data.hasStoppedAt) {
        if (Date.now() >= data.hasStoppedAt) {
          unlockNotification();
        } else {
          let min_left = (data.hasStoppedAt - Date.now()) / 60_000;
          setBadge(min_left.toFixed());
        }
        console.log("onAlarm.addListener work properly");
      } else {
        console.log("onAlarm.addListener no hasStoppedAt, data:", data);
      }
    })
  }
});

chrome.action.onClicked.addListener(() => chrome.storage.session.get(['hasStoppedAt'], function(data) {
  data.hasStoppedAt ? unlockNotification() : lockNotification();
}));

console.log("reload");