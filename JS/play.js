 //------------Play Button
		var onOff = 0;
		
		
			
			function playOrPauseSong() {
				
				
				
				if (onOff == 0) {
					audioElement2.src = songs[select];
				
					audioElement2.play();
					document.getElementById('pausebtn').style.display="inline-block";
					document.getElementById('playbtn').style.display="none";
					
					onOff = 1;
				}
			
				else {
					
					audioElement2.pause(); 
					document.getElementById('playbtn').style.display="inline-block";
					document.getElementById('pausebtn').style.display="none";
					onOff = 0;
				}
			}

			
			//------------Audio Select
		
	 
			function selectSong(value) {		
					select = value;

				
}