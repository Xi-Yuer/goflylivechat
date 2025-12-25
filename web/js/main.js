// 移动端导航菜单切换
document.addEventListener("DOMContentLoaded", function () {
  // 1. 移动端汉堡菜单交互
  const navMobileBtn = document.querySelector(".nav-mobile-btn");
  const navMobile = document.querySelector(".nav-mobile");

  if (navMobileBtn && navMobile) {
    navMobileBtn.addEventListener("click", function () {
      navMobile.style.display =
        navMobile.style.display === "block" ? "none" : "block";
    });

    // 点击移动端菜单项后关闭菜单
    const mobileLinks = navMobile.querySelectorAll("a");
    mobileLinks.forEach((link) => {
      link.addEventListener("click", function () {
        navMobile.style.display = "none";
      });
    });
  }

  // 2. 微信二维码hover/click交互（移动端click，PC端hover）
  const wechatItem = document.querySelector(".wechat-item");
  const wechatQrcode = document.querySelector(".wechat-qrcode");

  if (wechatItem && wechatQrcode) {
    // 默认隐藏二维码
    wechatQrcode.style.display = "none";

    // 移动端（点击切换）
    if (window.innerWidth <= 768) {
      wechatItem.addEventListener("click", function (e) {
        e.stopPropagation();
        wechatQrcode.style.display =
          wechatQrcode.style.display === "block" ? "none" : "block";
      });

      // 点击页面其他区域关闭二维码
      document.addEventListener("click", function () {
        wechatQrcode.style.display = "none";
      });
    } else {
      // PC端（hover显示/隐藏）
      wechatItem.addEventListener("mouseenter", function () {
        wechatQrcode.style.display = "block";
      });
      wechatItem.addEventListener("mouseleave", function () {
        wechatQrcode.style.display = "none";
      });
    }
  }

  // 3. 咨询表单提交处理
  const consultForm = document.getElementById("consult-form");
  if (consultForm) {
    consultForm.addEventListener("submit", function (e) {
      e.preventDefault(); // 阻止默认提交

      // 获取表单数据
      const formData = {
        name: consultForm.querySelector('input[type="text"]').value.trim(),
        phone: consultForm.querySelector('input[type="tel"]').value.trim(),
        type: consultForm.querySelector("select").value,
        demand: consultForm.querySelector("textarea").value.trim(),
      };

      // 简单验证
      if (!formData.name) {
        alert("请填写您的姓名！");
        return;
      }
      if (
        !/^1[3-9]\d{9}$/.test(formData.phone) &&
        !/^400-\d{3}-\d{4}$/.test(formData.phone)
      ) {
        alert("请填写有效的联系电话！");
        return;
      }
      if (!formData.type) {
        alert("请选择咨询类型！");
        return;
      }

      // 发送网络请求到后端
      const submitButton = consultForm.querySelector('button[type="submit"]');
      const originalText = submitButton.textContent;
      submitButton.disabled = true;
      submitButton.textContent = "提交中...";

      // 创建FormData对象
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("phone", formData.phone);
      formDataToSend.append("type", formData.type);
      if (formData.demand) {
        formDataToSend.append("demand", formData.demand);
      }

      // 发送POST请求
      fetch("http://47.79.98.63:8081/contact", {
        method: "POST",
        body: formDataToSend,
      })
        .then((response) => response.json())
        .then((data) => {
          submitButton.disabled = false;
          submitButton.textContent = originalText;

          if (data.code === 200) {
            alert("咨询提交成功！我们会尽快与您联系~");
            consultForm.reset(); // 重置表单
          } else {
            alert(data.msg || "提交失败，请稍后重试");
          }
        })
        .catch((error) => {
          submitButton.disabled = false;
          submitButton.textContent = originalText;
          console.error("提交错误:", error);
          alert("网络错误，请稍后重试");
        });
    });
  }

  // 4. 平滑滚动（锚点跳转）
  const anchorLinks = document.querySelectorAll('a[href^="#"]');
  anchorLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href");
      if (targetId === "#") return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        // 计算滚动位置（避开固定导航栏）
        const headerHeight = document.querySelector(".header").offsetHeight;
        const targetTop = targetElement.offsetTop - headerHeight - 20;

        // 平滑滚动
        window.scrollTo({
          top: targetTop,
          behavior: "smooth",
        });
      }
    });
  });

  // 5. 页面滚动时导航栏样式优化
  window.addEventListener("scroll", function () {
    const header = document.querySelector(".header");
    if (window.scrollY > 50) {
      header.style.padding = "10px 0";
      header.style.boxShadow = "0 4px 15px rgba(0,0,0,0.1)";
    } else {
      header.style.padding = "15px 0";
      header.style.boxShadow = "0 2px 10px rgba(0,0,0,0.1)";
    }
  });
});
