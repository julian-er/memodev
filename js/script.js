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
        this.numberAttempts = 0;

        // html selectors

        this.cardsContainer = document.querySelector('.contenedor-tarjetas');
        this.generalContainer = document.querySelector('.contenedor-general');
        this.message = document.querySelector('h2.mensaje');
        this.blockedScreen = document.querySelector('.pantalla-bloqueada');
        this.containerIssues = document.createElement('div')
        this.level = document.createElement('div')

        // call to events
        this.eventListeners()

    }

    // create listeners
    eventListeners(){
        window.addEventListener('DOMContentLoaded', ()=>{
            this.selecLevel();
            this.loadScreen();

            //stop default events with right click
            window.addEventListener('contextmenu', e => {
                e.preventDefault();
            }, false)
        })
    }


    selecLevel(){
        const msg = prompt('Elige el nivel : Fácil, Medio, Difícil. (Nivel medio pre-determinado)')

        switch (msg.toLowerCase()) {
            case ('intermedio'):
                this.numberAttempts = 5;
                this.difficulty = 'Intermedio'
                break;
            case ('dificil'):
                this.numberAttempts = 1;
                this.difficulty = 'Difícil'
                break;
            case ('facil'):
                this.numberAttempts = 20;
                this.difficulty = 'Fácil'
                break;
            default:
                this.numberAttempts = 5;
                this.difficulty = 'Intermedio'
                break;
        }


        //load issues count
        this.newContainerIssues();

        this.divAttempts();

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
                if (!e.target.classList.contains('acertada')&&!e.target.classList.contains('tarjeta-img')){
                    this.clickCards(e)
                }
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
            this.gameWinner();
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
                this.issuesCount();
                this.gameLoser();
            }
            this.verifyCards.splice(0);
            this.cardsAggregators.splice(0);
        }
    }

    // check if the user win
    gameWinner(){
        if (this.correctImg.length === this.numerOfCards){
            setTimeout(()=>{
                this.blockedScreen.style.display = 'block';
                this.message.innerText = 'Felicidades, ganaste el test!';
            },1000);

            //reload page when the user win
            setTimeout(()=>{
                location.reload()
            }, 4000)
        }
    }

    //lose the game 
    gameLoser(){
        if(this.issues === this.numberAttempts){
            setTimeout(()=>{
                this.blockedScreen.style.display = 'block';
                this.message.innerText = 'Has perdido, vuelve a codear!';
            },1000)
             //reload page when the user lose
             setTimeout(()=>{
                location.reload()
            }, 4000)
        }                

    }

    // issues count 
    issuesCount(){
        this.containerIssues.innerText = `Errores : ${this.issues}`;
    }

    newContainerIssues(){
        this.containerIssues.classList.add('error');
        this.issuesCount();
        this.generalContainer.appendChild(this.containerIssues)
    }
    
    //create div with level
    divAttempts () {
        this.level.classList.add('nivel-dificultad');
        this.level.innerHTML = `Nivel seleccionado : ${this.difficulty}`;
        this.generalContainer.appendChild(this.level)
    }


}

new memoTest(); 

