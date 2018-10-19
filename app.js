//Initiate SpeechSynth
const synth = window.speechSynthesis;

//Grab the DOM elements
const form = document.querySelector('form'),
      text = document.querySelector('#text'),
      voiceSelect = document.querySelector('#voice-select'),
      rate = document.querySelector('#rate'),
      rateValue = document.querySelector('#rate-value'),
      pitch = document.querySelector("#pitch"),
      pitchValue = document.querySelector('#pitch-value'),
      speakBtn = document.querySelector('#btn-speak'),
      body = document.querySelector('body');

let voices = [];

//This function gets all voices from the API
function getVoices(){
    voices = synth.getVoices();
    
    //Loop through the array to create options to be inserted in the select
    voices.forEach(voice => {
        //Create an option element
        let option = document.createElement('option');
        
        //Set the text content of each option
        option.textContent = `${voice.name} (${voice.lang})`;

        //Set the attributes
        option.setAttribute('data-lang', voice.lang);
        option.setAttribute('data-name', voice.name);

        voiceSelect.appendChild(option);
    });
}


if(synth.onvoiceschanged !== undefined){
    synth.onvoiceschanged = getVoices;
}
getVoices();

//Speak function will be the 'core' of this project
function speak(){
    if(synth.speaking){
        //check if the program is already speaking
        console.error('Already speaking');
        return;
    }
    //check if the text area is not empty
    if(text.value !== ''){
        //Set background animation
        body.style.background = '#141414 url(https://raw.githubusercontent.com/bradtraversy/type-n-speak/master/dist/img/wave.gif)';
        body.style.backgroundRepeat = 'repeat-x';
        body.style.backgroundSize = '100% 100%';

        //Pass as an argument the text to be speeched
        const speakText = new SpeechSynthesisUtterance(text.value);

        //It runs when the speak end
        speakText.onend = e => {
            console.log('Done!');
            body.style.background = '#141414';
        }

        //Speak Error
        speakText.onerror = e => {
            console.log('Something went wrong!');
        }

        //Get the selected voice
        const selectedVoice = voiceSelect.selectedOptions[0].getAttribute('data-name');
        
        //Set the voice to speak
        voices.forEach((voice) => {
            if(voice.name === selectedVoice){
                speakText.voice = voice;
            }
        });
        
        //Set the rate
        speakText.rate = rate.value;

        //Set the pitch
        speakText.pitch = pitch.value;

        //Speak
        synth.speak(speakText);
    }
}

//Event Listeners
form.addEventListener('submit', e => {
    e.preventDefault();
    speak();
});
voiceSelect.addEventListener('change', speak);
rate.addEventListener('change', () => rateValue.textContent = rate.value);
pitch.addEventListener('change', () => pitchValue.textContent = pitch.value);