chrome.alarms.create("1min_badge_refresh", {
  delayInMinutes: 1,
  periodInMinutes: 1
});

const minSilence = 60;

let hasStoppedAt;

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
  hasStoppedAt = undefined;
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
}

const lockNotification = () => {
  hasStoppedAt = Date.now() + minSilence * 60_000;
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
}

chrome.alarms.onAlarm.addListener(function(alarm) {
  if (alarm.name === "1min_badge_refresh" && hasStoppedAt) {
    if (Date.now() >= hasStoppedAt) {
      unlockNotification();
    } else {
      let min_left = (hasStoppedAt - Date.now()) / 60_000;
      setBadge(min_left.toFixed());
    }
  }
});

chrome.action.onClicked.addListener(() => hasStoppedAt ? unlockNotification() : lockNotification());