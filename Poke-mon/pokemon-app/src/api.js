import { useState, useEffect } from "react";

export function usePokemonData() {
  const [data, setData] = useState([]);
  const [pokeInfo, setPokeInfo] = useState([]);
  const [endPoint, setEndPoint] = useState([]);
  const [num, setNum] = useState(0);
  const [atackArray, setPokeDamage] = useState([]);
  const [pokeMoveSet, setPokeMoveSet] = useState([]);

  useEffect(() => {
    //grabs 5 pokemon
    async function getLink() {
      const link = `https://pokeapi.co/api/v2/pokemon?limit=3&offset=${num}`;
      const responce = await fetch(link);
      const linked = await responce.json();
      const data = linked.results;
      const endPoint = linked.count;
      setEndPoint(endPoint);
      setData(data);
    }
    getLink();
  }, [num]);

  //grabs info on pokemon
  useEffect(() => {
    async function getPokemonInfo() {
      const infoArray = await Promise.all(
        data.map(async (stuff) => {
          const link = stuff.url;
          const response = await fetch(link);
          const pokemonInfo = await response.json();
          return pokemonInfo;
        })
      );

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
        weaknesse:
          typeInfo.damage_relations.double_damage_from.length > 0
            ? typeInfo.damage_relations.double_damage_from[
                Math.floor(
                  Math.random() *
                    typeInfo.damage_relations.double_damage_from.length
                )
              ].name
            : undefined,
        strength:
          typeInfo.damage_relations.double_damage_to.length > 0
            ? typeInfo.damage_relations.double_damage_to[
                Math.floor(
                  Math.random() *
                    typeInfo.damage_relations.double_damage_to.length
                )
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
          const move2 =
            rad2 < poke.moves.length ? poke.moves[rad2]?.move : null;

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

  return {
    pokeInfo,
    endPoint,
    num,
    atackArray,
    pokeMoveSet,
    setNum,
  };
}
