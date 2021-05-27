// eslint-disable-next-line import/no-cycle
import {
  deletePost, orderPostbyTimeDesc, editPost, likePost,
} from './firestore-controller.js';
// eslint-disable-next-line import/no-cycle
import { templatePost, createAttributesButton, templateModal } from './templates-sections.js';
// eslint-disable-next-line import/no-cycle
import { notUserSignIn } from '../view/not-user-sign-in.js';

export const idDocumentPost = (e) => {
  const idPost = e.target.dataset.id;
  deletePost(idPost);
};
export const setupPosts = (data, user, template) => {
  const postList = template.querySelector('.posts');
  postList.innerHTML = '';

  if (data.length) {
    data.forEach((doc) => {
      const section = templatePost(doc);
      postList.appendChild(section);
      const buttonCancelEditPost = createAttributesButton('cancelar', 'btn-cancel-edit-post');
      const textPost = section.querySelector('#text-post');

      // likes
      const likes = section.querySelector('#btn-like');
      likes.addEventListener('click', () => {
        const result = doc.likes.indexOf(user);
        if (result === -1) {
          doc.likes.push(user);
          likePost(doc.id, doc.likes);
        } else {
          doc.likes.splice(result, 1);
          likePost(doc.id, doc.likes);
        }
      });

      if (user === doc.idUser) {
        // botón eliminar post
        const btnDeletePost = createAttributesButton(
          'eliminar',
          'btn-delete',
          doc.id,
        );
        section.appendChild(btnDeletePost);
        // obteniendo nuevos valores
        const templateModalValue = templateModal();
        section.appendChild(templateModalValue);
        const modalContainer = section.querySelector('.modal-container');
        const optionYes = templateModalValue.querySelector('.btn-confirmYes');
        optionYes.dataset.id = doc.id;
        const optionNo = templateModalValue.querySelector('.btn-confirmNo');
        btnDeletePost.addEventListener('click', () => {
          modalContainer.style.display = 'flex';
        });
        optionNo.addEventListener('click', () => {
          modalContainer.style.display = 'none';
        });
        optionYes.addEventListener('click', idDocumentPost);
        postList.appendChild(section);
        // botón editar post
        const buttonEditPost = createAttributesButton('editar', 'btn-edit', doc.id);
        section.appendChild(buttonEditPost);
        // creando input para editar post
        const inputEditPost = document.createElement('input');
        inputEditPost.value = textPost.textContent;
        // creando botón para guardar lo editado
        const buttonSaveEditPost = createAttributesButton('cambiar', 'btn-save-edit-Post', doc.id);
        // reemplazando botones de seguridad
        buttonEditPost.addEventListener('click', () => {
          section.replaceChild(buttonCancelEditPost, btnDeletePost);
          section.replaceChild(buttonSaveEditPost, buttonEditPost);
          section.replaceChild(inputEditPost, textPost);
        });
        buttonCancelEditPost.addEventListener('click', () => {
          section.replaceChild(btnDeletePost, buttonCancelEditPost);
          section.replaceChild(buttonEditPost, buttonSaveEditPost);
          section.replaceChild(textPost, inputEditPost);
        });
        buttonSaveEditPost.addEventListener('click', () => {
          editPost(doc.id, inputEditPost.value);
        });
      }
    });
  } else {
    postList.innerHTML = '<h4 class="text-white">Login to See Posts</h4>';
  }
};

export const showPost = (callback) => {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      orderPostbyTimeDesc(callback, user.uid);
    } else {
      const container = document.getElementById('container');
      container.innerHTML = '';
      // callback([]);
      container.appendChild(notUserSignIn(container));
    }
  });
};
