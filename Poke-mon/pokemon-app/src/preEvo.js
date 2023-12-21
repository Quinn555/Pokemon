import { useState, useEffect } from "react";

export function usePreEvo(pokeInfo) {
  const [evoData, setEvoData] = useState([]);
  const [preName, setPreName] = useState([]);
  const [evoImg, setEvoImg] = useState([]);

  useEffect(() => {
    // grab species info
    async function getEvoData() {
      const evoData = [];
      for (const item of pokeInfo) {
        const link = item.species.url;
        const response = await fetch(link);
        const linked = await response.json();
        const data = linked.evolution_chain;
        const name = item.name;
        evoData.push([data, name]);
      }
      setEvoData(evoData);
    }
    getEvoData();
  }, [pokeInfo]);

  useEffect(() => {
    // grab species img
    async function getEvoInfo() {
      const preName = [];
      for (const item of evoData) {
        const link = item[0].url;
        const response = await fetch(link);
        const linked = await response.json();

        const nameOne = linked.chain.species.name;
        const nameTwo = linked.chain.evolves_to[0]?.species.name;
        const nameThree =
          linked.chain.evolves_to[0]?.evolves_to[0]?.species.name;
        let evoName;
        if (item[1] === nameOne) {
          evoName = "basic";
        } else if (item[1] === nameTwo) {
          evoName = nameOne;
        } else if (item[1] === nameThree) {
          evoName = nameTwo;
        }
        preName.push(evoName);
      }
      setPreName(preName);
    }
    getEvoInfo();
  }, [evoData]);
  useEffect(() => {
    async function getEvoImg() {
      const imgData = [];
      for (const item of preName) {
        if (item !== 'basic' && item) {
            const link = `https://pokeapi.co/api/v2/pokemon/${item}`;
            const response = await fetch(link);
            const linked = await response.json();
            const data = linked.sprites.front_default;
            imgData.push(data);
        }
        else{
            const data = undefined;
            imgData.push(data);
        }
      }
      setEvoImg(imgData);
    }
    getEvoImg();
  }, [preName]);

  return {
    preName,
    evoImg
  };
}
