let blockHolder;

const unlockNotification = () => {
  chrome.storage.session.set({'isNotifyDisabled': 0}).then(() => {
    console.log("notification is unLoked");
    chrome.contentSettings['notifications'].clear({});
    chrome.action.setIcon({
      'path': {
        '19': 'images/icon-on-19.png',
        '38': 'images/icon-on-38.png'
      }
    });
  });
  console.log("after unlockNotification");
}

const lockNotification = () => {
  chrome.storage.session.set({'isNotifyDisabled': 1}).then(() => {
    chrome.contentSettings['notifications'].set({
      'primaryPattern': '<all_urls>',
      'setting': 'block'
    });
    chrome.action.setIcon({
      'path': {
        '19': 'images/icon-off-19.png',
        '38': 'images/icon-off-38.png'
      }
    });
    delayUnlock(5000);
    console.log("after lockNotification");
  });
}

function delayUnlock(ms) {
  var timeWatcher;

  var promise = new Promise(() =>
    timeWatcher = setTimeout(() => {
      console.log("delayed unlockNotification was succesfully invoked");
      blockHolder = undefined;
      unlockNotification();
    }, ms)
  );

  blockHolder = {
    promise,
    cancel: () => {
      console.log("cancel locking by call unlockNotification");
      clearTimeout(timeWatcher);
      blockHolder = undefined;
      unlockNotification();
    }
  };
}

chrome.action.onClicked.addListener(function(tab) {
  chrome.storage.local.get({'isNotifyDisabled': 0}, (data) => {
    console.log("isNotifyDisabled:", data['isNotifyDisabled'] ? 1 : 0, "blockHolder:", blockHolder ? 1 : 0);
    if (blockHolder) blockHolder.cancel();
    data['isNotifyDisabled'] ? unlockNotification() : lockNotification();
  });
});



// chrome.storage.local.set({'isNotifyDisabled': 0}, unblockNotification);




// // https://learn.javascript.ru/task/delay-promise
// // function delay(ms) {
// //   return new Promise(resolve => setTimeout(resolve, ms));
// // }
// // delay(3000).then(() => alert('выполнилось через 3 секунды'));

// // https://stackoverflow.com/questions/25345701/how-to-cancel-timeout-inside-of-javascript-promise
// function delayAction(ms, delayFunc) {
//   var timeWatcher;

//   var promise = new Promise((resolve, reject) =>
//     timeWatcher = setTimeout(delayFunc, ms)
//   );

//   return {
//     promise,
//     cancel: () => clearTimeout(timeWatcher)
//   };
// }

// // var timeOutObj = delayAction(() => console.log("Hello"), 3000); 

// // timeOutObj.promise.then(function(result) { 
// //   console.log(result); // timeout done
// // });

// // //Cancel it.
// // timeOutObj.cancel();

// chrome.storage.local.get({'isNotifyDisabled': 0},
//   function (data) {
//     setNotificationSetting(data['isNotifyDisabled']);
//   }
// );

// chrome.action.onClicked.addListener(function(tab) {
//   chrome.storage.local.get({'isNotifyDisabled': 0},
//     function (data) {
//       // ?
//       setNotificationSetting(data['isNotifyDisabled'] ? 1 : 0);
//     }
//   );
// });


// function setNotificationSetting(isDisabled) {
//   chrome.storage.local.set({'isNotifyDisabled': isDisabled});

//   if (isDisabled) {
//     chrome.contentSettings['notifications'].set({
//       'primaryPattern': '<all_urls>',
//       'setting': 'block'
//     });

//     chrome.action.setIcon({
//       'path': {
//         '19': 'images/icon-off-19.png',
//         '38': 'images/icon-off-38.png'
//       }
//     });
//   } else {
//     chrome.contentSettings['notifications'].clear({});

//     chrome.action.setIcon({
//       'path': {
//         '19': 'images/icon-on-19.png',
//         '38': 'images/icon-on-38.png'
//       }
//     });
//   }
// }
