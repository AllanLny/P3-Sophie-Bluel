let apiWorks = "http://localhost:5678/api/works";

fetch(apiWorks).then((response) =>
  response.json().then((data) => {
    console.log(data);
    let affichage = "";
    for (let image of data) {
      affichage += `<figure><img src= "${image.imageUrl}"</img>`;
      affichage += ` <figcaption>${image.title}</figcaption>
      </figure> `;
    }
    document.querySelector(".gallery").innerHTML = affichage;
  })
);
