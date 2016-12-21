# new-tracks

### Description

This project is a continuation of my original SoundCloud project that displays descriptions of tracks on SoundCloud. This project would help the user keep track of new tracks that will be released in the future that have previews posted on SoundCloud.

From the description of the preview track, the user can add the track to a list of other upcoming tracks. If the release date is not included in the track info from the API, the user will be asked to provide the release date that may be found in the description or leave it blank.

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
