// ==UserScript==
// @name         Facebook Messenger Auto Delete Conversations (Debug Version)
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Tự động xóa tất cả cuộc trò chuyện Facebook Messenger với debug chi tiết
// @author       You
// @match        https://www.messenger.com/*
// @match        https://www.facebook.com/messages/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    let isDeleting = false;
    let deletedCount = 0;
    let attemptCount = 0;
    let failedCount = 0;
    let deleteDelay = 3; // Delay giữa các lần xóa (giây)
    let conversationLoadDelay = 2; // Thời gian đợi cuộc trò chuyện load (giây)
    let menuClickDelay = 2; // Thời gian đợi menu hiện ra (giây)
    let confirmClickDelay = 2; // Thời gian đợi dialog xác nhận (giây)
    let afterDeleteDelay = 2; // Thời gian đợi sau khi xóa xong (giây)
    let debugMode = true;

    function debugLog(message, data = null) {
        if (debugMode) {
            console.log(`[Messenger Auto Delete] ${message}`, data || '');
        }
    }

    // Tạo giao diện người dùng với debug info
    function createUI() {
        const ui = document.createElement('div');
        ui.id = 'messenger-auto-delete-ui';
        ui.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            width: 350px;
            background: #1877f2;
            color: white;
            padding: 15px;
            border-radius: 10px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            z-index: 10000;
            font-family: Arial, sans-serif;
            font-size: 14px;
            max-height: 80vh;
            overflow-y: auto;
        `;

        ui.innerHTML = `
            <div style="margin-bottom: 15px; font-weight: bold; text-align: center; font-size: 16px;">
                🗑️ Auto Delete Messenger (Debug)
            </div>

            <!-- Nút điều khiển nổi bật -->
            <div style="margin-bottom: 15px; text-align: center;">
                <button id="start-delete-btn" style="
                    background: linear-gradient(45deg, #42b883, #369870);
                    color: white;
                    border: none;
                    padding: 12px 20px;
                    border-radius: 8px;
                    cursor: pointer;
                    margin-right: 10px;
                    font-weight: bold;
                    font-size: 14px;
                    box-shadow: 0 4px 8px rgba(66, 184, 131, 0.3);
                    transition: all 0.3s ease;
                ">🚀 BẮT ĐẦU</button>

                <button id="stop-delete-btn" style="
                    background: linear-gradient(45deg, #e74c3c, #c0392b);
                    color: white;
                    border: none;
                    padding: 12px 20px;
                    border-radius: 8px;
                    cursor: pointer;
                    font-weight: bold;
                    font-size: 14px;
                    box-shadow: 0 4px 8px rgba(231, 76, 60, 0.3);
                    transition: all 0.3s ease;
                    opacity: 0.5;
                " disabled>⏹️ DỪNG</button>
            </div>

            <!-- Thống kê nổi bật -->
            <div style="background: rgba(255,255,255,0.1); padding: 10px; border-radius: 8px; margin-bottom: 15px;">
                <div style="display: flex; justify-content: space-between; font-size: 13px; font-weight: bold;">
                    <div>✅ Đã xóa: <span id="deleted-count" style="color: #42b883;">0</span></div>
                    <div>🔄 Thử: <span id="attempt-count" style="color: #3498db;">0</span></div>
                    <div>❌ Thất bại: <span id="failed-count" style="color: #e74c3c;">0</span></div>
                </div>
                <div style="margin-top: 8px; font-size: 12px; text-align: center; font-weight: bold;">
                    <div id="status" style="color: #f1c40f;">Sẵn sàng</div>
                </div>
            </div>

            <!-- Cài đặt thời gian -->
            <div style="background: rgba(0,0,0,0.2); padding: 12px; border-radius: 8px; margin-bottom: 10px;">
                <div style="font-weight: bold; margin-bottom: 10px; text-align: center; font-size: 14px; color: #fff;">⚙️ CÀI ĐẶT THỜI GIAN</div>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 12px;">
                    <div>
                        <label style="color: #fff; font-weight: bold;">Delay xóa (giây):</label><br>
                        <input type="number" id="delete-delay" value="${deleteDelay}" min="1" max="10"
                               style="width: 100%; padding: 6px; border: none; border-radius: 4px; color: black; font-size: 12px; font-weight: bold;">
                    </div>

                    <div>
                        <label style="color: #fff; font-weight: bold;">Đợi load (giây):</label><br>
                        <input type="number" id="conversation-load-delay" value="${conversationLoadDelay}" min="1" max="5"
                               style="width: 100%; padding: 6px; border: none; border-radius: 4px; color: black; font-size: 12px; font-weight: bold;">
                    </div>

                    <div>
                        <label style="color: #fff; font-weight: bold;">Đợi menu (giây):</label><br>
                        <input type="number" id="menu-click-delay" value="${menuClickDelay}" min="1" max="5"
                               style="width: 100%; padding: 6px; border: none; border-radius: 4px; color: black; font-size: 12px; font-weight: bold;">
                    </div>

                    <div>
                        <label style="color: #fff; font-weight: bold;">Đợi xác nhận (giây):</label><br>
                        <input type="number" id="confirm-click-delay" value="${confirmClickDelay}" min="1" max="5"
                               style="width: 100%; padding: 6px; border: none; border-radius: 4px; color: black; font-size: 12px; font-weight: bold;">
                    </div>
                </div>

                <div style="margin-top: 10px;">
                    <label style="font-size: 12px; color: #fff; font-weight: bold;">Đợi sau khi xóa (giây):</label><br>
                    <input type="number" id="after-delete-delay" value="${afterDeleteDelay}" min="1" max="5"
                           style="width: 100%; padding: 6px; border: none; border-radius: 4px; color: black; font-size: 12px; font-weight: bold;">
                </div>
            </div>

            <!-- Debug Log -->
            <div style="font-size: 10px; background: rgba(0,0,0,0.3); padding: 8px; border-radius: 5px; max-height: 120px; overflow-y: auto;">
                <div style="font-weight: bold; margin-bottom: 5px;">🔍 Debug Log:</div>
                <div id="debug-log"></div>
            </div>
        `;

        document.body.appendChild(ui);
        return ui;
    }

    function addDebugLog(message) {
        const debugLog = document.getElementById('debug-log');
        if (debugLog) {
            const time = new Date().toLocaleTimeString();
            debugLog.innerHTML += `<div>[${time}] ${message}</div>`;
            debugLog.scrollTop = debugLog.scrollHeight;
        }
    }

    // Cập nhật thống kê
    function updateStats() {
        document.getElementById('deleted-count').textContent = deletedCount;
        document.getElementById('attempt-count').textContent = attemptCount;
        document.getElementById('failed-count').textContent = failedCount;
    }

    // Cập nhật trạng thái
    function updateStatus(message) {
        document.getElementById('status').textContent = message;
        addDebugLog(message);
    }

    // Tìm cuộc trò chuyện với debug chi tiết
    function findAndClickFirstConversation() {
        debugLog('=== Bắt đầu tìm cuộc trò chuyện ===');
        
        // Tìm tất cả các element có thể là cuộc trò chuyện
        const allElements = document.querySelectorAll('div, a, span');
        debugLog(`Tổng số elements: ${allElements.length}`);
        
        // Tìm elements có text chứa tên người dùng
        const conversationCandidates = [];
        
        for (let element of allElements) {
            const text = element.textContent?.trim();
            if (text && text.length > 2 && text.length < 100 && 
                !text.includes('Messenger') && 
                !text.includes('Search') &&
                !text.includes('Tìm kiếm') &&
                element.offsetParent !== null) {
                
                // Kiểm tra xem có phải là tên người dùng không
                if (/^[A-Za-zÀ-ỹ\s]{2,50}$/.test(text) || 
                    text.includes('Người dùng Facebook')) {
                    conversationCandidates.push({
                        element: element,
                        text: text,
                        clickable: element.closest('div[role="row"]') || element.closest('a') || element.closest('div[tabindex]')
                    });
                }
            }
        }
        
        debugLog(`Tìm thấy ${conversationCandidates.length} ứng viên cuộc trò chuyện`);
        
        // Thử click vào ứng viên đầu tiên
        for (let candidate of conversationCandidates.slice(0, 5)) {
            debugLog(`Thử click: "${candidate.text}"`);
            
            const clickTarget = candidate.clickable || candidate.element;
            if (clickTarget) {
                try {
                    clickTarget.click();
                    debugLog(`Đã click vào: "${candidate.text}"`);
                    return true;
                } catch (e) {
                    debugLog(`Lỗi khi click: ${e.message}`);
                }
            }
        }
        
        debugLog('Không tìm thấy cuộc trò chuyện nào có thể click');
        return false;
    }

    // Tìm và click nút 3 chấm, sau đó xóa
    function findAndClickDeleteButton() {
        return new Promise((resolve) => {
            debugLog('=== Bắt đầu tìm nút 3 chấm ===');

            setTimeout(() => {
                // Tìm nút 3 chấm ở HEADER của cuộc trò chuyện (không phải trong danh sách)
                let menuButton = null;

                // Tìm header/toolbar của cuộc trò chuyện hiện tại
                const chatHeaders = document.querySelectorAll('[role="banner"], [data-testid*="header"], .x1n2onr6');
                debugLog(`Tìm thấy ${chatHeaders.length} chat headers`);

                for (let header of chatHeaders) {
                    // Tìm nút 3 chấm trong header này
                    const buttonsInHeader = header.querySelectorAll('div[role="button"], button');
                    debugLog(`Header có ${buttonsInHeader.length} buttons`);

                    for (let btn of buttonsInHeader) {
                        const ariaLabel = btn.getAttribute('aria-label') || '';
                        const svg = btn.querySelector('svg');

                        debugLog(`Header button: aria-label="${ariaLabel}"`);

                        // Kiểm tra có phải nút 3 chấm không
                        if (ariaLabel.toLowerCase().includes('more') ||
                            ariaLabel.toLowerCase().includes('conversation actions') ||
                            ariaLabel.toLowerCase().includes('hành động cuộc trò chuyện') ||
                            (svg && svg.innerHTML.includes('M12'))) {
                            debugLog(`✅ Tìm thấy nút 3 chấm trong header: "${ariaLabel}"`);
                            menuButton = btn;
                            break;
                        }
                    }
                    if (menuButton) break;
                }

                // Nếu không tìm thấy trong header, thử tìm tổng quát
                if (!menuButton) {
                    debugLog('Không tìm thấy trong header, tìm tổng quát...');
                    const allButtons = document.querySelectorAll('div[role="button"], button');
                    debugLog(`Tìm thấy ${allButtons.length} buttons tổng cộng`);

                    for (let btn of allButtons) {
                        const ariaLabel = btn.getAttribute('aria-label') || '';
                        const text = btn.textContent?.trim() || '';

                        if ((ariaLabel.toLowerCase().includes('more') ||
                             ariaLabel.toLowerCase().includes('conversation actions') ||
                             ariaLabel.toLowerCase().includes('hành động') ||
                             text === '⋯' || text === '•••') &&
                            btn.offsetParent !== null) {
                            debugLog(`Tìm thấy nút menu: "${ariaLabel}"`);
                            menuButton = btn;
                            break;
                        }
                    }
                }

                if (!menuButton) {
                    debugLog('❌ Không tìm thấy nút 3 chấm');
                    resolve(false);
                    return;
                }

                debugLog('✅ Click vào nút 3 chấm...');
                menuButton.click();

                setTimeout(() => {
                    // Tìm menu "Xóa đoạn chat"
                    const allMenuItems = document.querySelectorAll('*');
                    debugLog(`Đang tìm trong ${allMenuItems.length} elements cho menu xóa`);

                    let deleteButton = null;

                    for (let item of allMenuItems) {
                        const text = item.textContent?.trim() || '';

                        if (text === 'Xóa đoạn chat' || text === 'Delete chat' ||
                            text === 'Xóa cuộc trò chuyện' || text === 'Delete conversation') {
                            debugLog(`✅ Tìm thấy menu xóa: "${text}"`);
                            deleteButton = item;
                            break;
                        }
                    }

                    if (deleteButton) {
                        debugLog('✅ Click vào "Xóa đoạn chat"...');
                        deleteButton.click();

                        setTimeout(() => {
                            // Tìm nút xác nhận "Xóa đoạn chat" trong dialog
                            debugLog('=== Tìm nút xác nhận trong dialog ===');

                            // Tìm dialog xác nhận
                            const dialogs = document.querySelectorAll('[role="dialog"], .x1n2onr6, div[style*="position: fixed"]');
                            debugLog(`Tìm thấy ${dialogs.length} dialogs`);

                            let confirmButton = null;

                            for (let dialog of dialogs) {
                                if (dialog.offsetParent !== null) {
                                    debugLog('Đang kiểm tra dialog...');

                                    // Tìm tất cả buttons trong dialog
                                    const buttonsInDialog = dialog.querySelectorAll('div[role="button"], button');
                                    debugLog(`Dialog có ${buttonsInDialog.length} buttons`);

                                    for (let btn of buttonsInDialog) {
                                        const text = btn.textContent?.trim() || '';
                                        const ariaLabel = btn.getAttribute('aria-label') || '';

                                        debugLog(`Dialog button: text="${text}", aria-label="${ariaLabel}"`);

                                        // Tìm nút "Xóa đoạn chat" màu xanh (nút xác nhận)
                                        if (text === 'Xóa đoạn chat' || text === 'Delete chat') {
                                            // Kiểm tra xem có phải nút chính (thường có background màu xanh)
                                            const style = window.getComputedStyle(btn);
                                            const bgColor = style.backgroundColor;

                                            debugLog(`Nút "${text}" có background: ${bgColor}`);

                                            // Nút xác nhận thường có màu xanh hoặc là nút cuối cùng
                                            if (bgColor.includes('rgb(24, 119, 242)') || // Facebook blue
                                                bgColor.includes('blue') ||
                                                btn.classList.contains('x1i10hfl') || // Facebook button class
                                                !confirmButton) { // Fallback: lấy nút đầu tiên tìm thấy
                                                confirmButton = btn;
                                                debugLog(`✅ Tìm thấy nút xác nhận: "${text}"`);
                                                break;
                                            }
                                        }
                                    }
                                    if (confirmButton) break;
                                }
                            }

                            // Nếu không tìm thấy trong dialog, tìm tổng quát
                            if (!confirmButton) {
                                debugLog('Không tìm thấy trong dialog, tìm tổng quát...');
                                const allButtons = document.querySelectorAll('div[role="button"], button');

                                for (let btn of allButtons) {
                                    const text = btn.textContent?.trim() || '';

                                    if ((text === 'Xóa đoạn chat' || text === 'Delete chat') &&
                                        btn.offsetParent !== null) {
                                        confirmButton = btn;
                                        debugLog(`✅ Tìm thấy nút xác nhận (tổng quát): "${text}"`);
                                        break;
                                    }
                                }
                            }

                            if (confirmButton) {
                                debugLog('✅ Click nút xác nhận xóa...');
                                confirmButton.click();
                                resolve(true);
                            } else {
                                debugLog('❌ Không tìm thấy nút xác nhận');
                                resolve(false);
                            }
                        }, 2000);
                    } else {
                        debugLog('❌ Không tìm thấy menu "Xóa đoạn chat"');
                        resolve(false);
                    }
                }, confirmClickDelay * 1000);
            }, menuClickDelay * 1000);
        });
    }

    // Hàm chính để xóa cuộc trò chuyện
    async function deleteConversation() {
        if (!isDeleting) return;

        attemptCount++;
        updateStats();
        updateStatus(`Lần thử ${attemptCount}: Đang tìm cuộc trò chuyện...`);

        const foundConversation = findAndClickFirstConversation();

        if (!foundConversation) {
            updateStatus('Không tìm thấy cuộc trò chuyện');
            failedCount++;
            updateStats();

            if (isDeleting) {
                setTimeout(() => {
                    deleteConversation();
                }, deleteDelay * 1000);
            }
            return;
        }

        updateStatus('Đã click cuộc trò chuyện, đang đợi load...');

        // Đợi cuộc trò chuyện load xong trước khi tìm nút 3 chấm
        setTimeout(async () => {
            updateStatus('Đang tìm nút 3 chấm trong header...');
            const deleted = await findAndClickDeleteButton();

            if (deleted) {
                deletedCount++;
                updateStatus(`✅ Xóa thành công! Đang đợi ${afterDeleteDelay}s trước khi xóa tiếp...`);

                // Đợi sau khi xóa thành công trước khi chuyển sang cuộc trò chuyện tiếp theo
                if (isDeleting) {
                    setTimeout(() => {
                        updateStatus('Đang tìm cuộc trò chuyện tiếp theo...');
                        deleteConversation();
                    }, afterDeleteDelay * 1000);
                }
            } else {
                failedCount++;
                updateStatus('❌ Xóa thất bại! Thử lại...');

                // Nếu thất bại, thử lại với delay bình thường
                if (isDeleting) {
                    setTimeout(() => {
                        deleteConversation();
                    }, deleteDelay * 1000);
                }
            }

            updateStats();
        }, conversationLoadDelay * 1000); // Đợi cuộc trò chuyện load
    }

    // Khởi tạo
    function init() {
        if (!window.location.href.includes('messenger.com') && 
            !window.location.href.includes('facebook.com/messages')) {
            return;
        }

        setTimeout(() => {
            createUI();
            
            document.getElementById('start-delete-btn').addEventListener('click', () => {
                if (confirm('Bạn có chắc chắn muốn xóa tất cả cuộc trò chuyện? Hành động này không thể hoàn tác!')) {
                    isDeleting = true;
                    deleteDelay = parseInt(document.getElementById('delete-delay').value) || 3;
                    conversationLoadDelay = parseInt(document.getElementById('conversation-load-delay').value) || 2;
                    menuClickDelay = parseInt(document.getElementById('menu-click-delay').value) || 2;
                    confirmClickDelay = parseInt(document.getElementById('confirm-click-delay').value) || 2;
                    afterDeleteDelay = parseInt(document.getElementById('after-delete-delay').value) || 2;

                    // Cập nhật giao diện nút
                    const startBtn = document.getElementById('start-delete-btn');
                    const stopBtn = document.getElementById('stop-delete-btn');

                    startBtn.disabled = true;
                    startBtn.style.opacity = '0.5';
                    stopBtn.disabled = false;
                    stopBtn.style.opacity = '1';

                    updateStatus('Bắt đầu xóa...');
                    deleteConversation();
                }
            });

            document.getElementById('stop-delete-btn').addEventListener('click', () => {
                isDeleting = false;

                // Cập nhật giao diện nút
                const startBtn = document.getElementById('start-delete-btn');
                const stopBtn = document.getElementById('stop-delete-btn');

                startBtn.disabled = false;
                startBtn.style.opacity = '1';
                stopBtn.disabled = true;
                stopBtn.style.opacity = '0.5';

                updateStatus('Đã dừng');
            });

            // Event listeners cho các input thời gian
            document.getElementById('delete-delay').addEventListener('change', (e) => {
                deleteDelay = parseInt(e.target.value) || 3;
            });

            document.getElementById('conversation-load-delay').addEventListener('change', (e) => {
                conversationLoadDelay = parseInt(e.target.value) || 2;
            });

            document.getElementById('menu-click-delay').addEventListener('change', (e) => {
                menuClickDelay = parseInt(e.target.value) || 2;
            });

            document.getElementById('confirm-click-delay').addEventListener('change', (e) => {
                confirmClickDelay = parseInt(e.target.value) || 2;
            });

            document.getElementById('after-delete-delay').addEventListener('change', (e) => {
                afterDeleteDelay = parseInt(e.target.value) || 2;
            });

            updateStatus('Sẵn sàng - Mở Console (F12) để xem debug chi tiết');
        }, 3000);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
