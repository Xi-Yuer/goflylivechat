// 移动端导航菜单切换
document.addEventListener('DOMContentLoaded', function () {
  // 1. 移动端汉堡菜单交互
  const navMobileBtn = document.querySelector('.nav-mobile-btn');
  const navMobile = document.querySelector('.nav-mobile');

  if (navMobileBtn && navMobile) {
    navMobileBtn.addEventListener('click', function () {
      navMobile.style.display = navMobile.style.display === 'block' ? 'none' : 'block';
      this.classList.toggle('active');
    });

    // 点击移动端菜单项后关闭菜单
    const mobileLinks = navMobile.querySelectorAll('a');
    mobileLinks.forEach(link => {
      link.addEventListener('click', function () {
        navMobile.style.display = 'none';
        navMobileBtn.classList.remove('active');
      });
    });
  }

  // 2. 微信二维码hover/click交互（移动端click，PC端hover）
  const wechatItem = document.querySelector('.wechat-item');
  const wechatQrcode = document.querySelector('.wechat-qrcode');

  if (wechatItem && wechatQrcode) {
    // 默认隐藏二维码
    wechatQrcode.style.display = 'none';

    // 移动端（点击切换）
    if (window.innerWidth <= 768) {
      wechatItem.addEventListener('click', function (e) {
        e.stopPropagation();
        wechatQrcode.style.display = wechatQrcode.style.display === 'block' ? 'none' : 'block';
      });

      // 点击页面其他区域关闭二维码
      document.addEventListener('click', function () {
        wechatQrcode.style.display = 'none';
      });
    } else {
      // PC端（hover显示/隐藏）
      wechatItem.addEventListener('mouseenter', function () {
        wechatQrcode.style.display = 'block';
        wechatQrcode.style.animation = 'popIn 0.3s ease';
      });
      wechatItem.addEventListener('mouseleave', function () {
        setTimeout(() => {
          wechatQrcode.style.display = 'none';
        }, 300);
      });
    }
  }

  // 3. 咨询表单提交处理
  const consultForm = document.getElementById('consult-form');
  if (consultForm) {
    consultForm.addEventListener('submit', function (e) {
      e.preventDefault(); // 阻止默认提交

      // 获取表单数据
      const formData = {
        name: consultForm.querySelector('input[type="text"]').value.trim(),
        phone: consultForm.querySelector('input[type="tel"]').value.trim(),
        type: consultForm.querySelector('select').value,
        demand: consultForm.querySelector('textarea').value.trim()
      };

      // 简单验证
      if (!formData.name) {
        alert('请填写您的姓名！');
        consultForm.querySelector('input[type="text"]').focus();
        return;
      }
      if (!/^1[3-9]\d{9}$/.test(formData.phone) && !/^400-\d{3}-\d{4}$/.test(formData.phone)) {
        alert('请填写有效的联系电话！');
        consultForm.querySelector('input[type="tel"]').focus();
        return;
      }
      if (!formData.type) {
        alert('请选择咨询类型！');
        consultForm.querySelector('select').focus();
        return;
      }

      //         // 显示加载效果
      //         const submitBtn = consultForm.querySelector('button[type="submit"]');
      //         const originalText = submitBtn.textContent;
      //         submitBtn.textContent = '提交中...';
      //         submitBtn.disabled = true;

      //         // 模拟提交成功
      //         setTimeout(() => {
      //             alert(`咨询提交成功！\n姓名：${formData.name}\n电话：${formData.phone}\n类型：${formData.type}\n需求：${formData.demand || '无'}\n我们会尽快与您联系~`);
      //             consultForm.reset();
      //             submitBtn.textContent = originalText;
      //             submitBtn.disabled = false;

      //             // 添加成功动画
      //             submitBtn.style.backgroundColor = '#4CAF50';
      //             setTimeout(() => {
      //                 submitBtn.style.backgroundColor = '';
      //             }, 1000);
      //         }, 1500);
      //     });
      // }
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
      fetch("/api/contact", {
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
  anchorLinks.forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        // 计算滚动位置（避开固定导航栏）
        const headerHeight = document.querySelector('.header').offsetHeight;
        const targetTop = targetElement.offsetTop - headerHeight - 20;

        // 平滑滚动
        window.scrollTo({
          top: targetTop,
          behavior: 'smooth'
        });

        // 添加滚动指示器动画
        if (targetId === '#home') {
          document.querySelector('.header').style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
          setTimeout(() => {
            document.querySelector('.header').style.backgroundColor = '';
          }, 1000);
        }
      }
    });
  });

  // 5. 页面滚动时导航栏样式优化
  window.addEventListener('scroll', function () {
    const header = document.querySelector('.header');
    if (window.scrollY > 50) {
      header.style.padding = '10px 0';
      header.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
      header.style.backdropFilter = 'blur(10px)';
      header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
    } else {
      header.style.padding = '15px 0';
      header.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
      header.style.backdropFilter = 'none';
      header.style.backgroundColor = 'var(--white)';
    }
  });

  // 6. FAQ展开/收起功能
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('h5');
    const answer = item.querySelector('p');

    // 设置初始高度
    answer.style.maxHeight = '0';
    answer.style.overflow = 'hidden';
    answer.style.transition = 'max-height 0.5s ease';

    question.addEventListener('click', function () {
      // 关闭其他FAQ
      faqItems.forEach(otherItem => {
        if (otherItem !== item && otherItem.classList.contains('active')) {
          otherItem.classList.remove('active');
          otherItem.querySelector('p').style.maxHeight = '0';
        }
      });

      // 切换当前FAQ
      item.classList.toggle('active');
      if (item.classList.contains('active')) {
        answer.style.maxHeight = answer.scrollHeight + 'px';
      } else {
        answer.style.maxHeight = '0';
      }
    });
  });

  // 7. 卡片悬停效果增强
  const cards = document.querySelectorAll('.card, .process-card, .logo-item');
  cards.forEach(card => {
    card.addEventListener('mouseenter', function () {
      this.style.zIndex = '10';
    });

    card.addEventListener('mouseleave', function () {
      this.style.zIndex = '';
    });
  });

  // 8. 表单输入特效
  const formInputs = document.querySelectorAll('input, textarea, select');
  formInputs.forEach(input => {
    input.addEventListener('focus', function () {
      this.parentElement.classList.add('focused');
    });

    input.addEventListener('blur', function () {
      if (!this.value) {
        this.parentElement.classList.remove('focused');
      }
    });
  });

  // 9. 进度指示器点击和滚动激活功能
  const progressSteps = document.querySelectorAll('.progress-step');
  const processPhases = document.querySelectorAll('.process-phase');

  if (progressSteps.length && processPhases.length) {
    // 为每个进度步骤添加点击事件
    progressSteps.forEach(step => {
      step.addEventListener('click', function (e) {
        e.preventDefault();

        // 获取目标阶段
        const targetPhase = this.querySelector('.progress-label').textContent;
        let targetElement;

        if (targetPhase === '准备阶段') {
          targetElement = document.querySelector('.process-phase:nth-child(1)');
        } else if (targetPhase === '促排取卵') {
          targetElement = document.querySelector('.process-phase:nth-child(2)');
        } else if (targetPhase === '胚胎培养') {
          targetElement = document.querySelector('.process-phase:nth-child(3)');
        } else if (targetPhase === '移植验孕') {
          targetElement = document.querySelector('.process-phase:nth-child(4)');
        }

        if (targetElement) {
          // 移除所有active类
          progressSteps.forEach(s => s.classList.remove('active'));
          // 给当前点击的步骤添加active类
          this.classList.add('active');

          // 平滑滚动到目标
          const headerHeight = document.querySelector('.header').offsetHeight;
          const targetTop = targetElement.offsetTop - headerHeight - 20;

          window.scrollTo({
            top: targetTop,
            behavior: 'smooth'
          });

          // 添加高亮效果
          targetElement.style.backgroundColor = 'rgba(255, 183, 77, 0.1)';
          setTimeout(() => {
            targetElement.style.backgroundColor = '';
          }, 2000);
        }
      });
    });

    // 监听滚动，根据当前可见的阶段更新进度指示器
    function updateProgressIndicator() {
      let currentPhaseIndex = -1;

      // 查找当前在视口中的阶段
      processPhases.forEach((phase, index) => {
        const rect = phase.getBoundingClientRect();
        const phaseTop = rect.top;
        const phaseHeight = rect.height;

        // 如果阶段顶部在视口上半部分，且高度至少一半可见
        if (phaseTop <= window.innerHeight / 2 && phaseTop + phaseHeight / 2 >= 0) {
          currentPhaseIndex = index;
        }
      });

      // 更新进度指示器
      if (currentPhaseIndex >= 0) {
        progressSteps.forEach((step, index) => {
          if (index <= currentPhaseIndex) {
            step.classList.add('active');
            step.querySelector('.progress-dot').style.animation = 'dotPulse 1s ease infinite';
          } else {
            step.classList.remove('active');
            step.querySelector('.progress-dot').style.animation = '';
          }
        });
      }
    }

    // 添加滚动监听
    let scrollTimeout;
    window.addEventListener('scroll', function () {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(updateProgressIndicator, 100);
    });

    // 初始检查
    updateProgressIndicator();
  }

  // 10. 页面加载动画
  window.addEventListener('load', function () {
    // 添加页面加载完成动画
    document.body.classList.add('loaded');

    // 为所有带有动画的元素添加延迟显示
    const animatedElements = document.querySelectorAll('.section-title, .advantage li, .step, .service-cards .card, .logo-item, .process-card, .feature-grid .card');
    animatedElements.forEach((element, index) => {
      element.style.animationDelay = `${index * 0.1}s`;
    });
  });

  // 11. 鼠标移动特效
  document.addEventListener('mousemove', function (e) {
    // 创建光点效果
    if (Math.random() > 0.95) {
      const sparkle = document.createElement('div');
      sparkle.style.position = 'fixed';
      sparkle.style.left = e.clientX + 'px';
      sparkle.style.top = e.clientY + 'px';
      sparkle.style.width = '5px';
      sparkle.style.height = '5px';
      sparkle.style.backgroundColor = 'rgba(255, 183, 77, 0.7)';
      sparkle.style.borderRadius = '50%';
      sparkle.style.pointerEvents = 'none';
      sparkle.style.zIndex = '9999';
      sparkle.style.animation = 'sparkleFade 1s ease forwards';

      document.body.appendChild(sparkle);

      setTimeout(() => {
        sparkle.remove();
      }, 1000);
    }
  });

  // 添加CSS动画
  const style = document.createElement('style');
  style.textContent = `
        @keyframes sparkleFade {
            0% {
                opacity: 1;
                transform: scale(1);
            }
            100% {
                opacity: 0;
                transform: scale(0) translateY(-20px);
            }
        }
        
        body.loaded {
            animation: fadeIn 1s ease;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        .nav-mobile-btn.active .iconfont {
            transform: rotate(90deg);
            transition: transform 0.3s ease;
        }
    `;
  document.head.appendChild(style);

  // 12. 图片懒加载和悬停效果
  const images = document.querySelectorAll('img');
  images.forEach(img => {
    // 图片加载时添加淡入效果
    img.addEventListener('load', function () {
      this.style.opacity = '0';
      this.style.transition = 'opacity 0.5s ease';
      setTimeout(() => {
        this.style.opacity = '1';
      }, 100);
    });

    // 图片错误处理
    img.addEventListener('error', function () {
      this.style.opacity = '0.5';
      this.style.filter = 'grayscale(100%)';
    });
  });

  // 13. 按钮点击涟漪效果
  const buttons = document.querySelectorAll('.btn');
  buttons.forEach(button => {
    button.addEventListener('click', function (e) {
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const ripple = document.createElement('span');
      ripple.style.position = 'absolute';
      ripple.style.left = x + 'px';
      ripple.style.top = y + 'px';
      ripple.style.width = '0';
      ripple.style.height = '0';
      ripple.style.backgroundColor = 'rgba(255, 255, 255, 0.5)';
      ripple.style.borderRadius = '50%';
      ripple.style.transform = 'translate(-50%, -50%)';
      ripple.style.animation = 'ripple 0.6s linear';

      this.appendChild(ripple);

      setTimeout(() => {
        ripple.remove();
      }, 600);
    });
  });

  // 添加涟漪动画
  const rippleStyle = document.createElement('style');
  rippleStyle.textContent = `
        @keyframes ripple {
            to {
                width: 300px;
                height: 300px;
                opacity: 0;
            }
        }
    `;
  document.head.appendChild(rippleStyle);
});