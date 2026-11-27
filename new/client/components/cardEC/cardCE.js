//import { EVENTS } from "../core/store/events";

class Card extends HTMLElement {
    constructor(){
        super();
        this.attachShadow({mode : 'open'});

        this.shadowRoot.innerHTML = `
            <link rel="stylesheet" href="cardCE.css">
        `;
    }

    connectedCallback(){
        this.render();
    }

    render(){
        const type = this.getAttribute('type');
        let card;

        if (type === 'event'){
            card = this.buildEvent();
        }
        else if (type === 'cal') {
            card = this.buildCal();
        }
        else {
            return; // om card inte får en type och blir undefined
        }

        this.shadowRoot.appendChild(card);

        card.addEventListener('click', () => {
            if (type === 'event') {
                this.publishEvent();
            } else {
                this.publishCal();
            }
        });
    }

    buildEvent(){
        const cardBackg = document.createElement('div');
        cardBackg.classList.add('card', 'cardEvent');
        cardBackg.setAttribute("type", "event");

        const cardLeftDiv = document.createElement('div');
        cardLeftDiv.classList.add('cardLeft');

        const textCLD = document.createElement('p');

        const cardMiddleDiv = document.createElement('div');
        cardMiddleDiv.classList.add('cardMiddle');

        const h3Middle = document.createElement('h3');
        
        const textMiddle = document.createElement('p');

        const cardRightDiv = document.createElement('div');
        cardRightDiv.classList.add('cardRight');
        
        cardLeftDiv.append(textCLD);
        cardMiddleDiv.append(h3Middle, textMiddle);
        cardBackg.append(cardLeftDiv, cardMiddleDiv, cardRightDiv);

        textCLD.innerHTML = `${this.getAttribute('day')}<br>${this.getAttribute('month')}`;

        //test
        h3Middle.textContent = this.getAttribute('title');
        textMiddle.innerHTML = `${this.getAttribute('time')}<br>${this.getAttribute('group')}`;

        return cardBackg;
    }
    
    buildCal() {
        const cardBackg = document.createElement('div');
        cardBackg.classList.add('card', 'cardCal');
        cardBackg.setAttribute("type", "cal");


        const cardLeftDiv = document.createElement('div');
        cardLeftDiv.classList.add('cardMiddle');

        const h3Cal = document.createElement('h3');
        
        const textCal = document.createElement('p');

        const cardRightDiv = document.createElement('div');
        cardRightDiv.classList.add('cardRight');

        cardLeftDiv.append(h3Cal, textCal);
        cardBackg.append(cardLeftDiv, cardRightDiv);

        return cardBackg;
    }

    publishEvent(){
        console.log("Hej");
        //PubSub.publish(EVENTS.POPUP.OPEN.EVENT); // ett för eventVy
    }


    publishCal() {
        //PubSub.publish(EVENTS.POPUP.OPEN.CAL); // ett för calsVy
    }
}

customElements.define('card-ce', Card);