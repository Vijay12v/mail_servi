


// // UI State
// let emailCounter = 0;
// const emailStatuses = new Map();
// let bulkEmailCount = 0;

// // Inbox state
// let receivedEmails = [];
// let currentEmailDetail = null;
// let currentBulkJob = null;

// // WebSocket connection for real-time updates
// let ws;
// try {
//   ws = new WebSocket(`ws://${window.location.host}`);
  
//   ws.onmessage = (event) => {
//     const data = JSON.parse(event.data);
//     if (data.type === 'emailEvent') {
//       handleEmailEvent(data.data);
//     }
//   };

//   ws.onerror = (error) => {
//     console.log('WebSocket error:', error);
//   };

//   ws.onclose = () => {
//     console.log('WebSocket connection closed');
//   };
// } catch (error) {
//   console.error('Failed to establish WebSocket connection:', error);
// }

// function handleEmailEvent(event) {
//   if (event.success) {
//     // Update progress in bulk modal
//     if (currentBulkJob) {
//       currentBulkJob.processed++;
//       updateBulkProgress();
      
//       // Add to inbox
//       receiveEmail(event.email);
//     }
//   } else {
//     console.error('Email failed:', event.error);
//     if (currentBulkJob) {
//       currentBulkJob.failed++;
//       updateBulkProgress();
//     }
//   }
// }

// // Email functions
// function receiveEmail(email) {
//   const newEmail = {
//     id: `recv_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
//     from: email.to,
//     to: email.to,
//     subject: `Re: ${email.subject}`,
//     body: `Thank you for your email regarding "${email.subject}".\n\nThis is an automated response confirming we received your message.\n\nOriginal message:\n${email.body}`,
//     receivedAt: new Date(),
//     read: false
//   };

//   receivedEmails.unshift(newEmail);
//   updateInboxDisplay();
  
//   // Update inbox count
//   document.getElementById('inboxCount').textContent = receivedEmails.length;
// }

// function simulateIncomingEmail() {
//   const senders = ["support@example.com", "noreply@newsletter.com", "alert@system.com"];
//   const subjects = ["Important Update", "Your Monthly Newsletter", "Security Alert"];
//   const bodies = ["We have important news for you...", "Check out our latest offers...", "Unusual activity detected..."];

//   const sender = senders[Math.floor(Math.random() * senders.length)];
//   const subject = subjects[Math.floor(Math.random() * subjects.length)];
//   const body = bodies[Math.floor(Math.random() * bodies.length)];

//   const newEmail = {
//     id: `recv_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
//     from: sender,
//     to: "user@example.com",
//     subject: subject,
//     body: body,
//     receivedAt: new Date(),
//     read: false
//   };

//   receivedEmails.unshift(newEmail);
//   updateInboxDisplay();
  
//   // Update inbox count
//   document.getElementById('inboxCount').textContent = receivedEmails.length;
// }

// // UI Functions
// function updateInboxDisplay() {
//   const container = document.getElementById('inboxContainer');
//   container.innerHTML = '';

//   if (receivedEmails.length === 0) {
//     container.innerHTML = '<div class="empty-state"><i class="fas fa-inbox"></i><h3>Your inbox is empty</h3><p>Send yourself an email or simulate incoming messages</p></div>';
//     return;
//   }

//   receivedEmails.forEach(email => {
//     const emailElement = document.createElement('div');
//     emailElement.className = `inbox-item ${email.read ? '' : 'unread'}`;
//     emailElement.onclick = () => showEmailDetail(email);

//     // Format date
//     let timeDisplay;
//     const now = new Date();
//     const emailDate = new Date(email.receivedAt);

//     if (isToday(emailDate)) {
//       timeDisplay = emailDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//     } else if (isYesterday(emailDate)) {
//       timeDisplay = 'Yesterday';
//     } else {
//       timeDisplay = emailDate.toLocaleDateString([], { month: '2-digit', day: '2-digit' });
//     }

//     const preview = email.body.length > 50 ? email.body.substring(0, 50) + '...' : email.body;

//     emailElement.innerHTML = `
//       <div class="inbox-header">
//         <div class="inbox-sender">${email.from}</div>
//         <div class="inbox-time">${timeDisplay}</div>
//       </div>
//       <div class="inbox-subject">${email.subject}</div>
//       <div class="inbox-preview">${preview}</div>
//     `;

//     container.appendChild(emailElement);
//   });
// }

// function isToday(date) {
//   const today = new Date();
//   return date.getDate() === today.getDate() &&
//     date.getMonth() === today.getMonth() &&
//     date.getFullYear() === today.getFullYear();
// }

// function isYesterday(date) {
//   const yesterday = new Date();
//   yesterday.setDate(yesterday.getDate() - 1);
//   return date.getDate() === yesterday.getDate() &&
//     date.getMonth() === yesterday.getMonth() &&
//     date.getFullYear() === yesterday.getFullYear();
// }

// function showEmailDetail(email) {
//   email.read = true;
//   currentEmailDetail = email;
//   updateInboxDisplay();

//   document.getElementById('emailDetailSubject').textContent = email.subject;
//   document.getElementById('emailDetailFrom').textContent = email.from;
//   document.getElementById('emailDetailTo').textContent = email.to;
//   document.getElementById('emailDetailDate').textContent = email.receivedAt.toLocaleString();
//   document.getElementById('emailDetailBody').textContent = email.body;
//   document.getElementById('emailDetailModal').style.display = 'flex';
// }

// function closeDetailModal() {
//   document.getElementById('emailDetailModal').style.display = 'none';
//   currentEmailDetail = null;
// }

// function replyToEmail() {
//   if (!currentEmailDetail) return;

//   document.getElementById('emailTo').value = currentEmailDetail.from;
//   document.getElementById('emailSubject').value = `Re: ${currentEmailDetail.subject}`;
//   document.getElementById('emailBody').value = `\n\n---------- Original Message ----------\nFrom: ${currentEmailDetail.from}\nSent: ${currentEmailDetail.receivedAt.toLocaleString()}\nSubject: ${currentEmailDetail.subject}\n\n${currentEmailDetail.body}`;
//   closeDetailModal();
//   document.getElementById('emailTo').scrollIntoView({ behavior: 'smooth' });
//   showNotification('Reply form pre-filled', 'success');
// }

// function refreshInbox() {
//   updateInboxDisplay();
//   showNotification('Inbox refreshed', 'success');
// }

// // Email sending functions
// window.sendSingleEmail = async function () {
//   const to = document.getElementById('emailTo').value;
//   const subject = document.getElementById('emailSubject').value;
//   const body = document.getElementById('emailBody').value;

//   if (!to || !subject) {
//     showNotification('Please fill in To and Subject fields', 'error');
//     return;
//   }

//   if (!isValidEmail(to)) {
//     showNotification(`"${to}" is not a valid email address`, 'error');
//     return;
//   }

//   try {
//     const response = await fetch('/email/send', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ to, subject, body })
//     });

//     const result = await response.json();

//     if (result.success) {
//       showNotification('Email sent successfully!', 'success');
//       receiveEmail({ to, subject, body });
      
//       // Clear form
//       document.getElementById('emailTo').value = '';
//       document.getElementById('emailSubject').value = '';
//       document.getElementById('emailBody').value = '';
//     } else {
//       showNotification(`Failed to send email: ${result.message}`, 'error');
//     }
//   } catch (error) {
//     showNotification(`Network error: ${error.message}`, 'error');
//   }
// }

// // FIXED: Bulk email sending function
// async function sendBulkEmails() {
//   const subject = document.getElementById('bulkSubject').value;
//   const body = document.getElementById('bulkBody').value;
//   const emailInputs = document.querySelectorAll('.bulk-email');
  
//   if (!subject.trim()) {
//     showNotification('Please enter a subject', 'error');
//     return;
//   }

//   const emails = [];
//   let allValid = true;

//   // Validate emails and collect them
//   emailInputs.forEach((input, index) => {
//     const email = input.value.trim();
//     if (!email) {
//       showNotification(`Email #${index + 1} is empty`, 'error');
//       allValid = false;
//       return;
//     }
    
//     if (!isValidEmail(email)) {
//       showNotification(`"${email}" is not a valid email`, 'error');
//       allValid = false;
//       return;
//     }
    
//     emails.push({
//       to: email,
//       subject: `${subject} #${index + 1}`,
//       body: body || 'This is a bulk email test message.'
//     });
//   });

//   if (!allValid || emails.length === 0) {
//     return;
//   }

//   console.log('Sending bulk emails:', emails); // Debug log

//   const sendBtn = document.getElementById('sendBulkBtn');
//   sendBtn.disabled = true;
//   sendBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';

//   currentBulkJob = {
//     total: emails.length,
//     processed: 0,
//     failed: 0,
//     startTime: Date.now()
//   };

//   updateBulkProgress();

//   try {
//     const response = await fetch('/email/send-bulk', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ emails: emails })
//     });

//     const result = await response.json();
//     console.log('Bulk send response:', result); // Debug log

//     if (!response.ok) {
//       throw new Error(result.message || result.error || 'Bulk send failed');
//     }

//     if (result.success) {
//       showNotification(`Processing ${emails.length} emails...`, 'info');
//     } else {
//       throw new Error(result.message || 'Bulk send failed');
//     }
//   } catch (error) {
//     console.error('Bulk send error:', error);
//     showNotification(`Failed to start bulk send: ${error.message}`, 'error');
//     sendBtn.disabled = false;
//     sendBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Emails';
//     currentBulkJob = null;
//   }
// }

// function updateBulkProgress() {
//   if (!currentBulkJob) return;
  
//   const job = currentBulkJob;
//   const progress = Math.floor((job.processed / job.total) * 100);
  
//   const progressBar = document.getElementById('progressBar');
//   const progressText = document.getElementById('progressText');
  
//   if (progressBar && progressText) {
//     progressBar.style.width = `${progress}%`;
//     progressText.textContent = `${progress}% Complete (${job.processed}/${job.total})`;
//   }
  
//   if (job.processed >= job.total) {
//     const duration = Math.round((Date.now() - job.startTime) / 1000);
    
//     setTimeout(() => {
//       showNotification(`${job.total} emails processed in ${duration} seconds`, 'success');
      
//       const sendBtn = document.getElementById('sendBulkBtn');
//       if (sendBtn) {
//         sendBtn.disabled = false;
//         sendBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Emails';
//       }
      
//       setTimeout(() => {
//         closeModal();
//         currentBulkJob = null;
//       }, 2000);
//     }, 500);
//   }
// }

// // FIXED: High load simulation
// window.simulateHighLoad = function() {
//   const emails = Array.from({length: 100}, (_, i) => ({
//     to: `user${i+1}@example.com`,
//     subject: `High Load Test #${i+1}`,
//     body: "This is a high load simulation email"
//   }));

//   currentBulkJob = {
//     total: emails.length,
//     processed: 0,
//     failed: 0,
//     startTime: Date.now()
//   };

//   showBulkModal(emails.length);
//   document.getElementById('bulkSubject').value = 'High Load Test';
//   document.getElementById('bulkBody').value = 'This is a high load simulation email';
  
//   const sendBtn = document.getElementById('sendBulkBtn');
//   sendBtn.disabled = true;
//   sendBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
  
//   console.log('Starting high load test with emails:', emails); // Debug log
  
//   fetch('/email/send-bulk', {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({ emails: emails })
//   })
//   .then(response => {
//     console.log('High load response status:', response.status); // Debug log
//     return response.json();
//   })
//   .then(result => {
//     console.log('High load response:', result); // Debug log
//     if (result.success) {
//       showNotification(`Processing ${emails.length} emails...`, 'info');
//     } else {
//       throw new Error(result.message || result.error);
//     }
//   })
//   .catch(error => {
//     console.error('High load error:', error);
//     showNotification(`High load failed: ${error.message}`, 'error');
//     sendBtn.disabled = false;
//     sendBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Emails';
//     currentBulkJob = null;
//   });
// }

// // Helper functions
// function isValidEmail(email) {
//   const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//   return re.test(email);
// }

// function showNotification(message, type) {
//   const notification = document.getElementById('notification');
//   const messageEl = document.getElementById('notification-message');

//   if (notification && messageEl) {
//     messageEl.textContent = message;
//     notification.className = `notification ${type} show`;

//     const icon = notification.querySelector('i');
//     if (icon) {
//       icon.className =
//         type === 'success' ? 'fas fa-check-circle' :
//         type === 'error' ? 'fas fa-exclamation-circle' :
//         'fas fa-info-circle';
//     }

//     setTimeout(() => {
//       notification.classList.remove('show');
//     }, 3000);
//   }
// }

// function showBulkModal(count) {
//   bulkEmailCount = count;
//   const modal = document.getElementById('bulkEmailModal');
//   const title = document.getElementById('modalTitle');
//   const sendBtn = document.getElementById('sendBulkBtn');

//   if (count === 5) {
//     title.textContent = 'Send Bulk Emails (5)';
//     sendBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send 5 Emails';
//   } else {
//     title.textContent = 'Simulate High Load (100)';
//     sendBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send 100 Emails';
//   }

//   const container = document.getElementById('emailListContainer');
//   container.innerHTML = '';

//   for (let i = 0; i < count; i++) {
//     addEmailRow();
//   }

//   document.getElementById('progressBar').style.width = '0%';
//   document.getElementById('progressText').textContent = '0% Complete';
//   modal.style.display = 'flex';
// }

// function closeModal() {
//   const modal = document.getElementById('bulkEmailModal');
//   if (modal) {
//     modal.style.display = 'none';
//   }
// }

// function addEmailRow() {
//   const container = document.getElementById('emailListContainer');
//   const row = document.createElement('div');
//   row.className = 'email-input-row';
//   row.innerHTML = `
//     <input type="email" class="bulk-email" placeholder="recipient@example.com" value="user${container.children.length + 1}@example.com">
//     <button type="button" onclick="removeEmailRow(this)"><i class="fas fa-times"></i></button>
//   `;
//   container.appendChild(row);
// }

// function removeEmailRow(btn) {
//   btn.parentElement.remove();
// }

// window.clearLogs = function () {
//   const logContainer = document.getElementById('logContainer');
//   if (logContainer) {
//     logContainer.innerHTML = '';
//     showNotification('Logs cleared', 'info');
//   }
// }

// // Initialize the application
// function initializeDisplay() {
//   updateInboxDisplay();
  
//   // Set up metrics display
//   const elements = ['totalSent', 'totalFailed', 'totalPending', 'successRate', 'inboxCount'];
//   elements.forEach(id => {
//     const el = document.getElementById(id);
//     if (el) {
//       el.textContent = id === 'successRate' ? '0%' : '0';
//     }
//   });
  
//   // Simulate initial inbox emails
//   setTimeout(() => {
//     simulateIncomingEmail();
//     setTimeout(simulateIncomingEmail, 1500);
//   }, 1000);
// }

// // Start the application
// document.addEventListener('DOMContentLoaded', function() {
//   initializeDisplay();
// });

// // Cleanup
// window.addEventListener('beforeunload', () => {
//   if (ws && ws.readyState === WebSocket.OPEN) {
//     ws.close();
//   }
// });

// // Global exports
// window.showBulkModal = showBulkModal;
// window.closeModal = closeModal;
// window.addEmailRow = addEmailRow;
// window.removeEmailRow = removeEmailRow;
// window.sendBulkEmails = sendBulkEmails;
// window.simulateIncomingEmail = simulateIncomingEmail;
// window.refreshInbox = refreshInbox;
// window.closeDetailModal = closeDetailModal;
// window.replyToEmail = replyToEmail;










// UI State
let emailCounter = 0;
const emailStatuses = new Map();
let bulkEmailCount = 0;
let isBulkSending = false;
let bulkJobCancelled = false;
let currentBulkJob = null;
let bulkEmailInterval = null;

// Inbox state
let receivedEmails = [];
let currentEmailDetail = null;

// WebSocket connection for real-time updates
let ws;
try {
    ws = new WebSocket(`ws://${window.location.host}`);
    
    ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === 'emailEvent') {
            handleEmailEvent(data.data);
        }
    };

    ws.onerror = (error) => {
        console.log('WebSocket error:', error);
    };

    ws.onclose = () => {
        console.log('WebSocket connection closed');
    };
} catch (error) {
    console.error('Failed to establish WebSocket connection:', error);
}

function handleEmailEvent(event) {
    if (event.success) {
        // Update progress in bulk modal
        if (currentBulkJob) {
            currentBulkJob.processed++;
            updateBulkProgress();
            
            // Add to inbox
            receiveEmail(event.email);
        }
    } else {
        console.error('Email failed:', event.error);
        if (currentBulkJob) {
            currentBulkJob.failed++;
            updateBulkProgress();
        }
    }
}

// Email functions
function receiveEmail(email) {
    const newEmail = {
        id: `recv_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        from: email.to,
        to: email.to,
        subject: `Re: ${email.subject}`,
        body: `Thank you for your email regarding "${email.subject}".\n\nThis is an automated response confirming we received your message.\n\nOriginal message:\n${email.body}`,
        receivedAt: new Date(),
        read: false
    };

    receivedEmails.unshift(newEmail);
    updateInboxDisplay();
    
    // Update inbox count
    document.getElementById('inboxCount').textContent = receivedEmails.length;
}

function simulateIncomingEmail() {
    const senders = ["support@example.com", "noreply@newsletter.com", "alert@system.com"];
    const subjects = ["Important Update", "Your Monthly Newsletter", "Security Alert"];
    const bodies = ["We have important news for you...", "Check out our latest offers...", "Unusual activity detected..."];

    const sender = senders[Math.floor(Math.random() * senders.length)];
    const subject = subjects[Math.floor(Math.random() * subjects.length)];
    const body = bodies[Math.floor(Math.random() * bodies.length)];

    const newEmail = {
        id: `recv_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        from: sender,
        to: "user@example.com",
        subject: subject,
        body: body,
        receivedAt: new Date(),
        read: false
    };

    receivedEmails.unshift(newEmail);
    updateInboxDisplay();
    
    // Update inbox count
    document.getElementById('inboxCount').textContent = receivedEmails.length;
}

// UI Functions
function updateInboxDisplay() {
    const container = document.getElementById('inboxContainer');
    container.innerHTML = '';

    if (receivedEmails.length === 0) {
        container.innerHTML = '<div class="empty-state"><i class="fas fa-inbox"></i><h3>Your inbox is empty</h3><p>Send yourself an email or simulate incoming messages</p></div>';
        return;
    }

    receivedEmails.forEach(email => {
        const emailElement = document.createElement('div');
        emailElement.className = `inbox-item ${email.read ? '' : 'unread'}`;
        emailElement.onclick = () => showEmailDetail(email);

        // Format date
        let timeDisplay;
        const now = new Date();
        const emailDate = new Date(email.receivedAt);

        if (isToday(emailDate)) {
            timeDisplay = emailDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } else if (isYesterday(emailDate)) {
            timeDisplay = 'Yesterday';
        } else {
            timeDisplay = emailDate.toLocaleDateString([], { month: '2-digit', day: '2-digit' });
        }

        const preview = email.body.length > 50 ? email.body.substring(0, 50) + '...' : email.body;

        emailElement.innerHTML = `
            <div class="inbox-header">
                <div class="inbox-sender">${email.from}</div>
                <div class="inbox-time">${timeDisplay}</div>
            </div>
            <div class="inbox-subject">${email.subject}</div>
            <div class="inbox-preview">${preview}</div>
        `;

        container.appendChild(emailElement);
    });
}

function isToday(date) {
    const today = new Date();
    return date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear();
}

function isYesterday(date) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return date.getDate() === yesterday.getDate() &&
        date.getMonth() === yesterday.getMonth() &&
        date.getFullYear() === yesterday.getFullYear();
}

function showEmailDetail(email) {
    email.read = true;
    currentEmailDetail = email;
    updateInboxDisplay();

    document.getElementById('emailDetailSubject').textContent = email.subject;
    document.getElementById('emailDetailFrom').textContent = email.from;
    document.getElementById('emailDetailTo').textContent = email.to;
    document.getElementById('emailDetailDate').textContent = email.receivedAt.toLocaleString();
    document.getElementById('emailDetailBody').textContent = email.body;
    document.getElementById('emailDetailModal').style.display = 'flex';
}

function closeDetailModal() {
    document.getElementById('emailDetailModal').style.display = 'none';
    currentEmailDetail = null;
}

function replyToEmail() {
    if (!currentEmailDetail) return;

    document.getElementById('emailTo').value = currentEmailDetail.from;
    document.getElementById('emailSubject').value = `Re: ${currentEmailDetail.subject}`;
    document.getElementById('emailBody').value = `\n\n---------- Original Message ----------\nFrom: ${currentEmailDetail.from}\nSent: ${currentEmailDetail.receivedAt.toLocaleString()}\nSubject: ${currentEmailDetail.subject}\n\n${currentEmailDetail.body}`;
    closeDetailModal();
    document.getElementById('emailTo').scrollIntoView({ behavior: 'smooth' });
    showNotification('Reply form pre-filled', 'success');
}

function refreshInbox() {
    updateInboxDisplay();
    showNotification('Inbox refreshed', 'success');
}

// Email sending functions
window.sendSingleEmail = async function () {
    const to = document.getElementById('emailTo').value;
    const subject = document.getElementById('emailSubject').value;
    const body = document.getElementById('emailBody').value;

    if (!to || !subject) {
        showNotification('Please fill in To and Subject fields', 'error');
        return;
    }

    if (!isValidEmail(to)) {
        showNotification(`"${to}" is not a valid email address`, 'error');
        return;
    }

    try {
        const response = await fetch('/email/send', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ to, subject, body })
        });

        const result = await response.json();

        if (result.success) {
            showNotification('Email sent successfully!', 'success');
            receiveEmail({ to, subject, body });
            
            // Clear form
            document.getElementById('emailTo').value = '';
            document.getElementById('emailSubject').value = '';
            document.getElementById('emailBody').value = '';
        } else {
            showNotification(`Failed to send email: ${result.message}`, 'error');
        }
    } catch (error) {
        showNotification(`Network error: ${error.message}`, 'error');
    }
}

// Bulk email sending function
async function sendBulkEmails() {
    if (isBulkSending) return;
    
    const subject = document.getElementById('bulkSubject').value;
    const body = document.getElementById('bulkBody').value;
    const emailInputs = document.querySelectorAll('.bulk-email');
    
    if (!subject.trim()) {
        showNotification('Please enter a subject', 'error');
        return;
    }

    const emails = [];
    let allValid = true;

    // Validate emails and collect them
    emailInputs.forEach((input, index) => {
        const email = input.value.trim();
        if (!email) {
            showNotification(`Email #${index + 1} is empty`, 'error');
            allValid = false;
            return;
        }
        
        if (!isValidEmail(email)) {
            showNotification(`"${email}" is not a valid email`, 'error');
            allValid = false;
            return;
        }
        
        emails.push({
            to: email,
            subject: `${subject} #${index + 1}`,
            body: body || 'This is a bulk email test message.'
        });
    });

    if (!allValid || emails.length === 0) {
        return;
    }

    const sendBtn = document.getElementById('sendBulkBtn');
    sendBtn.disabled = true;
    sendBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';

    isBulkSending = true;
    bulkJobCancelled = false;
    
    currentBulkJob = {
        total: emails.length,
        processed: 0,
        failed: 0,
        startTime: Date.now()
    };

    updateBulkProgress();

    // Process emails one by one with delay
    const processEmail = async (index) => {
        if (index >= emails.length || bulkJobCancelled) {
            // Processing complete
            isBulkSending = false;
            sendBtn.disabled = false;
            sendBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Emails';
            
            if (bulkJobCancelled) {
                showNotification('Bulk sending cancelled', 'info');
            } else {
                const duration = Math.round((Date.now() - currentBulkJob.startTime) / 1000);
                showNotification(`${currentBulkJob.total} emails processed in ${duration} seconds`, 'success');
            }
            return;
        }

        const email = emails[index];
        
        try {
            const response = await fetch('/email/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(email)
            });
            
            const result = await response.json();
            
            if (result.success) {
                currentBulkJob.processed++;
                receiveEmail(email);
            } else {
                currentBulkJob.failed++;
            }
            
            updateBulkProgress();
            
            // Process next email after a short delay
            setTimeout(() => processEmail(index + 1), 300);
        } catch (error) {
            currentBulkJob.failed++;
            updateBulkProgress();
            setTimeout(() => processEmail(index + 1), 300);
        }
    };

    // Start processing
    processEmail(0);
}

function updateBulkProgress() {
    if (!currentBulkJob) return;
    
    const job = currentBulkJob;
    const progress = Math.floor((job.processed / job.total) * 100);
    
    const progressBar = document.getElementById('progressBar');
    const progressText = document.getElementById('progressText');
    
    if (progressBar && progressText) {
        progressBar.style.width = `${progress}%`;
        progressText.textContent = `${progress}% Complete (${job.processed}/${job.total})`;
    }
}

// Helper functions
function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function showNotification(message, type) {
    const notification = document.getElementById('notification');
    const messageEl = document.getElementById('notification-message');

    if (notification && messageEl) {
        messageEl.textContent = message;
        notification.className = `notification ${type} show`;

        const icon = notification.querySelector('i');
        if (icon) {
            icon.className =
                type === 'success' ? 'fas fa-check-circle' :
                type === 'error' ? 'fas fa-exclamation-circle' :
                'fas fa-info-circle';
        }

        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }
}

function showBulkModal(count) {
    bulkEmailCount = count;
    const modal = document.getElementById('bulkEmailModal');
    const title = document.getElementById('modalTitle');
    const sendBtn = document.getElementById('sendBulkBtn');

    if (count === 5) {
        title.textContent = 'Send Bulk Emails (5)';
        sendBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send 5 Emails';
    } else {
        title.textContent = 'Simulate High Load (100)';
        sendBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send 100 Emails';
    }

    const container = document.getElementById('emailListContainer');
    container.innerHTML = '';

    for (let i = 0; i < count; i++) {
        addEmailRow();
    }

    document.getElementById('progressBar').style.width = '0%';
    document.getElementById('progressText').textContent = '0% Complete';
    modal.style.display = 'flex';
}

function closeModal() {
    const modal = document.getElementById('bulkEmailModal');
    if (modal) {
        bulkJobCancelled = true;
        isBulkSending = false;
        modal.style.display = 'none';
    }
}

function addEmailRow() {
    const container = document.getElementById('emailListContainer');
    const row = document.createElement('div');
    row.className = 'email-input-row';
    row.innerHTML = `
        <input type="email" class="bulk-email" placeholder="recipient@example.com" value="user${container.children.length + 1}@example.com">
        <button type="button" onclick="removeEmailRow(this)"><i class="fas fa-times"></i></button>
    `;
    container.appendChild(row);
}

function removeEmailRow(btn) {
    btn.parentElement.remove();
}

window.clearLogs = function () {
    const logContainer = document.getElementById('logContainer');
    if (logContainer) {
        logContainer.innerHTML = '';
        showNotification('Logs cleared', 'info');
    }
}

// Initialize the application
function initializeDisplay() {
    updateInboxDisplay();
    
    // Set up metrics display
    const elements = ['totalSent', 'totalFailed', 'totalPending', 'successRate', 'inboxCount'];
    elements.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.textContent = id === 'successRate' ? '0%' : '0';
        }
    });
    
    // Simulate initial inbox emails
    setTimeout(() => {
        simulateIncomingEmail();
        setTimeout(simulateIncomingEmail, 1500);
    }, 1000);
}

// Start the application
document.addEventListener('DOMContentLoaded', function() {
    initializeDisplay();
});

// Cleanup
window.addEventListener('beforeunload', () => {
    if (ws && ws.readyState === WebSocket.OPEN) {
        ws.close();
    }
});

// Global exports
window.showBulkModal = showBulkModal;
window.closeModal = closeModal;
window.addEmailRow = addEmailRow;
window.removeEmailRow = removeEmailRow;
window.sendBulkEmails = sendBulkEmails;
window.simulateIncomingEmail = simulateIncomingEmail;
window.refreshInbox = refreshInbox;
window.closeDetailModal = closeDetailModal;
window.replyToEmail = replyToEmail;