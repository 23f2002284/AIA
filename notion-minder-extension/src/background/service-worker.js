const REMINDER_ALARM_NAME = 'notionMinderAlarm';
const REMINDER_PERIOD_MINUTES = 10;

function isShallowSite(url, shallowSites) {
  if (!url || !shallowSites) return false;
  const sites = shallowSites.split('\n').map(s => s.trim()).filter(Boolean);
  return sites.some(site => url.includes(site));
}

function checkTabAndManageAlarm(tabId, url) {
  chrome.storage.local.get(['settings'], (result) => {
    if (result.settings) {
      if (isShallowSite(url, result.settings.shallowSites)) {
        chrome.alarms.get(REMINDER_ALARM_NAME, (alarm) => {
          if (!alarm) {
            chrome.alarms.create(REMINDER_ALARM_NAME, { delayInMinutes: REMINDER_PERIOD_MINUTES });
          }
        });
      } else {
        chrome.alarms.clear(REMINDER_ALARM_NAME);
      }
    }
  });
}

chrome.tabs.onActivated.addListener(async (activeInfo) => {
  const tab = await chrome.tabs.get(activeInfo.tabId);
  if (tab) checkTabAndManageAlarm(tab.id, tab.url);
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.url) checkTabAndManageAlarm(tabId, changeInfo.url);
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === REMINDER_ALARM_NAME) {
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'icons/icon-128.png',
      title: 'Notion Minder',
      message: 'Time for a quick reflection. What have you been working on?',
      priority: 2
    });
  }
});