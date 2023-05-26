import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Card from './Card';
import './CardList.css';
const CardList = () => {
    const [deckId, setDeckId] = useState("");
    const [cards, setCards] = useState([]);
    const [autoDraw, setAutoDraw] = useState(false);
    const timerRef = useRef(null);
   // const [autoDraw, setAutoDraw] = useState(false);
    // useEffect to fectch the API and get the data back when the component mount
    useEffect(() => {
      async function fetchNewDeck() {
        try {
          const deck = await axios.get(
            "https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1"
          );
          setDeckId(deck.data.deck_id);
        } catch (err) {
          console.error("Error fetching new deck:", err);
        }
      }
      fetchNewDeck();
    }, []);
    useEffect(() => {
        async function drawCard() {
          try {
            const card = await axios.get(
              `https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`
            );
            if (card.data.remaining === 0) {
              //setAutoDraw(false);
              throw new Error("no cards remaining!");
            }
            const c = card.data.cards[0];
            setCards((cards) => [
              ...cards,
              {
                id: c.code,
                name: c.suit + " " + c.value,
                image: c.image,
              },
            ]);

          } catch (err) {
            console.error("Error drawing a card:", err);
          }
        }

        if (autoDraw && !timerRef.current) {
           timerRef.current = setInterval(async () => {
           await drawCard();
           }, 1000);
        }

        return () => {
           clearInterval(timerRef.current);
           timerRef.current = null;
        };
      }, [setCards, autoDraw, deckId])

    const toggleAutoDraw = () => {
        setAutoDraw(auto => !auto);
    };

  return (
    <div className="Deck">
      {deckId ? (
        <button className="Deck-gimme" onClick={toggleAutoDraw}>
          {autoDraw ? "STOP" : "KEEP"} DRAWING!
        </button>
      ) : null}

      <div className="Card">
        {cards.map(c =><Card key={c.id} name={c.name} image={c.image} />)}
      </div>
    </div>
  );
}

    
export default CardList;
