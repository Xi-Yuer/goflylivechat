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
        #chat-widget-button {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 60px;
            height: 60px;
            background-color: #1E88E5;
            color: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            z-index: 9999;
        }
        
        #chat-widget-button .notification-badge {
            position: absolute;
            top: -5px;
            right: -5px;
            background-color: #FF5722;
            color: white;
            border-radius: 50%;
            width: 20px;
            height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
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
          #chat-widget-container {
            width: 100% !important;
            right: 0 !important;
            bottom: 80px !important;
          }
        }
    `;
  document.head.appendChild(style);
};

CHAT_WIDGET.createChatButton = function () {
  const button = document.createElement("div");
  button.id = "chat-widget-button";
  button.innerHTML = `
        <svg version="1.0" xmlns="http://www.w3.org/2000/svg" width="800.000000" height="800.000000" viewBox="0 0 800.000000 800.000000" preserveAspectRatio="xMidYMid meet">
        <metadata>
            <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:rdfs="http://www.w3.org/2000/01/rdf-schema#" xmlns:dc="http://purl.org/dc/elements/1.1/">
            <rdf:Description dc:format="image/svg+xml" dc:Label="1" dc:ContentProducer="001191330110MACRLGPT8B00000" dc:ProduceID="340695450" dc:ReservedCode1="fhHYYc2jeZRKQ5b+cLlAfKpe4xfMZyt03Ua9afnJeTQ=" dc:ContentPropagator="001191330110MACRLGPT8B00000" dc:PropagateID="340695450" dc:ReservedCode2="fhHYYc2jeZRKQ5b+cLlAfKpe4xfMZyt03Ua9afnJeTQ="/>
            </rdf:RDF>
        </metadata>
        <g transform="translate(14.087194,796.962286) scale(0.098300,-0.098300)" fill="#4d82f2" stroke="none">
            <path d="M2623 6170 c-403 -20 -572 -96 -693 -312 -76 -136 -86 -221 -100 -838 -28 -1252 -22 -2310 15 -2553 42 -278 203 -476 435 -533 121 -30 500 -36 1750 -30 682 4 1291 11 1374 17 243 17 338 51 447 160 72 72 124 165 148 265 18 73 20 152 30 1094 18 1612 13 2076 -23 2251 -36 172 -152 326 -298 393 -152 71 -107 68 -1278 76 -580 4 -1185 10 -1345 13 -159 3 -368 2 -462 -3z m2757 -140 c98 -7 167 -16 213 -31 130 -41 232 -143 276 -276 41 -122 44 -276 35 -1583 -4 -674 -9 -1342 -10 -1485 -2 -292 -7 -321 -80 -431 -64 -96 -154 -152 -284 -175 -138 -25 -3026 -33 -3168 -9 -145 24 -231 81 -312 204 -51 80 -75 152 -92 287 -18 139 -18 2107 0 2663 14 428 23 502 74 598 81 153 213 224 453 247 117 11 2705 3 2895 -9z"/>
            <path d="M2493 5939 c-140 -16 -239 -62 -312 -145 -47 -53 -101 -159 -100 -195 l0 -24 17 25 c77 114 255 216 537 305 121 38 124 45 20 44 -49 -1 -122 -5 -162 -10z"/>
            <path d="M5370 5927 c0 -8 11 -20 25 -27 14 -7 25 -19 25 -26 0 -15 -62 -29 -86 -20 -10 4 -14 1 -12 -6 6 -18 73 -49 115 -54 49 -6 73 14 80 64 5 34 2 42 -22 60 -32 26 -125 32 -125 9z"/>
            <path d="M5592 5850 c-28 -27 -29 -80 -2 -105 13 -12 30 -16 55 -13 46 5 66 -16 72 -77 10 -80 36 -43 34 47 -1 81 -61 168 -115 168 -12 0 -32 -9 -44 -20z"/>
            <path d="M3740 5481 l-605 -6 -37 -23 c-20 -13 -48 -36 -62 -52 -53 -64 -55 -77 -65 -615 -6 -292 -6 -522 -1 -554 11 -62 50 -125 93 -147 16 -9 60 -19 98 -23 101 -11 104 -16 104 -162 l0 -121 33 -29 c20 -18 43 -29 62 -29 17 0 155 62 347 158 l318 157 335 5 c373 6 365 4 432 78 20 22 40 55 46 73 6 19 13 183 16 369 3 184 9 425 12 536 6 188 5 203 -14 247 -22 50 -82 100 -150 126 -47 17 -184 19 -962 12z m945 -122 c30 -11 62 -30 70 -42 13 -19 22 -97 10 -97 -2 0 -35 23 -72 51 -79 59 -106 74 -150 84 -58 12 -47 25 21 25 41 0 85 -8 121 -21z m-1330 -10 c5 -5 0 -9 -15 -9 -30 -1 -56 -15 -100 -55 -92 -84 -116 -113 -132 -160 l-18 -50 5 84 c7 135 45 186 146 201 57 8 98 5 114 -11z m968 -308 c31 -12 42 -43 26 -73 -12 -22 -330 -375 -452 -500 -48 -51 -60 -58 -94 -58 -54 0 -82 21 -242 176 -147 145 -158 163 -131 215 24 44 56 25 204 -121 78 -77 145 -140 148 -140 7 0 225 224 368 378 68 72 129 132 136 132 7 0 24 -4 37 -9z m437 -769 c0 -46 -30 -90 -77 -113 -38 -18 -55 -21 -111 -16 -36 4 -70 11 -76 17 -7 7 -4 10 10 10 31 0 118 47 156 84 23 22 39 51 47 82 24 92 24 92 37 24 7 -36 13 -76 14 -88z"/>
            <path d="M4312 3254 c-14 -10 -22 -26 -22 -45 l0 -29 -97 -1 c-120 0 -189 -11 -210 -32 -24 -23 -29 -111 -9 -142 30 -45 90 -24 98 35 2 21 9 26 41 28 27 2 37 -1 37 -12 0 -17 -79 -89 -132 -120 -44 -25 -63 -59 -48 -86 18 -33 56 -35 111 -6 l50 26 30 -22 c16 -12 29 -25 29 -29 0 -3 -46 -14 -101 -22 -104 -16 -139 -34 -139 -69 0 -26 36 -58 65 -58 14 0 25 -1 26 -2 0 -2 4 -54 8 -117 6 -95 10 -116 27 -128 12 -9 28 -12 44 -7 47 13 401 16 431 4 21 -9 34 -9 56 2 28 13 28 14 33 128 l5 115 35 5 c51 9 60 17 60 54 0 54 -15 63 -125 76 -55 7 -103 14 -107 16 -4 3 8 19 28 36 47 41 67 82 59 119 -12 52 -35 59 -188 59 -106 0 -138 3 -135 13 4 9 49 13 171 15 l167 2 0 -30 c0 -50 16 -70 55 -70 43 0 55 20 55 95 0 55 -12 93 -34 107 -6 4 -63 8 -126 8 -140 0 -156 4 -164 38 -11 53 -47 72 -84 46z m111 -338 c1 -5 -15 -18 -35 -28 l-36 -19 -51 26 c-28 14 -51 28 -51 31 0 9 170 -1 173 -10z m-28 -186 l40 -19 -110 1 -110 0 55 18 c69 23 76 23 125 0z m135 -160 l0 -40 -185 0 -185 0 0 33 c0 19 3 37 7 40 3 4 87 7 185 7 l178 0 0 -40z"/>
            <path d="M2582 3248 c-5 -7 -17 -28 -26 -45 l-17 -33 -99 0 c-131 0 -150 -8 -150 -59 0 -22 6 -43 12 -47 7 -5 52 -7 100 -6 49 2 88 0 88 -3 0 -20 -80 -121 -150 -190 -61 -61 -80 -86 -80 -107 0 -55 70 -71 109 -24 7 9 17 13 22 10 5 -3 9 -68 9 -144 0 -130 1 -140 21 -150 11 -6 30 -10 42 -8 40 6 47 41 47 236 l0 184 56 99 57 99 126 1 c69 1 173 4 230 8 104 6 104 6 114 35 8 23 6 32 -12 50 -21 20 -31 21 -214 21 l-192 0 2 23 c5 39 -14 62 -51 62 -19 0 -38 -6 -44 -12z"/>
            <path d="M3258 3243 c-37 -44 -148 -225 -148 -243 0 -33 36 -60 80 -60 22 0 40 -3 40 -6 0 -4 -20 -38 -44 -78 -60 -97 -63 -110 -31 -141 22 -23 30 -25 73 -20 93 13 152 35 157 58 5 20 12 22 73 22 l66 -1 12 -64 c6 -36 10 -68 7 -72 -2 -4 -36 -27 -76 -50 -82 -49 -96 -63 -97 -99 0 -52 45 -64 101 -26 50 33 109 67 118 67 4 0 21 -19 38 -43 49 -70 128 -95 192 -62 37 19 71 88 78 159 6 62 -5 86 -42 86 -30 0 -51 -27 -60 -75 -9 -50 -22 -75 -39 -75 -15 0 -66 55 -66 70 0 5 32 34 70 65 57 46 70 61 70 85 0 19 -9 35 -27 49 l-28 20 41 1 c47 0 64 14 64 51 0 47 -21 54 -147 52 l-113 -3 0 30 c0 17 4 30 9 30 58 0 221 25 239 36 40 26 26 79 -24 93 -21 5 -30 14 -32 33 -4 31 -92 118 -120 118 -23 0 -52 -30 -52 -54 0 -10 18 -36 41 -59 l41 -42 -39 -7 c-61 -11 -70 -4 -76 56 -7 73 -21 96 -56 96 -40 0 -53 -20 -59 -96 -6 -78 -18 -87 -73 -56 -52 30 -69 28 -109 -13 -53 -54 -56 -26 -5 49 47 71 52 85 35 117 -13 24 -61 25 -82 2z m240 -289 c8 -2 12 -16 10 -36 -3 -32 -5 -33 -53 -38 -56 -6 -75 -15 -75 -34 0 -11 -77 -33 -85 -24 -2 2 16 35 39 75 l41 72 55 -5 c30 -3 61 -8 68 -10z m212 -194 c-25 -22 -49 -38 -55 -36 -5 1 -11 16 -13 34 -3 33 6 37 83 40 l30 1 -45 -39z"/>
            <path d="M4863 3218 c-29 -14 -31 -35 -37 -323 -4 -214 -6 -236 -31 -314 -15 -46 -24 -93 -21 -105 7 -29 51 -50 76 -36 21 11 54 94 64 160 15 100 15 100 47 100 l29 0 0 -85 0 -85 -36 -15 c-31 -13 -35 -18 -32 -47 6 -67 106 -77 152 -15 20 28 21 39 21 386 0 289 -3 361 -14 374 -11 14 -31 17 -105 16 -50 0 -101 -5 -113 -11z m125 -140 c-3 -38 -6 -43 -28 -43 -20 0 -26 6 -28 28 -5 42 4 57 33 57 25 0 26 -3 23 -42z m2 -201 c0 -39 -14 -57 -41 -50 -14 4 -19 14 -19 37 0 39 6 46 37 46 19 0 23 -5 23 -33z"/>
            <path d="M5183 3220 c-42 -17 -44 -37 -50 -400 -6 -316 -4 -351 11 -374 32 -50 113 -29 198 51 l27 25 43 -34 c24 -19 57 -43 75 -53 30 -17 33 -17 57 -1 43 28 34 58 -31 112 -32 25 -59 49 -61 53 -1 4 13 37 32 74 39 75 51 122 42 170 -9 50 -37 61 -159 67 -136 6 -142 24 -8 28 90 2 101 5 123 27 31 30 48 87 48 154 0 65 -11 86 -51 100 -38 13 -264 14 -296 1z m235 -126 c5 -32 -18 -43 -102 -50 l-76 -7 0 36 0 36 68 4 c101 5 107 4 110 -19z m2 -304 c0 -17 -40 -90 -48 -90 -10 0 -42 65 -42 85 0 11 12 15 45 15 25 0 45 -5 45 -10z m-130 -187 c0 -12 -38 -43 -52 -43 -5 0 -8 39 -8 88 l0 87 30 -60 c16 -33 30 -65 30 -72z"/>
            <path d="M2762 3028 c-5 -7 -13 -39 -17 -70 l-7 -58 -70 0 c-91 0 -108 -10 -108 -60 0 -50 17 -60 110 -60 l71 0 -3 -92 -3 -93 -95 -5 -95 -5 -3 -38 c-6 -67 -7 -67 255 -67 142 0 242 4 254 10 14 8 19 21 19 55 l0 44 -107 3 -108 3 0 87 c0 47 4 90 8 94 4 5 40 10 80 12 83 5 97 13 97 56 0 48 -15 56 -101 56 l-77 0 -4 54 c-3 30 -10 62 -17 70 -16 19 -64 21 -79 4z"/>
            <path d="M5764 2618 c-21 -34 -97 -122 -170 -195 -171 -173 -206 -190 -547 -255 -165 -31 -133 -41 148 -46 350 -6 446 19 525 138 62 94 82 159 88 298 2 67 2 122 0 122 -3 0 -22 -28 -44 -62z"/>
            <path d="M3249 2615 c-113 -25 -109 -22 -109 -59 0 -49 19 -60 91 -52 83 8 146 37 155 70 13 54 -25 66 -137 41z"/>
            <path d="M2070 2502 c0 -147 102 -313 209 -342 42 -11 314 -40 320 -34 6 5 -18 23 -91 72 -172 112 -178 115 -236 120 -74 6 -92 22 -92 82 0 35 -5 52 -21 66 -12 10 -29 35 -38 54 -9 19 -24 36 -34 38 -15 3 -17 -5 -17 -56z"/>
        </g>
        </svg>
        <div class="notification-badge" style="display: none;">0</div>
    `;
  document.body.appendChild(button);

  button.addEventListener("click", () => {
    this.openChatWindow();
  });

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
    "#chat-widget-button .notification-badge"
  );
  badge.style.display = "none";
  badge.textContent = "0";

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

  // Hide the floating button
  document.getElementById("chat-widget-button").style.display = "none";
};

CHAT_WIDGET.closeChatWindow = function () {
  document.getElementById(this.containerId).style.display = "none";
  this.isChatOpen = false;
  document.getElementById("chat-widget-button").style.display = "flex";
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
    "#chat-widget-button .notification-badge"
  );
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
