import React, { useState, useEffect } from 'react';
import typeImages from './typeImages';
import './App.css';
import Button from '@mui/material/Button';

function App() {
  const [data, setData] = useState([]);
  const [pokeInfo, setPokeInfo] = useState([]);
  const [code, setCode] = useState([]);
  const [endPoint, setEndPoint] = useState([]);
  const [num, setNum] = useState(0);
  const [atackArray, setPokeDamage] = useState([])
  const [pokeMoveSet, setPokeMoveSet] = useState([])

  function capFirstLetter(word) {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }

  //initial grab of 5 pokemon
  useEffect(() => {
    //grabs 5 pokemon
    async function getLink() { 
      const link = `https://pokeapi.co/api/v2/pokemon?limit=3&offset=${num}`;
      const responce = await fetch(link);
      const linked = await responce.json();
      const data = linked.results;
      const endPoint = linked.count;
      setEndPoint(endPoint)
      setData(data);

    }
    getLink();
  }, [num]);


  //grabs info on pokemon
  useEffect(() => {
    async function getPokemonInfo() {
      const infoArray = await Promise.all(data.map(async (stuff) => {
        const link = stuff.url;
        const response = await fetch(link);
        const pokemonInfo = await response.json();
        return pokemonInfo;
      }));

      setPokeInfo(infoArray);
    }
  
    getPokemonInfo();
  }, [data]);

  //grabs info on damage of Pokemon based on their typing
  useEffect(() => {
    async function typeDamage() {
      const typeInfoArray = await Promise.all(
        pokeInfo.map(async (poke) => {
          const typeLink = poke.types[0].type.url;
          const typeResponse = await fetch(typeLink);
          const typeInfo = await typeResponse.json();
          return typeInfo;
        })
      );

      //extract weaknesse and strength
      const atackArray = typeInfoArray.map((typeInfo) => ({
        weaknesse: typeInfo.damage_relations.double_damage_from.length > 0
        ? typeInfo.damage_relations.double_damage_from[
            Math.floor(Math.random() * typeInfo.damage_relations.double_damage_from.length)
          ].name
        : undefined,
        strength: typeInfo.damage_relations.double_damage_to.length > 0
        ? typeInfo.damage_relations.double_damage_to[
            Math.floor(Math.random() * typeInfo.damage_relations.double_damage_to.length)
          ].name
        : undefined,
      }));

      setPokeDamage(atackArray);
    }

    typeDamage();
  }, [pokeInfo]);

  //grabs move data
  useEffect(() => {
    async function getMoves() {
      const movesInfoArray = await Promise.all(
        pokeInfo.map(async (poke) => {
          const rad = Math.floor(Math.random() * poke.moves.length);
          const move1 = poke.moves[rad]?.move;
          const typeLink = move1?.url;
          
          if (!typeLink) {
            return [null, null]; // Return an array of null values
          }
    
          const typeResponse = await fetch(typeLink);
          const typeInfo = await typeResponse.json();
    
          const rad2 = rad + 1;
          const randomValue = Math.random();
          const move2 = rad2 < poke.moves.length ? poke.moves[rad2]?.move : null;
    
          if (move2 && randomValue < 0.5) {
            const typeLink2 = move2?.url;
            const typeResponse2 = await fetch(typeLink2);
            const typeInfo2 = await typeResponse2.json();
    
            return [typeInfo, typeInfo2];
          }
    
          return [typeInfo, null];
        })
      );
  

      const pokeMoveSet = movesInfoArray.map(([move1, move2]) => [
        {
          moveName: move1?.name,
          type: move1?.type.name,
          damage: move1?.power,
          effect: move1?.effect_entries[0],
          amount: (move1?.pp <= 5 ? 3 : move1?.pp >= 20 ? 1 : 2) || 1,
        },
        move2 && {
          moveName: move2?.name,
          type: move2?.type.name,
          damage: move2?.power,
          effect: move2?.effect_entries[0],
          amount: (move2?.pp <= 5 ? 3 : move2?.pp >= 20 ? 1 : 2) || 1,
        },
      ]);
  
      setPokeMoveSet(pokeMoveSet);
    }

    getMoves();
  }, [pokeInfo]);
  

  //Displays the 5 pokemon
  useEffect(() => {
    function cardCreation() {
      let names = pokeInfo.map((poke, index) => {
        const typeing = poke.types[Math.floor(Math.random() * poke.types.length)].type.name;

        const moveSymbles = [];
        let i = 0;
        let j = 0;
        let check = pokeMoveSet[index]?.[1]?.amount ?? 1;
        for (i = 0; i < check; i++) {
          const movePer = [];
          moveSymbles.push(movePer);
          for (j = 0; j < check; j++) {
            const moveType = pokeMoveSet[index]?.[i]?.type;
            if (moveType) { // Check if moveType is defined
              const moveSymblesHolder =
                <svg className='element-circle' viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg" key={`move-sym-${j}`} style={{ backgroundColor: typeImages[moveType][1], border: `1px solid ${typeImages[moveType][1]}` }}>
                  <path className='small' fillRule="evenodd" clipRule="evenodd" d={typeImages[moveType][0]} fill={typeImages[moveType][1]} />
                </svg>;
        
              movePer.push(moveSymblesHolder);
            }
          }
        }
        return (
          <div className='border'>
            <div key={poke.name + index} className='card' style={{ backgroundColor: typeImages[typeing][1] }}>
              <div className='card-info-desighn' style={{ backgroundColor: typeImages[typeing][1] }}>
                <div className='basic'>
                  basic
                </div>
                <div className='pok-info'>
                  <div className='card-title-holder'>
                    <div className='card-title'>
                      <h1>{capFirstLetter(poke.name)}</h1>
                      <div className='right-title'>
                        <h4>HP</h4>
                        <h1>{poke.stats[0].base_stat} </h1> 
                        <div className='small'>
                          <svg className='element-circle' viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg" key={`move-sym-${index}`} style={{ backgroundColor: typeImages[typeing][1], border: `1px solid ${typeImages[typeing][1]}` }} >
                            <path fillRule="evenodd" clipRule="evenodd" d={typeImages[typeing][0]} fill={typeImages[typeing][1]}/>
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className='big-container'>
                    <div className='big-box' style={{ backgroundImage: `url(${poke.sprites?.front_default})` }}></div>
                    <div className='wide-box'>
                      <div>NO.{poke.id}</div>
                      <div>{poke.weight}lbs</div>
                      <div>height:{poke.height}</div>
                    </div>
                  </div>

                  <div className='bottom'>
                    <div className='movess'>
                      <div className='moves'>
                        <div className='move'>
                          <div>
                            {moveSymbles[0]}
                          </div>
                          <h2>{pokeMoveSet[index]?.[0]?.moveName}</h2>
                          <h2>{pokeMoveSet[index]?.[0]?.damage}</h2>
                        </div>
                        <div className='center'><h3>{pokeMoveSet[index]?.[0]?.effect?.effect?.replace(/\$effect_chance%/g, '').length > 20 ? pokeMoveSet[index]?.[0]?.effect?.effect?.split('.')[0].replace(/\$effect_chance%/g, '') : pokeMoveSet[index]?.[0]?.effect?.effect?.replace(/\$effect_chance%/g, '')}</h3></div>
                      </div>
                      <div className='moves'>
                        <div className='move'>
                          <div>
                            {moveSymbles[1]}
                          </div>
                          <h2>{pokeMoveSet[index]?.[1]?.moveName}</h2>
                          <h2>{pokeMoveSet[index]?.[1]?.damage}</h2>
                        </div>
                        <div className='center'><h3>{pokeMoveSet[index]?.[1]?.effect?.effect?.replace(/\$effect_chance%/g, '').length > 20 ? pokeMoveSet[index]?.[1]?.effect?.effect?.split('.')[0].replace(/\$effect_chance%/g, '') : pokeMoveSet[index]?.[1]?.effect?.effect?.replace(/\$effect_chance%/g, '')}</h3></div>
                      </div>
                    </div>

                    <div className='wide-box-2'>
                      <div className='wide-box-2'>
                        <div>weaknesse {atackArray[index]?.weaknesse} X 2</div>
                        <div>strength {atackArray[index]?.strength} X 2</div>
                      </div>
                      <div>Ability:{poke.abilities[Math.floor(Math.random() * poke.abilities.length)].ability.name} </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      });
      setCode(names);
    }
    

    cardCreation();
  }, [pokeInfo, atackArray, pokeMoveSet]);

  function next(){
    if (num < endPoint){
      setNum(num + 3)
    }
    else{
      setNum(0)
    }
  }
  function back() {
    if (num < endPoint){
      setNum(num - 3)
    }
    else{
      setNum(endPoint)
    }
  }
  function RandomButton(){
    const randomNumber = Math.floor(Math.random() * endPoint) + 1;
    setNum(randomNumber)
  }

  return (
    <div className="App">
      <div className='cardHolder'>{code}</div>
      <Button onClick={back} variant="contained" size="large">
          Back
      </Button>
      <Button onClick={next} variant="contained" size="large">
          Next
      </Button>
      <Button onClick={RandomButton} variant="contained" size="large">
          Random
      </Button>
    </div>
  );
}

export default App;
