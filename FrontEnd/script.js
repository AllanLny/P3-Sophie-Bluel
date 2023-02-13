let apiWorks = "http://localhost:5678/api/works";

fetch(apiWorks).then((response) =>
  response.json().then((data) => {
    console.log(data);
    let affichage = "<div>";
    for (let image of data) {
      affichage += `<figure> <img src= "${image.imageUrl}"</img></figure>`;
      affichage += ` <figcaption>${image.title}</figcaption> `;
    }
    affichage += "</div>";
    document.querySelector(".gallery").innerHTML = affichage;
  })
);
