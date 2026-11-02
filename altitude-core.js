/* Altitude core: example inbox, Graph mapping, grouping engine and tile rendering.
   Shared by taskpane.html and dialog.html. Exposes window.Altitude. */
window.Altitude = (() => {

/* ---------- Example inbox (fictional people and companies) ---------- */
const DEMO_NOW = new Date(2026, 10, 2, 11, 40);
const DEMO_SENDERS = [
  ['Lukas Brenner', 'lukas.brenner@kadeco.nl', null, 38, .3, ['Weekly priorities', 'Q4 budget review – numbers by Thursday', '1:1 agenda', 'Harbor portal status for the board', 'Veshel escalation – call at 14:00?', 'Team offsite – save the date', 'Headcount plan Q1', 'Board deck draft', 'Quick question on the Dekker pilot', 'Feedback on your Harbor portal demo', 'Q4 budget: travel line', 'Can you cover standup tomorrow?', 'Team offsite agenda – input needed'], ['Q4-budget-v3.xlsx', 'Board-deck-draft.pptx', 'Offsite-agenda.pdf'], 'Can you send me your view on this before end of day?'],
  ['Sanne de Vries', 'sanne.devries@kadeco.nl', null, 14, .35, ['Harbor portal – design review', 'Wireframes for the checkout flow', 'Team offsite – who is joining the dinner?', 'Lunch Thursday?', 'Harbor portal: copy for the login page', 'Usability test results'], ['Harbor-wireframes-v5.pdf'], 'I added comments on the login screens. Two of them need a decision from you.'],
  ['Pieter Jansen', 'pieter.jansen@kadeco.nl', null, 10, .2, ['Harbor portal – API rate limits', 'Deploy window Wednesday', 'Code review backlog', 'Route planner integration – auth question', 'Staging is down (fixed)'], ['Deploy-checklist.pdf'], 'Deploy is planned for Wednesday 21:00. I need your go by Tuesday noon.'],
  ['Amira Haddad', 'amira.haddad@kadeco.nl', null, 9, .35, ['Dekker Logistics – contract renewal 2027', 'Noord Energie proposal', 'Pipeline review Friday', 'Intro: Noord Energie CFO'], ['Noord-proposal-v2.pdf'], 'Can you check the delivery estimate in section 4 before I send it?'],
  ['Karin Hoekstra', 'karin.hoekstra@kadeco.nl', null, 6, .5, ['Q4 budget – final template', 'Expense report reminder', 'Q4 budget: please confirm cost centres', 'Invoice approval needed'], ['Q4-budget-template.xlsx'], 'Please use the attached template for Q4. Deadline is Thursday 5 November.'],
  ['IT Servicedesk', 'servicedesk@kadeco.nl', null, 6, 0, ['Password expires in 5 days', 'Ticket #48213 resolved', 'Planned maintenance Saturday'], null, 'This is an automated message from the IT Servicedesk.', 'auto'],
  ['HR People Team', 'people@kadeco.nl', null, 5, 0, ['Open enrolment closes 15 Nov', 'Team offsite – travel details', 'Q4 performance check-ins'], null, 'Here is the information you need.', 'auto'],
  ['Daan Visser', 'daan.visser@veshel.nl', 'Veshel BV', 12, .4, ['Harbor portal – sprint review', 'Harbor portal: acceptance criteria', 'Change request CR-17', 'Go-live planning Harbor portal', 'Meeting notes 28 Oct', 'Harbor portal: test accounts?', 'Escalation: login issue on staging'], ['CR-17.pdf', 'Acceptance-criteria.docx'], 'Our board asked for a firm go-live date. Can you confirm 1 December?'],
  ['Eva Smit', 'eva.smit@veshel.nl', 'Veshel BV', 9, .45, ['Harbor portal – content migration', 'Brand assets for the portal', 'Harbor portal training dates', 'Feedback round 2'], ['Brand-assets.zip'], 'We have migrated 140 of the 210 product pages.'],
  ['Veshel BV Projects', 'projects@veshel.nl', 'Veshel BV', 5, 1, ['Invoice INV-2026-0412', 'Purchase order PO-7781', 'Steering committee – minutes'], ['INV-2026-0412.pdf'], 'Please find the document attached.'],
  ['Ruben Dekker', 'ruben@dekkerlogistics.nl', 'Dekker Logistics', 8, .35, ['Route planner integration – next steps', 'Pilot results week 43', 'Contract renewal 2027', 'Route planner: driver app feedback'], ['Pilot-results-wk43.pdf'], 'Pilot results look good: average route time down 11% in week 43.'],
  ['Lotte Bakker', 'lotte.bakker@dekkerlogistics.nl', 'Dekker Logistics', 5, .3, ['Route planner – data export', 'Warehouse visit 12 Nov'], ['Route-export-oct.csv'], 'Attached is the October export.'],
  ['Femke Mulder', 'f.mulder@noordenergie.nl', 'Noord Energie', 7, .15, ['Proposal questions', 'Meeting next Tuesday?', 'Smart meter dashboard scope', 'Budget approval on our side'], ['Scope-notes.pdf'], 'We read the proposal. Three questions about data retention.'],
  ['Yusuf Demir', 'yusuf@pixelwerk.studio', 'Pixelwerk Studio', 7, .55, ['Harbor portal – illustrations v2', 'Icon set delivery', 'Invoice PW-2210', 'Harbor portal hero animation'], ['Illustrations-v2.zip'], 'Version 2 of the illustrations is attached.'],
  ['Tracker', 'noreply@tracker.app', null, 18, 0, ['[HARBOR-212] Login fails on Safari', '[HARBOR-219] Assigned to you', '[ROUTE-41] Status changed to Review', '[HARBOR-230] Ready for QA', 'Sprint 23 summary'], null, 'You are receiving this because you are watching this issue.', 'auto'],
  ['Calendar', 'calendar@kadeco.nl', null, 10, 0, ['Invitation: Harbor portal sprint review', 'Accepted: 1:1 Lukas / Juan', 'Invitation: Q4 budget sync', 'Updated: Team offsite planning', 'Invitation: Dekker pilot debrief'], null, 'Calendar update. Open the event to respond.', 'cal'],
  ['Product Weekly', 'hello@productweekly.news', null, 6, 0, ['Roadmaps that survive contact with customers', 'The quiet cost of status meetings', 'Pricing pages, revisited'], null, 'This week: three essays and one tool worth trying.', 'auto'],
  ['FlowDesk Billing', 'billing@flowdesk.io', null, 4, 1, ['Your FlowDesk receipt – October', 'Seat change confirmation'], ['Receipt-Oct-2026.pdf'], 'Thanks for your payment.', 'auto'],
  ['Teamspace', 'digest@teamspace.app', null, 5, 0, ['Your weekly Teamspace digest', '3 new posts in #harbor-portal'], null, 'Here is what happened in your spaces this week.', 'auto'],
  ['Tom Willems', 'tom@talentbridge.nl', null, 4, 0, ['Opportunity: Head of Delivery', 'Following up'], null, 'I think you would be a strong fit for a role I am recruiting for.'],
  ['Office Amsterdam', 'office@kadeco.nl', null, 5, 0, ['Heating maintenance Thursday', 'New coffee machine on the 3rd floor', 'Bike shed access cards'], null, 'A quick update from the office team.', 'auto'],
  ['Jasper Kuiper', 'jasper.kuiper@mailbox.nl', null, 3, .5, ['Padel Saturday?', 'Photos from the weekend'], ['IMG_2041.jpg'], 'Court is booked for 10:00, are you in?'],
  ['DevDays NL', 'tickets@devdays.nl', null, 4, .5, ['Your DevDays NL ticket', 'Speaker line-up announced'], ['DevDays-ticket.pdf'], 'See you in Utrecht on 26 November.', 'auto'],
];

function demoInbox() {
  let s = 20261102;
  const rnd = () => { s |= 0; s = s + 0x6D2B79F5 | 0; let t = Math.imul(s ^ s >>> 15, 1 | s); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  const pick = a => a[Math.floor(rnd() * a.length)];
  const now = DEMO_NOW;
  const weights = [];
  for (let d = 0; d < 14; d++) { const dt = new Date(now); dt.setDate(dt.getDate() - d); const wd = dt.getDay(); weights.push(d === 0 ? 1.15 : (wd === 0 || wd === 6) ? .18 : 1); }
  const wSum = weights.reduce((a, b) => a + b, 0);
  const emails = []; let id = 0;
  for (const [name, email, org, n, att, subj, files, body, flag] of DEMO_SENDERS) {
    for (let k = 0; k < n; k++) {
      let r = rnd() * wSum, d = 0; while (r > weights[d]) { r -= weights[d]; d++; }
      const date = new Date(now); date.setDate(date.getDate() - d);
      date.setHours(0, d === 0 ? 390 + Math.floor(rnd() * 305) : 420 + Math.floor(rnd() * 720), 0, 0);
      const age = (now - date) / 864e5;
      const auto = flag === 'auto' || flag === 'cal';
      let subject = pick(subj); if (!auto && rnd() < .28) subject = 'Re: ' + subject;
      emails.push({
        id: 'demo-' + id++, from: name, email, org, auto, cal: flag === 'cal', subject, date,
        attachments: files && rnd() < att ? [pick(files)] : [], preview: body,
        unread: rnd() < (age < 1 ? .72 : age < 3 ? .32 : .06), flagged: !auto && rnd() < .07,
        needsReply: !auto && (subject.includes('?') || rnd() < .14) && age < 7,
      });
    }
  }
  emails.sort((a, b) => b.date - a.date);
  return { now, myDomain: 'kadeco.nl', emails, source: 'demo' };
}

/* ---------- Microsoft Graph messages -> Altitude emails ---------- */
const FREEMAIL = new Set('gmail.com googlemail.com outlook.com hotmail.com live.com msn.com icloud.com me.com yahoo.com proton.me protonmail.com ziggo.nl kpnmail.nl planet.nl hetnet.nl home.nl xs4all.nl mailbox.nl gmx.com gmx.de web.de'.split(' '));
const AUTO_RE = /(no-?reply|do-?not-?reply|notification|newsletter|digest|mailer|bounce|updates?@|news@|marketing|info@|hello@|billing@|support@|calendar)/i;
const titleCase = s => s.replace(/(^|[-\s])([a-z])/g, (m, a, b) => a + b.toUpperCase());

function fromGraph(messages, myAddress) {
  const myDomain = (myAddress.split('@')[1] || '').toLowerCase();
  const emails = messages.map(m => {
    const addr = (m.from && m.from.emailAddress && m.from.emailAddress.address || '').toLowerCase();
    const name = (m.from && m.from.emailAddress && m.from.emailAddress.name) || addr || 'Unknown';
    const domain = addr.split('@')[1] || '';
    const type = m['@odata.type'] || '';
    const cal = type.includes('eventMessage');
    const auto = cal || AUTO_RE.test(addr) || m.inferenceClassification === 'other';
    const base = domain.split('.').slice(-2)[0] || '';
    const org = !auto && domain && domain !== myDomain && !FREEMAIL.has(domain) ? titleCase(base) : null;
    const date = new Date(m.receivedDateTime);
    return {
      id: m.id, from: name, email: addr, org, auto, cal, subject: m.subject || '(no subject)', date,
      attachments: m.hasAttachments ? ['attachment'] : [], preview: m.bodyPreview || '',
      unread: !m.isRead, flagged: !!(m.flag && m.flag.flagStatus === 'flagged'),
      needsReply: !auto && ((m.subject || '').includes('?') || m.importance === 'high') && (Date.now() - date) < 7 * 864e5,
    };
  });
  return { now: new Date(), myDomain, emails, source: 'graph' };
}

/* ---------- Grouping engine ---------- */
const STOP = new Set(('re fw fwd aw wg antw the a an and or of to for on in at by with from your you our my is are be this that next new please can quick question who joining week weekly notes update updated invitation accepted declined canceled cancelled status review agenda summary results final v2 day days today tomorrow monday tuesday wednesday thursday friday saturday sunday '
  + 'de het een en van voor met op te aan je jouw uw ons onze zijn wordt nieuwe vraag over bij naar wat hoe niet ook nog').split(' '));

function tokens(subj) {
  return subj.toLowerCase().replace(/^((re|fw|fwd|aw|wg|antw):\s*)+/g, '').replace(/\[[^\]]*\]/g, ' ').replace(/[^\p{L}\p{N} ]+/gu, ' ').split(/\s+/)
    .filter(w => w && w.length > 1 && !/^\d+$/.test(w));
}

function buildGroups(inbox) {
  const { emails, now } = inbox;
  const n = emails.length;
  const minPerson = Math.max(3, Math.round(n * .035)), minOrg = Math.max(3, Math.round(n * .025)), minTopic = Math.max(3, Math.round(n * .03));
  const startToday = new Date(now); startToday.setHours(0, 0, 0, 0);
  const groups = [];
  const add = (kind, key, name, sub, test) => { const items = emails.filter(test); if (items.length) groups.push({ kind, key, name, sub, items }); };

  const bySender = {};
  for (const e of emails) if (!e.auto) (bySender[e.email] ||= { n: 0, e }).n++;
  Object.values(bySender).filter(x => x.n >= minPerson).sort((a, b) => b.n - a.n).slice(0, 6)
    .forEach(({ e }) => add('person', 'p:' + e.email, e.from.split(/[\s,]+/)[0], e.from + ' · ' + (e.org || (e.email.endsWith('@' + inbox.myDomain) ? 'Colleague' : 'Contact')), m => m.email === e.email));

  const byOrg = {};
  for (const e of emails) if (e.org) byOrg[e.org] = (byOrg[e.org] || 0) + 1;
  Object.entries(byOrg).filter(([, c]) => c >= minOrg).sort((a, b) => b[1] - a[1]).slice(0, 6).forEach(([org]) => {
    const contacts = new Set(emails.filter(m => m.org === org).map(m => m.email)).size;
    add('client', 'c:' + org, org, 'Client · ' + contacts + (contacts === 1 ? ' contact' : ' contacts'), m => m.org === org);
  });

  const orgWords = new Set(Object.keys(byOrg).flatMap(o => o.toLowerCase().split(/\s+/)));
  const bi = {}, uni = {};
  for (const e of emails) {
    const t = tokens(e.subject).filter(w => !orgWords.has(w));
    const sb = new Set(), su = new Set();
    for (let i = 0; i < t.length - 1; i++) if (!STOP.has(t[i]) && !STOP.has(t[i + 1])) sb.add(t[i] + ' ' + t[i + 1]);
    for (const w of t) if (!STOP.has(w) && w.length > 3) su.add(w);
    sb.forEach(k => (bi[k] ||= new Set()).add(e.id));
    su.forEach(k => (uni[k] ||= new Set()).add(e.id));
  }
  const chosen = [];
  Object.entries(bi).filter(([, v]) => v.size >= minTopic).sort((a, b) => b[1].size - a[1].size)
    .forEach(([k]) => { if (!chosen.some(c => c.split(' ').some(w => k.includes(w)))) chosen.push(k); });
  Object.entries(uni).filter(([, v]) => v.size >= minTopic).sort((a, b) => b[1].size - a[1].size)
    .forEach(([k]) => { if (chosen.length < 6 && !chosen.some(c => c.includes(k) || k.includes(c))) chosen.push(k); });
  chosen.slice(0, 6).forEach(k => {
    const ids = k.includes(' ') ? bi[k] : uni[k];
    const re = new RegExp(k.split(' ').join('[^\\p{L}\\p{N}]+'), 'iu');
    const sample = emails.find(e => re.test(e.subject)); const m = sample && sample.subject.match(re);
    const senders = new Set(emails.filter(e => ids.has(e.id)).map(e => e.from)).size;
    add('topic', 't:' + k, m ? m[0].replace(/^./, c => c.toUpperCase()) : k, 'Topic · ' + senders + ' senders', e => ids.has(e.id));
  });

  add('smart', 's:morning', 'This morning', 'Since 06:00 today', e => e.date >= startToday);
  add('smart', 's:reply', 'Waiting on your reply', 'Questions addressed to you', e => e.needsReply);
  add('smart', 's:att', 'With attachments', 'Files, decks and invoices', e => e.attachments.length > 0);
  add('smart', 's:unread', 'Unread', 'Not opened yet', e => e.unread);
  add('smart', 's:cal', 'Calendar invites', 'Meetings to answer', e => e.cal);
  add('smart', 's:auto', 'Notifications & newsletters', 'Automated senders', e => e.auto && !e.cal);
  return groups;
}

/* ---------- Rendering helpers ---------- */
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const pad = n => String(n).padStart(2, '0');
const hm = d => pad(d.getHours()) + ':' + pad(d.getMinutes());
const MON = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const WD = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
const hue = str => { let h = 0; for (const c of str) h = (h * 31 + c.charCodeAt(0)) % 360; return h; };
const initials = n => n.split(/\s+/).filter(w => /^\p{Lu}/u.test(w)).slice(0, 2).map(w => w[0]).join('') || n.slice(0, 2).toUpperCase();
const daysAgo = (d, now) => { const a = new Date(now); a.setHours(0, 0, 0, 0); return Math.round((a - new Date(d.getFullYear(), d.getMonth(), d.getDate())) / 864e5); };
const shortWhen = (d, now) => { const a = daysAgo(d, now); return a === 0 ? hm(d) : a < 7 ? WD[d.getDay()] + ' ' + hm(d) : d.getDate() + ' ' + MON[d.getMonth()]; };
const ago = (d, now) => { const m = Math.round((now - d) / 6e4); if (m < 60) return m + ' min ago'; const h = Math.round(m / 60); return h < 24 ? h + ' h ago' : Math.round(h / 24) + ' d ago'; };
const avatar = (e, cls = '') => e.auto ? `<div class="av auto ${cls}">${esc(initials(e.from))}</div>` : `<div class="av ${cls}" style="--h:${hue(e.from)}">${esc(initials(e.from))}</div>`;
const KIND_LABEL = { person: 'Person', client: 'Client', topic: 'Topic', smart: 'Smart group' };
const SECTIONS = [
  { kind: 'person', title: 'People', note: 'who writes to you most' },
  { kind: 'client', title: 'Clients', note: 'external organisations by domain' },
  { kind: 'topic', title: 'Topics', note: 'most used words in subjects' },
  { kind: 'smart', title: 'Smart groups', note: 'filters across everyone' },
];

function spark(items, now) {
  const days = Array(14).fill(0);
  for (const e of items) { const a = daysAgo(e.date, now); if (a >= 0 && a < 14) days[13 - a]++; }
  const max = Math.max(1, ...days);
  return days.map(c => `<i style="height:${Math.max(6, c / max * 100)}%"></i>`).join('');
}

function tileHTML(g, now) {
  const items = g.items, unread = items.filter(e => e.unread).length;
  const att = items.filter(e => e.attachments.length).length;
  const a0 = new Date(now); a0.setHours(0, 0, 0, 0);
  const today = items.filter(e => e.date >= a0).length;
  const big = items.length >= 30, wide = items.length >= 14;
  const people = [...new Map(items.map(e => [e.from, e])).values()];
  const latest = items.slice(0, big ? 5 : wide ? 2 : 1);
  return `<button class="tile${wide ? ' w2' : ''}${big ? ' h2' : ''}" data-kind="${g.kind}" data-group="${esc(g.key)}">
    <div class="t-head"><div style="min-width:0"><div class="t-kind">${KIND_LABEL[g.kind]}</div><div class="t-name">${esc(g.name)}</div><div class="t-sub">${esc(g.sub)}</div></div>
      <div class="t-count"><b>${items.length}</b><span>emails</span></div></div>
    <div class="t-badges">${unread ? `<span class="badge">${unread} unread</span>` : ''}${today && g.key !== 's:morning' ? `<span class="badge plain">${today} today</span>` : ''}${att && g.key !== 's:att' ? `<span class="badge plain">${att} with files</span>` : ''}</div>
    <div class="t-latest">${latest.map(e => `<div><b>${esc(g.kind === 'person' ? shortWhen(e.date, now) : e.from.split(' ')[0])}</b> · ${esc(e.subject)}</div>`).join('')}</div>
    <div class="t-foot"><div class="stack">${people.slice(0, 4).map(e => avatar(e, 'sm')).join('')}</div>
      <div style="margin-left:auto;text-align:right"><div class="spark" title="Emails per day, last 14 days">${spark(items, now)}</div><div class="spark-cap">14 days · last ${ago(items[0].date, now)}</div></div></div>
  </button>`;
}

/* Serialise for dialog messaging (dates as ISO strings) */
const pack = inbox => JSON.stringify({ ...inbox, now: inbox.now.toISOString(), emails: inbox.emails.map(e => ({ ...e, date: e.date.toISOString() })) });
const unpack = json => { const o = JSON.parse(json); o.now = new Date(o.now); o.emails.forEach(e => e.date = new Date(e.date)); return o; };

return { demoInbox, fromGraph, buildGroups, tileHTML, avatar, shortWhen, esc, SECTIONS, pack, unpack };
})();
