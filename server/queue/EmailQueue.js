// EmailQueue.js content
const EventEmitter = require('events');
const transporter = require('../config/transporter');

class EmailQueue extends EventEmitter {
  constructor(concurrency = 5) {
    super();
    this.queue = [];
    this.activeCount = 0;
    this.concurrency = concurrency;
  }

  add(email) {
    return new Promise((resolve, reject) => {
      this.queue.push({ email, resolve, reject });
      this.process();
    });
  }

  process() {
    while (this.queue.length > 0 && this.activeCount < this.concurrency) {
      this.activeCount++;
      const task = this.queue.shift();
      
      this.sendEmail(task.email)
        .then(result => {
          task.resolve(result);
          this.emit('sent', {
            email: task.email,
            success: true
          });
        })
        .catch(error => {
          task.reject(error);
          this.emit('sent', {
            email: task.email,
            success: false,
            error: error.message
          });
        })
        .finally(() => {
          this.activeCount--;
          this.process();
        });
    }
  }

  async sendEmail(email) {
    try {
      const info = await transporter.sendMail({
        from: `"growth funnel" <${process.env.EMAIL_USER}>`,
        to: email.to,
        subject: email.subject,
        text: email.body
      });
      
      return {
        message: `Email sent: ${info.messageId}`,
        email
      };
    } catch (error) {
      throw new Error(`Failed to send email: ${error.message}`);
    }
  }

  addBulk(emails) {
    return Promise.allSettled(emails.map(email => this.add(email)));
  }
}

module.exports = new EmailQueue();