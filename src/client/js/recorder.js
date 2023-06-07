const $startBtn = document.querySelector("#startBtn");
const $preview = document.querySelector("#preview");

let stream;
let recorder;

const handleStop = () => {
  $startBtn.innerText = "Start Recording";
  $startBtn.removeEventListener("click", handleStop);
  $startBtn.addEventListener("click", handleStart);
};

const handleStart = () => {
  $startBtn.innerText = "Stop Recording";
  $startBtn.removeEventListener("click", handleStart);
  $startBtn.addEventListener("click", handleStop);
  recorder = new MediaRecorder(stream);
  recorder.ondataavailable = (e) => {
    const video = URL.createObjectURL();
  };
  recorder.start();
  setTimeout(() => {
    recorder.stop();
  }, 10000);
};

const init = async () => {
  stream = await navigator.mediaDevices.getUserMedia({
    audio: true,
    video: true,
  });
  $preview.srcObject = stream;
  $preview.play();
};
init();

$startBtn.addEventListener("click", handleStart);
