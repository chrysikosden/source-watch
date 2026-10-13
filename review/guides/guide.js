"use strict";
(() => {
  const remember = document.getElementById("rememberChecklist");
  if (!remember) return;
  const boxes = [...document.querySelectorAll("[data-check]")];
  const notes = document.getElementById("feedbackNotes");
  const count = document.getElementById("checkCount");
  const progress = document.getElementById("checkProgress");
  const status = document.getElementById("checkStatus");
  const storageKey = "tubeunpackBeta13GuideChecklist:v1";
  function message(text) { status.textContent = text; }
  function update() {
    const checked = boxes.filter(box => box.checked).length;
    progress.max = boxes.length;
    progress.value = checked;
    count.textContent = `${checked} of ${boxes.length} items reviewed`;
    if (remember.checked) {
      try { localStorage.setItem(storageKey, JSON.stringify({version:1, checked:boxes.filter(box => box.checked).map(box => box.dataset.check)})); }
      catch { remember.checked = false; message("This browser could not remember choices. They remain in this tab only."); }
    }
  }
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || "null");
    if (saved?.version === 1 && Array.isArray(saved.checked)) {
      remember.checked = true;
      const selected = new Set(saved.checked.filter(value => typeof value === "string"));
      boxes.forEach(box => { box.checked = selected.has(box.dataset.check); });
      message("Restored the checkbox choices previously remembered on this device. No notes were stored.");
    }
  } catch { message("Saved choices could not be read. This checklist still works in the current tab."); }
  boxes.forEach(box => box.addEventListener("change", update));
  remember.addEventListener("change", () => {
    if (!remember.checked) {
      try { localStorage.removeItem(storageKey); message("Remembering is off. Choices remain in this tab; the stored checklist record was removed."); }
      catch { message("Remembering is off in this tab, but browser storage could not be cleared. Use this browser's site-data controls if needed."); }
    } else message("Only checkbox choices will be remembered on this device. Feedback notes will not be stored.");
    update();
  });
  document.getElementById("clearChecklist").addEventListener("click", () => {
    if (!window.confirm("Clear this checklist's choices and the note in this tab? Downloaded files and TubeUnpack data will not be changed.")) return;
    remember.checked = false;
    boxes.forEach(box => { box.checked = false; });
    notes.value = "";
    let cleared = true;
    try { localStorage.removeItem(storageKey); } catch { cleared = false; }
    update();
    message(cleared ? "Checklist cleared on this device and in this tab. Downloaded files and app data were not changed." : "This tab was cleared, but browser storage could not be removed. Review browser site-data controls; app data was not changed.");
  });
  document.getElementById("downloadFeedback").addEventListener("click", () => {
    const lines = boxes.map(box => `${box.checked ? "[Reviewed]" : "[Not marked]"} ${box.closest("label").querySelector("strong").textContent}`);
    const text = ["TubeUnpack invited beta feedback", "Candidate: 4.0.0-beta.13 — unsigned private candidate", "Checklist marks record review, not passing or distribution approval.", "", ...lines, "", "Feedback note:", notes.value.trim() || "No note entered.", "", "Before sharing: redact tokens, credentials, account details, private transcripts and logs."].join("\n");
    const url = URL.createObjectURL(new Blob([text], {type:"text/plain;charset=utf-8"}));
    const anchor = document.createElement("a");
    anchor.href = url; anchor.download = "tubeunpack-beta13-feedback.txt";
    document.body.append(anchor); anchor.click(); anchor.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    message("Feedback file prepared for download. Nothing was submitted. Review and redact it before sharing.");
  });
  update();
})();
