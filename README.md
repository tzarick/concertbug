# Concertbug :microphone::beetle:

[ConcertBug](https://concertbug.herokuapp.com) is a live music search assistant - it looks through your music library, finds live shows in your vicinity that feature an artist you like, and displays them geographically on a map.

- [Planning Overview](https://docs.google.com/document/d/1LQvc6JSZblEMstAgsUkg_fFnjt5LMhc5YHWmB8zfad0/edit?usp=sharing)
- [(Initial) Class Diagram](https://github.com/tzarick/concertbug/blob/master/design/concertbug-v2-class-diagram1.jpg)

## What Does It Provide?

- A geographical representation of all your artists' shows. Filterable on:
  1. Center point, by clicking anywhere
  2. Distance radius
  3. Date range
- Information about each show:
  - Date/time
  - Venue
  - Ticket info
  - Other artists on bill
  - Embedded playable track from the selected artist
- Bonus Feature(s) :cowboy_hat_face:

## Details

Tech Stack:

- TypeScript
- React.js
- VSCode
- Heroku

External Services:

- Spotify Web API
- SongKick API
- Google Maps Web API
- (Apple Music API in the future, hopefully)

Thankful for these packages:

- [axios](https://github.com/axios/axios)
- [materialUI](https://material-ui.com/)
- [geolib](https://github.com/manuelbieh/geolib)

---

:art: Logo Design: [Tray Stidham](https://www.behance.net/TrayStidham/appreciated)  
This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app)

### Note...

This project is most certainly not a purist React one. I'm sure React functionality could have been leveraged better. However, my main learning goal through this project was to exercise my TypeScript chops, specifially relating to OO design, so I tried to isolate as much of the logic into pure TypeScript modules as I could. This brought about it's own challenges but I liked the idea of keeping the model a little further removed from the framework (I also need to improve my deeper React understanding! More on that soon...).
