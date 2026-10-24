# Bài tập Slug Fashion

Bổ sung `IdF` (số, duy nhất), tạo Slug cho Fashion và hiển thị đúng Fashion Detail
khi truy cập bằng Slug, kèm giao diện danh sách/chi tiết mới.

## 1. Dữ liệu và API

`IdF` là số do **server** cấp, không lấy từ client:

- Khi `POST /fashions`, server lấy `IdF` lớn nhất hiện có + 1.
- `IdF` và `created_at` không bị ghi đè khi `PUT`.
- Có unique index `{ IdF: 1 }` nên hai Fashion không thể trùng `IdF`.
- Dữ liệu cũ được bổ sung bằng migration, các trường khác giữ nguyên.

| Method | Route | Ghi chú |
| --- | --- | --- |
| GET | `/fashions` | Danh sách, mới nhất trước |
| GET | `/fashions?style=...` | Lọc theo Style |
| GET | `/fashions/:id` | `:id` là **IdF** (`1`) hoặc `_id` MongoDB |
| POST | `/fashions` | Server tự cấp `IdF` |
| PUT | `/fashions/:id` | Sửa nội dung, giữ `IdF`, `created_at` |
| DELETE | `/fashions/:id` | Xoá theo IdF hoặc `_id` |

### Migration dữ liệu

```powershell
cd D:\Angular\LearnAngular\my-server-mongodb
npm run migrate:idf
```

Script chỉ thêm `IdF` cho document còn thiếu, sắp theo `created_at` tăng dần nên
chạy lại nhiều lần vẫn cho cùng kết quả.

Dữ liệu mẫu 16 Fashion (đã có `IdF`) nằm trong `server/fashion-data.json`, nạp bằng
`npm run import:data`.

## 2. Quy tắc Slug

Hàm `toSlug()` trong `src/app/classes/FashionSlug.ts`:

- Chuyển về chữ thường.
- Bỏ dấu tiếng Việt, kể cả `đ` → `d`, `Đ` → `D`.
- Ký tự đặc biệt và khoảng trắng → `-`, gộp các `-` liên tiếp, bỏ `-` đầu/cuối.

Ví dụ:

| Tên | Slug |
| --- | --- |
| Áo Sơ Mi Trắng | `ao-so-mi-trang` |
| Đầm Dạ Hội Cao Cấp | `dam-da-hoi-cao-cap` |
| Quần Jean Nam | `quan-jean-nam` |

**Slug duy nhất:** Fashion trùng tên thì Fashion có `IdF` nhỏ hơn giữ slug gốc,
các Fashion sau thêm hậu tố `-f{IdF}`. Ví dụ hai Fashion tên "King" (IdF 11 và 12)
có slug `king` và `king-f12`. Quy tắc này xác định nên tải lại trang vẫn ra đúng.

## 3. Luồng danh sách → chi tiết

1. `/fashion` tải toàn bộ Fashion qua `FashionAPIService.getFashions()`.
2. `buildSlug()` tính slug cho từng card (IdF + tên).
3. Người dùng bấm card → Router điều hướng `/fashion/<slug>`.
4. `FashionDetailComponent` đọc slug bằng `ActivatedRoute.paramMap`.
5. `FashionAPIService.getFashionBySlug(slug)` tải danh sách và tìm Fashion có slug
   khớp → hiển thị. Không phụ thuộc vị trí trong danh sách, mở trực tiếp URL và
   tải lại trang vẫn đúng.
6. Slug không tồn tại → hiện "Không tìm thấy sản phẩm" kèm nút quay về.

## 4. Chạy project

Dự án gồm 2 phần: Angular ở thư mục gốc và API trong `server/`.

```powershell
# Terminal 1: API (cổng 4000)
cd server
npm install
npm run import:data    # nạp 16 Fashion mẫu (bỏ qua nếu collection đã có dữ liệu)
npm start

# Terminal 2: Angular (cổng 4200)
npm install
npm start
```

Mở `http://localhost:4200/fashion`. Dev-server proxy `/fashions` sang
`http://localhost:4000` (xem `src/proxy.conf.json`).

Nếu database đã có Fashion từ trước mà chưa có `IdF`:

```powershell
cd server
npm run migrate:idf
```

`npm run import:data -- --force` sẽ xoá dữ liệu cũ và nạp lại 16 Fashion mẫu.

## 5. URL kiểm tra

| URL | Kết quả mong đợi |
| --- | --- |
| `http://localhost:4200/fashion` | Grid 6/16 Fashion, mỗi card có IdF + slug |
| `http://localhost:4200/fashion/monochrome-with-a-modern-edge` | Chi tiết đúng Fashion IdF 16 |
| `http://localhost:4200/fashion/king` | Fashion "King" IdF 11 |
| `http://localhost:4200/fashion/king-f12` | Fashion "King" IdF 12 (slug trùng tên) |
| `http://localhost:4200/fashion/khong-ton-tai` | "Không tìm thấy sản phẩm" |

## 6. Kiểm tra đã chạy

- `npm test` (server): 2/2 pass, gồm IdF tự tăng, không nhận IdF từ client,
  tìm theo IdF, `PUT` giữ `IdF`.
- `npm run build` (Angular): thành công.
- Trình duyệt: 16 card, ảnh hiển thị, slug tiếng Việt đúng, hai Fashion "King"
  ra hai slug khác nhau, tải lại trang chi tiết vẫn đúng, slug sai hiện thông báo,
  mobile 390px không tràn ngang.
- Không có lỗi console, không có request lỗi.

## 7. File thay đổi

**Backend `server/`**

- `index.js`: cấp `IdF`, unique index, tìm/sửa/xoá theo IdF.
- `migrate-idf.js`: bổ sung IdF cho dữ liệu cũ.
- `seed-fashion.js`: dữ liệu mẫu có IdF.
- `import-data.js` + `fashion-data.json`: nạp lại 16 Fashion thật kèm IdF.
- `index.test.js`: test IdF.
- `package.json`: `npm run migrate:idf`, `npm run import:data`.

**Frontend `my-app/src/app/`**

- `classes/FashionSlug.ts`: **mới** – `toSlug`, `buildSlug`, `findFashionBySlug`.
- `classes/FashionImage.ts`: **mới** – ảnh dự phòng.
- `classes/Fashion.ts`: thêm `IdF`, sửa `getBase64String()` cho ảnh data URI.
- `services/fashion-apiservice.ts`: thêm `getFashionBySlug()`, xử lý lỗi.
- `app-routing-module.ts`: `/fashion`, `/fashion/:slug`, khôi phục vị trí cuộn.
- `app.html`: thêm link "Fashion Collection".
- `fashion-component/*`: giao diện grid card.
- `fashion-detail-component/*`: giao diện chi tiết, đọc slug từ URL.
- `src/proxy.conf.json`: proxy `/fashions` sang port 4000.
