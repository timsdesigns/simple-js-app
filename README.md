
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
 - [x] load data from an `external API`; for instance: [Pokémon API](https://pokeapi.co/)
 - [x] display `item list` after page load (from API)
 - [x] enable more detail `list item view` (e.g., Pokémon) on demand, when clicking
 - [x] have `CSS styling`
 - [x] have JavaScript code formatted according to `ESLint` rules
   - [x] *may* be formatted via `Prettier`
   - [x] *may* be manually formatted
 - [x] use 1+ additional `complex UI patterns` for _details_ or _touch interactions_, i.e. a `modal`.
   - [x] *may* allow `item search` (e.g., search Pokémon)
 - [x] throw `no errors`
 - [x] **should** be `deployed` on GitHub Pages (or other `publicly` accessible platform)
 - [x] work in Chrome, Firefox, Safari, Edge,
   - [ ] not `Internet Explorer 11` due to [Bootstrap 5.3](https://github.com/twbs/bootstrap/blob/v5.3.2/.browserslistrc)

### Nice to Have
 - [x] *should* show `loading indicators` while loading data
 - [x] *should* `handle errors` (i.e. trying to load data while offline)
   - [x] show user-friendly `error messages`.

## Mock-ups or Other Assets
 - mock-ups are provided primarily for reference purposes
   - depending on the type of data being displayed

## Work steps
 1. - [x] Set up the general `outline`
 2. - [x] Set up a general `dataset` and `display` in very basic way to user
 3. - [x] `Print details` on each item
 4. - [x] Wrap repo in `IIFE` to avoid accidentally accessing global state
 5. - [x] `Update` implementation to work within the IIFE
 6. - [x] `Render static` data from data repo on page
 7. - [x] Add basic `styling` to app
 8. - [x] Ensure app `accessability`
 9. - [x] Fetch data from API via `Ajax` with `asynchronous` behavior
 10. - [x] Add 1+ `complex UI patterns` to app (show data details in a `modal`)
 11. - [x] Create clean and usable app and `UI` design via `Bootstrap`
 12. - [x] Ensure app works in `all` necessary `browsers`
 13. - [x] Add `ESLint rules`, ensure code passes `validation`
 14. - [x] Make final adjustments (`styling`, `usability` improvements)
 15. - [x] ++ Add `Touch` interactions (pointer events), e.g., `swiping` between items
 16. - [x] ++ Add `loading indicator`
 17. - [x] ++ Improve `aesthetics` or including `more features` (e.g, item search)
