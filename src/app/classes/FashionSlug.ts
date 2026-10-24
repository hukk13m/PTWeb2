import { Fashion } from './Fashion';

/**
 * Chuyển một chuỗi tiếng Việt thành slug thân thiện với URL.
 * "Áo Sơ Mi Trắng" -> "ao-so-mi-trang"
 * "Đầm Dạ Hội Cao Cấp" -> "dam-da-hoi-cao-cap"
 */
export function toSlug(text: string | null | undefined): string {
  return String(text ?? '')
    .normalize('NFD') // tách dấu ra khỏi ký tự: á -> a + dấu
    .replace(/[\u0300-\u036f]/g, '') // xoá các dấu vừa tách
    .replace(/đ/g, 'd') // NFD không tách được đ nên đổi tay
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-') // ký tự đặc biệt, khoảng trắng -> "-"
    .replace(/-+/g, '-') // gộp nhiều "-" liền nhau
    .replace(/^-|-$/g, ''); // bỏ "-" ở đầu và cuối
}

/**
 * Tạo slug duy nhất cho một Fashion.
 * Fashion trùng tên: Fashion có IdF nhỏ hơn giữ slug gốc,
 * các Fashion sau thêm hậu tố -f{IdF} để không trùng.
 */
export function buildSlug(fashion: Fashion, allFashions: Fashion[]): string {
  const base = toSlug(fashion.fashion_subject) || 'fashion';
  const sameName = allFashions
    .filter((item) => toSlug(item.fashion_subject) === base)
    .sort((left, right) => left.IdF - right.IdF);

  if (sameName.length <= 1 || sameName[0].IdF === fashion.IdF) {
    return base;
  }
  return `${base}-f${fashion.IdF}`;
}

/**
 * Tìm đúng Fashion theo slug. So khớp trên toàn bộ danh sách nên
 * không phụ thuộc vào vị trí của Fashion trong danh sách.
 */
export function findFashionBySlug(fashions: Fashion[], slug: string): Fashion | null {
  const wanted = String(slug ?? '').trim().toLowerCase();
  if (!wanted) {
    return null;
  }
  const found = fashions.find((fashion) => buildSlug(fashion, fashions) === wanted);
  return found ?? null;
}
