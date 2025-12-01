# Airport Search System

Hệ thống tra cứu mã IATA sân bay quốc tế nhanh chóng và dễ dàng.

## 🚀 Demo

Truy cập: [https://trung-devvon.github.io/airp-test/](https://trung-devvon.github.io/airp-test/)

## ✨ Tính năng

- 🔍 Tìm kiếm theo thành phố, mã IATA, tên tiếng Việt, tiếng Anh
- 📋 Copy nhanh thông tin sân bay
- ✏️ Chỉnh sửa thông tin
- 📱 Responsive design
- 🎨 Giao diện đẹp mắt với gradient và animations

## 🛠️ Cài đặt

```bash
# Clone repository
git clone https://github.com/trung-devvon/airp-test.git
cd airp-test

# Cài đặt dependencies
npm install

# Chạy local server
npm start
```

Mở trình duyệt tại: http://localhost:8000

## 📦 Deploy lên GitHub Pages

### Bước 1: Push code lên GitHub

```bash
git add .
git commit -m "Update code"
git push origin main
```

### Bước 2: Bật GitHub Pages

1. Vào repository trên GitHub: https://github.com/trung-devvon/airp-test
2. Click **Settings** → **Pages**
3. Trong phần **Source**, chọn **GitHub Actions**
4. Workflow sẽ tự động chạy và deploy

### Bước 3: Kiểm tra

Sau khi workflow chạy xong (khoảng 1-2 phút), truy cập:
https://trung-devvon.github.io/airp-test/

## 🔧 Cấu trúc project

```
airline-test/
├── index.html          # Giao diện chính
├── index.js            # Logic xử lý
├── data.json           # Dữ liệu sân bay
├── .github/
│   └── workflows/
│       └── deploy.yml  # GitHub Actions workflow
└── README.md
```

## 📝 Các lỗi đã fix

✅ **Lỗi search**: Fixed TypeError khi field có giá trị `null` hoặc `undefined`  
✅ **Nút copy**: Hiển thị nút copy ở tất cả các dòng  
✅ **Icon copy**: Bỏ chữ "Copy", chỉ giữ icon

## 🤝 Đóng góp

Mọi đóng góp đều được chào đón! Hãy tạo issue hoặc pull request.

## 📄 License

ISC
