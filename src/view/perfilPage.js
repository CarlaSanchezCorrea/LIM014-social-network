// eslint-disable-next-line import/no-cycle
import { signOutUser, pageInitial, dataPost } from '../lib/view-controller.js';
// eslint-disable-next-line import/no-cycle
import { setupPosts } from '../lib/posts.js';
// eslint-disable-next-line import/no-cycle
import { editDescriptions, getUser, showPostUserid } from '../lib/firestore-controller.js';
// eslint-disable-next-line import/no-cycle
import { currentUser } from '../lib/firebase-controller.js';

export default () => {
  const templatePerfilPage = document.createElement('section');
  const viewPerfilPage = `
    <div class="tabs">
    <div class="tabs__inner">
        <a class="tabs__item">
          <img data-feather="home" src="./img/ichef oro.png" id="bar-chart"></img>
          <h1>I CHEF</h1>
          <span class="tabs__tooltip">I CHEF</span>
        </a>
        <a class="tabs__item" id="inicio">
          <img data-feather="home" src="./img/menu/home.png"></img>
          <span class="tabs__tooltip">Inicio</span>
        </a>
        <a class="tabs__item tabs__item--active" id="menu-perfil-page">
          <div id="backgroung-img">
            <img id="user-pic-initalPage" class="demo-avatar">
          </div>
          <span id="myPerfil-Inital"></span>
          <span class="tabs__tooltip">Mi Perfil</span>
        </a>
        <a class="tabs__item" id="signOut">
          <img data-feather="logOut" src="./img/menu/log out.png" id="logOut"></img>
          <span class="tabs__tooltip">Cerrar Sesión</span>
        </a>
    </div>
  </div>
  
  <div class="grid">
    <div class="page_left">
      <article class="infoUser">
        <div>
          <img class="portada" src ="./img/comida.jpg">
        </div>
          <div class="infoUser_data">
            <img id="user-pic" class="demo-avataar">
            <div style="margin-left:10px">
              <h2 id="user-name"></h2>
            </div>
          </div>

          <section>
              <div class="btn-post">
                <span class="show-edit-description">Editar perfil</span> 
            </div>
            <div class="text-description-myself">
              <input id="textareaDescription" placeholder="Acerca de mi">
              </input>
              <div class="btn-post">
               <button id="cancel-edit-post" class="btn-to-post-default">Cancel</button>
                <button id="btnGuardar" class="btn-to-post-default">Guardar</button>
              </div>
            </div>
            <p id="descripcion"></p>
         </section>
    
        <article class = "create-post" id="create-post-perfil">
          <h2>Publica tus recetas</h2>
            <div class="img-textPost">
            <div id="backgroung-img">
              <img id="user-pic-initalPage" class="demo-avataar" src="" />
            </div>
              <input type="text" id="textarea" placeholder="Comparte tus recetas">
              </input>
            </div>
          <div class="btn-post">
            <a>🥗 Comida</a>
            <a> 🍹 Bebida</a>
            <button id="btn" class="btn-to-post-default">Compartir</button>
          </div>
        </article>
      </div>
    <div class="page_right">
      <div class="posts"></div>
    </div>
  </div>
     `;

  templatePerfilPage.classList.add('position');
  templatePerfilPage.innerHTML = viewPerfilPage;

  const userID = sessionStorage.getItem('id');
  showPostUserid((data) => {
    setupPosts(data, userID, templatePerfilPage);
  }, userID);
  const hiddenEditDescriptonText = templatePerfilPage.querySelector('.text-description-myself');
  const buttonHiddenDescription = templatePerfilPage.querySelector('.show-edit-description');
  buttonHiddenDescription.addEventListener('click', () => {
    hiddenEditDescriptonText.style.display = 'block';
  });
  const buttonNoneDescription = templatePerfilPage.querySelector('#cancel-edit-post');
  buttonNoneDescription.addEventListener('click', () => {
    hiddenEditDescriptonText.style.display = 'none';
  });
  const publicarDescripcion = templatePerfilPage.querySelector('#btnGuardar');
  const textDescription = templatePerfilPage.querySelector('#textareaDescription');
  textDescription.addEventListener('input', () => {
    if (textDescription.value !== '') {
      publicarDescripcion.classList.remove('btn-to-post-default');
      publicarDescripcion.classList.add('string-text-post');
    } else {
      publicarDescripcion.classList.remove('string-text-post');
      publicarDescripcion.classList.add('btn-to-post-default');
    }
  });
  publicarDescripcion.addEventListener('click', () => {
    const user = currentUser();
    editDescriptions(user.uid, textDescription.value);
    textDescription.value = '';
    publicarDescripcion.classList.remove('string-text-post');
    publicarDescripcion.classList.add('btn-to-post-default');
    hiddenEditDescriptonText.style.display = 'none';
  });
  // const unsubscribe = firebase.firestore().collection('users').doc(userID).onSnapshot((doc) => {
  //   console.log(doc.data());
  //   const user = doc.data();
  //   if (user && user.Description) {
  //     const description = user.Description;
  //     const postDescription = document.getElementById('descripcion');
  //     postDescription.textContent = description;
  //   }
  // });
  // unsubscribe(); // para desactivar el onsnapshot, el observador se quita

  const publicar = templatePerfilPage.querySelector('#btn');
  publicar.addEventListener('click', () => {
    dataPost();
  });
  const HomePage = templatePerfilPage.querySelector('#inicio');
  HomePage.addEventListener('click', () => {
    pageInitial();
  });
  const signOutLink = templatePerfilPage.querySelector('#signOut');
  signOutLink.addEventListener('click', (e) => {
    e.preventDefault();
    signOutUser();
  });

  const textPost = templatePerfilPage.querySelector('#textarea');
  const createPost = templatePerfilPage.querySelector('#btn');
  textPost.addEventListener('input', () => {
    if (textPost.value !== '') {
      createPost.classList.remove('btn-to-post-default');
      createPost.classList.add('string-text-post');
    } else {
      createPost.classList.remove('string-text-post');
      createPost.classList.add('btn-to-post-default');
    }
  });
  createPost.addEventListener('click', () => {
    dataPost(textPost.value, createPost);
    textPost.value = '';
    createPost.classList.remove('string-text-post');
    createPost.classList.add('btn-to-post-default');
  });

  getUser(userID, (userData) => {
    if (userData.exists) {
      const user = userData.data();
      const name = user.Usuario;
      const userNameComplete = templatePerfilPage.querySelectorAll('#myPerfil-Inital');

      const separador = ' '; // un espacio en blanco
      const arregloDeSubCadenas = name.split(separador); // SEPARA EL NOMBRE EN CADENAS INDIVIDUALES
      // IMPRIME EL NOMBRE INGRESADO
      const nameUser = arregloDeSubCadenas[0];
      userNameComplete.forEach((e) => {
        e.textContent = nameUser;
      });
      const userImage = templatePerfilPage.querySelectorAll('#user-pic-initalPage');
      const userPhoto = user.Photo;
      userImage.forEach((e) => {
        if (userPhoto != null) {
          e.src = userPhoto;
        } else {
          e.src = './img/avataar.png';
        }
      });
    }
  });

  return templatePerfilPage;
};
