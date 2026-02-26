/* ========================================
   DayNight Admin - JavaScript (ادغام شده با منطق X-UI)
   ======================================== */

// ===== Theme Toggle =====
function initTheme() {
    const savedTheme = localStorage.getItem('daynight-theme');
    if (savedTheme === 'carbon') {
        document.documentElement.classList.add('carbon');
        document.body.classList.add('carbon');
        updateThemeButtons('carbon');
    } else {
        updateThemeButtons('snow');
    }
}

function setTheme(theme) {
    if (theme === 'carbon') {
        document.documentElement.classList.add('carbon');
        document.body.classList.add('carbon');
        localStorage.setItem('daynight-theme', 'carbon');
    } else {
        document.documentElement.classList.remove('carbon');
        document.body.classList.remove('carbon');
        localStorage.setItem('daynight-theme', 'snow');
    }
    updateThemeButtons(theme);
}

function updateThemeButtons(theme) {
    const snowBtns = document.querySelectorAll('.theme-btn-snow');
    const carbonBtns = document.querySelectorAll('.theme-btn-carbon');
    
    snowBtns.forEach(btn => {
        btn.classList.toggle('active', theme === 'snow');
    });
    carbonBtns.forEach(btn => {
        btn.classList.toggle('active', theme === 'carbon');
    });
}

// ===== Time-based Greeting =====
function getGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
}

function setGreeting() {
    const greetingEl = document.getElementById('greeting');
    if (greetingEl) {
        // نام کاربر از متغیر global user_name که در قالب تعریف شده استفاده می‌کند
        greetingEl.textContent = getGreeting() + ', ' + (window.user_name || 'User');
    }
}

// ===== Mobile Menu =====
function toggleMobileMenu() {
    const menu = document.querySelector('.mobile-menu');
    const overlay = document.querySelector('.mobile-menu-overlay');
    
    if (menu && overlay) {
        menu.classList.toggle('active');
        overlay.classList.toggle('active');
        document.body.style.overflow = menu.classList.contains('active') ? 'hidden' : '';
    }
}

function closeMobileMenu() {
    const menu = document.querySelector('.mobile-menu');
    const overlay = document.querySelector('.mobile-menu-overlay');
    
    if (menu && overlay) {
        menu.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// ===== توابع نوتیفیکیشن (از main.js قبلی) =====
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast align-items-center text-white bg-${type === 'success' ? 'success' : type === 'error' ? 'danger' : 'info'} border-0 position-fixed bottom-0 end-0 m-3`;
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'assertive');
    toast.setAttribute('aria-atomic', 'true');
    toast.style.zIndex = '9999';
    
    toast.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">
                ${message}
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
        </div>
    `;
    
    document.body.appendChild(toast);
    const bsToast = new bootstrap.Toast(toast);
    bsToast.show();
    
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// ===== توابع مربوط به کلاینت‌ها (از clients.html قبلی) =====
function searchClients() {
    const search = document.getElementById('searchInput').value;
    const sortBy = document.getElementById('sortSelect').value;
    const sortOrder = document.getElementById('orderSelect').value;
    window.location.href = `/clients?search=${encodeURIComponent(search)}&sort_by=${sortBy}&sort_order=${sortOrder}`;
}

function sortClients() {
    const search = document.getElementById('searchInput').value;
    const sortBy = document.getElementById('sortSelect').value;
    const sortOrder = document.getElementById('orderSelect').value;
    window.location.href = `/clients?search=${encodeURIComponent(search)}&sort_by=${sortBy}&sort_order=${sortOrder}`;
}

function toggleClient(btn) {
    const uuid = btn.dataset.uuid;
    fetch(`/client/${uuid}/toggle`, { method: 'POST' })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showToast('Client status changed!', 'success');
                setTimeout(() => location.reload(), 1000);
            } else {
                showToast('Error changing status!', 'error');
            }
        })
        .catch(() => showToast('Server connection error', 'error'));
}

function resetTraffic(btn) {
    const uuid = btn.dataset.uuid;
    if (confirm('Are you sure you want to reset traffic for this client?')) {
        fetch(`/client/${uuid}/reset`, { method: 'POST' })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    showToast('Client traffic reset!', 'success');
                    setTimeout(() => location.reload(), 1000);
                } else {
                    showToast('Error resetting traffic!', 'error');
                }
            })
            .catch(() => showToast('Server connection error', 'error'));
    }
}

function deleteClient(btn) {
    const uuid = btn.dataset.uuid;
    if (confirm('⚠️ Are you sure you want to delete this client? This action cannot be undone!')) {
        fetch(`/client/${uuid}/delete`, { method: 'POST' })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    showToast('Client deleted!', 'success');
                    setTimeout(() => location.reload(), 1000);
                } else {
                    showToast('Error deleting client!', 'error');
                }
            })
            .catch(() => showToast('Server connection error', 'error'));
    }
}

function showSublink(btn) {
    const uuid = btn.dataset.uuid;
    fetch(`/client/${uuid}/sublink`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                document.getElementById('sublinkInput').value = data.sublink;
                document.getElementById('downloadLink').href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(data.sublink);
                document.getElementById('qrcodeContainer').innerHTML = `<img src="/client/${uuid}/qrcode" alt="QR Code" class="img-fluid" style="max-width: 200px;">`;
                new bootstrap.Modal(document.getElementById('sublinkModal')).show();
            } else {
                showToast('Error getting link!', 'error');
            }
        });
}

function showQRCode(btn) {
    const uuid = btn.dataset.uuid;
    window.open(`/client/${uuid}/qrcode`, '_blank');
}

function copySublink() {
    const sublinkInput = document.getElementById('sublinkInput');
    sublinkInput.select();
    sublinkInput.setSelectionRange(0, 99999);
    document.execCommand('copy');
    showToast('Link copied!', 'success');
}

function cleanupDuplicateClients() {
    if (!confirm('Are you sure? This will remove clients that do not exist on any server from the database.')) return;
    fetch('/api/clients/cleanup_duplicates', { method: 'POST' })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showToast(`✅ ${data.deleted_count} duplicate clients deleted.`, 'success');
                setTimeout(() => location.reload(), 1500);
            } else {
                showToast('❌ Error deleting duplicate clients', 'error');
            }
        })
        .catch(() => showToast('❌ Server connection error', 'error'));
}

function syncClients() {
    if (!confirm('⚠️ Are you sure? This will create missing clients on all servers and inbounds.')) return;
    fetch('/api/clients/sync_all', { method: 'POST' })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showToast(`✅ Sync completed. ${data.created_count} new clients created.`, 'success');
                setTimeout(() => location.reload(), 1500);
            } else {
                showToast('❌ Error syncing clients', 'error');
            }
        })
        .catch(() => showToast('❌ Server connection error', 'error'));
}

function editClient(btn) {
    const uuid = btn.dataset.uuid;
    fetch(`/client/${uuid}/info`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                document.getElementById('editUuid').value = uuid;
                document.getElementById('editEmail').value = data.email;
                document.getElementById('editTotalGB').value = data.total_gb.toFixed(2);
                document.getElementById('editDays').value = data.remaining_days;
                new bootstrap.Modal(document.getElementById('editClientModal')).show();
            } else {
                showToast('Error getting user info', 'error');
            }
        })
        .catch(() => showToast('Server connection error', 'error'));
}

function saveEdit() {
    const uuid = document.getElementById('editUuid').value;
    const totalGB = document.getElementById('editTotalGB').value;
    const days = document.getElementById('editDays').value;
    
    fetch(`/client/${uuid}/edit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ total_gb: totalGB, days: days })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showToast('Client info updated!', 'success');
            bootstrap.Modal.getInstance(document.getElementById('editClientModal')).hide();
            setTimeout(() => location.reload(), 1000);
        } else {
            showToast('Error updating!', 'error');
        }
    })
    .catch(() => showToast('Server connection error', 'error'));
}

function addClient() {
    const form = document.getElementById('addClientForm');
    const formData = new FormData(form);
    const data = {
        email: formData.get('email'),
        total_gb: formData.get('total_gb'),
        days: formData.get('days'),
    };
    
    fetch('/api/client/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
        if (result.success) {
            showToast('✅ Client created successfully', 'success');
            setTimeout(() => location.reload(), 1500);
        } else {
            showToast('❌ Error creating client: ' + (result.msg || 'Unknown error'), 'error');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showToast('❌ Server connection error', 'error');
    });
}

function showPanels(uuid) {
    showToast('Panel info not implemented yet', 'info');
}

// ===== توابع مربوط به سرورها (از servers.html قبلی) =====
function restartXray(panelId) {
    if (confirm('Are you sure you want to restart Xray on this server?')) {
        fetch(`/api/panel/${panelId}/restart`, { method: 'POST' })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    showToast('Xray restarted successfully', 'success');
                    setTimeout(() => location.reload(), 1000);
                } else {
                    showToast('Error restarting Xray', 'error');
                }
            })
            .catch(() => showToast('Server connection error', 'error'));
    }
}

function deleteServer(panelId) {
    if (confirm('⚠️ Are you sure you want to delete this server?')) {
        fetch(`/api/panels/${panelId}`, { method: 'DELETE' })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    showToast('Server deleted successfully', 'success');
                    setTimeout(() => location.reload(), 1000);
                } else {
                    showToast('Error deleting server', 'error');
                }
            })
            .catch(() => showToast('Server connection error', 'error'));
    }
}

function editServer(panelId) {
    fetch(`/api/panels/${panelId}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const panel = data.panel;
                document.getElementById('editId').value = panel.id;
                document.getElementById('editName').value = panel.name;
                document.getElementById('editHost').value = panel.host;
                document.getElementById('editPort').value = panel.port;
                document.getElementById('editBasePath').value = panel.base_path;
                document.getElementById('editUsername').value = panel.username;
                document.getElementById('editPassword').value = panel.password;
                document.getElementById('editSubUrl').value = panel.subscription_base_url;
                
                new bootstrap.Modal(document.getElementById('editServerModal')).show();
            } else {
                showToast('Error getting server info', 'error');
            }
        })
        .catch(() => showToast('Server connection error', 'error'));
}

function addServer() {
    const form = document.getElementById('addServerForm');
    const formData = new FormData(form);
    const data = {
        id: formData.get('id'),
        name: formData.get('name'),
        host: formData.get('host'),
        port: parseInt(formData.get('port')),
        base_path: formData.get('base_path'),
        username: formData.get('username'),
        password: formData.get('password'),
        subscription_base_url: formData.get('subscription_base_url'),
        enabled: true
    };
    
    fetch('/api/panels', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
        if (result.success) {
            showToast('✅ Server added successfully', 'success');
            setTimeout(() => location.reload(), 1500);
        } else {
            showToast('❌ Error adding server', 'error');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showToast('❌ Server connection error', 'error');
    });
}

function saveEditServer() {
    const form = document.getElementById('editServerForm');
    const formData = new FormData(form);
    const panelId = document.getElementById('editId').value;
    const data = {
        name: formData.get('name'),
        host: formData.get('host'),
        port: parseInt(formData.get('port')),
        base_path: formData.get('base_path'),
        username: formData.get('username'),
        password: formData.get('password'),
        subscription_base_url: formData.get('subscription_base_url'),
        enabled: true
    };
    
    fetch(`/api/panels/${panelId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
        if (result.success) {
            showToast('✅ Server updated successfully', 'success');
            setTimeout(() => location.reload(), 1500);
        } else {
            showToast('❌ Error updating server', 'error');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showToast('❌ Server connection error', 'error');
    });
}

// ===== توابع مربوط به قالب‌ها (از templates.html قبلی) =====
function refreshAllSubs() {
    fetch('/templates/refresh', { method: 'POST' })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showToast('All subscriptions refreshed', 'success');
            } else {
                showToast('Error refreshing', 'error');
            }
        })
        .catch(() => showToast('Server connection error', 'error'));
}

function editTemplate(id) {
    fetch(`/api/template/${id}`)
        .then(response => response.json())
        .then(data => {
            if (data.id) {
                document.getElementById('edit_template_id').value = data.id;
                document.getElementById('edit_server_select').value = data.server_id;
                document.getElementById('edit_name').value = data.name;
                document.getElementById('edit_priority').value = data.priority;
                document.getElementById('edit_template').value = data.template;
                document.getElementById('edit_remark_template').value = data.remark_template || '';
                
                loadInboundsForEdit(data.server_id, data.inbound_id);
                
                document.getElementById('editTemplateForm').action = `/templates/edit/${data.id}`;
                
                new bootstrap.Modal(document.getElementById('editTemplateModal')).show();
            } else {
                showToast('Error getting template info', 'error');
            }
        })
        .catch(() => showToast('Server connection error', 'error'));
}

function loadInbounds() {
    const serverSelect = document.getElementById('server_select');
    const inboundSelect = document.getElementById('inbound_select');
    const serverId = serverSelect.value;
    
    if (!serverId) {
        inboundSelect.innerHTML = '<option value="">Select server first</option>';
        inboundSelect.disabled = true;
        return;
    }
    
    inboundSelect.disabled = true;
    inboundSelect.innerHTML = '<option value="">Loading...</option>';
    
    fetch(`/api/panels/${serverId}/inbounds`)
        .then(response => response.json())
        .then(data => {
            inboundSelect.innerHTML = '';
            if (data.success && data.inbounds.length > 0) {
                data.inbounds.forEach(inbound => {
                    const option = document.createElement('option');
                    option.value = inbound.id;
                    option.textContent = `${inbound.remark} (${inbound.protocol})`;
                    inboundSelect.appendChild(option);
                });
                inboundSelect.disabled = false;
            } else {
                inboundSelect.innerHTML = '<option value="">No inbounds found</option>';
            }
        })
        .catch(error => {
            console.error('Error:', error);
            inboundSelect.innerHTML = '<option value="">Error loading</option>';
        });
}

function loadInboundsForEdit(serverId, selectedInboundId) {
    const inboundSelect = document.getElementById('edit_inbound_select');
    inboundSelect.disabled = true;
    inboundSelect.innerHTML = '<option value="">Loading...</option>';
    
    fetch(`/api/panels/${serverId}/inbounds`)
        .then(response => response.json())
        .then(data => {
            inboundSelect.innerHTML = '';
            if (data.success && data.inbounds.length > 0) {
                data.inbounds.forEach(inbound => {
                    const option = document.createElement('option');
                    option.value = inbound.id;
                    option.textContent = `${inbound.remark} (${inbound.protocol})`;
                    if (inbound.id == selectedInboundId) {
                        option.selected = true;
                    }
                    inboundSelect.appendChild(option);
                });
                inboundSelect.disabled = false;
            } else {
                inboundSelect.innerHTML = '<option value="">No inbounds found</option>';
            }
        })
        .catch(error => {
            console.error('Error:', error);
            inboundSelect.innerHTML = '<option value="">Error loading</option>';
        });
}

// ===== توابع مربوط به هدرها (از headers.html قبلی) =====
function editHeader(id, name, template, priority, enabled) {
    document.getElementById('edit_header_id').value = id;
    document.getElementById('edit_name').value = name;
    document.getElementById('edit_template').value = template;
    document.getElementById('edit_priority').value = priority;
    document.getElementById('edit_enabled').checked = enabled;
    
    document.getElementById('editHeaderForm').action = `/header/edit/${id}`;
    
    new bootstrap.Modal(document.getElementById('editHeaderModal')).show();
}

// ===== Initialize =====
document.addEventListener('DOMContentLoaded', function() {
    initTheme();
    setGreeting();
    
    // Close mobile menu on overlay click
    const overlay = document.querySelector('.mobile-menu-overlay');
    if (overlay) {
        overlay.addEventListener('click', closeMobileMenu);
    }
});