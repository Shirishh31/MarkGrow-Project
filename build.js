const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, 'public');
const htmlContent = fs.readFileSync(path.join(publicDir, 'mark grow main1.3.html'), 'utf8');
const cssContent = fs.readFileSync(path.join(publicDir, 'style.css'), 'utf8');
const jsContent = fs.readFileSync(path.join(publicDir, 'main.js'), 'utf8');

// 1. Transform main.js to use localStorage instead of fetch
let newJs = jsContent;

const contactSaveLogic = `
    const messages = JSON.parse(localStorage.getItem('mg_messages') || '[]');
    payload.id = Date.now();
    messages.push(payload);
    localStorage.setItem('mg_messages', JSON.stringify(messages));
`;
newJs = newJs.replace(/const res = await fetch\(['`]\/api\/messages['`], \{[\s\S]*?body: JSON\.stringify\(payload\)[\s\S]*?\}\);[\s\S]*?if\(!res\.ok\) throw new Error\('API Error'\);/g, contactSaveLogic);

const adminLoadLogic = `
    // Simulating API load latency if any, or just direct load mapping:
    const dbData = {
      visitors: JSON.parse(localStorage.getItem('mg_visitors') || '[]'),
      messages: JSON.parse(localStorage.getItem('mg_messages') || '[]')
    };
`;
newJs = newJs.replace(/const res = await fetch\(['`]\/api\/admin['`]\);[\s\S]*?if\(!res\.ok\) throw new Error\('API Error'\);[\s\S]*?const dbData = await res\.json\(\);/g, adminLoadLogic);

const adminClearLogic = `
      localStorage.removeItem('mg_visitors');
      localStorage.removeItem('mg_messages');
`;
newJs = newJs.replace(/const res = await fetch\(['`]\/api\/admin['`], \{ method: 'DELETE' \}\);[\s\S]*?if\(!res\.ok\) throw new Error\('API Error'\);/g, adminClearLogic);

// 2. Wrap CSS and JS into HTML
let newHtml = htmlContent;

newHtml = newHtml.replace('<link rel="stylesheet" href="style.css" />', `<style>\n${cssContent}\n</style>`);
newHtml = newHtml.replace('<script src="main.js"></script>', `<script>\n${newJs}\n</script>`);

// 3. Update the Inline HTML login script to hook into localStorage
const loginInject = `
                // Inject visitor into LocalStorage tracking
                const n = document.getElementById('login-name').value.trim();
                const em = document.getElementById('login-email').value.trim();
                const p = document.getElementById('login-contact').value.trim();
                const visitors = JSON.parse(localStorage.getItem('mg_visitors') || '[]');
                visitors.push({ name: n, email: em, phone: p, date: new Date().toLocaleString() });
                localStorage.setItem('mg_visitors', JSON.stringify(visitors));
`;

newHtml = newHtml.replace(/(loginForm\.addEventListener\('submit', \(e\) => \{\s*e\.preventDefault\(\);)/, `$1${loginInject}`);

// Write Output
fs.writeFileSync(path.join(__dirname, 'index.html'), newHtml, 'utf8');
console.log('Successfully bundled full application into index.html');
