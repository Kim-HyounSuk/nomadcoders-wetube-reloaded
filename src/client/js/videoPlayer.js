const $videoContainer = document.querySelector("#videoContainer");
const video = document.querySelector("video");
const $videoController = document.querySelector("#videoController");
const $playBtn = $videoController.querySelector("#playPauseBtn");
const $volumeBtn = $videoController.querySelector("#volume");
const $volumeRange = $videoController.querySelector("#volumeRange");
const $currentTime = $videoController.querySelector("#currentTime");
const $totalTime = $videoController.querySelector("#totalTime");
const $timeLine = $videoController.querySelector("#timeLine");
const $fullScreen = $videoController.querySelector("#fullScreen");

let controlsTimeout = null;
let controlsMovementTimeout = null;
let volumeValue = 0.5;
video.volume = volumeValue;

const formatTime = (sec) => new Date(sec * 1000).toISOString().substr(14, 5);

const handlePlayAndStop = () => {
  if (video.paused) {
    video.play();
  } else {
    video.pause();
  }
  $playBtn.className = video.paused ? "fas fa-play" : "fas fa-pause";
};

const handleEnded = async () => {
  const { id } = $videoContainer.dataset;
  await fetch(`/api/videos/${id}/view`, {
    method: "POST",
  });
  $playBtn.className = "fas fa-play";
};

const handleKey = (e) => {
  e.preventDefault();
  if (e.code === "Space") {
    handlePlayAndStop();
  }
  if (e.code === "KeyF") {
    if (!document.fullscreenElement) {
      $videoContainer.requestFullscreen();
      $fullScreen.className = "fas fa-compress";
    }
  }
  if (e.code === "Escape") {
    if (document.fullscreenElement) {
      document.exitFullscreen();
      $fullScreen.className = "fas fa-expand";
    }
  }
};

const handleSound = () => {
  if (video.muted) {
    video.muted = false;
    $volumeRange.value = volumeValue;
    $volumeBtn.className = "fas fa-volume-up";
  } else {
    video.muted = true;
    $volumeRange.value = 0;
    $volumeBtn.className = "fas fa-volume-mute";
  }
};

const handleVolume = (event) => {
  const {
    target: { value },
  } = event;
  if (video.muted) {
    video.muted = false;
    $volumeBtn.className = "fas fa-volume-mute";
  }
  if (value === "0") {
    $volumeBtn.className = "fas fa-volume-off";
  } else {
    $volumeBtn.className = "fas fa-volume-up";
  }
  video.volume = volumeValue = value;
};

const handleLoadedMetadata = () => {
  $totalTime.innerText = formatTime(Math.floor(video.duration));
  $timeLine.max = Math.floor(video.duration);
};

const handleTimeUpdate = () => {
  $currentTime.innerText = formatTime(Math.floor(video.currentTime));
  $timeLine.value = Math.floor(video.currentTime);
};

const handleTimeLineChange = (e) => {
  video.currentTime = e.target.value;
};

const handleFullScreen = () => {
  const fullscreen = document.fullscreenElement;
  if (fullscreen) {
    document.exitFullscreen();
    $fullScreen.className = "fas fa-expand";
  } else {
    $videoContainer.requestFullscreen();
    $fullScreen.className = "fas fa-compress";
  }
};
const hideControls = () => $videoController.classList.remove("active");
const handleMouseMove = () => {
  if (controlsTimeout) {
    clearTimeout(controlsTimeout);
    controlsTimeout = null;
  }
  if (controlsMovementTimeout) {
    clearTimeout(controlsMovementTimeout);
    controlsMovementTimeout = null;
  }
  $videoController.classList.add("active");
  controlsMovementTimeout = setTimeout(hideControls, 3000);
};
const handleMouseLeave = () => {
  controlsTimeout = setTimeout(hideControls, 3000);
};

$playBtn.addEventListener("click", handlePlayAndStop);
$volumeBtn.addEventListener("click", handleSound);
$volumeRange.addEventListener("input", handleVolume);
video.addEventListener("loadedmetadata", handleLoadedMetadata);
video.addEventListener("timeupdate", handleTimeUpdate);
video.addEventListener("ended", handleEnded);
$timeLine.addEventListener("input", handleTimeLineChange);
$fullScreen.addEventListener("click", handleFullScreen);
$videoContainer.addEventListener("mousemove", handleMouseMove);
$videoContainer.addEventListener("mouseleave", handleMouseLeave);
