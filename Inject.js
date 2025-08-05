// ==UserScript==
// @name         Redacao Parana Destroyer
// @namespace    https://github.com/LuizzLoL
// @version      1.0
// @description  Emulates clipboard typing
// @author       Luizz
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function() {
    if (document.getElementById('clipboardTyperDropdown')) {
        document.getElementById('clipboardTyperDropdown').remove();
        return;
    }

    const dropdown = document.createElement('div');
    dropdown.id = 'clipboardTyperDropdown';
    dropdown.innerHTML = `
        <div style="position:fixed;top:5px;right:10px;z-index:99999;font-family:Arial,sans-serif;color:#fff;min-width:250px;transform:translateX(100%);opacity:0;transition:all 0.4s cubic-bezier(0.68,-0.55,0.265,1.55)">
            <div id="dropdownHeader" style="background:#000;border:2px solid #333;border-radius:8px;padding:12px 15px;cursor:pointer;display:flex;justify-content:space-between;align-items:center;box-shadow:0 2px 10px rgba(0,0,0,0.5);transition:border-radius 0.3s ease">
                <span style="font-weight:bold;font-size:14px">📋 Clipboard Typer</span>
                <span id="dropdownArrow" style="font-size:12px;transition:transform 0.3s ease">▼</span>
            </div>
            <div id="dropdownContent" style="background:rgba(0,0,0,0.8);border:2px solid #333;border-top:1px solid #333;border-radius:0 0 8px 8px;padding:15px;box-shadow:0 4px 20px rgba(0,0,0,0.8);display:none;transform:translateY(-10px);opacity:0;transition:all 0.3s ease">
                <div style="margin-bottom:15px">
                    <label style="display:block;margin-bottom:8px;font-size:13px">Typing Delay: <span id="delayValue">1</span>ms</label>
                    <input type="range" id="typingDelay" value="1" min="0" max="200" style="width:100%">
                </div>
                <div style="margin-bottom:15px">
                    <div id="countdownDisplay" style="font-size:24px;font-weight:bold;color:#ff6b6b;text-align:center;margin:10px 0;min-height:30px;transform:scale(0);opacity:0"></div>
                </div>
                <button id="startTyping" style="width:100%;padding:12px;background:#22c55e;color:#fff;border:none;border-radius:4px;cursor:pointer;font-size:14px;font-weight:bold">Start</button>
                <div style="margin-top:10px;font-size:11px;color:#aaa;text-align:center">Focus on input field first!</div>
                <button id="closeTyping" style="width:100%;margin-top:10px;padding:8px;background:#333;color:#fff;border:none;border-radius:4px;cursor:pointer;font-size:12px">Close</button>
                <div style="margin-top:8px;text-align:right;font-size:18px;font-weight:bold;background:linear-gradient(90deg,#6366f1,#8b5cf6,#a855f7,#c084fc,#d8b4fe,#c084fc,#a855f7,#8b5cf6,#6366f1);background-size:800% 100%;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:slideGradient 12s linear infinite;opacity:0.9">Luizz</div>
            </div>
        </div>
    `;

    document.body.appendChild(dropdown);
    setTimeout(() => {
        dropdown.children[0].style.transform = 'translateX(0)';
        dropdown.children[0].style.opacity = '1';
    }, 10);

    const slider = dropdown.querySelector('#typingDelay');
    const delayValue = dropdown.querySelector('#delayValue');
    const startBtn = dropdown.querySelector('#startTyping');
    const closeBtn = dropdown.querySelector('#closeTyping');
    const countdownDisplay = dropdown.querySelector('#countdownDisplay');
    const content = dropdown.querySelector('#dropdownContent');
    const arrow = dropdown.querySelector('#dropdownArrow');
    const header = dropdown.querySelector('#dropdownHeader');

    let countdownInterval, typingInterval;
    let isTyping = false, stopTyping = false;

    header.onclick = () => {
        if (content.style.display === 'none' || !content.style.display) {
            content.style.display = 'block';
            header.style.borderRadius = '8px 8px 0 0';
            setTimeout(() => {
                content.style.transform = 'translateY(0)';
                content.style.opacity = '1';
            }, 10);
            arrow.textContent = '▲';
            arrow.style.transform = 'rotate(180deg)';
        } else {
            content.style.transform = 'translateY(-10px)';
            content.style.opacity = '0';
            setTimeout(() => {
                content.style.display = 'none';
                header.style.borderRadius = '8px';
            }, 300);
            arrow.textContent = '▼';
            arrow.style.transform = 'rotate(0deg)';
        }
    };

    closeBtn.onclick = () => {
        dropdown.children[0].style.transform = 'translateX(100%)';
        dropdown.children[0].style.opacity = '0';
        setTimeout(() => { dropdown.remove(); }, 400);
    };

    startBtn.onclick = async () => {
        if (isTyping) {
            stopTyping = true;
            clearInterval(countdownInterval);
            clearInterval(typingInterval);
            resetButton();
            return;
        }

        const delay = parseInt(slider.value) || 1;
        let clipboardText;
        try {
            clipboardText = await navigator.clipboard.readText();
        } catch (e) {
            alert('Could not read clipboard!');
            return;
        }

        if (!clipboardText) {
            alert('Clipboard is empty!');
            return;
        }

        startBtn.textContent = 'Stop';
        startBtn.style.background = '#dc3545';
        isTyping = true;
        stopTyping = false;
        let countdown = 5;
        countdownDisplay.style.transform = 'scale(1)';
        countdownDisplay.style.opacity = '1';
        countdownDisplay.textContent = countdown;

        countdownInterval = setInterval(() => {
            if (stopTyping) {
                clearInterval(countdownInterval);
                resetButton();
                return;
            }
            countdown--;
            if (countdown > 0) {
                countdownDisplay.textContent = countdown;
            } else {
                clearInterval(countdownInterval);
                countdownDisplay.innerHTML = '<span style="background:linear-gradient(90deg,#6366f1,#8b5cf6,#a855f7,#c084fc,#d8b4fe,#c084fc,#a855f7,#8b5cf6,#6366f1);background-size:800% 100%;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:slideGradient 6s linear infinite">TYPING!</span>';
                setTimeout(() => {
                    typeText(clipboardText, delay).then(() => {
                        resetButton();
                    });
                }, 100);
            }
        }, 1000);
    };

    function resetButton() {
        isTyping = false;
        stopTyping = false;
        startBtn.textContent = 'Start';
        startBtn.style.background = '#22c55e';
        countdownDisplay.style.transform = 'scale(0)';
        countdownDisplay.style.opacity = '0';
        countdownDisplay.textContent = '';
    }

    async function typeText(text, delay) {
        const active = document.activeElement;
        if (!active || (!active.tagName.match(/INPUT|TEXTAREA/) && !active.isContentEditable)) {
            alert('Focus an input field first!');
            resetButton();
            return;
        }
        for (let i = 0; i < text.length && !stopTyping; i++) {
            const char = text[i];
            if (active.tagName.match(/INPUT|TEXTAREA/)) {
                const start = active.selectionStart;
                const end = active.selectionEnd;
                const val = active.value;
                active.value = val.slice(0, start) + char + val.slice(end);
                active.selectionStart = active.selectionEnd = start + 1;
            } else if (active.isContentEditable) {
                document.execCommand('insertText', false, char);
            }
            active.dispatchEvent(new Event('input', { bubbles: true }));
            await new Promise(res => setTimeout(res, delay));
        }
    }

})();
