(function(){
    if(document.getElementById('clipboardTyperDropdown')){
        document.getElementById('clipboardTyperDropdown').remove();
        return;
    }
    
    const dropdown=document.createElement('div');
    dropdown.id='clipboardTyperDropdown';
    dropdown.innerHTML=`<div style="position:fixed;top:5px;right:10px;z-index:99999;font-family:Arial,sans-serif;color:#fff;min-width:250px;transform:translateX(100%);opacity:0;transition:all 0.4s cubic-bezier(0.68,-0.55,0.265,1.55)">
        <div id="dropdownHeader" style="background:#000;border:2px solid #333;border-radius:8px;padding:12px 15px;cursor:pointer;display:flex;justify-content:space-between;align-items:center;box-shadow:0 2px 10px rgba(0,0,0,0.5);transition:border-radius 0.3s ease">
            <span style="font-weight:bold;font-size:14px">📋 Clipboard Typer</span>
            <span id="dropdownArrow" style="font-size:12px;transition:transform 0.3s ease">▼</span>
        </div>
        <div id="dropdownContent" style="background:rgba(0,0,0,0.8);border:2px solid #333;border-top:1px solid #333;border-radius:0 0 8px 8px;padding:15px;box-shadow:0 4px 20px rgba(0,0,0,0.8);display:none;transform:translateY(-10px);opacity:0;transition:all 0.3s ease;height:auto;overflow:hidden">
            <div style="margin-bottom:15px">
                <div style="position:relative;height:30px;padding:12px 0;margin:5px 0">
                    <span id="delayValue" style="position:absolute;top:-5px;left:10px;font-size:12px;color:#fff;font-weight:bold;z-index:20">1ms</span>
                    <div style="position:absolute;top:50%;left:0;right:0;height:6px;background:linear-gradient(90deg,#6366f1,#8b5cf6,#a855f7,#c084fc,#d8b4fe,#c084fc,#a855f7,#8b5cf6,#6366f1);background-size:800% 100%;animation:slideGradient 12s linear infinite;border-radius:3px;transform:translateY(-50%)"></div>
                    <div id="fisheyeEffect"></div>
                    <input type="range" id="typingDelay" value="1" min="0" max="200" style="position:absolute;top:50%;left:0;right:0;width:100%;height:6px;background:transparent;-webkit-appearance:none;appearance:none;outline:none;cursor:pointer;transform:translateY(-50%);z-index:10">
                    <style>
                        @keyframes slideGradient{0%{background-position:0% 50%}100%{background-position:800% 50%}}
                        @keyframes bounceIn{0%{transform:scale(0);opacity:0}60%{transform:scale(1.2);opacity:1}100%{transform:scale(1);opacity:1}}
                        @keyframes bounceOut{0%{transform:scale(1);opacity:1}100%{transform:scale(0);opacity:0}}
                        @keyframes sliderRipple{0%{transform:scale(0);opacity:0.8}50%{transform:scale(1);opacity:0.4}100%{transform:scale(1.5);opacity:0}}
                        #typingDelay{position:relative}
                        #typingDelay::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;height:18px;width:18px;border-radius:50%;background:#fff;cursor:pointer;border:2px solid #8b5cf6;box-shadow:0 2px 8px rgba(0,0,0,0.4);position:relative;z-index:10;margin-top:-6px;transition:all 0.2s ease}
                        #typingDelay::-moz-range-thumb{height:18px;width:18px;border-radius:50%;background:#fff;cursor:pointer;border:2px solid #8b5cf6;box-shadow:0 2px 8px rgba(0,0,0,0.4);margin-top:-6px}
                        #typingDelay::-webkit-slider-track{height:6px;border-radius:3px;background:transparent}
                        #typingDelay::-moz-range-track{height:6px;border-radius:3px;background:transparent;border:none}
                        #fisheyeEffect{position:absolute;top:calc(50% - 3px);width:4px;height:4px;background:linear-gradient(90deg,#6366f1,#8b5cf6,#a855f7,#c084fc,#d8b4fe,#c084fc,#a855f7,#8b5cf6,#6366f1);background-size:800% 100%;animation:slideGradient 12s linear infinite;border-radius:50%;pointer-events:none;transform:translate(-50%,-50%) scale(0.5);opacity:1;z-index:5}
                        #startTyping{transition:all 0.3s cubic-bezier(0.68,-0.55,0.265,1.55)}
                    </style>
                </div>
            </div>
            <div id="timerSection" style="margin-bottom:15px;height:0;opacity:0;overflow:hidden;transition:all 0.4s cubic-bezier(0.68,-0.55,0.265,1.55)">
                <div id="countdownDisplay" style="font-size:24px;font-weight:bold;color:#ff6b6b;text-align:center;margin:10px 0;min-height:30px;transform:scale(0);opacity:0"></div>
            </div>
            <button id="startTyping" onclick="startClipboardTyping()" style="width:100%;padding:12px;background:#22c55e;color:#fff;border:none;border-radius:4px;cursor:pointer;font-size:14px;font-weight:bold">Start</button>
            <div style="margin-top:10px;font-size:11px;color:#aaa;text-align:center">Focus on input field first!</div>
            <button onclick="closeClipboardTyper()" style="width:100%;margin-top:10px;padding:8px;background:#333;color:#fff;border:none;border-radius:4px;cursor:pointer;font-size:12px">Close</button>
            <div style="margin-top:8px;text-align:right;font-size:11px;background:linear-gradient(90deg,#6366f1,#8b5cf6,#a855f7,#c084fc,#d8b4fe,#c084fc,#a855f7,#8b5cf6,#6366f1);background-size:800% 100%;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:slideGradient 12s linear infinite;opacity:0.8;font-weight:bold">Luizz</div>
        </div>
    </div>`;
    
    document.body.appendChild(dropdown);
    
    setTimeout(()=>{
        dropdown.children[0].style.transform='translateX(0)';
        dropdown.children[0].style.opacity='1';
    },10);
    
    const slider=document.getElementById('typingDelay');
    const delayValue=document.getElementById('delayValue');
    const fisheyeEffect=document.getElementById('fisheyeEffect');
    let lastSliderValue=slider.value;
    let movementSpeed=0;
    let movementDirection=0;
    let lastDirection=0;
    let directionChangeTime=0;
    let speedDecay;
    
    function updateFisheyePosition(){
        const sliderRect=slider.getBoundingClientRect();
        const sliderPadding=9;
        const effectiveWidth=sliderRect.width-(sliderPadding*2);
        const thumbPercent=(slider.value-slider.min)/(slider.max-slider.min);
        const thumbPosition=sliderPadding+(thumbPercent*effectiveWidth);
        const currentValue=parseFloat(slider.value);
        const deltaValue=currentValue-lastSliderValue;
        
        if(Math.abs(deltaValue)>0.1){
            const newDirection=deltaValue>0?1:-1;
            if(newDirection!==lastDirection&&lastDirection!==0){
                directionChangeTime=Date.now();
                movementSpeed*=0.3;
            }
            movementDirection=newDirection;
            lastDirection=newDirection;
        }
        
        const timeSinceDirectionChange=Date.now()-directionChangeTime;
        const directionTransition=Math.min(timeSinceDirectionChange/300,1);
        const offsetDistance=8*directionTransition;
        const fisheyePosition=thumbPosition+(movementDirection*offsetDistance);
        fisheyeEffect.style.left=fisheyePosition+'px';
        
        movementSpeed=Math.min(movementSpeed+Math.abs(deltaValue)*0.1,1.5);
        
        const distanceToLeftEdge=thumbPercent;
        const distanceToRightEdge=1-thumbPercent;
        const distanceFromClosestEdge=movementDirection>0?distanceToRightEdge:distanceToLeftEdge;
        const distanceScale=(1-Math.min(distanceToLeftEdge,distanceToRightEdge))*2;
        const totalScale=Math.max(0.1,distanceScale*movementSpeed*1.5);
        
        fisheyeEffect.style.transform=`translate(-50%,-50%) scale(${totalScale})`;
        
        lastSliderValue=currentValue;
        
        clearTimeout(speedDecay);
        speedDecay=setTimeout(()=>{
            const decayInterval=setInterval(()=>{
                movementSpeed*=0.95;
                const totalScale=Math.max(0.1,distanceScale*movementSpeed*1.5);
                fisheyeEffect.style.transform=`translate(-50%,-50%) scale(${totalScale})`;
                if(movementSpeed<0.05){
                    clearInterval(decayInterval);
                    movementSpeed=0;
                    fisheyeEffect.style.transform='translate(-50%,-50%) scale(0.1)'
                }
            },50)
        },200)
    }
    
    slider.oninput=function(){
        delayValue.textContent=this.value+'ms';
        updateFisheyePosition()
    };
    
    slider.onmousemove=function(e){
        if(e.buttons===1){
            updateFisheyePosition()
        }
    };
    
    slider.onmouseenter=function(e){
        updateFisheyePosition()
    };
    
    slider.onmouseleave=function(){
        movementSpeed=0;
        fisheyeEffect.style.transform='translate(-50%,-50%) scale(0.1)'
    };
    
    slider.oninput();
    
    document.getElementById('dropdownHeader').onclick=function(){
        const content=document.getElementById('dropdownContent');
        const arrow=document.getElementById('dropdownArrow');
        const header=document.getElementById('dropdownHeader');
        
        if(content.style.display==='none'||!content.style.display){
            content.style.display='block';
            header.style.borderRadius='8px 8px 0 0';
            setTimeout(()=>{
                content.style.transform='translateY(0)';
                content.style.opacity='1'
            },10);
            arrow.textContent='▲';
            arrow.style.transform='rotate(180deg)'
        }else{
            content.style.transform='translateY(-10px)';
            content.style.opacity='0';
            setTimeout(()=>{
                content.style.display='none';
                header.style.borderRadius='8px'
            },300);
            arrow.textContent='▼';
            arrow.style.transform='rotate(0deg)'
        }
    };
    
    let countdownInterval;
    let typingInterval;
    let isTyping=false;
    let stopTyping=false;
    
    window.closeClipboardTyper=function(){
        const dropdown=document.getElementById('clipboardTyperDropdown');
        dropdown.children[0].style.transform='translateX(100%)';
        dropdown.children[0].style.opacity='0';
        setTimeout(()=>{
            dropdown.remove()
        },400)
    };
    
    window.startClipboardTyping=async function(){
        if(isTyping){
            stopTyping=true;
            clearInterval(countdownInterval);
            clearInterval(typingInterval);
            resetButton();
            return;
        }
        
        const button=document.getElementById('startTyping');
        const countdownDisplay=document.getElementById('countdownDisplay');
        const timerSection=document.getElementById('timerSection');
        const delay=parseInt(document.getElementById('typingDelay').value)||1;
        
        try{
            const clipboardText=await navigator.clipboard.readText();
            if(!clipboardText){
                alert('Clipboard is empty!');
                return;
            }
            
            // Expand timer section
            timerSection.style.height='60px';
            timerSection.style.opacity='1';
            
            button.style.transform='translateY(2px)';
            setTimeout(()=>{
                button.textContent='Stop';
                button.style.background='#dc3545'
            },150);
            
            isTyping=true;
            stopTyping=false;
            
            let countdown=5;
            setTimeout(()=>{
                countdownDisplay.style.animation='bounceIn 0.5s cubic-bezier(0.68,-0.55,0.265,1.55)';
                countdownDisplay.style.transform='scale(1)';
                countdownDisplay.style.opacity='1';
                countdownDisplay.textContent=countdown;
            },200);
            
            countdownInterval=setInterval(()=>{
                if(stopTyping){
                    clearInterval(countdownInterval);
                    resetButton();
                    return;
                }
                
                countdown--;
                if(countdown>0){
                    countdownDisplay.textContent=countdown
                }else{
                    clearInterval(countdownInterval);
                    countdownDisplay.innerHTML='<span style="background:linear-gradient(90deg,#6366f1,#8b5cf6,#a855f7,#c084fc,#d8b4fe,#c084fc,#a855f7,#8b5cf6,#6366f1);background-size:800% 100%;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:slideGradient 6s linear infinite">TYPING!</span>';
                    setTimeout(()=>{
                        typeText(clipboardText,delay).then(()=>{
                            resetButton()
                        })
                    },100)
                }
            },1000)
        }catch(err){
            alert('Error reading clipboard: '+err.message);
            resetButton()
        }
    };
    
    function resetButton(){
        const button=document.getElementById('startTyping');
        const countdownDisplay=document.getElementById('countdownDisplay');
        const timerSection=document.getElementById('timerSection');
        
        button.style.transform='translateY(-2px)';
        setTimeout(()=>{
            button.textContent='Start';
            button.style.background='#22c55e';
            button.style.transform='translateY(0)'
        },150);
        
        countdownDisplay.style.animation='bounceOut 0.3s linear';
        setTimeout(()=>{
            countdownDisplay.style.transform='scale(0)';
            countdownDisplay.style.opacity='0';
            countdownDisplay.textContent='';
            countdownDisplay.style.color='#ff6b6b';
            
            // Collapse timer section after countdown animation
            setTimeout(()=>{
                timerSection.style.height='0';
                timerSection.style.opacity='0';
            },100);
        },300);
        
        isTyping=false;
        stopTyping=false;
        if(typingInterval){
            clearInterval(typingInterval);
        }
    }
    
    function simulateKeyEvent(element,eventType,char){
        const keyCode=char.charCodeAt(0);
        const event=new KeyboardEvent(eventType,{
            key:char,
            code:'Key'+char.toUpperCase(),
            keyCode:keyCode,
            which:keyCode,
            charCode:eventType==='keypress'?keyCode:0,
            bubbles:true,
            cancelable:true
        });
        return element.dispatchEvent(event)
    }
    
    async function typeText(text,delay){
        if(stopTyping)return;
        
        const activeElement=document.activeElement;
        if(!activeElement||(!activeElement.tagName.match(/INPUT|TEXTAREA/)&&!activeElement.contentEditable)){
            alert('Please focus on an input field first!');
            resetButton();
            return
        }
        
        for(let i=0;i<text.length;i++){
            if(stopTyping)break;
            
            const char=text[i];
            
            simulateKeyEvent(activeElement,'keydown',char);
            simulateKeyEvent(activeElement,'keypress',char);
            
            if(activeElement.tagName.match(/INPUT|TEXTAREA/)){
                const start=activeElement.selectionStart||0;
                const end=activeElement.selectionEnd||0;
                const currentValue=activeElement.value||'';
                activeElement.value=currentValue.substring(0,start)+char+currentValue.substring(end);
                activeElement.selectionStart=activeElement.selectionEnd=start+1
            }else if(activeElement.contentEditable){
                document.execCommand('insertText',false,char)
            }
            
            activeElement.dispatchEvent(new Event('input',{bubbles:true}));
            activeElement.dispatchEvent(new Event('change',{bubbles:true}));
            simulateKeyEvent(activeElement,'keyup',char);
            
            if(delay>0){
                await new Promise(resolve=>setTimeout(resolve,delay))
            }
        }
    }
})();
