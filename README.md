<h1 align="center">SUPERHERO-ATIVIDADE</h1>

## Sumário
* [Objetivo](#objetivo)
*  [1. Estrutura do Projeto: HTML vs Next.js ](#htmlXnext)
*  [2. Requisição à API: ](#api)
*  [3. Atualização do DOM: Manipulação Direta vs React State](#3)
*  [4. Estilos CSS:](#4)
*  [5. Renderização e Componentização:](#5)
*  [6. Imagens](#imagens)
* [Autoras](#autoras)

  <div id='objetivo'/> 
   
## Objetivo

O objetivo desta atividade é demonstrar a transição de uma aplicação simples de exibição de heróis utilizando `HTML`, `CSS` e `JavaScript` para uma estrutura mais robusta e escalável usando Next.js e React. A proposta visa ilustrar como a aplicação pode ser modularizada, tornando o código mais limpo, reutilizável e fácil de manter, aproveitando os benefícios dos hooks do React, como `useState` e `useEffect`, e da gestão eficiente de estado. Além disso, a prova de conceito explora como a integração com APIs externas pode ser feita de maneira mais eficaz e segura com o uso de `fetch` e CSS Modules para encapsulamento de estilos, promovendo melhores práticas de desenvolvimento web.


<div id='htmlXnext' />

## 1. Estrutura do Projeto: HTML vs Next.js

O código original é baseado em HTML estático, que exibe informações diretamente dentro de um arquivo .html: 

```html
<html> 
  <body>
    <div id="heroes">
    </div>
  </body>
</html>
```

* O que estava fazendo: O HTML basicamente configurava a estrutura da página, e a interação com a API de super-heróis acontecia via JavaScript diretamente no <script>.
* Problema: Embora simples, o código não reutiliza componentes e depende de funções globais, o que pode ser ineficiente e difícil de manter.


Em `Next.js`, a estrutura do projeto é dividida em componentes e arquivos de estilo. O código está agora em um componente funcional dentro do diretório pages:

```next.js
"use client";  // Especifica que este é um componente cliente (React)
import { useState, useEffect } from "react";  // Hooks do React
import styles from "../styles/page.module.css";  // Importação de estilos CSS

export default function Home() {
  const [heroes, setHeroes] = useState([]);  // Gerencia o estado dos heróis
  ...
}
```

* O que está fazendo: Agora, temos um componente React que é mais modular. O useState gerencia o estado dos heróis, e useEffect permite buscar os dados assim que o componente for carregado.
* Por que mudou: Em vez de manipular o DOM diretamente, agora usamos um estado reativo para refletir as mudanças automaticamente, o que facilita a manutenção e a escalabilidade.


<div id='api' />
  
## 2. Requisição à API:
### Código original: 

```js
function getJSON(url, callback) {
  var xhr = new XMLHttpRequest(); 
  xhr.open('GET', url, true); 
  xhr.responseType = 'json'; 
  xhr.onload = function () {
    if (xhr.status === 200) {
      console.log('Dados recebidos com sucesso!'); 
      callback(xhr.response);
    } else {
      console.log('Problema ao conectar com a API: ' + xhr.status);
    } 
  }
  xhr.send(); 
}
```

* O que estava fazendo: O código original usa XMLHttpRequest para fazer a requisição HTTP à API de super-heróis. A resposta é manipulada com um callback, que é uma abordagem comum no JavaScript tradicional.
* Problema: O código usa uma abordagem antiga e não tão eficiente quanto a fetch, que é mais moderna e integrada com Promises, facilitando o manuseio de erros e fluxo assíncrono.

### Código Next.js: 

```next.js
const getHero = (id) => {
  const url = `${BASE_URL}${id}`;
  
  fetch(url)
    .then((response) => response.json())  // Converte a resposta para JSON
    .then((data) => {
      if (data.powerstats && data.image) {
        const hero = {
          name: data.name,
          intelligence: data.powerstats.intelligence || 0,
          strength: data.powerstats.strength || 0,
          image: data.image.url,
        };
        setHeroes((prevHeroes) => [...prevHeroes, hero]);  // Atualiza o estado com o herói
      }
    })
    .catch((error) => {
      console.error("Erro ao buscar dados", error);
    });
};
```

* O que está fazendo: O fetch é utilizado para fazer a requisição à API. Ele retorna uma Promise, que permite lidar de forma mais limpa com a resposta usando then e catch para tratar erros.
* Por que mudou: fetch é mais moderno, mais fácil de usar, e integrado ao ciclo de vida do React, o que torna o código mais legível e modular.

<div id='3' />

## 3. Atualização do DOM: Manipulação Direta vs React State

### Código original:

```js
document.getElementById("heroes").innerHTML += "<article>" +
  "<img src='" + image + "'/>" +
  "<h1>" + name + "</h1>" +
  "<p>intelligence: <span style='width: " + intelligence + "%; background-color: #F9B32F'></span> </p>" +
  "<p>strength: <span style='width: " + strength + "%; background-color: #FF7C6C'></span> </p>" +
  "</article>";
```

* O que estava fazendo: No código original, a resposta da API era usada diretamente para atualizar o conteúdo da página, manipulando o DOM com innerHTML.
* Problema: Manipulações diretas do DOM são propensas a erros e difíceis de gerenciar quando há atualizações frequentes, como no caso de adicionar heróis dinamicamente.

### Código Next.js:

``` next.js

return (
  <div className={styles.container}>
    <div className={styles.heroes}>
      {heroes.map((hero, index) => (
        <div key={index} className={styles.card}>
          <img src={hero.image} alt={hero.name} className={styles.heroImage} />
          <h1 className={styles.heroName}>{hero.name}</h1>
          <p>
            Intelligence:
            <p
              className={styles.setBar1}
              style={{ width: `${hero.intelligence}%` }}
            ></p>
          </p>
          <p>
            Strength:
            <p>
              className={styles.setBar2}
              style={{ width: `${hero.strength}%` }}
            ></p>
          </p>
        </div>
      ))}
    </div>
  </div>
);
```

* O que está fazendo: Em vez de manipular o DOM diretamente, o React usa o estado (heroes) para armazenar os dados dos heróis e automaticamente re-renderiza a página sempre que o estado é atualizado.
* Por que mudou: O React gerencia a renderização de maneira eficiente e baseada em estado, o que permite que o código seja mais modular e fácil de manter, sem a necessidade de atualizar manualmente o DOM.


<div id='4' />
  
## 4. Estilos CSS:

### Código original:
O código original usava CSS global, com regras aplicadas diretamente no arquivo HTML, como:

```css
#heroes {
  display: flex;
  flex-flow: row wrap;
  width: 100%;
  height: 100%;
  padding: 20px;
}
```

### Código next.js: 
No Next.js, usamos CSS Modules, que oferecem um escopo local para os estilos, evitando conflitos de nome.

```css
.heroes {
  display: flex;
  flex-flow: row wrap;
  justify-content: flex-start;
  gap: 20px;
  width: 100%;
}
```

* O que está fazendo: No código Next.js, cada arquivo CSS é tratado de maneira modular, ou seja, os estilos definidos em page.module.css afetam apenas os componentes que o importam.
* Por que mudou: O CSS Modules melhora a manutenção e evita problemas de colisão de classes ao isolar os estilos por componente, algo que o CSS global não oferece.



<div id ='5' />
  
## 5. Renderização e Componentização:

### Código original:

O código original é um arquivo HTML simples, sem componentes reutilizáveis ou modularização.

### Código next.js: 

No código Next.js, o HTML foi transformado em um componente React reutilizável. Cada herói é renderizado dentro de um cartão usando o map:

```next.js
{heroes.map((hero, index) => (
  <div key={index} className={styles.card}>
    <img src={hero.image} alt={hero.name} className={styles.heroImage} />
    <h1 className={styles.heroName}>{hero.name}</h1>
    <p>
      Intelligence:
      <span
        className={styles.setBar1}
        style={{ width: `${hero.intelligence}%` }}
      ></p>
    </p>
    <p>
      Strength:
      <p
        className={styles.setBar2}
        style={{ width: `${hero.strength}%` }}
      ></p>
    </p>
  </div>
))}
```

* O que está fazendo: O código agora utiliza componentes React e mapeia o array de heróis para renderizar dinamicamente os cartões de heróis.
* Por que mudou: A componentização permite reutilização e maior modularidade, o que facilita a manutenção e expansão da aplicação.

<div id='imagens' />
  
## Imagens

### IMAGEM original:
![image](https://github.com/user-attachments/assets/fde21340-c571-4695-84af-64f445b8118c)



### IMAGEM NEXT.JS: 

![image](https://github.com/user-attachments/assets/b5d0f313-a21b-472b-aed2-c22da9de90b1)



<div id='autoras'/>
   
## Autoras:
* Carolina Sun Ramos Nantes de Castilho 
* Clara Beatriz Aguiar 
 
