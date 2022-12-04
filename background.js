const skipAfter = 3600_000;
let blockTimeout;
let badgeTimeout;

const setBadge = (num) => {
    chrome.action.setBadgeText({text: num ? num.toString() : ""});
    // no badge - no color
    if (num <= 10) {
      chrome.action.setBadgeBackgroundColor({color: "#FFB6C1"});
    } else if (num <= 20) {
      chrome.action.setBadgeBackgroundColor({color: "#FFFACD"});
    } else {
      chrome.action.setBadgeBackgroundColor({color: "#B0C4DE"});
    }
    if (num > 0) {
      let nextBadge = num - 1;
      badgeTimeout = setTimeout(() => {
        setBadge(nextBadge);
      }, 60_000);
    } else {
      badgeTimeout = undefined;
    }
}

const unlockNotification = () => {
  if (blockTimeout) {
    clearTimeout(blockTimeout);
    blockTimeout = undefined;
  }
  if (badgeTimeout) {
    clearTimeout(badgeTimeout);
    badgeTimeout = undefined;
  }
  chrome.contentSettings['notifications'].clear({});
  chrome.action.setIcon({
    'path': {
      '16': 'images/volume-16.png',
      '24': 'images/volume-24.png',
      '32': 'images/volume-32.png',
      '64': 'images/volume-64.png'
    }
  });
  chrome.action.setBadgeText({text: ""});
  console.log("notification is unLoked");
}

const lockNotification = () => {
  blockTimeout = setTimeout(() => {
    console.log("delayed unlockNotification was succesfully invoked");
    blockTimeout = undefined;
    unlockNotification();
  }, skipAfter);
  setBadge(60);
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

chrome.action.onClicked.addListener(() => blockTimeout ? unlockNotification() : lockNotification());