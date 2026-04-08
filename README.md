# 🐰 Easter Egg Catcher 🥚

Un joc distractiv cu tematică de Paște! Prinde ouăle colorate care cad din cer cu iepurașul tău.

## Structura fișierelor

```
index.html        – Pagina principală (meniu, joc, game over, statistici, setări)
css/style.css     – Stiluri complete cu animații și design responsive
js/storage.js     – Gestionare LocalStorage (scoruri, setări, statistici)
js/audio.js       – Efecte sonore procedurale cu Web Audio API
js/game.js        – Logica principală a jocului
```

## Cum se joacă

| Control       | Acțiune                  |
|---------------|--------------------------|
| ← → / A D    | Mișcă iepurașul          |
| Touch / Swipe | Control pe mobil         |
| Mouse drag    | Control cu mouse         |
| P / Escape    | Pauză                    |

### Tipuri de ouă

| Ou         | Puncte |
|------------|--------|
| 🥚 Normal  | +10    |
| ✨ Glitter | +25    |
| ⭐ Auriu   | +50    |
| 🖤 Stricat | -20    |

### Power-ups

| Power-up       | Efect                              | Durată |
|----------------|------------------------------------|--------|
| 🧲 Magnet      | Atrage ouăle automat               | 5s     |
| 🛡️ Scut       | Protecție față de ouăle stricate   | 10s    |
| 2️⃣ Duble      | Puncte duble                       | 8s     |
| ❤️ Viață Extra | Adaugă o viață                     | –      |

## Funcționalități

- 🐰 **Iepurașul** controlabil cu tastatura, touch sau mouse
- 🥚 **Ouă colorate** care cad cu viteză crescândă pe niveluri
- ⭐ **Power-ups** cu efecte speciale
- ❤️ **3 vieți** – pierzi una când un ou bun cade pe jos
- 📊 **Sistem de niveluri** – la fiecare 200 puncte crește dificultatea
- 🏆 **High Score** și statistici persistente (LocalStorage)
- 🎵 **Efecte sonore** generate procedural (Web Audio API)
- 📱 **Responsive** – funcționează pe desktop, tabletă și mobil
- 💾 **Fișiere statice** – compatibil cu orice server web (inclusiv PHP 5.6)

## Instalare

Copiați fișierele pe server și accesați `index.html`. Nu necesită instalare sau build tools.

## Tehnologii

- HTML5 semantic
- CSS3 (animații, tranziții, responsive design – fără framework-uri)
- JavaScript ES5/ES6 (Vanilla JS – fără biblioteci externe)
- LocalStorage pentru persistarea datelor
- Web Audio API pentru efecte sonore procedurale