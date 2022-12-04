const skipAfter = 3600_000;
let blockTimeout;

const unlockNotification = () => {
  if (blockTimeout) {
    clearTimeout(blockTimeout);
    blockTimeout = undefined;
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
  console.log("notification is unLoked");
}

const lockNotification = () => {
  blockTimeout = setTimeout(() => {
    console.log("delayed unlockNotification was succesfully invoked");
    blockTimeout = undefined;
    unlockNotification();
  }, skipAfter);
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