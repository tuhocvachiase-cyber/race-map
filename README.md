# Bản đồ Race Việt Nam

Bản đồ các giải chạy road, trail và ba môn tại Việt Nam trong 12 tháng tới.

**Xem:** https://tuhocvachiase-cyber.github.io/race-map/ · English: https://tuhocvachiase-cyber.github.io/race-map/#en

Trang tự chọn tiếng Anh cho trình duyệt không dùng tiếng Việt; nút **EN / VI** ở góc trên để đổi.

## Khu vực quản trị (sửa ngay trên trang)

1. Tạo token: https://github.com/settings/personal-access-tokens/new
   - Repository access: **Only select repositories** → `race-map`
   - Permissions → Repository → **Contents: Read and write**
2. Mở trang, bấm **Quản trị** ở cuối trang (hoặc vào `.../race-map/#admin`), dán token.
3. Dùng **+ Thêm giải**, **Sửa**, **Xóa**. Mỗi lần lưu là một commit vào `races.json`; website cập nhật sau 1–2 phút.

Token chỉ lưu trong trình duyệt của bạn (nếu chọn "Ghi nhớ"), không nằm trong code. Không đăng nhập trên máy dùng chung. Bấm **Thoát quản trị** để xóa token khỏi trình duyệt; muốn thu hồi hẳn thì xóa token trong GitHub Settings.

## Cập nhật giải thủ công

Toàn bộ dữ liệu nằm trong `races.json`, mỗi dòng là một giải. Trang web tự đọc file này, nên chỉ cần sửa `races.json` là xong (1–2 phút sau GitHub Pages cập nhật).

Sửa trên web: mở `races.json` → biểu tượng bút chì → sửa → **Commit changes**.

| Trường | Ý nghĩa | Ví dụ |
|---|---|---|
| `name` | Tên giải | `"Techcombank HCMC International Marathon"` |
| `start` / `end` | Ngày bắt đầu / kết thúc (YYYY-MM-DD), `end` để `null` nếu chạy 1 ngày | `"2026-12-06"` |
| `type` | Màu ghim: `road`, `trail`, `other` | `"road"` |
| `kind` | Nhãn hiển thị | `"Road (đêm)"` |
| `dist` | Các cự ly | `"5–42K"` |
| `max` | Cự ly dài nhất (km), dùng cho bộ lọc; `null` nếu chưa rõ | `42` |
| `prov` | Địa điểm hiển thị | `"TP.HCM (Thủ Đức)"` |
| `region` | `bac`, `trung`, `nam` | `"nam"` |
| `lat` / `lon` | Tọa độ ghim | `10.78`, `106.7` |
| `status` | `open` đang mở · `closed` hết vé · `tbd` chưa công bố · `est` dự kiến | `"open"` |
| `org` | Đơn vị tổ chức (bấm trên trang để lọc các giải cùng BTC) | `"VietRace365"` |
| `link` | Trang đăng ký | `"https://…"` |
| `note` | Ghi chú ngắn (tiếng Việt) | `"AIMS, hợp săn PR"` |
| `note_en` | Ghi chú tiếng Anh, để trống thì bản tiếng Anh không hiện | `"AIMS-certified, good for a PB"` |
| `id` | Mã duy nhất, không trùng | `"tcb-hcmc-2026"` |

Giải đã diễn ra tự ẩn khỏi bản đồ. `index.html` cũng chứa một bản dữ liệu dự phòng để trang vẫn chạy khi được dán thẳng vào Google Sites bằng "Mã nhúng".

## Góp ý của người xem

Trang có nút **Báo sai** trên từng giải, **+ Đề xuất giải** và **Góp ý cho trang**. Góp ý được ghi vào Google Sheet và gửi email báo. Các nút chỉ hiện khi `config.json` có `feedbackUrl`.

Cài đặt một lần: làm theo hướng dẫn ở đầu file `feedback/Code.gs`, rồi dán URL ứng dụng web vào `config.json`:

```json
{ "feedbackUrl": "https://script.google.com/macros/s/…/exec" }
```

## Nhúng vào Google Sites

**Chèn → Nhúng → Theo URL** → dán `https://tuhocvachiase-cyber.github.io/race-map/`.

Thông tin tổng hợp từ nhiều nguồn công khai, chỉ mang tính tham khảo; cần tự kiểm chứng tại trang chính thức của từng giải.
