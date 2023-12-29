let pokemonRepository = (function(){
  let pokemonList = []; // Creating list of custom objects
    pokemonList[0] = {
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
  }
  function getAll(){ return pokemonList; } 
  // function add(pokemon){ pokemonList.push(pokemon); }
  let add = pokemon => pokemonList.push(pokemon);
  return {
    getAll: getAll,
    add: add
  }
})();
// pokemonRepository.add(pokemonRepository.getAll()[3]); // Test adding
// Preparing object-list for page and highlight outlier:
let pDocList = `<div class="pokemonList">\n<h1>Pokemon List</h1>\n<ul>`; // Title
pokemonRepository.getAll().forEach(pokemon => {
  let p = pokemon;
  pDocList += p.height >= 1.0 ?
  `<li><strong>Name: ${p.name}, height: ${p.height} - Wow, that's big</strong></li>\n` : // Highlighting special object
  `<li>Name: ${p.name}, height: ${p.height}</li>\n`;
});
// Adding content:
document.write(pDocList + `\n</ul>\n</div>`);

