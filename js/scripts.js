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

    //#region Utility functions
    let add = pokemon => typeof (pokemon) === 'object' ?
      pokemonList.push(pokemon) : reportError('Wrong data type added, try using an object.'); // Add one pokemon object
    let getAll = () => pokemonList;
    let find = pokemonName =>
      pokemonList.filter((p) => p.name.toLowerCase().includes(pokemonName.toLowerCase()))[0]; // Find 1st pokemon object by name
    let findIndex = pokemonName => pokemonList.indexOf(find(pokemonName)); // Get Index in pokemonList by name
    //#endregion Utility functions

    //#region Fill page
    // Adding buttons as divs to page per pokemon
    let addListItem = pokemon => {
      let pokList = document.querySelector(".pokemon-list");
      let listItem = document.createElement("div"); // Adding to DOM
      /* 
          12/12 => 100% column-screen-width on custom extra small devices (<319px)
          6/12  => 1/2 on extra small     (<576px)
          4/12  => 1/3 on small devices   (≥576px)
          3/12  => 1/4 on medium devices  (≥768px)
          2/12  => 1/6 on large devices   (≥992px)
      */
      listItem.className = "col-custom col-6 col-sm-4 col-md-3 col-lg-2";
      let button = document.createElement("button");
      button.innerText = pokemon.name;
      /* bootstrap-btn, blue, pill-shape, white-text, top+button-margin, font-weight, left+right-padding, constant-width+transparency */
      button.classList.add(
        "btn", "btn-primary", "rounded-pill", "text-white", "my-2", "fw-bold",
        "px-3", "btn-fixed-min-width");
      listItem.appendChild(button);
      pokList.appendChild(listItem);
      button.classList.add("btn-primary");
      button.setAttribute("data-bs-toggle", "modal");
      button.setAttribute("data-bs-target", "#exampleModal");
      buttonClickHandlerBs(button, pokemon);
    }
    // Function to handle click events on the list buttons
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
    //#endregion Fill page

    //#region Details
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

    // Functions to show the Bootstrap modal
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
          li.classList.add("details-item", "list-group-item", "d-flex", "align-items-center");
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
    //#endregion Details

    //#region Carousel
    // Swipe detection
    let startX = 0;
    let container = document.querySelector(".modal");
    if (container != null) {
      container.addEventListener("touchstart", e => startX = e.changedTouches[0].screenX);
      container.addEventListener("touchend", e => updateCarousel(e.changedTouches[0].screenX - startX));
      // Slide display
      let updateCarousel = (change) => {
        let currentPokemonName = document.querySelector(".modal-title").innerText;
        let currentIndex = findIndex(currentPokemonName); // Get index in pokemonList
        let nextIndex = (currentIndex + 1) % getAll().length; // Calc next, wrap end
        let prevIndex = (currentIndex - 1 + getAll().length) % getAll().length; // Calc previous in wrapped list
        if (change > 50) loadDetails(getAll()[prevIndex])
          .then(() => showDetailsBs(getAll()[prevIndex])); // Get previous on swipe left if found/loading resolved
        else if (change < -50) loadDetails(getAll()[nextIndex])
          .then(() => showDetailsBs(getAll()[nextIndex])); // Get next on swipe right
      }
    }
    //#endregion Carousel


    //#region Loading message
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
    //#endregion Loading message

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