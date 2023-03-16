const body = document.querySelector("body");
const header = document.querySelector("header");
const introduction = document.querySelector("#introduction");

//Creation de la bannière et bouton édition//
let editingBanner;
let editingButton;

const createBannner = () => {
  editingBanner = document.createElement("div");
  editingBanner.classList.add("editingbanner");
  editingBanner.innerHTML = `<i class="fa-regular fa-pen-to-square modal_trigger"></i>
  <p>Mode édition</p>
  <button class="changes_publication_button">publier les changements</button>`;
};

const createEditingButton = (id) => {
  editingButton = document.createElement("btn");
  editingButton.classList.add("edit_button");
  editingButton.setAttribute("id", id);
  editingButton.innerHTML = `<i class="fa-regular fa-pen-to-square"></i>
  <p>modifier</p>`;
};
// Insertion si admin //
if (localStorage.token) {
  createBannner();
  body.insertBefore(editingBanner, header);
  createEditingButton("change_button_photo");
  const introductionFigure = introduction.querySelector("figure");
  introductionFigure.append(editingButton);
  createEditingButton("change_button_intro");
  const introductionArticle = introduction.querySelector("article");
  introductionArticle.append(editingButton);
  createEditingButton("change_button_project");
  const filters = document.querySelector("#portfolio>h2");
  filters.append(editingButton);
}
// Déconnexion en quittant la page //
function removeToken() {
  localStorage.removeItem("token");
}
window.addEventListener("unload", removeToken);

// MODALES //
const modalAdding = document.querySelector("#modaladding");
const modalDelete = document.querySelector("#modaldelete");
const overlay = document.querySelector(".overlaymodal");
const modalTriggers = document.querySelector("#change_button_project");
const modalContainer = document.querySelector(".modalcontainer");
const modalDeleteContent = modalDelete.querySelector(".modal_content");
const closeTriggers = document.querySelector(".fa-solid.fa-xmark.modal_closing_icon")
const modalAddingTriggers = document.querySelector("#modaldelete>input")
const returnTriggers = document.querySelector(".fa-solid.fa-arrow-left-long.previous_icon")
const closeTriggers2 = document.querySelector("#modaladding>.fa-solid.fa-xmark.modal_closing_icon")

// OUVERTURE/FERMETURE MODALES //
modalTriggers.addEventListener("click", OpenModal);

function OpenModal() {
  modalContainer.classList.add("active")
  modalDelete.classList.toggle("active")
};

overlay.addEventListener("click", CloseModalOverlay);
closeTriggers.addEventListener("click", CloseModalOverlay);

function CloseModalOverlay() {
  modalContainer.classList.remove("active")
  modalDelete.classList.remove("active")
  modalAdding.classList.remove("active")
};

modalAddingTriggers.addEventListener("click", OpenModalAdding);

function OpenModalAdding() {
  modalDelete.classList.remove("active")
  modalContainer.classList.add("active")
  modalAdding.classList.toggle("active")
}

returnTriggers.addEventListener("click", returnModalDelete);

function returnModalDelete() {
  modalAdding.classList.remove("active")
  modalContainer.classList.add("active")
  modalDelete.classList.toggle("active")
}

closeTriggers2.addEventListener("click", CloseModalOverlay);

fetch(apiWorks + "works")
  .then((response) => {
    if (response.ok) {
      return response.json();
    }
  })
  .then((projects) => {
    getAllProjects(projects, createModalCard);

  })
  .catch((err) => {
    console.log(err);
  });

// Fonction de création des cartes de la modale
const createModalCard = (project) => {
  //Création de la card
  const editCard = document.createElement("figure");
  editCard.classList.add("edit_Card");
  editCard.dataset.id = project.id;
  //Insertion de l'image et de la description
  const image = document.createElement("img");
  image.crossOrigin = "anonymous";
  image.src = project.imageUrl;
  image.alt = project.title;
  const description = document.createElement("figcaption");
  description.innerHTML = `<p class="editing_trigger">éditer</p>
  <button
      <i class="fa-solid fa-trash-can"></i>
  </button`;
  description.setAttribute("id", "deleteBtn");
  // Supprimer un projet ciblé //
  description.addEventListener('click', function () {
    fetch(`http://localhost:5678/api/works/${project.id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${localStorage.token}`,
      },
    })
      .then(response => {
        if (response.ok) {
          console.log(project.id)
          alert("Projet supprimé avec succès !");
        }
      });
  });



  // Insertion des cards et de leur contenu dans le document //
  modalDeleteContent.append(editCard);
  editCard.append(image);
  editCard.append(description);
};
// Ajout de l'image chargée dans l'AddingModal //
const imageUpload = document.getElementById("image_upload");
const uploadContainer = document.querySelector(".uploadcontainer");
const previewImage = document.querySelector(".image_preview");
const LabelUpload = uploadContainer.querySelector("label");

imageUpload.addEventListener("change", function () {
  const file = this.files[0];
  if (file) {
    const reader = new FileReader();
    previewImage.style.display = "block";

    reader.addEventListener("load", function () {
      LabelUpload.style.visibility = "hidden";
      previewImage.setAttribute("src", this.result);
    });
    reader.readAsDataURL(file);
  }
});

// Modification du style du submit quand formulaire remplit //
const submitBtn = document.getElementById("modal_form_validation");
const FormModalAdding = modalAdding.querySelector("form");
FormModalAdding.addEventListener("input", function () {
  submitBtn.setAttribute("class", "active_button");
});

// Ajout works dans l'api//
submitBtn.addEventListener("click", function () {
  const title = document.querySelector('#TitleImageInput input').value;
  const image = imageUpload.files[0];
  const categoryElements = document.querySelector('#category_input').value.split(',');
  const categoryId = parseInt(categoryElements[0]);
  const categoryName = categoryElements[1];

  const formData = new FormData();

  formData.append('title', title);
  formData.append('image', image);
  formData.append('category', categoryId);

  fetch('http://localhost:5678/api/works', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${localStorage.token}`,
    },
    body: formData,
  })
    .then(function (response) {
      if (response.ok) {
        alert('Nouveau projet envoyé avec succès !');
      } else {
        alert('Erreur lors de la lecture des informations.')
      }
    })
});

