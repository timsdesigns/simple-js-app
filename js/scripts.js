// Creating list of custom objects
let pokemonList = [];
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

// Adding object-list to page and highlight outlier:
let pDocList = `<div class="pokemonList">\n<h1>Pokemon List</h1>\n<ul>`;
for (let i = 0; i < pokemonList.length; i++) {
  let p = pokemonList[i];
  pDocList += p.height >= 1.0 ?
  `<li><strong>Name: ${p.name}, height: ${p.height} - Wow, that's big</strong></li>\n` : // Highlighting a special object from list
  `<li>Name: ${p.name}, height: ${p.height}</li>\n`;
}
document.write(pDocList + `\n</ul>\n</div>`);

