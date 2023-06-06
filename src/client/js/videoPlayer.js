const $videoContainer = document.querySelector("#videoContainer");
const video = document.querySelector("video");
const videoController = document.querySelector("#videoController");
const psBtn = videoController.querySelector("#playPauseBtn");
const volumeBtn = videoController.querySelector("#volume");
const volumeRange = videoController.querySelector("#volumeRange");
const $currentTime = videoController.querySelector("#currentTime");
const $totalTime = videoController.querySelector("#totalTime");
const $timeLine = videoController.querySelector("#timeLine");
const $fullScreen = videoController.querySelector("#fullScreen");

let controlsTimeout = null;
let volumeValue = 0.5;
video.volume = volumeValue;

const formatTime = (sec) => new Date(sec * 1000).toISOString().substr(11, 8);

const handlePlayAndStop = () => {
  if (video.paused) {
    video.play();
    psBtn.className = "fas fa-pause";
  } else {
    video.pause();
    psBtn.className = "fas fa-play";
  }
};
const handleEnded = () => {
  psBtn.className = "fas fa-play";
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
    volumeRange.value = volumeValue;
    volumeBtn.className = "fas fa-volume-up";
  } else {
    video.muted = true;
    volumeRange.value = 0;
    volumeBtn.className = "fas fa-volume-mute";
  }
};

const handleVolume = (event) => {
  const {
    target: { value },
  } = event;
  if (video.muted) {
    video.muted = false;
    volumeBtn.className = "fas fa-volume-mute";
  }
  if (value === "0") {
    volumeBtn.className = "fas fa-volume-off";
  } else {
    volumeBtn.className = "fas fa-volume-up";
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
const handleMouseMove = () => {
  if (controlsTimeout) {
    clearTimeout(controlsTimeout);
    controlsTimeout = null;
  }
  videoController.classList.add("active");
  controlsTimeout = setTimeout(() => {
    videoController.classList.remove("active");
  }, 7000);
};
const handleMouseLeave = () => {
  controlsTimeout = setTimeout(() => {
    videoController.classList.remove("active");
  }, 3000);
};

psBtn.addEventListener("click", handlePlayAndStop);
volumeBtn.addEventListener("click", handleSound);
volumeRange.addEventListener("input", handleVolume);
video.addEventListener("loadedmetadata", handleLoadedMetadata);
video.addEventListener("timeupdate", handleTimeUpdate);
$timeLine.addEventListener("input", handleTimeLineChange);
$fullScreen.addEventListener("click", handleFullScreen);
document.addEventListener("keyup", handleKey);
video.addEventListener("ended", handleEnded);
video.addEventListener("mousemove", handleMouseMove);
video.addEventListener("mouseleave", handleMouseLeave);
