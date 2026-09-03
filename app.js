
const studentSelect = document.getElementById('studentSelect');
const leaveBtn = document.getElementById('leaveBtn');
const outList = document.getElementById('outList');
const viewLogBtn = document.getElementById('viewLogBtn');
const adminBtn = document.getElementById('adminBtn');
const adminPanel = document.getElementById('adminPanel');
const addStudentBtn = document.getElementById('addStudentBtn');
const removeStudentBtn = document.getElementById('removeStudentBtn');
const clearLogBtn = document.getElementById('clearLogBtn');
const downloadLogBtn = document.getElementById('downloadLogBtn');
const emailLogBtn = document.getElementById('emailLogBtn');
const editTitleBtn = document.getElementById('editTitleBtn');
const closeAdminBtn = document.getElementById('closeAdminBtn');
const logPanel = document.getElementById('logPanel');
const logList = document.getElementById('logList');
const closeLogBtn = document.getElementById('closeLogBtn');
const sortToggleBtn = document.getElementById('sortToggleBtn');
const pageTitle = document.getElementById('pageTitle');
const controlsWrap = document.getElementById('controlsWrap');
const studentGrid = document.getElementById('studentGrid');
const modeDropdownBtn = document.getElementById('modeDropdownBtn');
const modeGridBtn = document.getElementById('modeGridBtn');
const gridFontSizeSection = document.getElementById('gridFontSizeSection');
const fontSizeBtns = document.querySelectorAll('.fontSizeBtn');
const themesBtn = document.getElementById('themesBtn');
const themePanel = document.getElementById('themePanel');
const themeSwatches = document.getElementById('themeSwatches');
const randomizeThemeBtn = document.getElementById('randomizeThemeBtn');
const closeThemeBtn = document.getElementById('closeThemeBtn');

let students = JSON.parse(localStorage.getItem('students')) || ['Alice','Bob','Charlie'];
let outStudents = JSON.parse(localStorage.getItem('outStudents')) || [];
let logs = JSON.parse(localStorage.getItem('logs')) || [];
let logSortMode = 'date'; // 'date' or 'student'
let displayMode = localStorage.getItem('displayMode') || 'dropdown'; // 'dropdown' or 'grid'
let gridFontSize = localStorage.getItem('gridFontSize') || 'medium'; // small | medium | large | xlarge

function save(){ localStorage.setItem('students', JSON.stringify(students)); localStorage.setItem('outStudents', JSON.stringify(outStudents)); localStorage.setItem('logs', JSON.stringify(logs)); localStorage.setItem('pageTitle', pageTitle.textContent); }

function renderStudents(){ studentSelect.innerHTML = students.map(s=>`<option value="${s}">${s}</option>`).join(''); }
function renderOut() {
  if (outStudents.length === 0) {
    outList.textContent = 'No one is out';
    return;
  }

  outList.innerHTML = outStudents.map(n => {
    const studentName = (typeof n === "string") ? n : n.name; 
    return `<button class="btn outBtn" onclick="attemptReturn('${studentName}')">${studentName}</button>`;
  }).join(' ');
}

function sendOut(name){
    if(outStudents.includes(name)){
        alert(name+' is already out');
        return;
    }

    if(outStudents.length >= 2){  // <-- limit check
        alert('Only 2 students can be out at the same time.');
        return;
    }

    const now = Date.now();
    outStudents.push(name);
    logs.push({name, leaveTs: now, returnTs: null});
    save();
    refreshDisplay();
}

leaveBtn.onclick = ()=>{
    const name = studentSelect.value;
    if(!name) return;
    sendOut(name);
};

window.attemptReturn = function(name){ if(confirm('Are you '+name+'? Confirm to return.')){ const now=Date.now(); const entry = logs.find(l=>l.name===name && !l.returnTs); if(entry) entry.returnTs=now; outStudents = outStudents.filter(n=>n!==name); save(); refreshDisplay(); } };

window.gridTileClick = function(name){
  if(outStudents.includes(name)){
    window.attemptReturn(name);
  } else {
    sendOut(name);
  }
};

function refreshDisplay(){
  renderOut();
  if(displayMode === 'grid') renderGrid();
}

function renderGrid(){
  studentGrid.innerHTML = students.map(s=>{
    const isOut = outStudents.includes(s);
    return `<button class="btn gridTile ${isOut ? 'gridOut' : 'gridIn'}" onclick="gridTileClick('${s}')">${s}</button>`;
  }).join('');
}

const gridFontSizes = {
  small:  {font:'14px', tile:'80px',  pad:'10px 8px'},
  medium: {font:'18px', tile:'110px', pad:'14px 10px'},
  large:  {font:'24px', tile:'150px', pad:'18px 12px'},
  xlarge: {font:'30px', tile:'190px', pad:'22px 14px'}
};

function applyGridFontSize(){
  const s = gridFontSizes[gridFontSize] || gridFontSizes.medium;
  studentGrid.style.setProperty('--gridFont', s.font);
  studentGrid.style.setProperty('--gridTileMin', s.tile);
  studentGrid.style.setProperty('--gridPad', s.pad);
  fontSizeBtns.forEach(b=> b.classList.toggle('active', b.dataset.size === gridFontSize));
}

function applyDisplayMode(){
  if(displayMode === 'grid'){
    controlsWrap.classList.add('hidden');
    outList.classList.add('hidden');
    studentGrid.classList.remove('hidden');
    gridFontSizeSection.classList.remove('hidden');
    modeGridBtn.classList.add('active');
    modeDropdownBtn.classList.remove('active');
    applyGridFontSize();
    renderGrid();
  } else {
    controlsWrap.classList.remove('hidden');
    outList.classList.remove('hidden');
    studentGrid.classList.add('hidden');
    gridFontSizeSection.classList.add('hidden');
    modeDropdownBtn.classList.add('active');
    modeGridBtn.classList.remove('active');
  }
}

modeDropdownBtn.onclick = ()=>{ displayMode = 'dropdown'; localStorage.setItem('displayMode', displayMode); applyDisplayMode(); };
modeGridBtn.onclick = ()=>{ displayMode = 'grid'; localStorage.setItem('displayMode', displayMode); applyDisplayMode(); };
fontSizeBtns.forEach(b=>{
  b.onclick = ()=>{ gridFontSize = b.dataset.size; localStorage.setItem('gridFontSize', gridFontSize); applyGridFontSize(); };
});

const themes = [
  {name:'Windows 11',    main:'#0078D4', secondary:'#005A9E', bg:'#EAF3FC'},
  {name:'Windows 10',    main:'#00A4EF', secondary:'#F25022', bg:'#E9F7FE'},
  {name:'Windows XP',    main:'#245EDB', secondary:'#3BB143', bg:'#DDEEFF'},
  {name:'macOS',         main:'#0A84FF', secondary:'#30D158', bg:'#F2F5F8'},
  {name:'macOS Purple',  main:'#BF5AF2', secondary:'#0A84FF', bg:'#F5F0FA'},
  {name:'Ubuntu',        main:'#E95420', secondary:'#772953', bg:'#FBEDE6'},
  {name:'Fedora',        main:'#3C6EB4', secondary:'#294172', bg:'#EAF0F8'},
  {name:'Linux Mint',    main:'#87CF3E', secondary:'#2F3A3F', bg:'#F0F7E9'},
  {name:'Pop!_OS',       main:'#48B9C7', secondary:'#FFC252', bg:'#EAF7F8'},
  {name:'Arch Linux',    main:'#1793D1', secondary:'#333333', bg:'#E8F4FB'},
  {name:'Debian',        main:'#A80030', secondary:'#380036', bg:'#FBEAF0'},
  {name:'Manjaro',       main:'#35BF5C', secondary:'#2D7D46', bg:'#EAF8EE'},
  {name:'openSUSE',      main:'#73BA25', secondary:'#030A0D', bg:'#F0F7E6'},
  {name:'Nord',          main:'#5E81AC', secondary:'#88C0D0', bg:'#ECF1F5'},
  {name:'Dracula',       main:'#BD93F9', secondary:'#FF79C6', bg:'#F5F0FA'},
  {name:'Gruvbox',       main:'#FE8019', secondary:'#B8BB26', bg:'#FBF1E6'},
  {name:'Windows 8',     main:'#2D89EF', secondary:'#E51400', bg:'#EAF2FB'},
  {name:'Chrome OS',     main:'#4285F4', secondary:'#34A853', bg:'#EAF1FE'},
  {name:'Zorin OS',      main:'#0294E4', secondary:'#1B3B5F', bg:'#E9F5FC'},
  {name:'elementary OS', main:'#64BAFF', secondary:'#4A90D9', bg:'#EFF7FF'},
  {name:'Kali Linux',    main:'#367BF0', secondary:'#0D1117', bg:'#EAF1FB'},
  {name:'Red Hat',       main:'#EE0000', secondary:'#151515', bg:'#FBEAEA'},
  {name:'Raspberry Pi',  main:'#C51A4A', secondary:'#75A928', bg:'#FBEAF0'},
  {name:'Solarized Dark',main:'#268BD2', secondary:'#2AA198', bg:'#EEE8D5'},
  {name:'Catppuccin',    main:'#89B4FA', secondary:'#F5C2E7', bg:'#F4F0FB'}
];

function applyTheme(main, secondary, bg, save=true){
  document.documentElement.style.setProperty('--themeMain', main);
  document.documentElement.style.setProperty('--themeSecondary', secondary);
  document.documentElement.style.setProperty('--themeBg', bg);
  if(save){
    localStorage.setItem('themeMain', main);
    localStorage.setItem('themeSecondary', secondary);
    localStorage.setItem('themeBg', bg);
  }
}

function renderThemeSwatches(){
  themeSwatches.innerHTML = themes.map((t,i)=> `
    <button class="themeSwatch" data-index="${i}" title="${t.name}">
      <span class="swatchColors">
        <span class="swatchMain" style="background:${t.main}"></span>
        <span class="swatchSecondary" style="background:${t.secondary}"></span>
        <span class="swatchBg" style="background:${t.bg}"></span>
      </span>
      <span class="swatchLabel">${t.name}</span>
    </button>`).join('');
}

themeSwatches.addEventListener('click', (e)=>{
  const btn = e.target.closest('.themeSwatch');
  if(!btn) return;
  const t = themes[Number(btn.dataset.index)];
  applyTheme(t.main, t.secondary, t.bg);
});

randomizeThemeBtn.onclick = ()=>{
  const hue = Math.floor(Math.random()*360);
  const secHue = (hue + 120 + Math.floor(Math.random()*60)) % 360;
  const main = `hsl(${hue}, 65%, 48%)`;
  const secondary = `hsl(${secHue}, 55%, 38%)`;
  const bg = `hsl(${hue}, 45%, 95%)`;
  applyTheme(main, secondary, bg);
};

themesBtn.onclick = ()=>{ renderThemeSwatches(); themePanel.classList.remove('hidden'); };
closeThemeBtn.onclick = ()=> themePanel.classList.add('hidden');

function fmtTime(ts){ return ts ? new Date(ts).toLocaleTimeString([], {hour:'numeric', minute:'2-digit'}) : ''; }
function fmtDateHeading(d){ return d.toLocaleDateString(undefined, {weekday:'long', month:'long', day:'numeric'}); }
function fmtDuration(l){
  if(!l.returnTs) return 'still out';
  const mins = Math.max(0, Math.round((l.returnTs - l.leaveTs)/60000));
  return `${mins} minute${mins===1?'':'s'}`;
}
function entryLine(l){ return `${l.name} - out@${fmtTime(l.leaveTs)}${l.returnTs? '   in@ '+fmtTime(l.returnTs): ''}  ||  duration ${fmtDuration(l)}`; }

function renderLogEntries(){
  if(logs.length === 0){ logList.innerHTML = '<p class="logEmpty">No entries yet</p>'; return; }

  if(logSortMode === 'date'){
    const groups = {};
    logs.forEach(l=>{
      const d = new Date(l.leaveTs);
      const key = d.toDateString();
      if(!groups[key]) groups[key] = {date: d, entries: []};
      groups[key].entries.push(l);
    });
    const sortedGroups = Object.values(groups).sort((a,b)=> b.date - a.date);
    logList.innerHTML = sortedGroups.map(g=>{
      const rows = g.entries.slice().sort((a,b)=> a.leaveTs - b.leaveTs)
        .map(l=> `<li class="logEntry">${entryLine(l)}</li>`).join('');
      return `<div class="logGroup"><h3 class="logHeading">${fmtDateHeading(g.date)}</h3><ul class="logEntries">${rows}</ul></div>`;
    }).join('');
  } else {
    const byStudent = {};
    logs.forEach(l=>{ if(!byStudent[l.name]) byStudent[l.name]=[]; byStudent[l.name].push(l); });
    const names = Object.keys(byStudent).sort((a,b)=> a.localeCompare(b));
    logList.innerHTML = names.map(name=>{
      const dateGroups = {};
      byStudent[name].forEach(l=>{
        const d = new Date(l.leaveTs);
        const key = d.toDateString();
        if(!dateGroups[key]) dateGroups[key] = {date: d, entries: []};
        dateGroups[key].entries.push(l);
      });
      const sortedDates = Object.values(dateGroups).sort((a,b)=> b.date - a.date);
      const rows = sortedDates.map(g=>
        g.entries.slice().sort((a,b)=> a.leaveTs - b.leaveTs)
          .map(l=> `<li class="logEntry"><span class="logEntryDate">${fmtDateHeading(g.date)}</span> — out@${fmtTime(l.leaveTs)}${l.returnTs? '   in@ '+fmtTime(l.returnTs): ''}  ||  duration ${fmtDuration(l)}</li>`).join('')
      ).join('');
      return `<div class="logGroup"><h3 class="logHeading">${name}</h3><ul class="logEntries">${rows}</ul></div>`;
    }).join('');
  }
}

viewLogBtn.onclick = ()=>{ renderLogEntries(); logPanel.classList.remove('hidden'); };
closeLogBtn.onclick = ()=> logPanel.classList.add('hidden');
sortToggleBtn.onclick = ()=>{
  logSortMode = logSortMode === 'date' ? 'student' : 'date';
  sortToggleBtn.textContent = logSortMode === 'date' ? 'Sort by Student' : 'Sort by Date';
  renderLogEntries();
};

function buildLogText(){
  if(logs.length === 0) return 'No entries yet';
  const lines = [];

  if(logSortMode === 'date'){
    const groups = {};
    logs.forEach(l=>{
      const d = new Date(l.leaveTs);
      const key = d.toDateString();
      if(!groups[key]) groups[key] = {date: d, entries: []};
      groups[key].entries.push(l);
    });
    Object.values(groups).sort((a,b)=> b.date - a.date).forEach(g=>{
      lines.push(fmtDateHeading(g.date));
      g.entries.slice().sort((a,b)=> a.leaveTs - b.leaveTs).forEach(l=> lines.push(entryLine(l)));
      lines.push('');
    });
  } else {
    const byStudent = {};
    logs.forEach(l=>{ if(!byStudent[l.name]) byStudent[l.name]=[]; byStudent[l.name].push(l); });
    Object.keys(byStudent).sort((a,b)=> a.localeCompare(b)).forEach(name=>{
      lines.push(name);
      const dateGroups = {};
      byStudent[name].forEach(l=>{
        const d = new Date(l.leaveTs);
        const key = d.toDateString();
        if(!dateGroups[key]) dateGroups[key] = {date: d, entries: []};
        dateGroups[key].entries.push(l);
      });
      Object.values(dateGroups).sort((a,b)=> b.date - a.date).forEach(g=>{
        g.entries.slice().sort((a,b)=> a.leaveTs - b.leaveTs).forEach(l=>
          lines.push(`  ${fmtDateHeading(g.date)} — out@${fmtTime(l.leaveTs)}${l.returnTs? '   in@ '+fmtTime(l.returnTs): ''}  ||  duration ${fmtDuration(l)}`)
        );
      });
      lines.push('');
    });
  }
  return lines.join('\n').trim();
}

downloadLogBtn.onclick = ()=>{
  const text = buildLogText();
  const filename = `sign-out-log-${new Date().toISOString().slice(0,10)}.txt`;
  const blob = new Blob([text], {type: 'text/plain'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  alert('Log downloaded as ' + filename);
};

emailLogBtn.onclick = ()=>{
  const text = buildLogText();
  const subject = encodeURIComponent(pageTitle.textContent + ' - Sign-Out Log');
  const body = encodeURIComponent(text);
  window.location.href = `mailto:?subject=${subject}&body=${body}`;
  alert('Opening your email app with the log ready to send.');
};

adminBtn.onclick = ()=>{ const pw = prompt('Enter admin password:'); if(pw==='2473'){ adminPanel.classList.remove('hidden'); } else alert('Incorrect password'); };
closeAdminBtn.onclick = ()=> adminPanel.classList.add('hidden');

addStudentBtn.onclick = ()=>{ const name = prompt('New student name:'); if(name && !students.includes(name)){ students.push(name); save(); renderStudents(); refreshDisplay(); } };
removeStudentBtn.onclick = ()=>{ const name = prompt('Name to remove:'); students = students.filter(s=>s!==name); outStudents = outStudents.filter(s=>s!==name); logs = logs.filter(l=>l.name!==name); save(); renderStudents(); refreshDisplay(); };
clearLogBtn.onclick = ()=>{ if(confirm('Clear all logs?')){ logs=[]; outStudents=[]; save(); refreshDisplay(); } };
editTitleBtn.onclick = ()=>{ const t = prompt('Enter new title:', pageTitle.textContent); if(t){ pageTitle.textContent = t; save(); } };

window.onload = ()=>{
  const stored = localStorage.getItem('pageTitle'); if(stored) pageTitle.textContent=stored;
  const storedMain = localStorage.getItem('themeMain');
  const storedSecondary = localStorage.getItem('themeSecondary');
  const storedBg = localStorage.getItem('themeBg');
  if(storedMain && storedSecondary && storedBg) applyTheme(storedMain, storedSecondary, storedBg, false);
  renderStudents(); renderOut(); applyDisplayMode();
};
