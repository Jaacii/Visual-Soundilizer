(function(){
	var canvas = document.getElementById("canvas2")
	var status = document.getElementById("status")

	function setStatus(text) {
		status.innerHTML = String(text)
	}

	// Variablen
	var canvasContext = canvas.getContext("2d")
	var imagePaths = ["node.png"]
	var imageBitmaps = []
	var imagePointer = 0
	var audioPaths = ["../Audio/footsteps.wav"]
	var audioBuffers = []
	var audioRequest = new XMLHttpRequest()
	var audioPointer = 0
	var audioContext = new AudioContext()
	var audioGain = audioContext.createGain()

	//Mute
	audioGain.gain.value = 0.0
	
	// Gain -> destination 
	audioGain.connect(audioContext.destination)
	audioContext.listener.setOrientation(0, 1, 0, 0, 0, 1)
// DemoNode: Rotierende bitmaps und sounds
	function DemoNode() {
		this.x = 0.0
		this.y = 0.0
		this.position = 0.0
		this.rotation = 0.0
		this.rotationSpeed = 0.0
		this.bitmap = null // Image
		this.buffer = null // AudioBufferSourceNode
		this.panner = null // PannerNode
	}

	DemoNode.prototype.updatePosition = function() {
		this.x = this.position * Math.cos(this.rotation)		//Rotationsachsen berechnung
		this.y = this.position * Math.sin(this.rotation)
		this.rotation += this.rotationSpeed

		this.panner.setPosition(this.x, this.y, 0)				//setzen des sounds
	}

	var demoNodes = []
	var demoMuted = true

	function load() {
		loadImage()
	}

	function whenLoaded() {
		var i = 0
		var n = audioBuffers.length

		while (i < n) {
			var node = new DemoNode()
			node.bitmap = imageBitmaps[0]
			node.source = audioContext.createBufferSource()
			node.panner = audioContext.createPanner()
			node.source.buffer = audioBuffers[i]
			node.source.loop = true
			node.panner.panningModel = "HRTF"
			node.panner.distanceModel = "linear"
			node.source.connect(node.panner)
			node.panner.connect(audioGain)
			
			node.source.start()
			node.position = 50 + (i * 50)
			node.rotationSpeed = (Math.PI / 180) * (i + 0.5)

			demoNodes.push(node)
			i++
		}
		
		setStatus("Play")  

		window.addEventListener("click", whenMouseClicked)
		window.requestAnimationFrame(update)
	}

	function loadImage() {
		if (imagePointer >= imagePaths.length) {
			loadAudio()
			return
		}
		
		var image = new Image()
		image.src = imagePaths[imagePointer]
		image.onload = whenImageLoaded
		imagePointer++;
	}

	function whenImageLoaded(event) {
		imageBitmaps.push(event.currentTarget);
		loadImage();
	}

	function loadAudio() {
		if (audioPointer >= audioPaths.length) {
			whenLoaded();
			return;
		}

		audioRequest.open("GET", audioPaths[audioPointer])
		audioRequest.responseType = "arraybuffer"
		audioRequest.onload = whenAudioLoaded
		audioRequest.send()
		audioPointer++
	}

	function whenAudioLoaded(event) {
		var data = audioRequest.response

		if (data === null) {
			setStatus("Loading failed")
			return
		}

		// Reset von XMLHttpRequest .
		audioRequest.abort()
		// Decode audiofile
		audioContext.decodeAudioData(data, whenAudioDecoded)
	}

	function whenAudioDecoded(buffer) {
		audioBuffers.push(buffer)
		loadAudio()
	}

	function whenMouseClicked(event) {

		var value

		if (demoMuted) {
			value = 1.0
			demoMuted = false
			setStatus("Pause") 
		} else {
			value = 0.0
			demoMuted = true
			setStatus("Play")
		}

		var time = audioContext.currentTime
		// "Fade" das Volume kurz (1sec)
		audioGain.gain.cancelScheduledValues(0)
		audioGain.gain.setTargetAtTime(audioGain.gain.value, time, 0)
		audioGain.gain.linearRampToValueAtTime(value, time + 1.0)
	}

	function update(t) {
		window.requestAnimationFrame(update)
		var w = canvas.width						//w = width
		var h = canvas.height						//h = height
		canvasContext.clearRect(0, 0, w, h)

		var i = 0									//Counter für die schleife, Auswählen des Arrayelements
		var n = demoNodes.length					//Sound length
		var x = 0									//X koordinate
		var y = 0									//Y koordinate
		var o = null								//

		while (i < n) {
			o = demoNodes[i]
			o.updatePosition()
			x = (w * 0.5) + o.x - (o.bitmap.width * 0.5)
			y = (h * 0.5) - o.y - (o.bitmap.height * 0.5)
			canvasContext.drawImage(o.bitmap, x|0, y|0)
			i++
		}
	}
	
	function cancelEvent(event) {
		event.preventDefault()
	}

	window.addEventListener("selectstart", cancelEvent)
	window.addEventListener("contextmenu", cancelEvent)

	load()
})()
