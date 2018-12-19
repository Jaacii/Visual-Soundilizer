var sliders = document.getElementsByClassName("slider"),
    filter = audioContext.createBiquadFilter();
    
audioElementSource2.connect(filter);
filter.connect(audioContext.destination);

//Slidern Eventlistener hinzufügen
for (var i = 0; i < sliders.length; i++) {
    sliders[i].addEventListener("mousemove", sliderchange);
}


function sliderchange() {
    switch(this.id) {
        case "volumeslider":
            audioElement2.volume = this.value / 100;
            document.getElementById("volumeOutput").innerHTML = this.value + " dB";
            break;

    }
}







	
	
	
	
	
	
	
	
	


	


	
	


	

		
		

	
	
	
	
	
	


	


	
	


	

		
		
		
