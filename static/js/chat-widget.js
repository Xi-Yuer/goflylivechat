const CHAT_WIDGET = {
  API_URL: "",
  AGENT_ID: "",
  AUTO_OPEN: true,
  DISPLAY_MODE: 1,
  USER_ID: "",
  USER_NAME: "",
  USER_AVATAR: "",
  isChatOpen: false,
  originalPageTitle: document.title,
  chatWindowTitle: "客服咨询",
  isOffline: false,
  iframeId: "chat-widget-iframe",
  containerId: "chat-widget-container",
  PHONE_NUMBER: "400-888-9999", // 电话号码
  WECHAT_QRCODE:
    "data:image/png;base64,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", // 微信二维码图片URL，可以后续设置
};

CHAT_WIDGET.initialize = function (config) {
  // Apply configuration
  for (let key in config) {
    if (this.hasOwnProperty(key)) {
      this[key] = config[key];
    }
  }

  // Normalize URL by removing trailing slash
  if (this.API_URL) {
    this.API_URL = this.API_URL.replace(/\/$/, "");
  }

  // Add required CSS styles
  this.injectStyles();

  // Display the chat button
  this.createChatButton();

  // Set up event handlers
  this.setupEventHandlers();
};

CHAT_WIDGET.injectStyles = function () {
  const style = document.createElement("style");
  style.textContent = `
        #chat-widget-panel {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 100px;
            background: white;
            border-radius: 12px;
            box-shadow: 0 5px 20px rgba(0,0,0,0.2);
            z-index: 9999;
        }
        
        .chat-option-item {
            padding: 20px;
            display: flex;
            flex-direction: column;
            align-items: center;
            cursor: pointer;
            transition: background-color 0.3s;
            position: relative;
            border-bottom: 1px solid #f0f0f0;
        }
        
        .chat-option-item:last-child {
            border-bottom: none;
        }
        
        .chat-option-item:hover {
            background-color: #f5f5f5;
        }
        
        .chat-option-icon {
            width: 50px;
            height: 50px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 10px;
        }
        
        .chat-option-icon svg {
            width: 100%;
            height: 100%;
        }
        
        .chat-option-text {
            font-size: 14px;
            color: #333;
            text-align: center;
        }
        
        .chat-option-item .notification-badge {
            position: absolute;
            top: 10px;
            right: 10px;
            background-color: #FF5722;
            color: white;
            border-radius: 50%;
            width: 18px;
            height: 18px;
            display: none;
            align-items: center;
            justify-content: center;
            font-size: 11px;
        }
        
        /* 电话号码提示框 */
        .phone-tooltip {
            position: absolute;
            bottom: 100%;
            left: 50%;
            transform: translateX(-50%);
            margin-bottom: 10px;
            padding: 8px 16px;
            background: #333;
            color: white;
            border-radius: 6px;
            font-size: 14px;
            white-space: nowrap;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.3s;
            z-index: 10000;
        }
        
        .phone-tooltip::after {
            content: '';
            position: absolute;
            top: 100%;
            left: 50%;
            transform: translateX(-50%);
            border: 6px solid transparent;
            border-top-color: #333;
        }
        
        .chat-option-item:hover .phone-tooltip {
            opacity: 1;
        }
        
        /* 微信二维码提示框 */
        .wechat-tooltip {
            position: absolute;
            bottom: 10%;
            left: -100%;
            transform: translateX(-50%);
            margin-bottom: 10px;
            padding: 12px;
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.3s;
            z-index: 10000;
        }
        
        .wechat-tooltip::after {
            content: '';
            position: absolute;
            top: 50%;
            right: -10%;
            transform: translateX(-40%) rotate(-90deg);
            border: 6px solid transparent;
            border-top-color: white;
        }
        
        .chat-option-item:hover .wechat-tooltip {
            opacity: 1;
        }
        
        .wechat-qrcode-img {
            width: 150px;
            height: 150px;
            display: block;
        }
        
        .wechat-qrcode-text {
            text-align: center;
            font-size: 12px;
            color: #666;
            margin-top: 8px;
        }
        
        #chat-widget-container {
            position: fixed;
            bottom: 90px;
            right: 20px;
            width: 350px;
            height: 500px;
            background: white;
            border-radius: 8px;
            box-shadow: 0 5px 20px rgba(0,0,0,0.2);
            display: none;
            flex-direction: column;
            z-index: 9998;
            overflow: hidden;
        }
        
        #chat-widget-header {
            padding: 15px;
            background: #1E88E5;
            color: white;
            display: flex;
            align-items: center;
        }
        
        #chat-widget-iframe {
            flex: 1;
            border: none;
        }
        
        .close-button {
            margin-left: auto;
            cursor: pointer;
            font-size: 20px;
        }
        
        @media (max-width: 800px) {
          #chat-widget-panel {
            width: 160px;
            bottom: 15px;
            right: 15px;
          }
          
          #chat-widget-container {
            width: 100% !important;
            right: 0 !important;
            bottom: 80px !important;
          }
        }
    `;
  document.head.appendChild(style);
};

// 处理 base64 格式的二维码
CHAT_WIDGET.getQrcodeSrc = function () {
  if (!this.WECHAT_QRCODE) return null;

  const qrcode = this.WECHAT_QRCODE.trim();

  // 如果已经是完整的 data URI 格式
  if (qrcode.startsWith("data:image/")) {
    return qrcode;
  }

  // 如果是纯 base64 字符串，添加 data URI 前缀（默认 PNG 格式）
  // 可以根据实际情况调整图片格式
  if (!qrcode.includes("://") && !qrcode.startsWith("data:")) {
    return `data:image/png;base64,${qrcode}`;
  }

  // 其他情况（URL 等），直接返回
  return qrcode;
};

CHAT_WIDGET.createChatButton = function () {
  const panel = document.createElement("div");
  panel.id = "chat-widget-panel";
  panel.innerHTML = `
        <!-- 在线咨询 -->
        <div class="chat-option-item" id="chat-option-online">
            <div class="chat-option-icon">
                <!-- 在线咨询图标 SVG - 预留位置，稍后可以替换为白色耳机带麦克风图标 -->
                <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="512" cy="512" r="450" fill="#1678FF" opacity="0.15"/>
                    <circle cx="512" cy="512" r="350" fill="#1678FF"/>
                    <!-- 耳机图标占位符 -->
                    <path d="M350 400 Q350 300 450 300 L574 300 Q674 300 674 400 L674 550 Q674 650 574 650 L450 650 Q350 650 350 550 Z" fill="white"/>
                    <circle cx="450" cy="475" r="30" fill="#1678FF"/>
                    <circle cx="574" cy="475" r="30" fill="#1678FF"/>
                    <!-- 麦克风图标占位符 -->
                    <rect x="487" y="550" width="50" height="80" rx="25" fill="white"/>
                    <line x1="512" y1="630" x2="512" y2="680" stroke="white" stroke-width="20" stroke-linecap="round"/>
                </svg>
            </div>
            <div class="chat-option-text">在线咨询</div>
            <div class="notification-badge" style="display: none;">0</div>
        </div>
        
        <!-- 电话沟通 -->
        <div class="chat-option-item" id="chat-option-phone">
            <div class="chat-option-icon">
                <!-- 电话图标 SVG - 预留位置，稍后可以替换为带声音波纹的电话图标 -->
                <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
                    <!-- 电话听筒 -->
                    <path d="M300 200 Q300 150 350 150 L674 150 Q724 150 724 200 L724 500 Q724 550 674 550 L350 550 Q300 550 300 500 Z" fill="#1678FF" stroke="#1678FF" stroke-width="4"/>
                    <rect x="400" y="300" width="224" height="150" rx="10" fill="white"/>
                    <circle cx="450" cy="375" r="15" fill="#1678FF"/>
                    <circle cx="574" cy="375" r="15" fill="#1678FF"/>
                    <!-- 声音波纹 -->
                    <path d="M200 400 Q250 400 250 450 Q250 500 200 500" stroke="#1678FF" stroke-width="8" fill="none" stroke-linecap="round"/>
                    <path d="M150 400 Q200 400 200 450 Q200 500 150 500" stroke="#1678FF" stroke-width="6" fill="none" stroke-linecap="round" opacity="0.7"/>
                    <path d="M824 400 Q774 400 774 450 Q774 500 824 500" stroke="#1678FF" stroke-width="8" fill="none" stroke-linecap="round"/>
                    <path d="M874 400 Q824 400 824 450 Q824 500 874 500" stroke="#1678FF" stroke-width="6" fill="none" stroke-linecap="round" opacity="0.7"/>
                </svg>
            </div>
            <div class="chat-option-text">电话沟通</div>
            <div class="phone-tooltip">${this.PHONE_NUMBER}</div>
        </div>
        
        <!-- 微信咨询 -->
        <div class="chat-option-item" id="chat-option-wechat">
            <div class="chat-option-icon">
                <!-- 微信图标 SVG - 预留位置，稍后可以替换为两个白色对话气泡图标 -->
                <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="512" cy="512" r="450" fill="#1678FF" opacity="0.15"/>
                    <circle cx="512" cy="512" r="350" fill="#1678FF"/>
                    <!-- 第一个对话气泡 -->
                    <ellipse cx="400" cy="450" rx="80" ry="100" fill="white" transform="rotate(-15 400 450)"/>
                    <path d="M350 500 Q400 480 400 500 Q400 520 350 500" fill="white"/>
                    <!-- 第二个对话气泡（重叠） -->
                    <ellipse cx="624" cy="450" rx="80" ry="100" fill="white" transform="rotate(15 624 450)"/>
                    <path d="M674 500 Q624 480 624 500 Q624 520 674 500" fill="white"/>
                </svg>
            </div>
            <div class="chat-option-text">微信咨询</div>
            <div class="wechat-tooltip">
                ${(() => {
                  const qrcodeSrc = this.getQrcodeSrc();
                  return qrcodeSrc
                    ? `<img src="${qrcodeSrc}" alt="微信二维码" class="wechat-qrcode-img">`
                    : '<div class="wechat-qrcode-img" style="background: #f0f0f0; display: flex; align-items: center; justify-content: center; color: #999; font-size: 12px;">二维码图片</div>';
                })()}
                <div class="wechat-qrcode-text">扫码添加微信</div>
            </div>
        </div>
    `;
  document.body.appendChild(panel);

  // 在线咨询点击事件
  const onlineOption = document.getElementById("chat-option-online");
  onlineOption.addEventListener("click", () => {
    this.openChatWindow();
  });

  // 电话沟通点击事件（可选：直接拨打电话）
  const phoneOption = document.getElementById("chat-option-phone");
  phoneOption.addEventListener("click", () => {
    if (this.PHONE_NUMBER) {
      window.location.href = `tel:${this.PHONE_NUMBER}`;
    }
  });

  // 微信咨询点击事件（可选：复制微信号等）
  const wechatOption = document.getElementById("chat-option-wechat");
  // 微信选项可以只显示二维码，不需要点击事件

  // Open automatically if configured
  if (this.AUTO_OPEN) {
    setTimeout(() => {
      this.openChatWindow();
    }, 3000);
  }
};

CHAT_WIDGET.openChatWindow = function () {
  if (this.isChatOpen) return;

  const badge = document.querySelector(
    "#chat-option-online .notification-badge"
  );
  if (badge) {
    badge.style.display = "none";
    badge.textContent = "0";
  }

  // Create container if it doesn't exist
  if (!document.getElementById(this.containerId)) {
    const container = document.createElement("div");
    container.id = this.containerId;
    container.innerHTML = `
            <div id="chat-widget-header">
                <span>${this.chatWindowTitle}</span>
                <span class="close-button">×</span>
            </div>
            <iframe id="${this.iframeId}" src="${this.buildChatUrl()}"></iframe>
        `;
    document.body.appendChild(container);

    // Add close button handler
    document
      .querySelector(`#${this.containerId} .close-button`)
      .addEventListener("click", () => {
        this.closeChatWindow();
      });
  }

  // Show the chat window
  document.getElementById(this.containerId).style.display = "flex";
  this.isChatOpen = true;

  // Hide the floating panel
  const panel = document.getElementById("chat-widget-panel");
  if (panel) {
    panel.style.display = "none";
  }
};

CHAT_WIDGET.closeChatWindow = function () {
  document.getElementById(this.containerId).style.display = "none";
  this.isChatOpen = false;
  const panel = document.getElementById("chat-widget-panel");
  if (panel) {
    panel.style.display = "block";
  }
};

CHAT_WIDGET.buildChatUrl = function () {
  let url = `${this.API_URL}/livechat?user_id=${this.AGENT_ID}`;

  if (this.USER_ID) {
    url += `&user_id=${this.USER_ID}`;
  }
  if (this.USER_NAME) {
    url += `&name=${encodeURIComponent(this.USER_NAME)}`;
  }
  if (this.USER_AVATAR) {
    url += `&avatar=${encodeURIComponent(this.USER_AVATAR)}`;
  }

  return url;
};

CHAT_WIDGET.setupEventHandlers = function () {
  // Handle messages from the chat iframe
  window.addEventListener("message", (e) => {
    if (!e.data || !e.data.type) return;

    switch (e.data.type) {
      case "new_message":
        this.handleIncomingMessage(e.data);
        break;
      case "close_chat":
        this.closeChatWindow();
        break;
    }
  });
};

CHAT_WIDGET.handleIncomingMessage = function (data) {
  // Update notification badge
  const badge = document.querySelector(
    "#chat-option-online .notification-badge"
  );
  if (badge) {
    let count = parseInt(badge.textContent || "0");

    if (!this.isChatOpen) {
      count++;
      badge.textContent = count;
      badge.style.display = "flex";

      // Flash title if window is not focused
      if (!document.hasFocus()) {
        this.notifyWithTitleFlash();
      }
    }
  }
};

CHAT_WIDGET.notifyWithTitleFlash = function () {
  let isFlashing = true;
  const flashInterval = setInterval(() => {
    document.title = isFlashing ? "New message!" : this.originalPageTitle;
    isFlashing = !isFlashing;
  }, 1000);

  // Stop flashing when window regains focus
  window.addEventListener(
    "focus",
    () => {
      clearInterval(flashInterval);
      document.title = this.originalPageTitle;
    },
    { once: true }
  );
};
