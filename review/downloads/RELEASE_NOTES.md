# TubeUnpack 4.0.0-beta.13

## Saved Analyses and Analysis Controls

- Saved Research has Research Projects and Saved Analyses tabs. Existing results
  remain available without their video being on the desk or in a project.
- Name, search, edit, rename, export and separately delete saved analyses. Project
  rename/delete is also available from the list. Deleting a project keeps analyses.
- Save analysis result explains the manual paste workflow and its destination,
  supports optional project membership, and confirms with View saved result.
  There is one editable saved response per video; export before replacing it.
- Copy Simple + Transcript joins the existing deep action. Both curated prompts
  are unchanged. Fetching/copying feedback, real batch progress and manual-copy
  fallback make pending work visible without invented percentages.
- Setup lets users choose visible analysis actions and restore defaults. The
  split assistant chooser uses the same preference as Setup and adds DeepSeek.
  It opens the provider website; it does not select that website's internal model.
- These changes are local-first. No AI response is retrieved or automatically
  submitted. Preferences and named results are included in workspace backups.

## Current Acceptance Limits

- Beta.12 remains an unpublished internal candidate. Packaged browser checks
  exposed refused dashboard asset connections during page-load bursts. Beta.13
  increases the local HTTP connection queue; no security checks are bypassed.

- This candidate is unsigned and unpublished. A new clean-Windows VM install,
  fresh Google approval, live caption availability and user acceptance remain
  separate from automated synthetic browser checks.
- Cloud hosting, AI transcription and automatic AI submission are not introduced.

## Dependency Update

- Bundles OAuthLib 4.0.0 instead of 3.3.1 after the final dependency audit flagged
  CVE-2026-49265. Beta.10 was an unpublished internal candidate and is superseded.
- This update changes the bundled library, not the user's Google account or
  permissions. Fresh Google authorization preparation remains an acceptance check.

## Saved Research

- Add videos directly to a searchable saved research session, or create one while
  adding. Batch Add selected to research sits beside Send to Analysis Desk.
- Add videos from inside a research session using a searchable video picker.
  Existing memberships are shown and duplicates are prevented.
- Missing transcripts are prepared automatically, with actual progress, cached
  reuse, unavailable status and retry. Captions still depend on availability.
- Select research videos to copy their complete transcripts, or transcripts plus
  a critical comparison prompt. Copy + open uses the preferred AI website;
  the user pastes there. Nothing is automatically submitted to an AI.
- Missing selected transcripts require retry or an explicit choice to continue
  with available sources. Large text warns without silently shortening it.
- The original simple/deep prompts remain available; the research comparison
  prompt is separate. Saved research and selection counters now update live.
- Save to folders identifies local saving. Channel priority replaces My priority.
- Channel Videos includes a compact creator avatar and a collapsed Categories
  control beside Send to Analysis Desk.
- Includes the September 29-October 2 local Channels, player, backup/Drive and
  mobile-protocol changes. Cloud sync and AI transcription are not introduced.

## Feed Recovery, Player and Tabs

- A failing public RSS feed now falls back to the connected YouTube uploads API.
  Channel details are resolved in batches, with one recent-uploads request per
  channel. This consumes normal YouTube API quota, never writes to YouTube, and
  stops further uploads requests on permission/quota errors.
- Progress counts actual checked channels and recovered videos. Failed channels
  retain cached videos; a completely failed refresh cannot erase the old feed.
- The video window supports desktop resizing, expand/restore and a keyboard or
  draggable side-panel divider. Outside-click dismissal is off by default and
  can be enabled in Setup & Preferences > Video player & tabs.
- Click the transcript count or Transcript tab to read existing/fetched captions
  beside playback. Timestamped lines can seek via YouTube's official player API.
  Availability of captions is not guaranteed; no new AI transcription is enabled.
- Navigation supports native middle/Ctrl-click. Video links can open TubeUnpack
  or YouTube according to the preference in Setup. Explicit YouTube links remain.
- Tabs synchronize local feed and saved state while keeping navigation and
  temporary selection independent. Concurrent conflicting edits require review.
- The YouTube player controls are supplied by YouTube and are not restyled.

## Saved Videos and Playback

- Save directly to existing folders, or create a folder while saving. Local folders
  do not create or edit YouTube playlists.
- All saved includes legacy videos assigned to folders. Folder IDs and memberships
  are preserved; folder names can be edited beside each folder.
- Select multiple saved videos to add to folders, move from the current folder,
  or remove local saves. Moving preserves other folder memberships.
- Drag from All saved to add to a folder; drag from a folder to move its membership.
  Undo is available for the most recent local library action in this session.
- Play buttons open YouTube's embedded player inside TubeUnpack, including playlist
  items. Saves and transcript-status updates no longer restart the player.
- Open in YouTube remains available for videos that cannot play embedded. Both
  curated prompt variants and transcript controls remain available.
- Google Cloud's app display name was changed to TubeUnpack on 2026-09-28 and
  verified after reloading the branding page. A fresh Google login is a manual check.

## Application Updates

- Update checks run only on explicit application launch and do not delay the dashboard.
  Setup & Preferences can disable launch checks; Check now remains available.
- Signed announcements, installer size and SHA-256 are verified. Invalid, expired,
  replaced and older announcements are rejected.
- Download progress uses actual received bytes. Download and installer launch each
  require approval, and Later dismisses the update notice for this launch.
- Interrupted downloads cannot be installed. The installer is verified again before
  Windows opens it; no remote arguments or silent installation are accepted.
- Upgrades retain the existing installation directory and local data.
- TubeUnpack name and approved branding are used in the installer and shortcuts.
- Public update delivery is pending publication; the Windows EXE remains unsigned.

## Channel Management and Personal Priority

- Replace automatic channel score/role badges with Channel priority: five user-selected
  levels and an unrated default. Existing automatic scores are not user ratings.
- Explain priority on first use; show priority filtering and sorting in the main feed toolbar.
- Remove a monitored channel from its video card, Sources or Categories, with confirmation.
  Saved video metadata, notes, transcripts and analysis remain local and available.
  This does not unsubscribe on YouTube or modify playlists.
- Manage channel category memberships in Sources and Categories, with channel avatars.
- Explain the separate private Source Watch Later playlist before the first save,
  including bulk saves. Creating/reusing the playlist requires explicit approval.
- V3.2 and existing personal profiles are not bundled or modified by this build.

## Feed Certificate Fix

- Feed downloads supplement Windows trust with the bundled public CA certificates.
  Certificate and hostname validation remain required; redirect restrictions remain.
- Certificate failures explain the secure-connection problem without an opaque SSL traceback.
- Regression tests cover an empty system trust store, trusted TLS, wrong hostnames,
  and untrusted certificates. Live-feed installation results accompany the candidate.

## Corrections After Real beta.3 Testing

- Preserve case-sensitive YouTube channel identities when reading subscriptions.
  Previously channel-only connections could display fresh results but reject imports.
- Reject cached subscriptions belonging to another verified YouTube channel.
- Show the review prompt when loading finishes, even after navigation during loading.
  Hide it on entry to Import Subscriptions or subsequent navigation/dismissal.
- Place Import all subscriptions next to Import selected in a dedicated action row.
- Extend tests to channel-only accounts, not just email-identified fixtures.

## Subscription Import Corrections

- Uncertain or missing categories use Uncategorized, without blocking a selection.
- Import everything confirms the full loaded count and explains category review.
- Local batch imports save once and preserve existing sources and categories.
- Import progress uses actual channel counts; feed refresh is reported separately.
- Import errors remain visible with the server's reason and a Retry action.
- Subscription reminders dismiss on navigation and never prompt from the import page.
- Import controls wrap in smaller windows; the search field cannot overlap Show.
- Installer startup option is now "Start SourceWatch with Windows", still optional.
- Google application branding is an external setting, not changed by this installer.

Invited Windows x64 beta candidate. Not yet approved for a public download button.

- Bundled runtime, selectable install folder, Start-menu launch/stop shortcuts,
  opt-in server startup and uninstall with research retained by default.
- Empty first profile; welcome guide; YouTube connection before source import.
- Built-in shared Google Desktop app registration: no configuration-file step.
  No personal token, password, subscriptions or account data is included.
- Welcome/help scrolls on short windows; setup controls remain reachable.
- Feed/subscription progress and targeted playlist membership checks.
- Full simple/deep prompt structure preserved; personal addressee changed to
  neutral "the reader" in the release copy only.

## Known limitations

- Unsigned Windows executables. No verified-publisher claim.
- An eligible Google test account is still required while Google consent is
  in Testing. Production verification and live end-to-end login remain release gates.
- Publisher verification is configured. The signed announcement and installer
  still need publication before public update delivery can be verified.
- Transcript availability varies. The existing unofficial transcript library
  is not a guarantee of access or content rights; Gemini transcription is not
  implemented. Public/commercial distribution review remains outstanding.
- Mobile pairing is disabled pending encrypted transport.
- One local server per Windows session/port; port 8904 conflicts are reported.
- Legacy technical health/package checks may refer to older development
  packages; they do not certify this installer.
- Production Google authorization, public update delivery and broad Windows
  compatibility remain separate release gates. Consult the build/test report.
- Two historical tests expect different prompt wording; preserved curated
  prompt parity is tested separately. Do not treat the whole test suite as green.
