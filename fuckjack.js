/**
 * Force Twitter to stay on the 'Latest' timeline and stop automatically switching to 'Home'.
 * This is a per-session setting; run on other users/browsers as needed.
 *
 * 1. Navigate to https://www.twitter.com
 * 2. Press F12 to open dev tools, switch to console
 * 3. Paste this whole script in.
 */
(() => {
  let id = document.cookie.match(/(twid=u%3D)([^;]+)/);
  if (!id) throw new Error('Could not retrieve user ID (make sure you run this on twitter.com)');
  id = id[2];

  let db = window.indexedDB.open('localforage', 2);
  db.onerror = console.error;
  db.onsuccess = () => {
    let t = db.result.transaction('keyvaluepairs', 'readwrite');
    let s = t.objectStore('keyvaluepairs');

    let vals = {
      [`user:${id}:rweb.homeTimelineBehavior`]: { useLatest: true },
      [`user:${id}:rweb.homeTimelineLastFrustrationEventTimestamp`]: { lastFrustrationEventTimestamp: 9999999999999 }
    };
    
    for (let key in vals) {
      let req = s.put(vals[key], key);
      req.onsuccess = console.log;
      req.onerror = console.error;
    }
  }
})();
