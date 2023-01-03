function setAuthKey(key) {
  window.__ctlst_authkey = key;
}

export function setup() {
  setAuthKey(
    'Basic OGY1OGIxMDMtODQwOS00OTM1LWE5MDEtMjhmYzgzMWQ3ZmY1Ojg4OVYxbE1lNG9FYU5Mbmo3RFFnWTVEalNMT1g5ZHVuSGNIZmNUaVlwTEJDYWs3UmhQZzR3bzB1ajJnZk1wMmc='
  );

  const catTrackFn = window.__cat_track_event
    ? window.__cat_track_event
    : function () {
        console.log('__cat_track_event not found');
      };

  // console.log('[*] CatTrack initialized.');
  const sessionId = 'unknown';
  const userId = {};

  catTrackFn(
    {
      TRACKING_ENABLED: false,
      CONSOLE_TRACKING: true,
    },
    'docs',
    {type: 'VISIT', subType: 'DIRECT_LINK_HIT'},
    sessionId,
    userId,
    {},
    {}
  );
}
