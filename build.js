// Dựng lại index.html từ src/ + races.json:  node build.js
// (races.json được nhúng làm dữ liệu dự phòng; khi chạy trên web, trang luôn đọc races.json mới nhất)
const fs = require('fs');
const path = require('path');
const R = p => fs.readFileSync(path.join(__dirname, p), 'utf8');
const data = JSON.parse(R('races.json'));
const json = JSON.stringify(data).replace(/</g, '\\u003c');
const app = R('src/app.js');
if (/<\/script/i.test(app)) throw new Error('app.js must not contain a closing script tag');
const html = `<!doctype html>
<html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="description" content="Bản đồ các giải chạy road, trail và Ironman tại Việt Nam: 1 tháng trước đến 13 tháng tới, lọc theo tháng, cự ly, miền và trạng thái đăng ký.">
<meta property="og:title" content="Bản đồ Race Việt Nam">
<meta property="og:description" content="Lịch giải chạy road và trail Việt Nam trên bản đồ, cập nhật trạng thái đăng ký.">
<style>html,body{margin:0}img{max-width:100%}</style></head><body>
<title>Bản đồ Race Việt Nam</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@500;600;700&family=Be+Vietnam+Pro:wght@400;500;600&display=swap">
<style id="css">${R('src/style.css')}</style>
<div id="root"></div>
<script type="text/plain" id="vnpath">${R('src/vn-path.txt')}</script>
<script type="application/json" id="data">${json}</script>
<script id="app">${app}</script>
</body></html>
`;
fs.writeFileSync(path.join(__dirname, 'index.html'), html);
console.log('index.html built:', data.races.length, 'races,', html.length, 'bytes');
