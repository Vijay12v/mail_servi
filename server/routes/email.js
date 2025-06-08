const express = require('express');
const router = express.Router();
const emailQueue = require('../queue/EmailQueue');

// Single email endpoint
router.post('/send', async (req, res) => {
  const { to, subject, body } = req.body;

  if (!to || !subject) {
    return res.status(400).json({
      success: false,
      message: 'Missing required fields: to, subject'
    });
  }

  try {
    const result = await emailQueue.add({ to, subject, body });
    res.status(200).json({
      success: true,
      message: result.message,
      email: result.email
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Bulk email endpoint - FIXED
router.post('/send-bulk', async (req, res) => {
  const { emails } = req.body;
  
  if (!emails || !Array.isArray(emails)) {
    return res.status(400).json({ 
      success: false,
      error: 'Invalid request format. Expected { emails: [...] }' 
    });
  }

  if (emails.length === 0) {
    return res.status(400).json({ 
      success: false,
      error: 'No emails provided' 
    });
  }

  // Validate each email object
  for (let i = 0; i < emails.length; i++) {
    const email = emails[i];
    if (!email.to || !email.subject) {
      return res.status(400).json({
        success: false,
        error: `Email at index ${i} is missing required fields (to, subject)`
      });
    }
  }
  
  try {
    // Process bulk emails asynchronously
    emailQueue.addBulk(emails).then(results => {
      console.log(`Bulk email processing completed: ${results.length} emails processed`);
    }).catch(error => {
      console.error('Bulk email processing error:', error);
    });
    
    // Return immediate response
    res.status(202).json({
      success: true,
      message: 'Bulk email processing started',
      count: emails.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Failed to start bulk send: ${error.message}`
    });
  }
});

module.exports = router;