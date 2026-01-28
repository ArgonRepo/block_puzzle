'use strict';

    document.getElementById('addTimes').addEventListener('click', function () {
        //document.getElementById('mask_layer').style.display = 'block'; // 显示遮罩层
    		//document.getElementById('couponCode').value = ''; // 清空输入框
    		showPiggyAlert("功能暂未实现");
    });

    document.getElementById('submitCoupon').addEventListener('click', function () {
            var couponCode = document.getElementById('couponCode').value;
    if (couponCode) {
                // 发送AJAX POST请求到后台验证券码
                var xhr = new XMLHttpRequest();
    xhr.open("POST", "/your-backend-url", true); // 替换为你的后端处理URL
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    xhr.onload = function () {
                    if (xhr.status === 200) {
                        var response = JSON.parse(xhr.responseText);
    // 根据返回的JSON信息处理结果
    if (response.valid) {
        // 券码有效，更新次数或执行其他操作
        showPiggyAlert('券码有效，增加了' + response.extraTimes + '次');
                        } else {
        // 券码无效或已过期等错误处理
        showPiggyAlert('券码无效或已过期');
                        }
                    } else {
        // 请求完成但返回了错误的状态码
        showPiggyAlert('请求失败，服务器返回状态码：' + xhr.status);
                    }
    // 关闭遮罩层
    document.getElementById('mask_layer').style.display = 'none';
                };

    xhr.onerror = function () {
        // 网络错误或其他问题导致请求失败
        showPiggyAlert('网络错误，请求未能完成。');
    // 关闭遮罩层
    document.getElementById('mask_layer').style.display = 'none';
                };

    xhr.ontimeout = function () {
        // 请求超时
        showPiggyAlert('请求超时，请检查您的网络连接。');
    // 关闭遮罩层
    document.getElementById('mask_layer').style.display = 'none';
                };

    // 设置请求超时时间（例如，5秒）
    xhr.timeout = 5000;
    var value = {code: couponCode, userId: piggy.uid };
    console.log(JSON.stringify(value));
    xhr.send(encodeURIComponent(JSON.stringify(value))); // 发送券码到后台
            } else {
        alert('请输入券码');
                // 不需要关闭遮罩层，因为用户可能需要重新输入
            }
        });

    function setDivProperties(id, zIndex, isVisible, position, x, y) {
            // 获取指定id的div元素
            var div = document.getElementById(id);
    if (div) {
        // 设置z-index
        div.style.zIndex = zIndex || 0;

    // 设置是否可见
    div.style.display = isVisible ? 'block' : 'none';

    // 设置排布位置
    div.style.position = position || 'static';

    // 如果位置是相对或绝对，设置x和y坐标
    if (position === 'relative' || position === 'absolute') {
        div.style.left = x + 'px';
    div.style.top = y + 'px';
                }
            } else {
        console.error('No div found with the given id:', id);
            }
        }


    function isHorizontalLayout() {
            if (window.innerWidth > window.innerHeight)
    return true;
    else {
                var userAgent = navigator.userAgent || navigator.vendor || window.opera;

    // Windows Phone must come first because its UA also contains "Android"
    if (/windows phone/i.test(userAgent)) {
                    return false;
                }
    if (/android/i.test(userAgent)) {
                    return false;
                }

    // iOS detection
    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
                    return false;
                }

    if (/iOS/i.test(navigator.platform)) {
                    return false; //iOS操作系统平台
                }

    if (/Win|Mac|Linux/.test(navigator.platform)) {
                    return true;    // 桌面平台，即使宽度较小，也作为横板布局
                }

    return false;
            }
        }

    const horizontalLayout = isHorizontalLayout();

    function UpdateTimes() {
        piggy.times=-1;
            if (isNaN(piggy.times))
    document.getElementById('times').innerHTML = `可使用次数：0`;
    else if (piggy.times == -1) {
        document.getElementById('times').innerHTML = `无使用次数限制`;
    document.getElementById('addTimes').disabled = true;
    return;
            }
    else
    document.getElementById('times').innerHTML = `可使用次数：${piggy.times}`;
    document.getElementById('addTimes').disabled = false;
        }

    window.onload = function () {
        UpdateTimes();
        let blockSize = 50;
        let spacing = 3;
        let width = getSize(9, blockSize, spacing);
        if (horizontalLayout) {
            let resize = Math.floor((window.innerHeight - width - 345) / 9);
            if (resize > 0) {
                blockSize += resize;
                width = getSize(9, blockSize, spacing);
            }
        }
        else {
            let resize = Math.floor((window.innerWidth - width) / 9 - 1);
            blockSize += resize;
            width = getSize(9, blockSize, spacing);
        }
        // 初始化3个canvas
        window.outCanvas = new board('canvasOutput', width, width, blockSize, spacing);
        window.roundcanvas = new roundShape('canvasRound', width, 140);
        window.selectcanvas = new shapeSelector('canvasSelector', width);
        outCanvas.draw();
        if (horizontalLayout) {
            selectcanvas.show = true;
            selectcanvas.setPosition(width + 20, 0, 50);
        }
        else {
            selectcanvas.show = false;
            selectcanvas.setPosition(0, 0, 50);
        }
        selectcanvas.draw();
        selectcanvas.addSelectedShapeChangedEventListener(function (e) {
            selectedShape = [];
            for (var i = 0; i < e.detail.length; i++) {
                selectedShape.push(e.detail[i].shape);
            }
            // 更新computer的
            roundcanvas.draw(selectedShape);
            selectButton.disabled = selectedShape.length !== 3;
        });

        StartGame();
    };

    // 初始化按钮
    let stepButton = document.getElementById('step');
    stepButton.addEventListener('click', onStepButtonPress);
    let resetButton = document.getElementById('reset');
    resetButton.addEventListener('click', onResetButtonPress);
    function onResetButtonPress() {
        download(JSON.stringify(shapeList), `mtdl_fkds_${round}.json`);
        }
    let editButton = document.getElementById('edit');
    editButton.addEventListener('click', onEditButtonPress);



    //outCanvas.drawBoard(testboard);
    //outCanvas.drawShape(4, 5, shapes[5]);

    let selectButton = document.getElementById('InputButton');
    selectButton.onclick = onSelectButtonPress;

        //var round = 0;
        //var total = 0;
        //var shapeList = new Array();
        //var solv = new slover();
        //var bestSolution = {step: [], strik: 0, score: 0, statusScore: 0 };
    //var curStep = 0;
    var selectedShape = [];

    //var you = new slover();
    var putShapeCount = 0;
    const c_BoardStatus = {SELECT_SHAPE: 0, EDIT: 1, MOVE: 2, CAL: 3, START: 4, DISABLE: 5 };
function StartGame() {
    window.round = 0;
    window.total = 0;
    window.shapeList = new Array();
    window.solv = new slover();
    window.bestSolution = { step: [], strik: 0, score: 0, statusScore: 0 };
    window.curStep = 0;
    window.boardStatus = c_BoardStatus.START;
    onEditButtonPress();
}

    function StartSelect() {
        selectedShape = [];
    boardStatus = c_BoardStatus.SELECT_SHAPE;
    selectcanvas.enable = true;
    if (!horizontalLayout)
    selectcanvas.show = true;

    ShowStatus("请选择本轮所用3个图案, 完成后点‘选好了’按钮");
    updateButtonStatus();
        }

    function FinishSelect() {
            if (!horizontalLayout)
    selectcanvas.show = false;
    selectcanvas.enable = false;
    selectcanvas.clearSelect();

    selectButton.disabled = true;
        }

    function onSelectButtonPress() {
            if (boardStatus === c_BoardStatus.SELECT_SHAPE) {
                if (selectedShape.length == 3) {
        FinishSelect();

                    // 计算本轮基础得分
                    //shapeList.push({'round': round, 'shapes': selectedShape.slice() });
                    //var score = 0;
                    //for (const shape of selectedShape) {
        //    for (const s of shape.s) {
        //        score += s;
        //    }
        //}

        roundcanvas.draw([]);
                    //total += score;
                    //console.log(`round ${round}: ${score}, total ${total}`);
    round++;
    ShowStatus("计算中，请等待...");

    // 新一轮放置，只需要保留strik和score
    bestSolution.step = [];
    bestSolution.statusScore = 1000000;
                    requestIdleCallback(() => {
                        if (putShapes(solv, selectedShape, bestSolution)) {
        curStep = 0;
    ShowStatus("请跟随放置，然后点击下一步按钮");
    onStepButtonPress();
                        }
                    });
                }
            }
    else if (boardStatus === c_BoardStatus.START) {
                if (piggy.use()) {
        UpdateTimes();
    StartSelect();
    Object.assign(solv.board, outCanvas.board);
                }
    else {
        boardStatus = c_BoardStatus.DISABLE;
    ShowStatus("抱歉，可用次数用完");
    updateButtonStatus();
                }
            }
    else if (boardStatus === c_BoardStatus.EDIT) {
        StartSelect();
    Object.assign(solv.board, outCanvas.board);
            }
        }

    var streak = 0;
    var score = 0;
var haveShowDonate = false;

    function onStepButtonPress() {
            if (curStep < bestSolution.step.length) {
                var step = bestSolution.step[curStep];
    outCanvas.drawBoard(solv.board);
    outCanvas.drawShape(step.x, step.y, step.shape);
    solv.putAt(step.x, step.y, step.shape);
    let count = solv.checkAndEliminate();
    score += GetScore(step.shape, count, streak);
    document.getElementById('score').innerHTML = "score: " + score.toString();
        if (score >= 16000 && !haveShowDonate) {
            haveShowDonate = true;
    window.open("../support/donate.html", "捐赠", "width=640,height=800");
        }

                if (count > 0)
    streak++;
    else
    streak = 0;
    curStep++;
    if (curStep === bestSolution.step.length) {
                    if (horizontalLayout) {
                        if (count > 0) {
        // 如果三个放完，有可销的，那么等用户点下一步再消除，以便用户看清楚放置块
        stepButton.disabled = false;
                        }
    else {
        // 保留现有的显示即可，请用户选择下一轮
        stepButton.disabled = true;
    selectcanvas.enable = true;
    if (curStep < 2)
    ShowStatus("无法全部放上, 游戏结束。请点‘重新开始’按钮");
    else
    StartSelect();
                        }
                    }
    else
    // 竖版需要等用户点下一步，以便用户看清楚放置块
    stepButton.disabled = false;
                }
    else {
        stepButton.disabled = false;
                }
            }
    else if (curStep === bestSolution.step.length) {
        stepButton.disabled = true;
    selectcanvas.enable = true;
    outCanvas.drawBoard(solv.board);
    if (curStep < 2)
    ShowStatus("无法全部放上, 游戏结束。请点‘重新开始’按钮");
    else
    StartSelect();
            }
        }

    function download(text, filename) {
            var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();
    document.body.removeChild(element);
        }

    function ShowStatus(string) {
        document.getElementById('status').innerHTML = string;
        }

    //ShowStatus("请选择本轮所用3个图案");
    //   selectButton.disabled = true;

    function updateButtonStatus() {
            switch (boardStatus) {
                case c_BoardStatus.SELECT_SHAPE:
    case c_BoardStatus.EDIT:
    case c_BoardStatus.START:
    stepButton.disabled = true;
    resetButton.disabled = true;
    editButton.disabled = true;
    selectButton.disabled = false;
    return;
    case c_BoardStatus.CAL:
    case c_BoardStatus.DISABLE:
    stepButton.disabled = true;
    resetButton.disabled = true;
    editButton.disabled = true;
    selectButton.disabled = true;
    return;
    case c_BoardStatus.MOVE:
    stepButton.disabled = false;
    resetButton.disabled = false;
    editButton.disabled = false;
    selectButton.disabled = false;
            }
        }

    function onEditButtonPress() {
        ShowStatus("请使用鼠标设置盘面, 完成后点‘选好了’按钮");
    selectcanvas.enable = false;
    outCanvas.enableEdit(true);
    haveShowDonate = false;
    if (boardStatus !== c_BoardStatus.START)
    boardStatus = c_BoardStatus.EDIT;
    updateButtonStatus();
        }
//let counter = document.querySelector('#counter');

//const isMobile = /(iPhone|iPad|iPod|iOS|Android|Linux armv8l|Linux armv7l|Linux aarch64)/i.test(navigator.platform);
//let windowRadio = window.innerWidth / window.innerHeight;
//if (isMobile)
//    document.body.style.zoom = 2;
//else
//    document.body.style.zoom = 1;

