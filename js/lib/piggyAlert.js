(function () {
    // 动态添加CSS样式  
    var style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = `  
    .piggy_modal {  
        display: none;
        position: fixed;
        z-index: 1000;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        overflow: auto;
        background-color: rgba(0, 0, 0, 0.5);
        align-items: center;
        justify-content: center;
    }  

    .piggy_modal-content {
        background: white;
        border-radius: 8px;
        box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.2);
        max-width: 500px;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        padding: 20px;
    }  
    .piggy_close {  
        position: absolute;
        right: 10px;
        top: 10px;
        font-size: 20px;
        font-weight: bold;
        cursor: pointer;
        color: #888888;
        transition: color 0.3s ease;
    }
    .piggy_close:hover {
        color: #000000;
    }
    `;
    document.head.appendChild(style);

    // 创建弹窗的DOM结构  
    var modalHTML = `  
    <div id="customAlert" class="piggy_modal">
        <div class="piggy_modal-content">
            <span class="piggy_close">&times;</span>
            <p id="alertMessage"></p>
        </div>
    </div>  
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // 初始化弹窗功能  
    var modal = document.getElementById('customAlert');
    var messageElement = document.getElementById('alertMessage');
    var closeSpan = document.querySelector('#customAlert .piggy_close');

    function showCustomAlert(msg) {
        messageElement.textContent = msg;
        modal.style.display = 'block';
    }

    closeSpan.addEventListener('click', function () {
        modal.style.display = 'none';
    });

    window.addEventListener('click', function (event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    // 将showCustomAlert函数暴露到全局，以便在其他地方调用  
    window.showPiggyAlert = showCustomAlert;
})();