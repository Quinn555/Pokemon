import React from "react";
import Card from "./Card";
import { usePokemonData } from "./api";
import { usePreEvo } from "./preEvo";
import "./App.css";
import Button from "@mui/material/Button";

function App() {
  const { pokeInfo, endPoint, num, atackArray, pokeMoveSet, setNum } =
    usePokemonData();
  const { preName, evoImg } = usePreEvo(pokeInfo);

  function next() {
    if (num < endPoint) {
      setNum(num + 3);
    } else {
      setNum(0);
    }
  }
  function back() {
    if (num < endPoint) {
      setNum(num - 3);
    } else {
      setNum(endPoint);
    }
  }
  function RandomButton() {
    const randomNumber = Math.floor(Math.random() * endPoint) + 1;
    setNum(randomNumber);
  }
  return (
    <div className="App">
      <Button onClick={back} size="large">
        Back
      </Button>
      <button onClick={RandomButton} className="cardHolder">
        <Card
          evoImg={evoImg}
          preName={preName}
          pokeInfo={pokeInfo}
          atackArray={atackArray}
          pokeMoveSet={pokeMoveSet}
        />
      </button>
      <Button onClick={next} size="large">
        Next
      </Button>

    </div>
  );
}

export default App;
