export class Fashion {
  constructor(
    public _id: string | null = null,
    public style: string = '',
    public fashion_subject: string = '',
    public fashion_detail: string = '',
    public fashion_image: string = '',
    public created_at: Date | string = new Date(),
    public IdF: number = 0,
  ) {}

  getBase64String() {
    const image = String(this.fashion_image ?? '').trim();
    // Dữ liệu thật lưu cả data URI (data:image/jpeg;base64,...) lẫn URL http.
    if (image.startsWith('data:image') || image.startsWith('http')) {
      return image;
    }
    // Trường hợp chỉ lưu chuỗi base64 trần.
    return `data:image/jpeg;base64,${image}`;
  }
}
