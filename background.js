chrome.storage.local.get({'notificationSetting': 'none'},
  function (data) {
    setNotificationSetting(data['notificationSetting']);
  }
);

chrome.action.onClicked.addListener(function(tab) {
  chrome.storage.local.get({'notificationSetting': 'none'},
    function (data) {
      setNotificationSetting(data['notificationSetting'] != 'block' ? 'block' : 'none');
    }
  );
});


function setNotificationSetting(setting) {
  chrome.storage.local.set({'notificationSetting': setting});

  if (setting == 'block') {
    chrome.contentSettings['notifications'].set({
      'primaryPattern': '<all_urls>',
      'setting': setting
    });

    chrome.action.setIcon({
      'path': {
        '19': 'images/icon-off-19.png',
        '38': 'images/icon-off-38.png'
      }
    });
    chrome.action.setTitle({
      'title': 'Unmute notifications'
    });
  } else {
    chrome.contentSettings['notifications'].clear({});

    chrome.action.setIcon({
      'path': {
        '19': 'images/icon-on-19.png',
        '38': 'images/icon-on-38.png'
      }
    });
    chrome.action.setTitle({
      'title': 'Mute notifications'
    });
  }
}
