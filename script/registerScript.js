// Lấy form
const form = document.getElementById("myForm");

// Xử lý sự kiện "submit" của form
form.addEventListener("submit", (event) => {
  // Ngăn chặn việc submit form mặc định
  event.preventDefault();

  // Hiển thị dialog thông báo
  alert("Đăng ký thành công!");

  // Chuyển trang về trang login sau khi đăng ký thành công
  window.location.href = "/";
});
