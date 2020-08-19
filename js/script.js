class memoTest {
    // The constructor method is a special method for creating and initializing an object created from a class.
    constructor(){
        this.totalCards=[];
        this.numerOfCards=0;
        this.verifyCards=[];
        this.issues=0;
        this.difficulty='';
        this.correctImg=[];
        this.cardsAggregators=[];

        // html selectors

        this.cardsContainer = document.querySelector('.contenedor-tarjetas');
        this.generalContainer = document.querySelector('.contenedor-general');
        this.message = document.querySelector('h2.mensaje');
        this.blockedScreen = document.querySelector('.pantalla-bloqueada');

        // call to events
        this.eventListeners()

    }

    // create listeners
    eventListeners(){
        window.addEventListener('DOMContentLoaded', ()=>{
            this.loadScreen();
        })
    }

    // load cards in the html   
    async loadScreen(){
        const res = await fetch('./memo.json');
        const data = await res.json();
        this.totalCards = data;
        
        if (this.totalCards.length != 0){
            // if cards are loaded we need sort in another random order
            this.totalCards.sort(Order);
                function Order (a,b){
                    return Math.random() -0.5;
                }
        }

        //console.log(this.totalCards)

        this.numerOfCards = this.totalCards.length;

        let html = '';
        
        // select every card of array
        this.totalCards.forEach(card => {
            html += `<div class="tarjeta">

                            <img class="tarjeta-img" src=${card.src} alt="card test" />
                    
                     </div>`
        })

        // load the html 
        this.cardsContainer.innerHTML = html;

        //on load, start game
        this.startGame();

    }

    // start game
    startGame() {
        const cards = document.querySelectorAll('.tarjeta')

        // adding event for clicks
        cards.forEach( card =>{
            card.addEventListener('click', e =>{
                this.clickCards(e)
            })
        })
    }


    //clicks cards function 
    clickCards (e){
        //turn the img
        this.turnEffect(e);

        let sourceImg = e.target.childNodes[1].attributes[1].value; 
        // save path in verify array
        this.verifyCards.push(sourceImg);
        let card = e.target;
        //adding data to the start of array with "unshift" method
        this.cardsAggregators.unshift(card);
        this.compareCards()
    }

    // add efect to turn up the card
    turnEffect (e){

        e.target.style.backgroundImage ='none';
        e.target.style.backgroundColor = 'white';
        e.target.childNodes[1].style.display = 'block'; 

    }

    // correct cards must be shown
    correctEven (arr){
        arr.forEach(card =>{
            card.classList.add('acertada');
            this.correctImg.push(card);
        });
    }

    // issues must be turn off
    turnOffEffect(arr){
        arr.forEach(card =>{
            setTimeout(()=>{
                card.style.backgroundImage = 'url(../img/cover.jpg)';
                card.childNodes[1].style.display ='none'
            }, 1000)
            //card.classList.add('')
        })

    }

    //compare the last two cards
    compareCards () {
        if(this.verifyCards.length == 2){
            if (this.verifyCards[0]=== this.verifyCards[1]){
                this.correctEven(this.cardsAggregators)
            } else {
                this.turnOffEffect(this.cardsAggregators);
                this.issues++;
            }
            this.verifyCards.splice(0);
            this.cardsAggregators.splice(0);
        }
    }

}

new memoTest(); 