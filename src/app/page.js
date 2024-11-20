"use client";
import { useState, useEffect } from "react";
import styles from "./page.module.css";

const BASE_URL = "https://superheroapi.com/api.php/4995282617154105/";

export default function Home() {
  const [heroes, setHeroes] = useState([]);

  const getHero = (id) => {
    const url = `${BASE_URL}${id}`;

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        if (data.powerstats && data.image) {
          const hero = {
            name: data.name,
            intelligence: data.powerstats.intelligence || 0,
            strength: data.powerstats.strength || 0,
            image: data.image.url,
          };
          setHeroes((prevHeroes) => {
            if (!prevHeroes.find((h) => h.name === hero.name)) {
              return [...prevHeroes, hero];
            }
            return prevHeroes;
          });
        } else {
          console.error("Dados incompletos para o herói", data);
        }
      })
      .catch((error) => {
        console.error("Erro ao buscar dados", error);
      });
  };

  useEffect(() => {
    getHero(200);
    getHero(465);
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.heroes}>
        {heroes.map((hero, index) => (
          <div key={index} className={styles.card}>
            <img
              src={hero.image}
              alt={hero.name}
              className={styles.heroImage}
            />
            <h1 className={styles.heroName}>{hero.name}</h1>
            <p>
              Intelligence:
              <span
                className={styles.setBar1}
                style={{ width: `${hero.intelligence}%` }}
              ></span>
            </p>
            <p>
              Strength:
              <span
                className={styles.setBar2}
                style={{ width: `${hero.strength}%` }}
              ></span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}