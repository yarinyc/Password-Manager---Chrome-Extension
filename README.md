# Password-Manager - Chrome-Extension

## Server side:
- Using Express - Node.js web application framework.
The server supports multiple users and holds the username and password of each user hashed and salted in users.json file (using bcrypt api). 
For each user the server holds a single entry of data. Each entry holds the user's name and an array of all the domain data sent by the user. For each domain the username and password are encrypted and authenticated. The data mentioned above is stored in data.json file.
The communication with the client is done with http protocol (get, post, delete…).
- Using ngrok framework we expose our server to the internet, all user's can connect the server from the internet, even if not in the same network.

## Client side: (Google Chrome Extension)

The user must download the plug-in. On registration the user picks a username and one master password. Every time the user tries to connect, they must enter the master password. Once connected, the password file is sent to user and decrypted in memory after authentication. For every password field in site, if already stored, display it, if not stored, ask user whether to store it after login and if the entered password does not match the one stored, ask user whether to update.

When the user closes the browser or logs out, all the data in the local storage is erased until the next login. 
A new user must first register and choose a strong password (at least 8 characters including at least one capital letter, one number, and one special character). The user may use the generate password function, included in the plug in.

If any of a user's data (any part of his domains, usernames or passwords) is altered in the server side an alert will appear in the user's browser, warning him that his data was exposed/altered.

- Using Cryptojs library for encryption, decryption and authentication on the client side.
- The communication with the server is done using axios framework.
- Currently the extension supports the following websites: Facebook, LinkedIn, Yad2.

## How To Install:
- Prequisites: npm (you can download Nodejs from https://nodejs.org/en/download/), chrome web browser.
- Clone or download the repository to your machine.
- Run 'npm install' in the directory of the repository to install all the necessary dependencies (open terminal in the directory and then run the command).
- Run 'node index.js' in order to start the server (after the server boots it will show a message in the terminal).
- To install the chrome plugin (in developer mode):
    1. Go to chrome://extensions/ and check the box for Developer mode in the top right.
    2. In the chrome://extensions/ page, click the Load unpacked extension button and select the unzipped folder of your extension to install it.
- To use the extension you must first choose to register (using your email and a valid password) and then login.
  (for the extension to work properley refresh any web pages that were opened before login to the extension).
- In order to gracefully shutdown the server you can click Ctrl-C in the terminal where the server runs (ensures all the data will be saved to disk).
- To delete your information from the service just enter your login information in the main screen of the plugin and then choose the delete option.
- When registering or when logged in, you can use the built-in password generator for quick and strong randomized passwords.
