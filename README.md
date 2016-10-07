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

### Features/ToDo
- [x] Show descriptions for SoundCloud tracks
  - Use other SoundCloud project as basis
- [x] Add tracks from the description display page
  - Modal asks for confirmation and release date if not in track data
- [x] Remove a track from the database from the list view
- [x] Store list of tracks in database for user
  - Authenticate – SoundCloud?
  - MongoDB vs. PostgreSQL
  - Store track API url for easier description fetching
- [x] Display list of tracks – Table?

  |Name|User|Release Date|Description|Purchase|Delete|
  |:---|:---|:-----------|:---------:|:------:|:----:|
  |We Are|Revealed Recordings|July 15, 2016|[Link](#)|[Link](#)|⨉|

  - wrap table in `<div class="table-responsive">`
    - use `.table` on table
  - Locate list at `/:username`
  - Sorted by release date
  - Links to:
    - Track description
    - Purchase url with purchase text?
      - Would have to refetch track info...
    - Original Track (on SoundCloud)
  - ⨉ to remove track from list
- [ ] Add tracks to SoundCloud playlist
