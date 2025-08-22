//////////      card class      //////////
class Card {
    constructor(seme, nome, valore, img){
        this.seme = seme;
        this.nome = nome;
        this.valore = valore;
        this.img = img;
    }
}

//////////      deck class      //////////
class Deck {
    constructor(){
        this.cards = [];
        const semi = ["hearts", "diamonds", "clubs", "spades"];
        const valori = [{nome: "A", valore: 11},
                        {nome: "2", valore: 2}, {nome: "3", valore: 3}, {nome: "4", valore: 4},
                        {nome: "5", valore: 5}, {nome: "6", valore: 6}, {nome: "7", valore: 7},
                        {nome: "8", valore: 8}, {nome: "9", valore: 9}, {nome: "10", valore: 10},
                        {nome: "J", valore: 10}, {nome: "Q", valore: 10}, {nome: "K", valore: 10}];

        semi.forEach(seme => {
            valori.forEach(v => 
                {this.cards.push(new Card(
                    seme, v.nome, v.valore, `img/${v.nome}_of_${seme}.png`
                ));}
            );
        });
    }

    shuffle(){
        for(let i = this.cards.length - 1; i > 0; i--){
            let j = Math.floor(Math.random() * (i + 1));
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
        }
    }

    draw(){
        return this.cards.pop();
    }
}


//////////      player/dealer class      //////////
class Player{
    /* static numPlayer = 0; */

    constructor(nome){
        this.nome = nome;
        this.mano = [];
        this.out = false;
    }

    draw(mazzo){
        this.mano.push(mazzo.draw());
    }

    score(){
        let totale = this.mano.reduce((sum, c) => sum + c.valore, 0);
        let assi = this.mano.filter(c => c.nome === "A").length;

        while(totale > 21 && assi > 0){
            totale -= 10;
            assi--;
        }

        if(totale > 21){
            this.out = true;
        }
        else this.out = false;

        return totale;
    }

    cleanHand(){
        this.mano = [];
    }
}

//////////      load function      //////////
var dealer;
var deck1;
var chips = document.querySelectorAll(".chip");
var fiches = 1000;
var plBet;
function load(){
    deck1 = new Deck();
    deck1.shuffle();

    dealer = new Player("Dealer");
    
    let ww = document.getElementById("footer");
    ww.style.display = "none";

    chips.forEach((img) => {
        img.addEventListener('click', chooseBet);
    });

    const play = document.getElementById("play");
    play.disabled = true;

    const b = document.getElementById("bet");
    b.classList.remove('disabled');

    plBet = document.getElementById("plBet");
    plBet.textContent = `Nome: ${p1.nome} | Fiches totali: ${fiches}`;

    const stay = document.getElementById("stay");
    stay.disabled = true;
    const hit = document.getElementById("hit");
    hit.disabled = true;
}


//////////      new player joined the game      //////////    ----> quando clicco la posizione di gioco
var p1;
/* var p2;
var p3; */
function newPlayer(){
    /* Player.numPlayer++; */
    const pName = window.prompt("Insert your name:");
    p1 = new Player(pName);
    /* if (Player.numPlayer === 1) p1 = new Player(pName);
    else if(Player.numPlayer === 2) p2 = new Player(pName);
    else p3 = new Player(pName); */
}

/* function minusPlayer(){

} */



//////////      bet function      //////////
var totBet = 0;
function chooseBet(event){
    let valBet = document.getElementById("totBet");
    const clickedImage = event.target.src;
    let first = clickedImage.indexOf("_");
    let second = clickedImage.lastIndexOf(".");
    console.log(Number(clickedImage.slice(first + 1, second)));
    if ((Number(clickedImage.slice(first + 1, second)) + Number(valBet.textContent)) <= fiches){
        if (first == -1 || second == -1){
            alert("problema");
    
            const play = document.getElementById("play");
            play.disabled = true;
        }
        else {
            totBet += Number(clickedImage.slice(first + 1, second));
            valBet.textContent = totBet;
            
            const play = document.getElementById("play");
            play.disabled = false;
        }
    }
    else {
        //non hai fiches
    }
}
function reset(){
    totBet = 0;
    let valBet = document.getElementById("totBet");
    valBet.textContent = totBet;

    const play = document.getElementById("play");
    play.disabled = true;
}





//////////      play function      //////////    ----> si attiva quando il player ha puntato e ha cliccato su play
var retro = false;
var lD= 62.5;
var lP = 0;
var blackJackP  = false;
var comBJ = ["A10", "AJ", "AQ", "AK",
             "10A", "JA", "QA", "KA"];
function play(){
    /* p1 != undefined ? p1.draw(deck1) : console.error("Counting players error"); */
/*     p2 != undefined ? p2.draw(deck1) : console.error("Player2 error or is not playing");
    p3 != undefined ? p3.draw(deck1) : console.error("Player3 error or is not playing"); */

    if(deck1.cards.length == 0){
        deck1 = new Deck();
        deck1.shuffle();
    }
    p1.draw(deck1);
    dealer.draw(deck1);
    p1.draw(deck1);
    dealer.draw(deck1);
    dealer.mano.forEach((c) => {
        if (!retro){
            let img = document.createElement("img");
            img.src = c.img;
            img.width = 125;
            img.style.position = "absolute";  
            img.style.marginLeft = 0 + "px";
            const d = document.getElementById("dealer");
            d.appendChild(img);
            retro = true;
        }
        else {
            let img = document.createElement("img");
            img.src = "img/retro.png";
            img.width = 125;
            img.height = 181.5;
            img.style.position = "absolute";  
            img.style.marginLeft = lD + "px";
            const d = document.getElementById("dealer");
            d.appendChild(img);
            lD += 62.5;
        }
    })

    p1.mano.forEach((c) => {
        let img = document.createElement("img");
        img.src = c.img;
        img.width = 125;
        img.style.position = "absolute";  
        img.style.marginLeft = lP + "px";
        const p = document.getElementById("player");
        p.appendChild(img);
        lP += 62.5;
    })

    


    comBJ.forEach((com) => {
        let scoreName = p1.mano[0].nome + p1.mano[1].nome;
        com == scoreName ? blackJackP = true : console.log();
    });

    if (blackJackP){
        let lS = document.getElementById("lblScore");
        let divS = document.getElementById("score");
        lS.textContent = p1.score();
        lS.style.color = "gold";
        divS.style.border = "3px solid gold";
    }
    else {
        let lS = document.getElementById("lblScore");
        lS.textContent = p1.score();
    }

    if (p1.score() == 21 ||  blackJackP == true){
        turnoDealer();
    }

    const play = document.getElementById("play");
    play.disabled = true;
    const b = document.getElementById("bet");
    b.classList.add('disabled');
    const reset = document.getElementById("reset");
    reset.disabled = true;

    
    fiches -= totBet;
    plBet.textContent = `Nome: ${p1.nome} | Fiches totali: ${fiches}`;

    const stay = document.getElementById("stay");
    stay.disabled = false;
    const hit = document.getElementById("hit");
    hit.disabled = false;
}



//////////      hit function      //////////
function hit(){
    if(deck1.cards.length == 0){
        deck1 = new Deck();
        deck1.shuffle();
    }

    let divP = document.getElementById("player");
    let alt = 187.5;
    alt += 62.5;
    divP.style.width = alt + "px";

    let card = deck1.draw();
    p1.mano.push(card);
    let img = document.createElement("img");
    img.src = card.img;
    img.width = 125;
    img.style.position = "absolute";  
    img.style.marginLeft = lP + "px";
    const divPla = document.getElementById("player");
    divPla.appendChild(img);
    lP += 62.5;

    p1.score();
    let lS = document.getElementById("lblScore");
    lS.textContent = p1.score();
    p1.out == true ? turnoDealer() : console.log(/* "player non ha sballato", p1.mano */);//devo aggiungere l else che aggiorna lo schermo con i pulsanti stay hit 
}

//////////      stay function      //////////
function stay(){
    /* Player.numPlayer === 1 ? turnoDealer() : console.error("Players > 1"); */
    turnoDealer();
}

//////////      dealer turn      //////////    ----> ultima funzione del gioco
var blackJackD = false;
function turnoDealer() {
    let s = document.getElementById("stay");
    let h = document.getElementById("hit");
    s.disabled = true;
    h.disabled = true;
    // Dealer pesca fino a 17
    let alt = 187.5;
    while (dealer.score() < 17) {
        if(deck1.cards.length == 0){
            deck1 = new Deck();
            deck1.shuffle();
        }

        dealer.draw(deck1);
        let divD = document.getElementById("dealer");
        alt += 62.5;
        divD.style.width = alt + "px";
    }
    lD = 0;
    if (retro){
        document.getElementById("dealer").innerHTML = "";
        dealer.mano.forEach(c => {
            let img = document.createElement("img");
            img.src = c.img;
            img.width = 125;
            img.height = 181.5;
            img.style.position = "absolute";  
            img.style.marginLeft = lD + "px";
            const d = document.getElementById("dealer");
            d.appendChild(img);
            lD += 62.5;
        });
    }

    
    comBJ.forEach((com) => {
        let scoreName = dealer.mano[0].nome + dealer.mano[1].nome;
        com == scoreName ? blackJackD = true : console.log();
    });
    
    if (blackJackD){
        let lSD = document.getElementById("lblScoreD");
        let divSD = document.getElementById("scoreD");
        lSD.textContent = dealer.score();
        lSD.style.color = "gold";
        divSD.style.border = "3px solid gold";
    }
    else {
        let lSD = document.getElementById("lblScoreD");
        lSD.textContent = dealer.score();
    }

      //////////      winner check      //////////
      let sww = "";
      if ((dealer.score() < 22 && p1.score() < 22) && (dealer.score() > p1.score())){
        console.log("Dealer win");
        sww = "You Lose";
      }
      else if((dealer.score() < 22 && p1.score() < 22) && (dealer.score() < p1.score())){
        console.log("You win");
        sww = "You Win";
      }
      else if(dealer.score() >= 22 && p1.score() >= 22){
        console.log("Dealer win");
        sww = "You Lose";
      }
      else if(dealer.score() >= 22 && p1.score() < 22){
        console.log("You win");
        sww = "You Win";
      }
      else if(dealer.score() < 22 && p1.score() >= 22){
        console.log("Dealer win");
        sww = "You Lose";console.log("d  in    p out");
      }
      else {
        if (blackJackP == true  && blackJackD == true){
            console.log("Push");
            sww = "Push";
        }
        else if(blackJackP == true && blackJackD == false){
            console.log("You win");
            sww = "You Win";
        }
        else if(blackJackP == false && blackJackD == true){
            console.log("Dealer win");
            sww = "You Lose";
        }
        else {
            console.log("Push");
            sww = "Push";
            console.log("finisce qui last push");
        }
      }
      setTimeout(whoWin, 750, sww);
/*       aggiornaSchermo(true);
      determinaVincitore(); */
}

//////////      who win      //////////
function whoWin(str){
    let ww = document.getElementById("footer");
    ww.textContent = str;
    ww.style.display = "block";

    //aggionare le fish
    if(str == "You Win"){
        if (!blackJackP){
            fiches = fiches + (totBet * 2);
        }
        else {
            fiches = fiches + (totBet + (totBet * 1.5));
        }
    }
    else if(str == "Push"){
        fiches += totBet;
    }
    else{
        fiches = fiches;
    }
    let lblFiches = document.getElementById("plBet");
    lblFiches.textContent = `Nome: ${p1.nome} | Fiches totali: ${fiches}`;
    console.log(fiches);

    setTimeout(ifFichesZero,1000);
    setTimeout(clean, 3000);
}

//////////      clean      //////////
function  clean(){
    let manoD = document.getElementById("dealer");
    let manoP = document.getElementById("player");
    manoD.innerHTML = "";
    manoP.innerHTML = "";

    let ww = document.getElementById("footer");
    ww.textContent = "";
    ww.style.display = "none";

    let lSD = document.getElementById("lblScoreD");
    let divSD = document.getElementById("scoreD");
    lSD.textContent = "";
    lSD.style.color = "white";
    divSD.style.border = "3px solid white";

    let lS = document.getElementById("lblScore");
    let divS = document.getElementById("score");
    lS.textContent = "";
    lS.style.color = "white";
    divS.style.border = "3px solid white";

    const stay = document.getElementById("stay");
    stay.disabled = true;
    const hit = document.getElementById("hit");
    hit.disabled = true;

    const reset = document.getElementById("reset");
    reset.disabled = false;
    const totBet2 = document.getElementById("totBet");
    totBet2.textContent = "0";
    const b = document.getElementById("bet");
    b.classList.remove('disabled');

    lD= 62.5;
    lP = 0;
    totBet = 0;
    retro = false;
    blackJackP = false;
    blackJackD = false;

    p1.cleanHand();
    dealer.cleanHand();

    let ppdiv = document.getElementById("player");
    ppdiv.width = 187.5 + "px";
    let dddiv = document.getElementById("dealer");
    dddiv.width = 187.5 + "px";

    console.log(deck1.cards.length);
}

function ifFichesZero(){
    let risposta;
    if(fiches == 0){
        risposta = confirm("You lost all your fiches. Do you want play again?");
        risposta ? fiches = 1000 : window.close();
        let lblFiches = document.getElementById("plBet");
        lblFiches.textContent = `Nome: ${p1.nome} | Fiches totali: ${fiches}`;
    }
}

newPlayer();
load();




// 1) D:in P:in D>P ---> D win
// 2) D:in P:in D<P ---> P win
// 3) D:out P:out   ---> D win
// 4) D:out P:in    ---> P win
// 5) D:in P:out    ---> D win
// 6) D = P         ---> tie


//controllo blackjack quando esce e bet x1.5