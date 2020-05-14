# Password-Manager - Chrome-Extension

## Server side:
- Using Express - Node.js web application framework.
The server supports multiple users and holds the username and password of each user hashed and salted in users.json file (using bcrypt api). 
For each user the server holds a single entry of data. Each entry holds the user's name and an array of all the domain data sent by the user. For each domain the username and password are encrypted and authenticated. The data mentioned above is stored in data.json file.
The communication with the client is done with http protocol (get, post, delete…).
- Using ngrok framework we expose our server to the internet, all user's can connect the server from the internet, even if not in the same network.

## Client side: (Google Chrome Eextension)

The user must download the plug-in. On registration the user picks a username and one master password. Every time the user tries to connect, they must enter the master password. Once connected, the password file is sent to user and decrypted in memory after authentication. For every password field in site, if already stored, display it, if not stored, ask user whether to store it after login and if the entered password does not match the one stored, ask user whether to update.

When the user closes the browser or logs out, all the data in the local storage is erased until the next login. 
A new user must first register and choose a strong password (at least 8 characters including at least one capital letter, one number, and one special character). The user may use the generate password function, included in the plug in.

- Using Cryptojs library for encryption, decryption and authentication on the client side.
- The communication with the server is done using axios framework.
- Currently the extension supports the following websites: Facebook, LinkedIn, Yad2.

## How To Install:
- Prequisites: npm, chrome web browser.
- Clone the repository to your machine.
- Run 'npm install' to install all the necessary dependencies.
- Run 'node index.js' in order to start the server.
- To install the chrome plugin (in developer mode):
    1. Go to chrome://extensions/ and check the box for Developer mode in the top right.
    2. In the chrome://extensions/ page, click the Load unpacked extension button and select the unzipped folder of your extension to install it.
- To use the extension you must first choose to register and then login. (for the extension to work properley refresh any web pages that were opened before login)
- In order to gracefully shutdown the server you can click Ctrl-C in the terminal where the server runs.
