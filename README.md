
# JavaScript App
## Objective
 - build a small web application with HTML, CSS, and JavaScript that loads
data from an external API and enables the viewing of data points in detail.
## Context
 - have you build a complete, fully functioning JavaScript web application
 - focus on app as a whole, including high-quality HTML and CSS
   - architecture of a JS app, as well as testing and debugging
 - app should not only work, but be aesthetically pleasing and easy to use, as well
 - shouldn’t look like a half-finished prototype

## Features and Requirements

### User Goals
- users should be able to view a list of data and see more details for a given data item on demand.
### Key Features
  - **Load data** from an external source (API)
  - **View a list** of items
  - View **item details** on user action (e.g., clicking on item), 

## Technical Requirements
### Required
 The App *must*:
 - [ ] load data from an `external API`; for instance: [Pokémon API](https://pokeapi.co/)
 - [ ] display `item list` after page load (from API)
 - [ ] enable more detail `list item view` (e.g., Pokémon) on demand, when clicking
 - [ ] have `CSS styling`
 - [ ] have JavaScript code formatted according to `ESLint` rules
   - [ ] *may* be formatted via `Prettier`
   - [ ] *may* be manually formatted
 - [ ] use 1+ additional `complex UI patterns` for _details_ or _touch interactions_, i.e. a `modal`.
   - [ ] *may* allow `item search` (e.g., search Pokémon)
 - [ ] throw `no errors`
 - [ ] **should** be `deployed` on GitHub Pages (or other `publicly` accessible platform)
 - [ ] work in Chrome, Firefox, Safari, Edge, and `Internet Explorer 11`

### Nice to Have
 - [ ] *should* show `loading indicators` while loading data
 - [ ] *should* `handle errors` (i.e. trying to load data while offline)
   - [ ] show user-friendly `error messages`.

## Mock-ups or Other Assets
 - mock-ups are provided primarily for reference purposes
   - depending on the type of data being displayed

## Work steps
 1. - [ ] Set up the general `outline`
 2. - [ ] Set up a general `dataset` and `display` in very basic way to user
 3. - [ ] `Print details` on each item
 4. - [ ] Wrap repo in `IIFE` to avoid accidentally accessing global state
 5. - [ ] `Update` implementation to work within the IIFE
 6. - [ ] `Render static` data from data repo on page
 7. - [ ] Add basic `styling` to app
 8. - [ ] Ensure app `accessability`
 9. - [ ] Fetch data from API via `Ajax` with `asynchronous` behavior
 10. - [ ] Add 1+ `complex UI patterns` to app (show data details in a `modal`)
 11. - [ ] Create clean and usable app and `UI` design via `Bootstrap`
 12. - [ ] Ensure app works in `all` necessary `browsers`
 13. - [ ] Add `ESLint rules`, ensure code passes `validation`
 14. - [ ] Make final adjustments (`styling`, `usability` improvements)
 15. - [ ] ++ Add `Touch` interactions (pointer events), e.g., `swiping` between items
 16. - [ ] ++ Add `loading indicator`
 17. - [ ] ++ Improve `aesthetics` or including `more features` (e.g, item search)
