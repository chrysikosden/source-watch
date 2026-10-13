TUBEUNPACK - INVITED WINDOWS BETA

This is an unsigned beta candidate, not a generally available release.
It includes Python: no separate Python install or terminal is required.
Use Windows 10/11 x64. Windows may show an unknown-publisher or reputation
warning. The app is not code-signed; do not disable Windows protections.
Only use an artifact obtained from the expected Source Watch distributor.

INSTALL AND OPEN
Run the setup EXE. Choose the destination folder. The default is a per-user
installation; an all-users installation requires administrator approval.
Desktop shortcut and "Start TubeUnpack with Windows" are optional and off by default.
The startup option runs in the background when you sign in to Windows.
It does not open your browser or check for updates.
Open TubeUnpack from Start. Your browser and welcome guide open.
Choose Start setup, then Connect YouTube before importing subscriptions.
Closing the browser does not stop the local server. Use the separate Stop
TubeUnpack Start-menu shortcut when you want it stopped.

GOOGLE CONNECTION
The installer supplies TubeUnpack's shared Google Desktop application
registration. It never includes anyone's account token, password or subscriptions.
Click Connect YouTube and Continue to Google. No configuration file, Google
developer account or terminal is required. Like other desktop application
registrations, these shared registration values can be extracted from the app;
they are not your personal permission to access YouTube.
While Google's consent application remains in Testing, only invited Google
accounts can complete sign-in. This beta does not claim production verification.
TubeUnpack never asks for your Google password. Authenticate only on Google.
Choose the Google account (and brand identity if offered) that owns your
subscriptions/playlists. Review the exact permissions shown before redirect:
openid, userinfo.email, youtube.readonly and youtube management access.
This is NOT a read-only integration. Management enables only the supported
playlist/subscription changes that you deliberately request.
An unverified-app warning means Google has not verified the app for public use.
Continue only if invited and the app matches the expected beta; otherwise
choose Back to safety. Review/select permission checkboxes Google shows,
choose Continue/Done as applicable, and return to TubeUnpack.
Testing-mode connections can require reconnection after seven days.
Import Subscriptions lets you review channels before adding them to your feed.

PLAYER AND BROWSER TABS
Setup & Preferences > Video player & tabs controls outside-click dismissal and
whether video links open TubeUnpack or YouTube. The default keeps videos inside
TubeUnpack and requires X or Escape to close the video window. Resize its corner
on desktop, use Expand/Restore, or drag the divider beside the video.
Description and Transcript are separate tabs beside playback. Caption availability
is not guaranteed. Timestamp buttons seek within the embedded YouTube player.
Middle/Ctrl-click navigation or video links to open independent browser tabs.
Local saves and feed results synchronize; navigation and selections stay per tab.
Feed fallback uses the connected YouTube uploads API and its normal quota.
No YouTube write action is performed merely to refresh a feed.
Source Watch Later is an optional ordinary private YouTube playlist, created
only with your approval; YouTube's built-in Watch Later is not supported.
Queued writes are not automatically replayed simply because you reconnect.

SAVED VIDEOS AND PLAYBACK
Save to folders... lets you choose folders or create one immediately. Saving without a
folder keeps a video in All saved. These saves stay on this computer and do not
change YouTube playlists. A video may belong to more than one local folder.
In Saved & Folders, select videos to add to folders or move them from the current
folder. Moving keeps memberships in other folders. The pencil beside a folder
renames it. Dragging from All saved adds to the target; dragging from a folder
moves that membership. Undo reverses the most recent library action this session.
Removing from a folder keeps the video saved. Removing from All saved removes
all local folder memberships, but keeps notes and research.
Play buttons open the official YouTube player in TubeUnpack. Playback contacts
YouTube; this is not offline playback. For restricted videos use Open in YouTube.

SAVED RESEARCH
Saved Research now has Research Projects and Saved Analyses tabs. Projects group
videos and conclusions. Saved Analyses contains the responses you manually paste
through Save analysis result. Give a response a name, optionally add its video to
a project, and use View saved result after saving to find it immediately.
You can search, edit, rename, export and separately delete analyses. Removing a
video from the desk or deleting a project keeps its analysis and transcript.
One editable response is stored per video; export it before replacing it if you
want to retain a separate version. Project Rename and Delete are on the list and
inside an opened project. Delete asks for confirmation.

Copy Simple + Transcript and Copy Deep + Transcript copy the original curated
instructions with the complete transcript. The initiating button shows fetching,
copying, completion or failure. Batch loading shows actual completed requests.
The arrow beside Open assistant changes the preferred provider website, including
DeepSeek. Setup & Preferences > Analysis buttons chooses visible actions and has
Restore default buttons. The preferred assistant is also in Video player & tabs.
You select the underlying AI model after opening its website. TubeUnpack does not
retrieve your AI conversations or submit anything automatically.

Add to research... beside a video's folder saving opens your saved research list.
Type to find an existing session, or create one while adding. Batch Add selected
to research... is beside Send to Analysis Desk. Inside a session, Add videos...
searches the local video library. Videos already included are identified.
TubeUnpack tries to load missing captions as videos enter a session. Ready,
loading and unavailable statuses are shown; retry or paste a transcript when
captions cannot be retrieved. Caption availability is not guaranteed.
Above the videos, select the sources and copy transcripts alone or + prompt.
The comparison prompt asks your assistant to evaluate claims, evidence,
agreements, disagreements and uncertainty. Original single-video prompts remain.
Copy + open opens your preferred assistant and copies the package. Paste it there;
nothing is automatically submitted. A missing source needs retry or your explicit
choice to use only available sources. Large packages warn; text is not truncated.
Download text file is available when pasting is inconvenient; provider limits
still apply. These transcripts and research may contain private material.

PRIVACY AND STORAGE
Program files and user data are separate. User data is kept at:
%LOCALAPPDATA%\SourceWatchV4
Sources, saves, notes, cached transcripts and research stay on your computer.
Local-first does not mean offline: Google/YouTube receive service requests.
Text you manually send to ChatGPT is handled by ChatGPT. Source Watch does not
automatically send transcripts there or retrieve your ChatGPT conversations.
Windows protects the OAuth token for your Windows user; research files are
not promised to be encrypted. Malware running as you can still access data.
Disconnect removes the local connection; revoke Google-side access separately
in your Google account if required. Keep your data folder private.

UPDATES
By default, TubeUnpack checks for an update when you open the application. The
dashboard opens immediately even when the update site is slow or unavailable.
In Setup & Preferences > Application updates, turn off "Check for updates when
I open TubeUnpack" if you prefer manual checks. "Check now" remains available
there at any time. Choose View update to read release notes, or Later to
continue working. Downloads
show actual progress and require your approval. After verification, choose
Open installer and follow its steps. Your existing installation folder is
remembered, and your local data stays in place. Save pending work first.
Announcements are signed by the publisher, and the installer file is checked
again before opening. This does not mean the EXE is Windows code-signed.
No updater service, scheduled task or silent install is added. This candidate's
public update announcement has not yet been published. Until publication,
the app reports that no announcement is available and remains usable.
Optional server-only startup does not open a browser or check for updates.

UNINSTALL
Save work and use Stop TubeUnpack. Uninstall through Windows Installed
apps. Local research is kept by default. Interactive per-user uninstall offers
two explicit confirmations before deleting data. Silent/all-users uninstall
always keeps user data; each user can remove their own data folder separately.
Uninstalling cannot revoke Google-side access by itself.

FEEDBACK
Report the version, Windows version, browser, steps and visible error message
to the person who invited you. Do not send token/configuration files, your
whole data folder, private transcripts, account details or unredacted logs.
See RELEASE_NOTES.md for beta limitations.
