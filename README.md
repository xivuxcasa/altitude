# Altitude: Outlook add-in

See your Outlook inbox from above. Altitude groups your mail into tiles by **person** (who writes most), **client** (external company by email domain), **topic** (most used words in subjects) and **smart filters** (this morning, attachments, unread, waiting on your reply, calendar invites, notifications). No AI: the grouping is counting and simple rules that run in your browser. Nothing is sent to a server other than Microsoft Graph.

## What's in version 1

- **Side panel** (`taskpane.html`): opens from **Altitude → Helicopter view** on any open email. You can pin it so it stays open while you browse.
  - Lists all groups with their counts
  - **Search** by sender, address, subject or preview, across the whole inbox or inside one group. Every word must match, in any order.
  - **All / Unread / Flagged** tabs, with counts that follow your search
  - Click an email to open it in Outlook (connected mailbox only)
  - **Auto refresh** every 5 minutes while the panel is visible (connected mailbox only). It pauses when the panel is hidden and catches up when you come back. The ↻ button refreshes right away.
- **Helicopter view** (`dialog.html`): a large dialog with the group tiles. Press Space while the panel has focus, or click the button. Click a tile to open that group in the panel. Esc or Space closes it.
- **Data**: an example inbox of 200 made-up emails until you connect your mailbox. After that, your last 200 Inbox messages through Microsoft Graph (`Mail.Read`, read-only).

## Install it for yourself (GitHub Pages)

GitHub Pages gives the add-in a public HTTPS address, so you don't need a local certificate or Node.js.

### 1. Put the code on GitHub
1. On github.com, create a new **public** repository named `altitude`, with no README.
2. In Terminal:
   ```bash
   cd /Users/juan/Downloads/labels/altitude-addin
   git add -A
   git commit -m "Altitude add-in v1"
   git remote add origin https://github.com/xivuxcasa/altitude.git
   git push -u origin main
   ```
   If your GitHub username isn't `xivuxcasa`, use your own in the remote URL here and in step 2.
3. On GitHub, go to **Settings → Pages → Build and deployment**, set **Source: Deploy from a branch**, choose **main / (root)**, and click **Save**.
4. After a minute, check that https://xivuxcasa.github.io/altitude/taskpane.html opens.

### 2. Make the manifest point at GitHub Pages
`manifest.hosted.xml` is already generated for `https://xivuxcasa.github.io/altitude`. For a different address, run:
```bash
python3 make_manifest.py https://<your-username>.github.io/altitude
```

### 3. Add it to Outlook
1. Go to https://aka.ms/olksideload (Outlook on the web opens the add-ins dialog).
2. Go to **My add-ins → Custom add-ins → Add a custom add-in → Add from file**, and pick **`manifest.hosted.xml`**.
3. Open any email and click **Altitude → Helicopter view**. It's in the email's toolbar or under **Apps**.

This works in Outlook on the web and in the new Outlook for Mac and Windows. Add-ins you install this way follow your account to every device.

If **Add from file** is missing, your Microsoft 365 admin has turned off custom add-ins.

### 4. Connect your mailbox (optional, needs a work or school account)
1. In https://entra.microsoft.com go to **App registrations → New registration** and name it "Altitude".
   - Supported account types: **Accounts in any organizational directory and personal Microsoft accounts**, or just your own organisation.
2. Under **Authentication → Add a platform → Single-page application**, add this redirect URI: `brk-multihub://xivuxcasa.github.io`
3. Under **API permissions → Add → Microsoft Graph → Delegated**, add `Mail.Read` and `User.Read`.
4. Copy the **Application (client) ID** into `config.js` as `clientId`, then commit and push again.
5. In the panel, click **Connect my mailbox** and approve the permissions.

## Updating

Edit the files, then `git commit` and `git push`. GitHub Pages updates within a minute or two and Outlook picks up the new files the next time the panel opens. You only need to sideload again if you change the manifest.

## Local development (optional)

`manifest.xml` points at `https://localhost:3000`. To use it, install a trusted localhost certificate (`npx office-addin-dev-certs install`, which needs Node.js), then run `python3 serve.py` and sideload `manifest.xml` instead. Don't install both manifests at once, because they share the same add-in ID.

## Settings (`config.js`)

| Setting | Default | Meaning |
|---|---|---|
| `clientId` | empty | Entra app ID. Empty means example inbox only |
| `maxMessages` | 200 | How many recent Inbox messages to read |
| `refreshMinutes` | 5 | Auto refresh interval while the panel is open |

## Known limits

- **Space works only while Altitude has focus.** Outlook doesn't let add-ins register global keyboard shortcuts (Office.js shortcuts are documented for Excel and Word only).
- **Altitude can't filter Outlook's own message list.** Groups open in Altitude's panel, and from there Outlook opens each email.
- **The button appears on an open email** (read surface), not on the inbox itself.
- **Read-only:** v1 can't mark as read, flag or archive. That would need `Mail.ReadWrite`.
- **Company names come from domains:** `veshel.nl` shows as "Veshel".
