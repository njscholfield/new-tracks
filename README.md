# new-tracks

### Description

This project is a continuation of my [original SoundCloud project](https://github.com/njscholfield/soundcloud) that displays descriptions of tracks on SoundCloud. It adds a database which allows users to save tracks for later. Users can either create an account or sign in with their SoundCloud account.

From the description of the track, the user can add the track to their list of tracks. If the release date is not included in the track info from the API, the user will be asked to provide the release date that may be found in the description or leave it blank.

Each user has the ability to make their profile public, which allows other people to see the tracks a user has saved.

### Technologies Used
- [Node.js](https://nodejs.org)
- [Express](https://expressjs.com)
- [Heroku](https://heroku.com)
- [mLab MongoDB](https://mlab.com)
- [AngularJS](https://angularjs.org)
- [SoundCloud API](https://developers.soundcloud.com)
- [UI Bootstrap](https://angular-ui.github.io/bootstrap/)
- [Autolinker.js](https://github.com/gregjacobs/Autolinker.js)
- [Passport](http://passportjs.org)

### To Do
- [x] Option of table or block layout for tracks on larger displays
- [x] Public/Private Profiles
  - ability to view track list of users whose accounts are 'public'
    - [x] add account visibility to db schema
    - [x] switch/checkbox/dropdown in profile
  - /:username
  - [x] see list and click to view description
    - [x] support /#!/trackID on main page
  - [ ] search for user?
- [ ] Password reset?
  - nodemailer, node-email-templates
- [x] Delete account
  - confirmation modal
- [x] Implement Disconnect from SoundCloud
- [x] show error if track has been removed from API/SoundCloud
- [x] show a loading indicator when getting track info
