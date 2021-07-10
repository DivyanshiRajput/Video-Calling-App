# Microsoft Teams Clone

### You can try the app on the following website:

[https://stormy-retreat-84614.herokuapp.com](https://stormy-retreat-84614.herokuapp.com/)

# Feature List

- A user can mute and unmute itself
- Option to turn on and off video
- Real time chat with other participants
- Participants list available for the call
- Dark mode feature which helps to reduce blue light exposure
- Invite link option enables the user to share the room link with other people
- Feedback mechanism for the app which helps developer to incorporate more user friendly interface
- User can rejoin meeting instantly using the rejoin button on leave page
- Option to create a room on the homepage of the app
- A person can join any other meeting using the invite link from the homepage or directly pasting the link in the url tab of the browser

### Adapt Stage Feature

- A user can access the chatroom for any meeting before or after he/she joins.
- There is a option to go to the chatroom directly from the call or you can join chat room from the home page
- User can also join the call directly from the chat room using the join call button present in the chat room
- The chat can be accessed even after the meeting has ended
- The chatroom also gives the list of participants present in the meeting

# Agile Methodology

## Week 1 (14 June' 21 - 21 June' 21)

### Target: prepare the basic model which connects 2 people on a video call

- Basic prototype of the app where 2 people can connect to each using the app
- Created `server.js` and `client.js` and incorporated video and audio sharing using [Socket.io](http://socket.io) and Peer.js
- Made frontend for the room
- Added mute and disabling video functionality

## Week 2 (22 June' 21 - 28 June' 21)

### Target: incorporate more features and work on UI

- Worked on the user interface
- Added dark mode for accessibility
- Incorporated the real time chat feature
- Added the invite link option

## Week 3 (29 June' 21 - 5 July' 21)

### Target: make the product more robust, polish the features and make the app user friendly

- Added leave functionality for the user
- Added leave and home page for the app
- Set up Firebase for storing the database of the app
- Deployed the app using Heroku

- Added following functionality to the leave page:
    - Rejoin function to go back to the meeting
    - Return to homepage function
    - Feedback mechanism for the developer
    - Displaying the cumulative rating for the user
    - Improved UI of the leave page

- Added the following functionality to the home page:
    - Option to create a room
    - Option to join a room using meeting link
    - Improved UI of the home page
    - Displaying the app cumulative for the user

## Week 4 (5 July' 21 - 12 July' 21)

### Target: incorporate the ADAPT Feature

- Added the chatroom feature which enables user to access the chat before and after he/she joins the meeting
- Created the user interface for the chatroom
- Integrated chat with Firebase Realtime Database
- Added function to join the call from the chatroom and vice-versa
- Added the participants list feature
- Added video grid resizing according to the number of people present in the call
- Made the web application responsive for the mobile view
- Added dark mode feature for the chatroom
- Added option to join the chatroom on the homepage
- Added animation to the chat window and the participants list
- Improved chat UI and added timestamps for the chat
- Added emojis in front of the username in the participants list to distinguish users present in the call and the users active in chatroom
