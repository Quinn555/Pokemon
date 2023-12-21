import React, { useEffect, useState } from "react";
import typeImages from "./typeImages";

function Card({ pokeInfo, atackArray, pokeMoveSet, preName, evoImg }) {
  const [code, setCode] = useState([]);

  function capFirstLetter(word) {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }

  useEffect(() => {
    function cardCreation() {
      let names = pokeInfo.map((poke, index) => {
        const typeing =
          poke.types[Math.floor(Math.random() * poke.types.length)].type.name;

        const moveSymbles = [];
        let i = 0;
        let j = 0;
        let check = pokeMoveSet[index]?.[1]?.amount ?? 1;
        for (i = 0; i < check; i++) {
          const movePer = [];
          moveSymbles.push(movePer);
          for (j = 0; j < check; j++) {
            const moveType = pokeMoveSet[index]?.[i]?.type;
            if (moveType) {
              // Check if moveType is defined
              const moveSymblesHolder = (
                <svg
                  className="element-circle"
                  viewBox="0 0 512 512"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  key={`move-sym-${j}`}
                  style={{
                    backgroundColor: typeImages[moveType][1],
                    border: `1px solid ${typeImages[moveType][1]}`,
                  }}
                >
                  <path
                    className="small"
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d={typeImages[moveType][0]}
                    fill={typeImages[moveType][1]}
                  />
                </svg>
              );

              movePer.push(moveSymblesHolder);
            }
          }
        }
        return (
        <div key={poke.id} className="border">
            <div
              key={poke.name + index}
              className="card"
              style={{ backgroundColor: typeImages[typeing][1] }}
            >
              <div
                className="card-info-desighn"
                style={{ backgroundColor: typeImages[typeing][1] }}
              >
                <div
                  className={evoImg[index] ? "imgEvo" : "basic"}
                  style={{
                    backgroundImage: `url(${evoImg[index]})`,
                    alt: `${preName[index]}`,
                  }}
                >
                  {!evoImg[index] && <h3 className="hidden">basic</h3>}
                </div>
                <div className="pok-info">
                  <div className="card-title-holder">
                    <div className="card-title">
                      <h1>{capFirstLetter(poke.name)}</h1>
                      <div className="right-title">
                        <h4>HP</h4>
                        <h1>{poke.stats[0].base_stat} </h1>
                        <div className="small">
                          <svg
                            className="element-circle"
                            viewBox="0 0 512 512"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            key={`move-sym-${index}`}
                            style={{
                              backgroundColor: typeImages[typeing][1],
                              border: `1px solid ${typeImages[typeing][1]}`,
                            }}
                          >
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d={typeImages[typeing][0]}
                              fill={typeImages[typeing][1]}
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="big-container">
                    <div
                      className="big-box"
                      style={{
                        backgroundImage: `url(${poke.sprites?.front_default})`,
                      }}
                    ></div>
                    <div className="wide-box">
                      <div>NO.{poke.id}</div>
                      <div>{poke.weight}lbs</div>
                      <div>height:{poke.height}</div>
                    </div>
                  </div>

                  <div className="bottom">
                    <div className="movess">
                      <div className="moves">
                        <div className="move">
                          <div>{moveSymbles[0]}</div>
                          <h2>{pokeMoveSet[index]?.[0]?.moveName}</h2>
                          <h2>{pokeMoveSet[index]?.[0]?.damage}</h2>
                        </div>
                        <div className="center">
                          <h3>
                            {pokeMoveSet[index]?.[0]?.effect?.effect?.replace(
                              /\$effect_chance%/g,
                              ""
                            ).length > 20
                              ? pokeMoveSet[index]?.[0]?.effect?.effect
                                  ?.split(".")[0]
                                  .replace(/\$effect_chance%/g, "")
                              : pokeMoveSet[
                                  index
                                ]?.[0]?.effect?.effect?.replace(
                                  /\$effect_chance%/g,
                                  ""
                                )}
                          </h3>
                        </div>
                      </div>
                      <div className="moves">
                        <div className="move">
                          <div>{moveSymbles[1]}</div>
                          <h2>{pokeMoveSet[index]?.[1]?.moveName}</h2>
                          <h2>{pokeMoveSet[index]?.[1]?.damage}</h2>
                        </div>
                        <div className="center">
                          <h3>
                            {pokeMoveSet[index]?.[1]?.effect?.effect?.replace(
                              /\$effect_chance%/g,
                              ""
                            ).length > 20
                              ? pokeMoveSet[index]?.[1]?.effect?.effect
                                  ?.split(".")[0]
                                  .replace(/\$effect_chance%/g, "")
                              : pokeMoveSet[
                                  index
                                ]?.[1]?.effect?.effect?.replace(
                                  /\$effect_chance%/g,
                                  ""
                                )}
                          </h3>
                        </div>
                      </div>
                    </div>

                    <div className="wide-box-2">
                      <div className="wide-box-2">
                        <div>weaknesse {atackArray[index]?.weaknesse} X 2</div>
                        <div>strength {atackArray[index]?.strength} X 2</div>
                      </div>
                      <div>
                        Ability:
                        {
                          poke.abilities[
                            Math.floor(Math.random() * poke.abilities.length)
                          ].ability.name
                        }{" "}
                      </div>
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
  }, [pokeInfo, atackArray, pokeMoveSet, preName, evoImg]);

  return <div className="cardHolder">{code}</div>;
}

export default Card;
