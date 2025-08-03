let AllShows = []
let AllEpisodes = [];
let episodesCache = {};

function populateShowSelector(){
  fetch("https://api.tvmaze.com/shows")
  .then((response)=>{
    if(!response.ok){
      throw new Error(
        "Oops! Something went wrong while loading the shows"
      )
    }
    return response.json()
  })
  .then((showsData)=>{
    AllShows = showsData;
    // Sort alphabetically by name (case-insensitive)
    AllShows.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
    makePageForShows(AllShows)

    const showSelector = document.getElementById("show-selector");

    // Clear all options except the first one (if any)
    showSelector.innerHTML = '<option value="default">Select a show...</option>';

    AllShows.forEach((show) => {
      const option = document.createElement("option");
      option.value = show.id;
      option.textContent = show.name;
      showSelector.appendChild(option);
    });
    showSelector.addEventListener("change", (event) => {
        const showId = event.target.value;
        if (showId === "default") return;

        if (episodesCache[showId]) {
          // Use cached episodes if available
          AllEpisodes = episodesCache[showId];
          updateUIForEpisodes();
        } else {
          // Fetch episodes and cache them
          fetch(`https://api.tvmaze.com/shows/${showId}/episodes`)
            .then((res) => {
              if (!res.ok) throw new Error("Failed to load episodes");
              return res.json();
            })
            .then((episodes) => {
              episodesCache[showId] = episodes;
              AllEpisodes = episodes;
              updateUIForEpisodes();
            })
            .catch((error) => console.error(error));
        }
      });
    })
    .catch((error) => console.error(error));
}

function updateUIForEpisodes() {
  clearEpisodeSelector();
  clearSearchInput();
  createSearchAndDropdown();
  makePageForEpisodes(AllEpisodes);
  updateEpisodesCount(AllEpisodes.length, AllEpisodes.length);
}


function setup() {
    //Show Selector UI
    createShowSelectorPlaceholder()
    //Calling it here to fetch and populate shows.
    populateShowSelector()
}
//Creating a placeholder for Show Selector
function createShowSelectorPlaceholder(){
  const select = document.createElement("select")
  select.id = "show-selector"
  const showOption = document.createElement("option");
  showOption.value = "default";
  showOption.textContent = "Select a show...";
  select.appendChild(showOption);
  const searchInput = document.getElementById("search-input");
  const rootElem = document.getElementById("root");

  if (searchInput) {
    document.body.insertBefore(select, searchInput);
  } else {
  // fallback, just insert before the episode root if search doesn't exist yet
    document.body.insertBefore(select, rootElem);
  }
}

//Making a search box for displaying episodes based on search input
function createSearchAndDropdown() {
  const searchInput = document.createElement("input");
  searchInput.type = "text";
  searchInput.placeholder = "Search Episodes....";
  searchInput.id = "search-input"; //allows you to refer to the element later using:document.getElementbyID.

  //Display count of how many episodes are shown

  const countDisplay = document.createElement("p");
  countDisplay.id = "episode-count";

  //Adding searchInput and countDisplay in DOM to show up before episodecards.

  const rootElem = document.getElementById("root");
  document.body.insertBefore(searchInput, rootElem);
  document.body.insertBefore(countDisplay, rootElem);

  //Adding Input Event Listener

  searchInput.addEventListener("input", () => {
    const searchTerm = searchInput.value.toLowerCase();
    const filteredEpisodes = AllEpisodes.filter((episode) => {
      return (
        episode.name.toLowerCase().includes(searchTerm) ||
        (episode.summary && episode.summary.toLowerCase().includes(searchTerm))
      );
    });

    updateEpisodesCount(filteredEpisodes.length, AllEpisodes.length);
    makePageForEpisodes(filteredEpisodes);

    const selector = document.getElementById("episode-selector");
    if (selector) selector.value = "all";
  });
  // Call episodeSelector here so dropdown gets created on page load
  createEpisodeSelector();
}
function createEpisodeSelector() {
  const select = document.createElement("select");
  select.id = "episode-selector";

  const allOption = document.createElement("option");
  allOption.value = "all";
  allOption.textContent = "Show All Episodes";
  select.appendChild(allOption);

  AllEpisodes.forEach((episode) => {
    const episodeOption = document.createElement("option");
    const episodeCode = getEpisodeCode(episode);
    episodeOption.value = episodeCode;
    episodeOption.textContent = `${episodeCode} -  ${episode.name}`;
    select.appendChild(episodeOption);
  });
  const rootElm = document.getElementById("root");
  document.body.insertBefore(select, rootElm);

  select.addEventListener("change", () => {
    const selectedCode = select.value;
    const searchInput = document.getElementById("search-input");

    if (selectedCode === "all") {
      makePageForEpisodes(AllEpisodes);
      updateEpisodesCount(AllEpisodes.length, AllEpisodes.length);
    } else {
      const filteredEpisodes = AllEpisodes.filter(
        (episode) => getEpisodeCode(episode) === selectedCode
      );
      makePageForEpisodes(filteredEpisodes);
      updateEpisodesCount(filteredEpisodes.length, AllEpisodes.length);
    }
    if (searchInput) searchInput.value = "";
  });
}
//Function for making an episode code so that we can recall it.

function getEpisodeCode(episode) {
  const season = String(episode.season).padStart(2, "0");
  const number = String(episode.number).padStart(2, "0");
  return `S${season}E${number}`;
}

function updateEpisodesCount(showing, total) {
  const countDisplay = document.getElementById("episode-count");
  if (countDisplay) {
    countDisplay.textContent = `Displaying ${showing} / ${total} episodes`;
  }
}
//clear functions
function clearEpisodeSelector() {
  const episodeSelector = document.getElementById("episode-selector");
  if (episodeSelector) { 
    episodeSelector.remove();
  }
}

function clearSearchInput() {
  const searchInput = document.getElementById("search-input");
  if (searchInput) {
    searchInput.remove();
  }

  const countDisplay = document.getElementById("episode-count");
  if (countDisplay) {
    countDisplay.remove();
  }
}
function makePageForShows(showList) {
  const rootElem = document.getElementById("root");
  rootElem.innerHTML = ""; // Clear root content

  showList.forEach((show) => {
    const showCard = document.createElement("div");
    showCard.className = "episode-card"; // Reuse the styling

    const title = document.createElement("h4");
    title.textContent = show.name;
    showCard.appendChild(title);

    if (show.image && show.image.medium) {
      const image = document.createElement("img");
      image.src = show.image.medium;
      image.alt = show.name;
      showCard.appendChild(image);
    }

    const summary = document.createElement("div");
    summary.innerHTML = show.summary || "No description available.";
    showCard.appendChild(summary);

    rootElem.appendChild(showCard);
  });
}
function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");
  // Clear previous episodes before rendering new ones to avoid duplicates
  rootElem.innerHTML = "";

  episodeList.forEach((episode) => {
    const episodeDiv = document.createElement("div");
    episodeDiv.className = "episode-card";

    const episodeCode = getEpisodeCode(episode);
    episodeDiv.id = episodeCode;

    // title element
    const titleElement = document.createElement("h4");
    titleElement.textContent = `${episodeCode} - ${episode.name}`;
    episodeDiv.appendChild(titleElement);

    if (episode.image && episode.image.medium) {
      const imageElement = document.createElement("img");
      imageElement.src = episode.image.medium;
      imageElement.alt = episode.name;
      episodeDiv.appendChild(imageElement);
    }
    const episodeSummary = document.createElement("div");
    episodeSummary.innerHTML = episode.summary;
    episodeDiv.appendChild(episodeSummary);

    rootElem.appendChild(episodeDiv);
  });
  // Add footer only if it doesn't already exist to avoid duplicates
  // This ensures we don't append multiple footers every time the episodes re-render
  if (!document.querySelector("footer")) {
    const footer = document.createElement("footer");
    footer.innerHTML = `Data from <a href="https://www.tvmaze.com/api" target="_blank">TVMaze.com</a>`;
    document.body.appendChild(footer);
  }
}

window.onload = setup;
