// 頁面轉場動畫
document.addEventListener('DOMContentLoaded', function() {
  // 頁面載入時的淡入動畫
  document.body.style.opacity = '0';
  setTimeout(() => {
    document.body.style.transition = 'opacity 0.5s ease';
    document.body.style.opacity = '1';
  }, 10);

  // 攔截所有連結點擊
  const links = document.querySelectorAll('a:not([target="_blank"])');
  
  links.forEach(link => {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      
      // 如果是錨點連結或 javascript:void(0)，不處理
      if (!href || href.startsWith('#') || href.startsWith('javascript:')) {
        return;
      }
      
      // 如果是外部連結，不處理
      if (href.startsWith('http://') || href.startsWith('https://')) {
        return;
      }
      
      e.preventDefault();
      
      // 添加滑出動畫
      document.body.style.transition = 'transform 0.4s ease, opacity 0.4s ease';
      document.body.style.transform = 'translateX(-50px)';
      document.body.style.opacity = '0';
      
      // 動畫完成後跳轉
      setTimeout(() => {
        window.location.href = href;
      }, 400);
    });
  });
  
  // 處理瀏覽器返回按鈕
  window.addEventListener('pageshow', function(event) {
    if (event.persisted) {
      document.body.style.transition = 'none';
      document.body.style.opacity = '1';
      document.body.style.transform = 'translateX(0)';
    }
  });
});
