# Skill Speedway: set up your class sheet

Connect Skill Speedway to a Google Sheet in your own Drive. Your students open one **class link**, tap their name, and every race they play on any Chromebook is saved to your sheet. It takes about 5 minutes, one time.

**What you get**
- A **Roster** tab: your students, their car, the levels they've unlocked and their accommodations
- A **Races** tab: one row per race (date, race, level, score, place, words per minute)
- An **Answers** tab: every question, the right answer, what the student picked, and how long they took, ready for IEP data
- A **Settings** tab: class name, Teacher PIN, and game settings that every Chromebook follows

Student data stays in your district Google Drive. Nothing goes anywhere else.

---

## 1. Make the sheet

1. Go to **sheets.new** to make a new Google Sheet.
2. Name it something like **Skill Speedway – Period 3**.

## 2. Add the script

1. In the sheet, click **Extensions → Apps Script**.
2. Delete the code that's there (`function myFunction() {}`).
3. Open [Code.gs](https://raw.githubusercontent.com/jharvey1113/skill-speedway/main/apps-script/Code.gs), select all (Ctrl+A), copy (Ctrl+C), and paste it into the Apps Script editor.
4. Click the **Save** icon (💾).

## 3. Turn it into a web app

1. Click **Deploy → New deployment**.
2. Click the gear ⚙️ next to "Select type" and pick **Web app**.
3. Set:
   - **Execute as:** Me
   - **Who has access:** Anyone
4. Click **Deploy**.
5. Google asks you to **Authorize access**. Pick your school account.
   - If you see "Google hasn't verified this app", click **Advanced → Go to (your project) (unsafe)**. It's your own script in your own sheet.
6. Copy the **Web app URL**. It starts with `https://script.google.com/macros/s/` and ends with `/exec`.

> "Anyone" lets students' Chromebooks send race results without signing in. The URL is long and random, and only you can open the sheet.

## 4. Connect Skill Speedway

1. Open **https://jharvey1113.github.io/skill-speedway/** on your computer.
2. Click **Teacher** (top right) and enter **2026**.
3. Open the **Data** tab, paste your Web app URL, and click **Connect**.
4. When it asks for the Teacher PIN, use **2026** (you can change it later on the Settings tab of your sheet).
   - If this computer already has students and races, it offers to copy them into your sheet.

## 5. Add students and share the class link

1. **Add students** on the dashboard's **Class** tab (one first name per line), or type names straight into the **Name** column of the **Roster** tab in your sheet.
2. On the **Data** tab, click **Copy class link** and post it in Google Classroom.
3. Students open the link, tap their name and race. The Chromebook remembers the class after that.

## 6. Change your Teacher PIN

Open the **Settings** tab in your sheet and change **Teacher PIN** to 4 numbers only you know. Use that PIN in the game from now on.

---

## Good to know

- **Offline:** if the Wi-Fi drops, races are saved on the Chromebook and upload when it's back. The start screen shows "All races saved to your class ✓" when everything is in.
- **Projecting:** open your class link on your laptop and project it. Any student can tap their name and race on the board.
- **Removing a student:** use **Delete student** on the Student tab, or set **Active** to FALSE on the Roster tab. Their past races stay in the sheet.
- **Settings for one student** (2 choices, slower speed, reading aloud, one-switch scanning) are on the dashboard's Student tab and follow them to any Chromebook.
- **If you update the script later:** in Apps Script, click **Deploy → Manage deployments → ✏️ Edit → Version: New version → Deploy**. The URL stays the same.
- **"Anyone" isn't an option** when deploying: your Google Workspace admin has limited web apps. Ask them to allow Apps Script web apps to be shared with anyone.
