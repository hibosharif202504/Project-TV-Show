//You can edit ALL of the code here
const AllEpisodes = getAllEpisodes();
makePageForEpisodes(AllEpisodes);
//Making a search box for displaying episodes based on search input
function setup(){
  const searchInput =document.createElement("input");
  searchInput.type = "text"
  searchInput.placeholder ="Search Episodes...."
  searchInput.id = "search-input"  //allows you to refer to the element later using:document.getElementbyID.

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
      episode.summary.toLowerCase().includes(searchTerm)
    );
  });

  countDisplay.textContent = `We have Found ${filteredEpisodes.length} episode(s)`;

  makePageForEpisodes(filteredEpisodes);


})
}

function makePageForEpisodes(episodeList) {
  
  const rootElem = document.getElementById("root");
  rootElem.innerHTML = ""; 

  episodeList.forEach((episode) => {
    const episodeDiv = document.createElement("div");
    episodeDiv.className = "episode-card";

    const season = String(episode.season).padStart(2, "0");
    const number = String(episode.number).padStart(2, "0");
    const episodeCode = `S${season}E${number}`;

    episodeDiv.textContent = `${episodeCode} - ${episode.name}`;

    const imageElement = document.createElement("img");
    imageElement.src = episode.image.medium;
    episodeDiv.appendChild(imageElement);

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
