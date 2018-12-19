					
	   var select = 3;
	   
		//---------- Resonance Audio

        var x = 0.0;
        var y = 0.0;
        var z = 0.0;

       
        let audioContext = new AudioContext();

        // first-order Ambisonic Resonance Audio scene 
        let resonanceAudioScene = new ResonanceAudio(audioContext);

        // Connect the scene’s binaural output to stereo out.
        resonanceAudioScene.output.connect(audioContext.destination);

		//Raum Größe und Material
        let roomDimensions = {
            width: 3.1,
            height: 2.5,
            depth: 3.4,
        };

       
			let roomMaterials = {
            
            left: 'curtain-heavy',
            right: 'curtain-heavy',
            front: 'glass-thin',
            back: 'glass-thin',
            // Room floor
            down: 'grass',
            // Room ceiling
            up: 'transparent',
        };

        
        resonanceAudioScene.setRoomProperties(roomDimensions, roomMaterials);
		
		
		//
		
 
        let audioElement2 = document.createElement('audio');
		
        audioElement2.loop = true;
        let audioElementSource2 = audioContext.createMediaElementSource(audioElement2);
        let source2 = resonanceAudioScene.createSource();
		
		resonanceAudioScene.setListenerPosition(x, y, z);
		resonanceAudioScene
        audioElementSource2.connect(source2.input);
        source2.setPosition(x,y,z);
