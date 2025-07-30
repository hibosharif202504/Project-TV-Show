function setup() {
  const rootElem = document.getElementById("root");
}

function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");
  rootElem.textContent = `Got ${episodeList.length} episode(s)`;

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

  const footer = document.createElement("footer");
  footer.innerHTML = `Data from <a href="https://www.tvmaze.com/api" target="_blank">TVMaze.com</a>`;
  document.body.appendChild(footer);
}

window.onload = setup;
