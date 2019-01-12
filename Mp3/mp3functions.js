
window.onload = function() {
/*HTML Elemente kriegen*/
  var file = document.getElementById("fileload");
  var audio = document.getElementById("audio");
  
/*Wenn die Audiodatei ausgesucht ist -> erschaffe Bars, Audiocontext etc etc*/
  file.onchange = function() {
    var files = this.files;
    audio.src = URL.createObjectURL(files[0]);
    audio.load();
    audio.play();
	
    var audioContext = new AudioContext();
    var audioElementSource2 = audioContext.createMediaElementSource(audio);
    var analyser = audioContext.createAnalyser();

	
    var canvas = document.getElementById("canvas");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    var ctx = canvas.getContext("2d");

    audioElementSource2.connect(analyser);
    analyser.connect(audioContext.destination);
    analyser.fftSize = 256;
  /*Analayse der Frequenzdaten wird in ein array ghepackt "bufferlength" */
    var bufferLength = analyser.frequencyBinCount;
    console.log(bufferLength);

    var dataArray = new Uint8Array(bufferLength);
    var WIDTH = canvas.width;					//HEIGHT -> canvas Höhe etc
    var HEIGHT = canvas.height;
    var bWidth = (WIDTH / bufferLength) * 3;  // b -> bar Höhe und Weite
    var bHeight;
    var x = 0;

    function renderFrame() {
/*AnalyserData + Canvas Colorisierung*/
      requestAnimationFrame(renderFrame);
      x = 0;
      analyser.getByteFrequencyData(dataArray);
      ctx.fillStyle = "#000";	//schwarzer Hintergrund
      ctx.fillRect(0, 0, WIDTH, HEIGHT);

	  
/*Bars-Generierung*/
      for (var i = 0; i < bufferLength; i++) {
        bHeight = dataArray[i];
		
/*Farbe*/
        var r = bHeight + (170 * (i/bufferLength));
        var g = 450 * (i/bufferLength);
        var b = 250;
        ctx.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
        ctx.fillRect(x, HEIGHT - bHeight, bWidth, bHeight);
        x += bWidth + 1;
      }
    }

	
    audio.play();
    renderFrame();
  };
};
