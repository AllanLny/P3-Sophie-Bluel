const apiWorks = "http://localhost:5678/api/";

const gallery = document.querySelector(".gallery");
const portfolio = document.querySelector("#portfolio");


// création cards //
function createScriptCard() {
  // Création Filtres //
  const filters = document.createElement("div");
  filters.classList.add("filters");
  portfolio.insertBefore(filters, gallery);

  // Filtre importation dans le HTML //

  const createFilter = (element, classes = [], content) => {
    let filter = document.createElement(element);
    classes.forEach((classe) => {
      filter.classList.add(classe);
    });
    filter.textContent = content;
    filters.append(filter);
  };

  const button = createFilter("button", ["filter", "active_filter"], "Tous");

  const createCard = (project) => {
    const card = document.createElement("figure");
    card.classList.add("cardPhoto");
    card.dataset.category = project.categoryId;
    // création images //
    const image = document.createElement("img");
    image.src = project.imageUrl;
    image.alt = project.title;
    // création figcaption //
    const description = document.createElement("figcaption");
    description.textContent = project.title;
    // Insertion Cards/Figure/figcaption //
    gallery.appendChild(card);
    card.appendChild(image);
    card.appendChild(description);
  };
  // Fonction récupération des projets
  const getAllProjects = (projects, fonction) => {
    const projectsSet = new Set(projects);
    projectsSet.forEach((project) => {
      fonction(project);
    });
  };
  // Mise en fonction des Filtres //
  const applyFilters = () => {
    let filtersList = document.querySelectorAll(".filter");
    filtersList.forEach((filter, index) => {
      filter.addEventListener("click", function () {
        document
          .querySelector(".active_filter")
          .classList.remove("active_filter");
        this.classList.add("active_filter");
        // Mise en place du filtrage //
        let cards = document.querySelectorAll(".cardPhoto");
        for (let card of cards) {
          card.style.display = "none";
          if (index === 0 || index == card.dataset.category) {
            card.style.display = "block";
          }
        }
      });
    });
  };
  // Récupération des catégories  //
  fetch(apiWorks + "categories")
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
    })
    // Utilisation des catégorie pour les filtres //
    .then((categories) => {
      categories.forEach((category) => {
        createFilter("button", ["filter"], category.name);
      });
    })
    .catch((err) => {
      console.log(err);
    });

  // Récupération des travaux + affichage //
  fetch(apiWorks + "works")
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
    })
    .then((projects) => {
      getAllProjects(projects, createCard);
      applyFilters();
    })
    .catch((err) => {
      console.log(err);
    });
}

createScriptCard();

function removeGalleryScript() {
  const galleryCard = gallery.querySelectorAll(".cardPhoto");
  galleryCard.forEach(function (card) {
    card.remove();
  });
  const galleryFilter = portfolio.querySelectorAll(".filters");
  galleryFilter.forEach(function (button) {
    button.remove();
  });
}
