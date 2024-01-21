let pokemonRepository = (function(){
  let pokemonList = []; // Creating list of custom objects
  //TODO 1.7.2: Remove the array of Pokémon objects and replace it with an empty array
  /*pokemonList[0] = {
    name: "Bulbasaur",
    height : 0.7 ,
    weight : 6.9 ,
    types: ['grass', 'poison']
  }
  pokemonList[1] = {
    name: "Pidgey",
    height : 0.3 ,
    weight : 1.8 ,
    types: ['flying', 'normal']
  }
  pokemonList[2] = {
    name: "Pikachu",
    height : 0.4 ,
    weight : 6 ,
    types: ['electric']
  }
  pokemonList[3] = {
    name: "Umbreon",
    height : 1 ,
    weight : 27 ,
    types: ['dark']
  }*/
  let apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=150';
  
  let add = pokemon => typeof(pokemon) === 'object'?
    pokemonList.push(pokemon): reportError('Wrong data type added, try using an object.');
  let getAll = () => pokemonList;
  let find = pokemon =>
    pokemonList.filter((p) => p.name.toLowerCase().includes(pokemon.toLowerCase()));
  // 1.6 Adding buttons as list items to page per pokemon:
  //TODO 1.7.6: Edit showDetails() to load from API instead of static data
  // - call loadDetails(), pass Pokémon object as parameter
  // - Log result to console for now; display in interface later
  let showDetails = (p) => console.log(p); //print element in console
  let buttonClickHandler = (button, p) => button.addEventListener('click', ()=>showDetails(p));
  let addListItem = pokemon => {
    let pokList = document.querySelector(".pokemon-list");
    let listItem = document.createElement("li"); //adding to DOM
    let button = document.createElement("button");
    button.innerText = pokemon.name;
    button.classList.add("list-button");
    listItem.appendChild(button);
    pokList.appendChild(listItem);    
    buttonClickHandler(button, pokemon);
  }
  //TODO 1.7.3:
  // - Add functions LoadList() and loadDetails() to load data from an external source
  //   - LoadList: GET shorthand via fetch promise, then parse to object as promise via .json(),
  //     then access collection ('results' key as defined per payload),
  //     and add each object via add() using properties as in payload
  let LoadList = ()=> 
  fetch(apiUrl).then(res => res.json())
  .then(o => o.results.forEach(p => 
    add({ name: p.name, detailsUrl: p.url })
    // ;console.log({ name: p.name, detailsUrl: p.url });} // Functional testing
    )).catch(e =>console.error(e));
    //   - loadDetails: request details on p object, then parse to details object, 
    //     then add chosen details properties back to p object (map instead forEach)
  let loadDetails = p =>
    fetch(p.detailsUrl).then(res => res.json())
      .then(d =>{
        p.imgUrl = d.sprites.front_default,
        p.height = d.height,
        p.weight = d.weight,
        p.moves = d.moves.map(m => m.move.name).join(", "),
        p.types = d.types.map(t => t.type.name).join(", ")
      }).catch(e => console.error(e));
  // - Assign both functions to keys with the same name in the returned object
  //TODO 1.7.B: Display message while data is being loaded
  // - Implement showLoadingMessage() and hideLoadingMessage() to append/remove a message to the page
  // - In LoadList() and loadDetails(); showLoadingMessage() should be the first executed call
  //   - In their fetch() code's then() and catch() blocks; hideLoadingMessage() should be executed
  //     to hide the loading message after receiving the response from the fetch code 
  return {
    add: add,
    LoadList: LoadList,
    getAll: getAll,
    find: find,
    addListItem: addListItem,
    loadDetails: loadDetails
  }
})();

//TODO 1.7.4: Load list from server before rendering it here
// Functional tests:
// pokemonRepository.add(pokemonRepository.getAll()[3]); // Test adding (should work)
// pokemonRepository.add('beer'); // Test adding string (shouldn't work, but print error)
// console.log(pokemonRepository.find('Umbreon')); // Test find (should work)

// Content to page
// Preparing object-list for page and highlight outlier:
// 1.5:
// let pDocList = `<div class="pokemonList">\n<h1>Pokemon List</h1>\n<ul>`; // Title
// pokemonRepository.getAll().forEach(pokemon => {
//   let p = pokemon;
//   pDocList += p.height >= 1.0 ?
//   `<li><strong>Name: ${p.name}, height: ${p.height} - Wow, that's big</strong></li>\n` : // Highlighting special object
//   `<li>Name: ${p.name}, height: ${p.height}</li>\n`;
// });
// Adding content:
// document.write(pDocList + `\n</ul>\n</div>`);
// pokemonRepository.LoadList(); //Functional testing 1.7.3
pokemonRepository.getAll().forEach(pokemon => pokemonRepository.addListItem(pokemon)); // 1.6 call repo functions to add to page
//TODO 1.7.7: Check functionality:
// - Page should a list displaying all Pokémon
// - Once one is clicked, after short moment to load, console should show the returned Pokémon object.