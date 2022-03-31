class Metronome {
  constructor(tempo = 120) {
    this.audioContext = null;
    this.beatsPerBar = 4;
    this.clicksInQueue = [];
    this.currentBeat = 0;
    this.intervalID = null;
    this.isRunning = false;
    this.nextClickTime = 0.0;
    this.scheduleFrequency = 25; // Scheduling function call frequency (ms)
    this.scheduleAheadTime = 0.1; // How far ahead to schedule audio (sec)
    this.tempo = tempo;
  }

  nextClick() {
    const secondsPerBeat = 60.0 / this.tempo;
    this.nextClickTime += secondsPerBeat;

    this.currentBeat++;
    if (this.currentBeat === this.beatsPerBar) {
      this.currentBeat = 0;
    }
  }

  scheduleClick(beatNumber, time) {
    this.clicksInQueue.push({ click: beatNumber, time: time });

    const osc = this.audioContext.createOscillator();
    const envelope = this.audioContext.createGain();

    osc.frequency.value = beatNumber % this.beatsPerBar == 0 ? 1000 : 800;
    envelope.gain.value = 1;
    envelope.gain.exponentialRampToValueAtTime(1, time + 0.001);
    envelope.gain.exponentialRampToValueAtTime(0.001, time + 0.02);

    osc.connect(envelope);
    envelope.connect(this.audioContext.destination);

    osc.start(time);
    osc.stop(time + 0.03);
  }

  scheduler() {     // See https://www.html5rocks.com/en/tutorials/audio/scheduling/
    while (
      this.nextClickTime <
      this.audioContext.currentTime + this.scheduleAheadTime
    ) {
      this.scheduleClick(this.currentBeat, this.nextClickTime);
      this.nextClick();
    }
  }

  start() {
    if (this.isRunning) return;
    if (this.audioContext == null) {
      this.audioContext = new (window.AudioContext ||
        window.webkitAudioContext)();
    }

    this.isRunning = true;

    this.currentBeat = 0;
    this.nextClickTime = this.audioContext.currentTime + 0.05;

    this.intervalID = setInterval(
      () => this.scheduler(),
      this.scheduleFrequency
    );
  }

  stop() {
    this.isRunning = false;

    clearInterval(this.intervalID);
  }

  toggleStartStop() {
    if (this.isRunning) {
      this.stop();
    } else {
      this.start();
    }
  }
}
