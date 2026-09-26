# Bản đồ Race Việt Nam

Bản đồ các giải chạy road, trail và ba môn tại Việt Nam trong 12 tháng tới.

**Xem:** https://tuhocvachiase-cyber.github.io/race-map/

## Cập nhật giải

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
| `link` | Trang đăng ký | `"https://…"` |
| `note` | Ghi chú ngắn | `"AIMS, hợp săn PR"` |
| `id` | Mã duy nhất, không trùng | `"tcb-hcmc-2026"` |

Giải đã diễn ra tự ẩn khỏi bản đồ. `index.html` cũng chứa một bản dữ liệu dự phòng để trang vẫn chạy khi được dán thẳng vào Google Sites bằng "Mã nhúng".

## Nhúng vào Google Sites

**Chèn → Nhúng → Theo URL** → dán `https://tuhocvachiase-cyber.github.io/race-map/`.

Nguồn ban đầu: lịch giải của Linh Academy (đối chiếu 11/09/2026) và trang chính thức từng giải.
