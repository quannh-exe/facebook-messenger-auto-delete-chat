# Facebook Messenger Auto Delete Script

🗑️ **Automatically delete all Facebook Messenger conversations with advanced debugging and customizable timing controls.**

![Version](https://img.shields.io/badge/version-1.4-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Platform](https://img.shields.io/badge/platform-Tampermonkey-orange.svg)

## 🌟 Features

### 🚀 **Core Functionality**
- **Automatic Deletion**: Systematically deletes all Facebook Messenger conversations
- **Sequential Processing**: Handles conversations one by one to avoid detection
- **Auto-scroll**: Automatically loads more conversations when needed
- **Smart Detection**: Finds conversation elements, menu buttons, and confirmation dialogs

### 🎛️ **Advanced Controls**
- **Start/Stop Buttons**: Easy control with prominent gradient buttons
- **Real-time Statistics**: Track deleted, attempted, and failed deletions
- **Customizable Timing**: 5 different timing settings in seconds (not milliseconds!)
- **Debug Mode**: Comprehensive logging for troubleshooting

### ⚙️ **Timing Configuration**
- **Delete Delay**: Time between each deletion (1-10 seconds)
- **Load Wait**: Time to wait for conversation to load (1-5 seconds)
- **Menu Wait**: Time to wait for menu to appear (1-5 seconds)
- **Confirm Wait**: Time to wait for confirmation dialog (1-5 seconds)
- **After Delete**: Time to wait after successful deletion (1-5 seconds)

### 🔍 **Debug Features**
- **Real-time Debug Log**: See exactly what the script is doing
- **Element Detection**: Shows how many elements are found
- **Click Tracking**: Logs all click attempts and results
- **Error Handling**: Graceful failure recovery

## 📋 Requirements

- **Browser**: Chrome, Firefox, Edge, or any Chromium-based browser
- **Extension**: Tampermonkey userscript manager
- **Platform**: Facebook Messenger (messenger.com) or Facebook Messages (facebook.com/messages)

## 🚀 Installation

### Step 1: Install Tampermonkey
1. Install Tampermonkey extension for your browser:
   - [Chrome Web Store](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo)
   - [Firefox Add-ons](https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/)
   - [Microsoft Edge Add-ons](https://microsoftedge.microsoft.com/addons/detail/tampermonkey/iikmkjmpaadaobahmlepeloendndfphd)

### Step 2: Install the Script
1. Open Tampermonkey Dashboard
2. Click "Create a new script"
3. Delete the default content
4. Copy the entire content from `facebook-messenger-auto-delete-debug.user.js`
5. Paste into the editor
6. Press `Ctrl+S` to save

### Step 3: Usage
1. Navigate to [Facebook Messenger](https://www.messenger.com/)
2. Wait for the page to fully load
3. You'll see the control panel in the top-right corner
4. Adjust timing settings if needed (default values work well)
5. Click "🚀 BẮT ĐẦU" (START) button
6. Confirm the deletion warning
7. Monitor progress through statistics and debug log
8. Click "⏹️ DỪNG" (STOP) to halt the process anytime

## 🎯 How It Works

### Process Flow
1. **Find Conversation**: Locates the first conversation in the list
2. **Click Conversation**: Opens the conversation
3. **Wait for Load**: Allows conversation to fully load
4. **Find Menu Button**: Locates the 3-dot menu button in the header
5. **Click Menu**: Opens the conversation actions menu
6. **Find Delete Option**: Locates "Xóa đoạn chat" (Delete chat) option
7. **Click Delete**: Selects the delete option
8. **Confirm Deletion**: Clicks the blue confirmation button
9. **Wait and Repeat**: Waits specified time before next deletion

### Smart Detection
- **Header Focus**: Prioritizes finding menu buttons in conversation headers
- **Multiple Selectors**: Uses various CSS selectors and attributes
- **Text Matching**: Supports both Vietnamese and English interfaces
- **Fallback Methods**: Multiple detection strategies for reliability

## ⚙️ Configuration

### Recommended Settings

**🚀 Fast (May be detected)**
- Delete Delay: 2 seconds
- Load Wait: 1 second
- Menu Wait: 1 second
- Confirm Wait: 1 second
- After Delete: 1 second

**⚖️ Balanced (Recommended)**
- Delete Delay: 3 seconds
- Load Wait: 2 seconds
- Menu Wait: 2 seconds
- Confirm Wait: 2 seconds
- After Delete: 2 seconds

**🐌 Safe (Slowest but safest)**
- Delete Delay: 5 seconds
- Load Wait: 3 seconds
- Menu Wait: 3 seconds
- Confirm Wait: 3 seconds
- After Delete: 3 seconds

## 🔧 Troubleshooting

### Common Issues

**Script not working**
- Refresh the page and try again
- Check if Tampermonkey is enabled
- Verify you're on messenger.com or facebook.com/messages

**Can't find delete button**
- Facebook may have updated their interface
- Check debug log for specific error messages
- Try increasing timing delays

**Process stops unexpectedly**
- Check for network connectivity issues
- Look for Facebook rate limiting
- Increase delays to avoid detection

### Debug Information
- Open browser console (F12) for detailed logs
- Monitor the debug panel in the script interface
- Check for any JavaScript errors

## ⚠️ Important Warnings

### 🚨 **Critical Notices**
- **Irreversible Action**: Deleted conversations cannot be recovered
- **Backup Important Data**: Save important conversations before running
- **Use Responsibly**: Respect Facebook's terms of service
- **Rate Limiting**: Don't set delays too low to avoid being blocked

### 🛡️ **Safety Measures**
- **Confirmation Dialog**: Requires explicit confirmation before starting
- **Stop Anytime**: Can be halted at any moment
- **Reasonable Delays**: Default settings are conservative
- **Error Recovery**: Gracefully handles failures

## 📊 Statistics

The script provides real-time statistics:
- **✅ Deleted**: Successfully deleted conversations
- **🔄 Attempts**: Total deletion attempts
- **❌ Failed**: Failed deletion attempts
- **Status**: Current operation status

## 🔍 Debug Log

Monitor the debug log to see:
- Element detection results
- Click attempt outcomes
- Timing information
- Error messages
- Process flow status

## 🤝 Contributing

Feel free to contribute by:
- Reporting bugs and issues
- Suggesting improvements
- Submitting pull requests
- Sharing feedback

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ⚖️ Disclaimer

This script is created for educational purposes and personal use. Users are responsible for:
- Complying with Facebook's Terms of Service
- Understanding the consequences of mass deletion
- Using the script responsibly and ethically
- Any potential account restrictions or bans

**Use at your own risk. The authors are not responsible for any consequences resulting from the use of this script.**

---

**Version**: 1.4
**Last Updated**: 2024
**Compatibility**: Facebook Messenger Web Interface
**Language Support**: Vietnamese & English

## 📁 Files

- `facebook-messenger-auto-delete-debug.user.js` - Main userscript file
- `README.md` - This documentation file

## 🚀 Quick Start

1. **Install Tampermonkey** → **Copy Script** → **Save** → **Go to Messenger** → **Start Deleting**

## 📞 Support

If you encounter issues:
1. Check the troubleshooting section above
2. Open browser console (F12) for error messages
3. Verify Tampermonkey is enabled and script is active
4. Try refreshing the page and running again

## 🔄 Updates

The script may need updates when Facebook changes their interface. Check for:
- New element selectors
- Updated button text
- Changed page structure
- Modified confirmation dialogs
