let metronome = new Metronome();
let tempo = document.getElementById("tempo");
tempo.textContent = metronome.tempo;

let statusIcon = document.getElementById("status-icon");

let playButton = document.getElementById("play-button");
playButton.addEventListener("click", function () {
  metronome.toggleStartStop();

  if (metronome.isRunning) {
    statusIcon.className = "pause";
  } else {
    statusIcon.className = "play";
  }
});

let tempoChangeButtons = document.getElementsByClassName("tempo-change");
for (let i = 0; i < tempoChangeButtons.length; i++) {
  tempoChangeButtons[i].addEventListener("click", function () {
    metronome.tempo += parseInt(this.dataset.change);
    tempo.textContent = metronome.tempo;
  });
}
