let pokemonRepository = (() => {
  let pokemonList = []; // Creating list for custom objects
  let apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=150'; // To fetch name and detailsURL 

  let add = pokemon => typeof (pokemon) === 'object' ?
    pokemonList.push(pokemon) : reportError('Wrong data type added, try using an object.'); // Add one pokemon object
  let getAll = () => pokemonList;
  let find = pokemonName =>
    pokemonList.filter((p) => p.name.toLowerCase().includes(pokemonName.toLowerCase()))[0]; // Find 1st pokemon object by name
  let findIndex = pokemonName => pokemonList.indexOf(find(pokemonName)); // Get Index in pokemonList by name

  // Adding buttons as list items to page per pokemon
  let addListItem = pokemon => {
    let pokList = document.querySelector(".pokemon-list");
    let listItem = document.createElement("li"); // Adding to DOM
    let button = document.createElement("button");
    button.innerText = pokemon.name;
    button.classList.add("list-button");
    listItem.appendChild(button);
    pokList.appendChild(listItem);
    buttonClickHandler(button, pokemon);
  }
  // Function to handle click events on the list buttons
  let buttonClickHandler = (button, p) => button.addEventListener('click', () => showDetails(p));

  // Load data from an external source:
  // GET shorthand via fetch promise, then parse to object as promise via .json(),
  // then access collection ('results' key as defined per payload),
  // and add each object via add() using properties as in payload
  let LoadList = () => {
    showLoadingMessage(); // Show the loading message
    return fetch(apiUrl).then(res => res.json()) /* Fetch the list of pokemon from the API */
      .then(o => o.results.forEach(p =>
        add({ name: p.name, detailsUrl: p.url }) /* Add each pokemon to the pokemonList */
      )).catch(e => console.error(e))
      .finally(() => hideLoadingMessage());
  }

  // Request details on p object, then parse to details object, 
  // then add chosen details properties back to p object (map instead forEach)
  let loadDetails = p => {
    showLoadingMessage(p);
    return fetch(p.detailsUrl).then(res => res.json())
      .then(d => {
        p.imgUrl = d.sprites.front_default,
        p.height = d.height,
        p.weight = d.weight,
        p.moves = d.moves.map(m => m.move.name).join(", "),
        p.types = d.types.map(t => t.type.name).join(", ")
      }).catch(e => console.error(e))
      .finally(() => hideLoadingMessage());
  }

  let hideModal = () => document.querySelector("#modal-container").classList.remove("is-visible");
  let showModal = (title, text, extra = null) => {
    // Create modal elements (in box)
    let closeButtonElement = document.createElement("button");
    closeButtonElement.innerText = "Close";
    closeButtonElement.classList.add("modal-close");
    let modalTitle = document.createElement("h1");
    modalTitle.innerText = title;
    let modalText = document.createElement("p");
    modalText.innerText = text;
    let modalElements = [closeButtonElement, modalTitle, modalText];
    // Add details as extra elements
    if (extra) {
      let modalExtra = document.createElement("div");
      modalExtra.appendChild(extra);
      modalElements.push(modalExtra);
    }

    // Add elements to modal box (on to of its container)
    let modal = document.createElement("div");
    modalElements.forEach(element => modal.appendChild(element));
    modal.classList.add("modal");

    // Add modal to modal-container (clickable around modal box)
    let modalContainer = document.querySelector("#modal-container");
    modalContainer.innerHTML = ""; //Clear existing modals
    modalContainer.appendChild(modal); //Add new modal box
    modalContainer.classList.add("is-visible"); //Show

    // Add event listeners to the close button and the modal container
    closeButtonElement.addEventListener("click", hideModal); //Hide when button clicked
    modalContainer.addEventListener("click", e => { if (e.target === modalContainer) hideModal() }) //Hide when clicked
    window.addEventListener("keydown", e => { if (e.key === "Escape") hideModal() }); //Hide when Esc
  }
  // Function to show the details of a pokemon in the modal
  // - call loadDetails(), pass Pokémon object as parameter
  // - display in modal interface
  let showDetails = p => {
    loadDetails(p).then(() => { /* Load the details of the pokemon */
      let extraHTML = document.createElement("ul"); // Create the elements for the details
      // Add each detail to the list
      Object.keys(p).forEach(k => {
        let li = document.createElement("li");
        li.classList.add("details-item");
        let title = document.createElement("h3");
        title.classList.add("details-title");
        title.innerText = k.includes("detailsUrl") ? "source" : k;
        if (k === "name") {
          return;
        } else if (k === "imgUrl") {
          title.innerText = "";
          let image = document.createElement("img");
          image.src = p[k];
          image.alt = "image";
          li.appendChild(image);
        } else if (k === "moves") {
          let div = document.createElement("div");
          let paragraph = document.createElement("p");
          let truncatedText = p[k].split(',').slice(0, 10).join(', ') + '...';
          paragraph.innerText = truncatedText;
          div.appendChild(title);
          div.appendChild(paragraph);
          let button = document.createElement("a");
          button.innerText = "Show all";
          button.href = "#";
          button.addEventListener('click', e => {
            e.preventDefault();
            paragraph.innerText = p[k];
            button.style.display = 'none';
          });
          div.appendChild(button);
          li.appendChild(div);
        } else {
          let paragraph = document.createElement("p");
          paragraph.innerText = p[k];
          paragraph.classList.add("details-content");
          li.appendChild(paragraph);
        }
        extraHTML.appendChild(title);
        extraHTML.appendChild(li);
      });
      showModal(p.name, "Details:", extraHTML); // Show the modal with the details
    });
  }

  //#region Carousel
  // Swipe detection
  let startX = 0;
  let container = document.querySelector("#modal-container");
  container.addEventListener("touchstart", e => startX = e.changedTouches[0].screenX);
  container.addEventListener("touchend", e => updateCarousel(e.changedTouches[0].screenX - startX));
  // Slide display
  let updateCarousel = (change) => {
    let currentPokemonName = document.querySelector("#modal-container > .modal > h1").innerText;
    let currentIndex = findIndex(currentPokemonName); // Get index in pokemonList
    let nextIndex = (currentIndex + 1) % getAll().length; // Calc next, wrap end
    let prevIndex = (currentIndex - 1 + getAll().length) % getAll().length; // Calc previous in wrapped list
    if (change > 50) loadDetails(getAll()[prevIndex])
      .then(() => showDetails(getAll()[prevIndex])); // Get previous on swipe left if found/loading resolved
    else if (change < -50) loadDetails(getAll()[nextIndex])
      .then(() => showDetails(getAll()[nextIndex])); // Get next on swipe right
  }
  //#endregion Carousel

  // Displaying message while data is being loaded
  // - Implement showLoadingMessage() and hideLoadingMessage() to append/remove a message to the page
  // - In LoadList() and loadDetails(); showLoadingMessage() should be the first executed call
  //   - In their fetch() code's then() and catch() blocks; hideLoadingMessage() should be executed
  //     to hide the loading message after receiving the response from the fetch code 
  let showLoadingMessage = (p = null) => {
    let btn = p ? Array.from(document.querySelectorAll('button'))
      .find(b => b.innerText === p.name) : null;
    const loadingElement = document.createElement('span');
    loadingElement.innerText = 'Loading...';
    loadingElement.id = 'loading-message';
    if (btn) btn.parentNode.appendChild(loadingElement);
    else {
      loadingElement.id = 'loading-message_unspecific';
      document.createElement("p").appendChild(loadingElement);
    }
  }
  let hideLoadingMessage = () => {
    const loadingElement = document.getElementById('loading-message');
    if (loadingElement) loadingElement.remove();
  }
  // Return the public functions
  return {
    add: add,
    getAll: getAll,
    find: find,
    findIndex: findIndex,
    addListItem: addListItem,
    LoadList: LoadList,
    loadDetails: loadDetails,
  }
})();

// Load list from server as promise, before then calling the render of it here (insert)
pokemonRepository.LoadList().then(() =>
  pokemonRepository.getAll()
    .forEach(pokemon => pokemonRepository
      .addListItem(pokemon))); // Call repo functions to add to page