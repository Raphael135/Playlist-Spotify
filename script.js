const songName = document.getElementById("music-info");
const bandName = document.getElementById("band-name");
const song = document.getElementById("audio");
const cover = document.getElementById("cover");
const play = document.getElementById("play");
const next = document.getElementById("next");
const previous = document.getElementById("previous");
const currentProgress = document.getElementById("current-progress");
const progresscontainer = document.getElementById("progress-container");
const shuffleButton = document.getElementById("shuffle");
const likeButton = document.getElementById("like");
const repeatButton = document.getElementById("repeat");
const songTime = document.getElementById("song-time");
const totalTime = document.getElementById("total-time");
const volumeSlider = document.getElementById("volume-slider");
const songSound = document.getElementById("audio");

volumeSlider.addEventListener("input", () => {
  songSound.volume = volumeSlider.value;
});

const coverImage = document.getElementById("cover");
const body = document.body;
const colorThief = new ColorThief();

// Condições para usar fundo dinâmico
coverImage.onload = function () {
  const colors = colorThief.getPalette(coverImage, 2); // Extrai duas cores principais

  const color1 = `rgb(${colors[0][0]}, ${colors[0][1]}, ${colors[0][2]})`;
  const color2 = `rgb(${colors[1][0]}, ${colors[1][1]}, ${colors[1][2]})`;

  body.style.background = `linear-gradient(${color1}, ${color2})`;
};

const pontesIndestrutiveis = {
  songName: "Pontes Indestrutíveis",
  artist: "Charlie Brow Jr.",
  file: "charlie-brow2",
};

const diasDeLuta = {
  songName: "Dias De Luta, Dias De Gloria",
  artist: "Charlie Brow Jr.",
  file: "charlie-brow",
};

const backslide = {
  songName: "Backslide",
  artist: "Twenty One Pilots",
  file: "backslide",
};

const playlist = [pontesIndestrutiveis, diasDeLuta, backslide];
let sortedPlaylist = [...playlist]; // Espalha a playlist
let index = 0;

let isPlaying = false;
let isShuffled = false;

// Favorito/Like
let isLike = false;

// Repetição
let repeatOn = false;

// Toca a música
function playSong() {
  play.querySelector(".bi").classList.remove("bi-play-circle-fill");
  play.querySelector(".bi").classList.add("bi-pause-circle-fill");
  song.play();
  isPlaying = true;
}

// Pausa a música
function pauseSong() {
  play.querySelector(".bi").classList.add("bi-play-circle-fill");
  play.querySelector(".bi").classList.remove("bi-pause-circle-fill");
  song.pause();
  isPlaying = false;
}

function playPauseDecider() {
  if (isPlaying == true) {
    pauseSong();
  } else {
    playSong();
  }
}

function loadSong() {
  cover.src = `img/${playlist[index].file}.jpg`;
  song.src = `music/${playlist[index].file}.mp3`;
  songName.innerText = playlist[index].songName;
  bandName.innerText = playlist[index].artist;
}

function previousSong() {
  if (index === 0) {
    index = playlist.length - 1;
  } else {
    index -= 1;
  }
  loadSong();
  playSong();
}

function nextSong() {
  if (index === playlist.length - 1) {
    index = 0;
  } else {
    index++;
  }
  loadSong();
  playSong();
}

function updateProgess() {
  const barWhidth = (song.currentTime / song.duration) * 100;
  currentProgress.style.setProperty("--progress", `${barWhidth}%`);
  songTime.innerText = toHHMMSS(song.currentTime);
}

function jumpTo(event) {
  const width = progresscontainer.clientWidth;
  const clickPosition = event.offsetX;
  const jumpToTime = (clickPosition / width) * song.duration;
  song.currentTime = jumpToTime;
}

function shuffleArray(preShuffleArray) {
  const size = preShuffleArray.length;
  let currentIndex = size - 1;
  while (currentIndex > 0) {
    let randomIndex = Math.floor(Math.random() * size);
    let aux = preShuffleArray[currentIndex];
    preShuffleArray[currentIndex] = preShuffleArray[randomIndex];
    preShuffleArray[randomIndex] = aux;
    currentIndex -= 1;
  }
}

function shuffleButtonClicked() {
  if (isShuffled === false) {
    isShuffled = true;
    shuffleArray(sortedPlaylist);
    shuffleButton.classList.add("button-active");
  } else {
    isShuffled = false;
    sortedPlaylist = [...playlist];
    shuffleButton.classList.remove("button-active");
  }
}

function likeButtonCheck() {
  if (isLike === false) {
    isLike = true;
    likeButton.classList.add("button-like");
  } else {
    isLike = false;
    likeButton.classList.remove("button-like");
  }
}

function repeatButtonCliked() {
  if (repeatOn === false) {
    repeatOn = true;
    repeatButton.classList.add("repeatButton");
  } else {
    repeatOn = false;
    repeatButton.classList.remove("repeatButton");
  }
}

// Ao carregar a página, nenhum botão fique marcado
window.onload = function () {
  repeatButton.classList.remove("repeatButton");
  shuffleButton.classList.remove("button-active");
  likeButton.classList.remove("button-like");
};

function nextOrRepeat() {
  if (repeatOn === false) {
    nextSong();
  } else {
    playSong();
  }
}

function toHHMMSS(originalNumber) {
  let hours = Math.floor(originalNumber / 3600);
  let min = Math.floor((originalNumber - hours * 3600) / 60);
  let secs = Math.floor(originalNumber - hours * 3600 - min * 60);

  return `${hours.toString().padStart(2, "0")}: ${min
    .toString()
    .padStart(2, "0")}: ${secs.toString().padStart(2, "0")}`;
}

function updateTotalTime() {
  totalTime.innerText = toHHMMSS(song.duration);
}

loadSong();
document.body.style.zoom = "80%";

play.addEventListener("click", playPauseDecider);
previous.addEventListener("click", previousSong);
next.addEventListener("click", nextSong);
song.addEventListener("timeupdate", updateProgess);
song.addEventListener("ended", nextOrRepeat);
song.addEventListener("loadedmetadata", updateTotalTime);
progresscontainer.addEventListener("click", jumpTo);
shuffleButton.addEventListener("click", shuffleButtonClicked);
likeButton.addEventListener("click", likeButtonCheck);
repeatButton.addEventListener("click", repeatButtonCliked);
