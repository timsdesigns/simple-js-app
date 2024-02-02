(() => {
  //#region Navbar dark mode
  let theme = localStorage.getItem('theme');
  if (theme === null || theme === undefined) {
    theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? "dark" : "light";
  }
  document.documentElement.setAttribute('data-bs-theme', theme);
  themeSwitch = document.getElementById('themeSwitcher');
  themeSwitch.checked = theme === "light";

  themeSwitch.addEventListener('change', () => {
    let newTheme = themeSwitch.checked ? "light" : "dark";
    document.documentElement.setAttribute('data-bs-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    console.log("localStorage.getItem('theme') set to:" + newTheme);
  });
  //#endregion Navbar dark mode

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
      let listItem = document.createElement("div"); // Adding to DOM
      listItem.className = "col-sm";
      let button = document.createElement("button");
      button.innerText = pokemon.name;
      //button.classList.add("list-button");
      //button.classList.add("btn");  // Adding Bootstrap
      //button.classList.add("list-group-item", "badge", "bg-primary", "rounded-pill");  // Adding Bootstrap
      //button.classList.add("d-flex", "align-items-center", "py-2");  // Adding Bootstrap
      button.classList.add(
        "btn", "btn-primary", "rounded-pill", "text-white", "my-2", "fw-bold",
        "px-3", "btn-fixed-min-width");
      listItem.appendChild(button);
      pokList.appendChild(listItem);
      // Bootstrap version
      //buttonClickHandler(button, pokemon);
      button.classList.add("btn-primary");
      button.setAttribute("data-bs-toggle", "modal");
      button.setAttribute("data-bs-target", "#exampleModal");
      buttonClickHandlerBs(button, pokemon);
    }
    // Function to handle click events on the list buttons
    let buttonClickHandler = (button, p) => button.addEventListener('click', () => showDetails(p));
    let buttonClickHandlerBs = (button, p) => button.addEventListener('click', () => showDetailsBs(p));

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
      let modalElements = [closeButtonElement, modalTitle, modalText]; // button, h1, p
      // Add details as extra elements
      if (extra) {
        let modalExtra = document.createElement("div"); // div with 
        modalExtra.appendChild(extra);
        modalElements.push(modalExtra);
      }

      // Add elements to modal box (on top of its container)
      let modal = document.createElement("div");
      modalElements.forEach(element => modal.appendChild(element));
      modal.classList.add("modal");

      // Add modal to modal-container (clickable around modal box)
      let modalContainer = document.querySelector("#modal-container");
      //modalContainer.innerHTML = ""; //Clear existing modals
      modalContainer.appendChild(modal); //Add new modal box
      modalContainer.classList.add("is-visible"); //Show

      // Add event listeners to the close button and the modal container
      closeButtonElement.addEventListener("click", hideModal); //Hide when button clicked
      modalContainer.addEventListener("click", e => { if (e.target === modalContainer) hideModal() }) //Hide when clicked
      window.addEventListener("keydown", e => { if (e.key === "Escape") hideModal() }); //Hide when Esc
    }

    // Functions to show the Bootstrap version
    let showModalBS = (title, text, extra = null) => {
      // Top row in modal box
      let modalHeaderBs = document.querySelector(".modal-header");
      let modalTitleBs = document.querySelector(".modal-title");
      // Image & list with detail names and details
      let modalBodyBs = document.querySelector(".modal-body");

      modalTitleBs.innerHTML = "";
      modalBodyBs.innerHTML = "";

      // Create modal elements (in header)
      let modalTitle = document.createElement("h1");
      modalTitle.innerText = title;
      modalTitleBs.appendChild(modalTitle);

      // Create modal elements (in box)
      let modalText = document.createElement("p");
      modalText.innerText = text;

      let modalElements = [modalText]; // [p]
      // Add details as extra elements
      if (extra) {
        let modalExtra = document.createElement("div"); // div with details
        modalExtra.appendChild(extra);
        modalElements.push(modalExtra); // [p, ]
      }
      // Add elements to modal-body (on top of its container)
      modalElements.forEach(element => modalBodyBs.appendChild(element));
    }
    let showDetailsBs = p => {
      loadDetails(p).then(() => {
        let extraHTML = document.createElement("ul");
        Object.keys(p).forEach(k => {
          // Add details to unordered list
          let li = document.createElement("li");
          li.classList.add("details-item");
          li.classList.add("list-group-item");
          li.classList.add("d-flex");
          li.classList.add("align-items-center");
          let propTitle = document.createElement("h3");
          propTitle.classList.add("details-title");
          propTitle.innerText = k.includes("detailsUrl") ? "source" : k;
          li.appendChild(propTitle);

          if (k === "name") return; // already in title
          else if (k === "imgUrl") {
            propTitle.innerText = ""; // image speaks for itself
            let image = document.createElement("img");
            image.src = p[k];
            image.alt = "image of pokemon";
            image.classList.add("details-content", "text-center", "text-justify");
            li.appendChild(image);
          } else if (k === "moves") {
            let div = document.createElement("div");
            div.classList.add("d-flex", "justify-content-between", "align-items-center", "flex-grow-1");
            div.appendChild(propTitle);

            let buttonWrap = document.createElement("a");
            buttonWrap.href = "#";
            buttonWrap.classList.add("details-content", "text-center", "text-justify", "mx-auto"); // mx to center

            let truncatedText = document.createElement("span");
            truncatedText.classList.add("badge", "bg-primary", "rounded-pill");
            truncatedText.innerText = p[k].length;
            buttonWrap.appendChild(truncatedText);

            let toggleFullText = true;
            buttonWrap.addEventListener('click', e => {
              e.preventDefault();
              if (toggleFullText) {
                truncatedText.classList.add("d-block");
                truncatedText.classList.remove("rounded-pill");
                truncatedText.classList.remove("badge");
                truncatedText.innerText = p[k];
                toggleFullText = false;
              } else {
                truncatedText.innerText = p[k].length;
                truncatedText.classList.add("badge");
                truncatedText.classList.add("rounded-pill");
                toggleFullText = true;
              }
              //buttonWrap.style.display = 'none';
            });

            div.appendChild(buttonWrap);
            li.appendChild(div);
          } else {
            let paragraph = document.createElement("p");
            paragraph.innerText = p[k];
            paragraph.classList.add("details-content", "text-center", "text-justify", "flex-grow-1");
            li.appendChild(paragraph);
          }
          extraHTML.appendChild(li);
        });
        showModalBS(p.name, "Details:", extraHTML);
      });
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
          li.appendChild(title);

          if (k === "name") {
            return;
          } else if (k === "imgUrl") {
            title.innerText = "";
            let image = document.createElement("img");
            image.src = p[k];
            image.alt = "image";
            li.appendChild(image);
          } else if (k === "moves") {
            // replace preview if clicked
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
          extraHTML.appendChild(li);
        });
        showModal(p.name, "Details:", extraHTML); // Show the modal with the details
      });
    }

    //#region Carousel
    // Swipe detection
    let startX = 0;
    // let container = document.querySelector("#modal-container");
    // let container = document.getElementById("#exampleModal"); // Bootstrap
    let container = document.querySelector(".modal");
    if (container != null) {
      container.addEventListener("touchstart", e => startX = e.changedTouches[0].screenX);
      container.addEventListener("touchend", e => updateCarousel(e.changedTouches[0].screenX - startX));
      // Slide display
      let updateCarousel = (change) => {
        // let currentPokemonName = document.querySelector("#modal-container > .modal > h1").innerText;
        let currentPokemonName = document.querySelector(".modal-title").innerText;
        let currentIndex = findIndex(currentPokemonName); // Get index in pokemonList
        let nextIndex = (currentIndex + 1) % getAll().length; // Calc next, wrap end
        let prevIndex = (currentIndex - 1 + getAll().length) % getAll().length; // Calc previous in wrapped list
        if (change > 50) loadDetails(getAll()[prevIndex])
          // .then(() => showDetails(getAll()[prevIndex])); // Get previous on swipe left if found/loading resolved
          .then(() => showDetailsBs(getAll()[prevIndex])); // Get previous on swipe left if found/loading resolved
        else if (change < -50) loadDetails(getAll()[nextIndex])
          // .then(() => showDetails(getAll()[nextIndex])); // Get next on swipe right
          .then(() => showDetailsBs(getAll()[nextIndex])); // Get next on swipe right
      }
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
})();