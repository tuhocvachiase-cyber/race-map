/**
 * Nhận góp ý từ Bản đồ Race Việt Nam → ghi vào Google Sheet → gửi email báo.
 *
 * Cài đặt (một lần):
 *  1. Tạo Google Sheet mới (vd: "Góp ý Race Map").
 *  2. Trong Sheet: Tiện ích mở rộng → Apps Script. Xóa code mẫu, dán toàn bộ file này, bấm Lưu.
 *  3. Chọn hàm "thuNghiem" → Chạy → cấp quyền (Sheet + gửi mail). Kiểm tra có email thử và dòng trong tab "GopY".
 *  4. Triển khai → Tùy chọn triển khai mới → loại "Ứng dụng web":
 *       - Thực thi với tư cách: Tôi
 *       - Người có quyền truy cập: Bất kỳ ai
 *     → Triển khai → chép "URL ứng dụng web" (dạng https://script.google.com/macros/s/…/exec).
 *  5. Dán URL đó vào ô "feedbackUrl" trong file config.json của repo race-map.
 *
 * Khi sửa code này sau này: Triển khai → Quản lý triển khai → sửa (bút chì) → Phiên bản: Mới → Triển khai.
 * Làm vậy URL giữ nguyên, không phải sửa config.json.
 */

// Để trống = gửi về email của tài khoản Google đang chạy script.
const NOTIFY_EMAIL = '';
const SHEET_NAME = 'GopY';
const HEADERS = ['Thời gian', 'Loại', 'Mã giải', 'Tên giải', 'Vấn đề', 'Nội dung',
  'Giải đề xuất', 'Ngày', 'Địa điểm', 'Link', 'Liên hệ', 'Ngôn ngữ', 'Trang', 'Trạng thái'];
const MAX_PER_CLIENT_10MIN = 5;   // mỗi trình duyệt
const MAX_TOTAL_PER_HOUR = 40;    // toàn trang, giữ trong hạn mức gửi mail của Gmail (~100/ngày)

const KIND_VI = { report: 'Báo sai', suggest: 'Đề xuất giải', general: 'Góp ý chung' };
const ISSUE_VI = {
  date: 'Sai ngày thi đấu', closed: 'Đã hết vé / đóng đăng ký', opened: 'Đã mở đăng ký',
  dist: 'Sai cự ly', place: 'Sai địa điểm', link: 'Link hỏng / sai link', org: 'Sai đơn vị tổ chức',
  cancel: 'Giải bị hủy / hoãn', other: 'Khác'
};

function doPost(e) {
  try {
    const d = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    if (d.website) return out({ ok: true });                      // bẫy bot
    if (!KIND_VI[d.kind]) return out({ ok: false, error: 'kind' });

    const cache = CacheService.getScriptCache();
    const ck = 'c_' + clip(d.cid, 40).replace(/[^\w-]/g, '');
    const cn = Number(cache.get(ck) || 0);
    const gn = Number(cache.get('global') || 0);
    if (cn >= MAX_PER_CLIENT_10MIN || gn >= MAX_TOTAL_PER_HOUR) return out({ ok: false, error: 'rate' });
    cache.put(ck, String(cn + 1), 600);
    cache.put('global', String(gn + 1), 3600);

    const row = [
      new Date(), KIND_VI[d.kind], clip(d.raceId, 80), clip(d.raceName, 200),
      ISSUE_VI[d.issue] || '', clip(d.message, 2000), clip(d.newName, 200), clip(d.newDate, 40),
      clip(d.newPlace, 200), clip(d.newLink, 500), clip(d.contact, 200), clip(d.lang, 5),
      clip(d.page, 300), 'Mới'
    ].map(safe);

    const lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try { sheet().appendRow(row); } finally { lock.releaseLock(); }

    notify(row);
    return out({ ok: true });
  } catch (err) {
    return out({ ok: false, error: String(err) });
  }
}

function doGet() {
  return out({ ok: true, service: 'race-map-feedback' });
}

function sheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) {
    sh = ss.insertSheet(SHEET_NAME);
    sh.appendRow(HEADERS);
    sh.setFrozenRows(1);
    sh.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
  }
  return sh;
}

function notify(row) {
  const to = NOTIFY_EMAIL || Session.getEffectiveUser().getEmail();
  const kind = row[1];
  const title = row[3] || row[6] || (row[5] || '').slice(0, 40);
  const lines = HEADERS.map((h, i) => row[i] ? h + ': ' + row[i] : '').filter(Boolean);
  lines.push('', 'Mở Sheet: ' + SpreadsheetApp.getActiveSpreadsheet().getUrl());
  MailApp.sendEmail({
    to: to,
    subject: '[Race Map] ' + kind + (title ? ': ' + title : ''),
    body: lines.join('\n'),
    name: 'Bản đồ Race Việt Nam'
  });
}

function clip(s, n) { return String(s == null ? '' : s).slice(0, n); }
// Chặn chèn công thức vào Sheet
function safe(v) { return (typeof v === 'string' && /^[=+\-@]/.test(v)) ? "'" + v : v; }
function out(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}

// Chạy tay một lần để cấp quyền và kiểm tra.
function thuNghiem() {
  const res = doPost({ postData: { contents: JSON.stringify({
    kind: 'general', message: 'Góp ý thử nghiệm – có thể xóa dòng này.', lang: 'vi', cid: 'test'
  }) } });
  Logger.log(res.getContent());
}
