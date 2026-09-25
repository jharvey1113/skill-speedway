/**
 * Skill Speedway class sheet.
 *
 * Paste this into Extensions > Apps Script of a Google Sheet, then
 * Deploy > New deployment > Web app (Execute as: Me, Who has access: Anyone).
 * The game sends race results here and reads the class roster and settings.
 *
 * Tabs it keeps (created on first use):
 *   Roster    - one row per student. Type a name in the Name column to add a student.
 *   Races     - one row per race.
 *   Answers   - one row per question, for IEP data.
 *   Settings  - class name, teacher PIN, and game settings.
 */

var ROSTER_COLS = ['Student ID', 'Name', 'Active', 'Car color', 'Car number', 'Trophies', 'Unlocked levels', 'Current levels', 'Accommodations'];
var RACE_COLS = ['Date', 'Student', 'Race', 'Level', 'Level name', 'Questions', 'Right first try', 'Accuracy %', 'Place', 'Race seconds',
  'Avg answer seconds', 'Words per minute', 'Session ID', 'Student ID', 'Pack', 'At', 'Data'];
var ANSWER_COLS = ['Date', 'Student', 'Race', 'Level', 'Type', 'Question', 'Right answer', 'Student answer', 'Correct', 'Seconds', 'Session ID'];
var SETTINGS = [
  ['Class name', 'My Class', 'Shown to students when they open the class link'],
  ['Teacher PIN', '2026', '4 numbers. Opens the Teacher Dashboard for this class'],
  ['pace', 'chill', 'chill, steady or speedy'],
  ['questions', '10', 'Questions per race: 5, 8, 10, 15 or 20'],
  ['choices', 'auto', 'Answer choices: auto (3, growing to 6 as students improve) or a number from 2 to 6'],
  ['read', 'true', 'Read questions aloud: true or false'],
  ['voiceRate', '0.95', 'Talking speed: 0.8 to 1.05'],
  ['scan', 'false', 'One-switch scanning: true or false'],
  ['scanSpeed', '2', 'Seconds each answer stays lit when scanning'],
  ['autoLevel', 'true', 'Unlock the next level at 80%: true or false'],
  ['music', 'true', 'Music: true or false']
];
var TYPE_NAMES = { g: 'Gate', p: 'Pit stop', s: 'Spelling word', k: 'Typed word' };
var COLORS = ['#e0302a', '#2f6fe0', '#22b35a', '#ff8a1f', '#7b4bd1', '#ffcf3a', '#ff6fae', '#1fb5c9'];

function doGet(e) { return handle_((e && e.parameter) || {}); }

function doPost(e) {
  var body = {};
  try { body = JSON.parse(e.postData.contents); } catch (err) { body = {}; }
  return handle_(body);
}

function handle_(b) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(25000);
    ensureSheets_();
    switch (b.a) {
      case 'class': return out_({ ok: true, name: setting_('Class name'), settings: publicSettings_(), roster: readRoster_(false) });
      case 'auth': return out_({ ok: pinOk_(b.pin) });
      case 'race': saveRace_(b.s, b.driver); return out_({ ok: true });
      case 'car': saveCar_(b.driver); return out_({ ok: true });
      case 'data':
        if (!pinOk_(b.pin)) return out_({ ok: false, error: 'pin' });
        return out_({ ok: true, name: setting_('Class name'), settings: publicSettings_(), roster: readRoster_(true), sessions: readSessions_() });
      case 'roster':
        if (!pinOk_(b.pin)) return out_({ ok: false, error: 'pin' });
        writeRoster_(b.roster || []); return out_({ ok: true, roster: readRoster_(true) });
      case 'settings':
        if (!pinOk_(b.pin)) return out_({ ok: false, error: 'pin' });
        writeSettings_(b.settings || {}); return out_({ ok: true, settings: publicSettings_() });
      case 'import':
        if (!pinOk_(b.pin)) return out_({ ok: false, error: 'pin' });
        (b.roster || []).forEach(function (d) { saveCar_(d, true); });
        (b.sessions || []).forEach(function (s) { saveRace_(s, null); });
        return out_({ ok: true, roster: readRoster_(true) });
      default: return out_({ ok: true, app: 'skill-speedway' });
    }
  } catch (err) {
    return out_({ ok: false, error: String(err && err.message || err) });
  } finally {
    try { lock.releaseLock(); } catch (e2) {}
  }
}

function out_(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }

function sheet_(name, cols) {
  var ss = SpreadsheetApp.getActive(), sh = ss.getSheetByName(name);
  if (!sh) {
    sh = ss.insertSheet(name);
    sh.getRange(1, 1, 1, cols.length).setValues([cols]).setFontWeight('bold').setBackground('#1b2233').setFontColor('#ffcf3a');
    sh.setFrozenRows(1);
  }
  return sh;
}

function ensureSheets_() {
  sheet_('Roster', ROSTER_COLS);
  var isNew = !SpreadsheetApp.getActive().getSheetByName('Races'), races = sheet_('Races', RACE_COLS);
  if (isNew) races.hideColumns(RACE_COLS.indexOf('Session ID') + 1, 5);
  sheet_('Answers', ANSWER_COLS);
  var st = SpreadsheetApp.getActive().getSheetByName('Settings');
  if (!st) {
    st = sheet_('Settings', ['Setting', 'Value', 'What it does']);
    st.getRange(2, 1, SETTINGS.length, 3).setValues(SETTINGS);
    st.getRange(2, 2, SETTINGS.length, 1).setNumberFormat('@');
    st.autoResizeColumns(1, 3);
  }
  var first = SpreadsheetApp.getActive().getSheetByName('Sheet1');
  if (first && first.getLastRow() === 0 && SpreadsheetApp.getActive().getSheets().length > 1) SpreadsheetApp.getActive().deleteSheet(first);
}

function settingsMap_() {
  var sh = SpreadsheetApp.getActive().getSheetByName('Settings'), vals = sh.getRange(2, 1, Math.max(1, sh.getLastRow() - 1), 2).getValues(), m = {};
  vals.forEach(function (r) { if (r[0] !== '') m[String(r[0]).trim()] = String(r[1]).trim(); });
  return m;
}
function setting_(k) { return settingsMap_()[k] || ''; }
function pinOk_(pin) { return String(pin || '') === (setting_('Teacher PIN') || '2026'); }

function publicSettings_() {
  var m = settingsMap_(), o = {};
  Object.keys(m).forEach(function (k) {
    if (k === 'Teacher PIN' || k === 'Class name') return;
    var v = m[k];
    o[k] = v === 'true' ? true : v === 'false' ? false : (v !== '' && !isNaN(Number(v))) ? Number(v) : v;
  });
  return o;
}

function writeSettings_(obj) {
  var sh = SpreadsheetApp.getActive().getSheetByName('Settings'), vals = sh.getRange(2, 1, Math.max(1, sh.getLastRow() - 1), 1).getValues();
  Object.keys(obj).forEach(function (k) {
    if (k === 'Teacher PIN') return;
    var row = -1;
    for (var i = 0; i < vals.length; i++) if (String(vals[i][0]).trim() === k) row = i + 2;
    if (row < 0) { sh.appendRow([k, String(obj[k]), '']); vals.push([k]); } else sh.getRange(row, 2).setValue(String(obj[k]));
  });
}

function parse_(v, d) { try { return v ? JSON.parse(v) : d; } catch (e) { return d; } }

function readRoster_(all) {
  var sh = SpreadsheetApp.getActive().getSheetByName('Roster'), n = sh.getLastRow() - 1;
  if (n < 1) return [];
  var rows = sh.getRange(2, 1, n, ROSTER_COLS.length).getValues(), out = [], dirty = false;
  rows.forEach(function (r, i) {
    var name = String(r[1]).trim();
    if (!name) return;
    if (!r[0]) { r[0] = Utilities.getUuid().slice(0, 12); dirty = true; }
    if (r[2] === '') { r[2] = true; dirty = true; }
    if (!r[3]) { r[3] = COLORS[i % COLORS.length]; dirty = true; }
    if (r[4] === '') { r[4] = 1 + Math.floor(Math.random() * 99); dirty = true; }
    var active = r[2] === true || String(r[2]).toLowerCase() === 'true' || String(r[2]).toLowerCase() === 'yes';
    if (!active && !all) return;
    out.push({ id: String(r[0]), name: name, active: active, color: String(r[3]), number: Number(r[4]) || 0, trophies: Number(r[5]) || 0,
      unlocked: parse_(r[6], {}), level: parse_(r[7], {}), acc: parse_(r[8], {}) });
  });
  if (dirty) sh.getRange(2, 1, n, ROSTER_COLS.length).setValues(rows);
  return out;
}

function rosterRow_(d) {
  return [d.id, d.name, d.active !== false, d.color || '', d.number == null ? '' : d.number, d.trophies || 0,
    JSON.stringify(d.unlocked || {}), JSON.stringify(d.level || {}), JSON.stringify(d.acc || {})];
}

// Replaces the roster with what the teacher saved in the game (students removed in the game are marked inactive, not deleted).
function writeRoster_(list) {
  var sh = SpreadsheetApp.getActive().getSheetByName('Roster'), cur = readRoster_(true), byId = {};
  list.forEach(function (d) { if (d && d.id && d.name) byId[d.id] = d; });
  var rows = [];
  cur.forEach(function (c) { var d = byId[c.id]; if (d) { rows.push(rosterRow_(d)); delete byId[c.id]; } else { c.active = false; rows.push(rosterRow_(c)); } });
  Object.keys(byId).forEach(function (id) { rows.push(rosterRow_(byId[id])); });
  if (sh.getLastRow() > 1) sh.getRange(2, 1, sh.getLastRow() - 1, ROSTER_COLS.length).clearContent();
  if (rows.length) sh.getRange(2, 1, rows.length, ROSTER_COLS.length).setValues(rows);
}

function findRosterRow_(sh, id) {
  var n = sh.getLastRow() - 1;
  if (n < 1) return -1;
  var ids = sh.getRange(2, 1, n, 1).getValues();
  for (var i = 0; i < ids.length; i++) if (String(ids[i][0]) === String(id)) return i + 2;
  return -1;
}

// Car changes and level-ups coming from a student's device. Unlocked levels only ever go up.
function saveCar_(d, addIfMissing) {
  if (!d || !d.id) return;
  var sh = SpreadsheetApp.getActive().getSheetByName('Roster'), row = findRosterRow_(sh, d.id);
  if (row < 0) {
    if (!addIfMissing || !d.name) return;
    var dup = readRoster_(true).filter(function (c) { return c.name.toLowerCase() === String(d.name).toLowerCase(); })[0];
    if (dup) return;
    sh.appendRow(rosterRow_(d));
    return;
  }
  var r = sh.getRange(row, 1, 1, ROSTER_COLS.length).getValues()[0], un = parse_(r[6], {}), lv = parse_(r[7], {});
  Object.keys(d.unlocked || {}).forEach(function (k) { un[k] = Math.max(un[k] || 1, d.unlocked[k]); });
  Object.keys(d.level || {}).forEach(function (k) { lv[k] = d.level[k]; });
  r[3] = d.color || r[3]; r[4] = d.number == null ? r[4] : d.number; r[5] = Math.max(Number(r[5]) || 0, d.trophies || 0);
  r[6] = JSON.stringify(un); r[7] = JSON.stringify(lv);
  sh.getRange(row, 1, 1, ROSTER_COLS.length).setValues([r]);
}

function saveRace_(s, driver) {
  if (!s || !s.id) return;
  var races = SpreadsheetApp.getActive().getSheetByName('Races'), sidCol = RACE_COLS.indexOf('Session ID') + 1, n = races.getLastRow() - 1;
  if (n > 0) {
    var found = races.getRange(2, sidCol, n, 1).createTextFinder(String(s.id)).matchEntireCell(true).findNext();
    if (found) { if (driver) saveCar_(driver); return; }
  }
  var when = new Date(s.at || Date.now()), name = s.name || '', pct = s.n ? Math.round(s.ok / s.n * 100) : 0;
  races.appendRow([when, name, s.race || s.pack, s.level, s.levelName || '', s.n, s.ok, pct, s.place, s.secs, Math.round((s.avgMs || 0) / 100) / 10,
    s.wpm || '', s.id, s.d, s.pack, s.at, JSON.stringify({ items: s.items || [], cacc: s.cacc })]);
  var ans = SpreadsheetApp.getActive().getSheetByName('Answers');
  var rows = (s.items || []).map(function (i) {
    return [when, name, s.race || s.pack, s.level, TYPE_NAMES[i.t] || 'Gate', i.p, i.a, i.c, i.ok ? 'Y' : 'N', Math.round((i.ms || 0) / 100) / 10, s.id];
  });
  if (rows.length) ans.getRange(ans.getLastRow() + 1, 1, rows.length, ANSWER_COLS.length).setValues(rows);
  if (driver) saveCar_(driver);
}

function readSessions_() {
  var sh = SpreadsheetApp.getActive().getSheetByName('Races'), n = sh.getLastRow() - 1;
  if (n < 1) return [];
  var start = Math.max(2, sh.getLastRow() - 2999), rows = sh.getRange(start, 1, sh.getLastRow() - start + 1, RACE_COLS.length).getValues();
  var c = function (name) { return RACE_COLS.indexOf(name); };
  return rows.filter(function (r) { return r[c('Session ID')]; }).map(function (r) {
    var data = parse_(r[c('Data')], {});
    return { id: String(r[c('Session ID')]), d: String(r[c('Student ID')]), pack: String(r[c('Pack')]), level: Number(r[c('Level')]) || 1,
      at: Number(r[c('At')]) || new Date(r[c('Date')]).getTime(), n: Number(r[c('Questions')]) || 0, ok: Number(r[c('Right first try')]) || 0,
      place: Number(r[c('Place')]) || 0, secs: Number(r[c('Race seconds')]) || 0, avgMs: Math.round((Number(r[c('Avg answer seconds')]) || 0) * 1000),
      wpm: r[c('Words per minute')] === '' ? undefined : Number(r[c('Words per minute')]), cacc: data.cacc, items: data.items || [] };
  });
}
