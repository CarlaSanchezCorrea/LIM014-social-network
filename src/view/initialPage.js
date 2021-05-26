// eslint-disable-next-line import/no-cycle
import { dataPost, signOutUser, perfilPageUser } from '../lib/view-controller.js';
// eslint-disable-next-line import/no-cycle
import { showPost, setupPosts } from '../lib/posts.js';

export default () => {
  const templateInitialPage = document.createElement('section');
  const viewInitialPage = `
  <nav>
   <li id="myPerfil">Mi Perfil</li>
   <li id="signOut">Cerrar Sesión</li>
  </nav> 

  <article class = "create-post">
    <h2>Publica tus recetas</h2>
  <div class="img-textPost">
    <svg height="60" width="80">
      <circle cx="30" cy="30" r="25"/>
    </svg>
    <input type="text" id="textarea" placeholder="Comparte tus recetas">
    </input>
  </div>
  <hr>
  <div class="btn-post">
    <a>🥗 Comida</a>
    <a> 🍹 Bebida</a>
    <button id="btn" class="btn-to-post-default">Compartir</button>
  </div>
  </article>

  <div class="posts"></div>
   `;

  templateInitialPage.classList.add('position');
  templateInitialPage.innerHTML = viewInitialPage;
  showPost((data, userId) => {
    setupPosts(data, userId, templateInitialPage);
  });
  const textPost = templateInitialPage.querySelector('#textarea');
  const createPost = templateInitialPage.querySelector('#btn');
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
  });

  const perfilUser = templateInitialPage.querySelector('#myPerfil');
  perfilUser.addEventListener('click', () => {
    perfilPageUser();
  });

  const signOutLink = templateInitialPage.querySelector('#signOut');
  signOutLink.addEventListener('click', (e) => {
    e.preventDefault();
    signOutUser();
  });

  // const eventTypeTextarea = templateInitialPage.querySelector('#textarea');
  // eventTypeTextarea.addEventListener('keydown', (event) => {
  //   if (event.code === 'Enter') {
  //     console.log(eventTypeTextarea.value);
  //   }
  //   console.log(event.code);
  // });
  return templateInitialPage;
};
