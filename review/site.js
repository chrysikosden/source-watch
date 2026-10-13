'use strict';
(() => {
  const release = window.SOURCE_WATCH_RELEASE || {};
  const videoId = /^[A-Za-z0-9_-]{11}$/.test(release.youtubeId || '') ? release.youtubeId : null;
  function play(start = 0) {
    if (!videoId) return;
    const frame = document.createElement('iframe');
    frame.src = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&start=${Math.max(0, Math.floor(start))}&rel=0`;
    frame.title = 'TubeUnpack workflow — recorded with the earlier Source Watch version';
    frame.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
    frame.allowFullscreen = true;
    frame.referrerPolicy = 'strict-origin-when-cross-origin';
    document.getElementById('video-player').replaceChildren(frame);
    document.getElementById('video-note').textContent = 'YouTube is now loaded. Choose the player settings for available quality and captions.';
  }
  if (videoId) {
    document.getElementById('video-status').textContent = 'The research workflow · Earlier Source Watch guide';
    const button = document.getElementById('load-video');
    button.hidden = false;
    button.addEventListener('click', () => play());
    document.querySelectorAll('[data-time]').forEach(link => {
      link.href = `https://www.youtube.com/watch?v=${videoId}&t=${link.dataset.time}s`;
      link.addEventListener('click', event => {
        event.preventDefault();
        play(Number(link.dataset.time));
        document.getElementById('watch').scrollIntoView();
      });
    });
    const external = document.createElement('a');
    external.href = `https://www.youtube.com/watch?v=${videoId}`;
    external.textContent = document.body.dataset.version === '2' ? 'Watch on YouTube' : 'Open directly on YouTube';
    external.className = 'light-link';
    document.getElementById('video-note').after(external);
  }
  let download;
  try { download = new URL(release.downloadUrl); } catch { return; }
  if (download.protocol !== 'https:' || !/^[a-fA-F0-9]{64}$/.test(release.sha256 || '') || !release.version) return;
  const link = document.getElementById('download-link');
  link.href = download.href;
  link.hidden = false;
  document.getElementById('download-pending').hidden = true;
  document.getElementById('release-badge').textContent = 'Available';
  document.getElementById('release-status').textContent = `Windows private-beta build: ${release.version}`;
  document.getElementById('release-detail').textContent = 'Download the Windows installer, then follow the setup guide. Private-beta Google access requires an eligible invited account.';
  document.getElementById('release-meta').textContent = `${release.version}${Number.isSafeInteger(release.bytes) && release.bytes > 0 ? ' · ' + (release.bytes / 1048576).toFixed(1) + ' MB' : ''} · Windows 10 / 11 · 64-bit`;
  document.getElementById('release-checksum').textContent = release.sha256;
  document.getElementById('release-verification').hidden = false;
})();
