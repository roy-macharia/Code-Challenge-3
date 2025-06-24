const BASE_URL = 'http://localhost:3000/posts';
const postList = document.getElementById('post-list');
const postDetail = document.getElementById('post-detail');
const newPostForm = document.getElementById('new-post-form');
const editPostForm = document.getElementById('edit-post-form');

function displayPosts() {
  fetch(BASE_URL)
    .then(res => res.json())
    .then(posts => {
      postList.innerHTML = '';
      posts.forEach(post => renderPostListItem(post));
      if (posts.length) handlePostClick(posts[0].id); // Shows post
    });
}

function renderPostListItem(post) {
  const div = document.createElement('div');
  div.textContent = post.title;
  div.classList.add('post-title');
  div.addEventListener('click', () => handlePostClick(post.id));
  postList.appendChild(div);
}

function handlePostClick(id) {
  fetch(`${BASE_URL}/${id}`)
    .then(res => res.json())
    .then(post => showPostDetail(post));
}

function showPostDetail(post) {
  postDetail.innerHTML = `
    <h2>${post.title}</h2>
    <img src="${post.image}" alt="Post image" />
    <p>${post.content}</p>
    <small><strong>Author:</strong> ${post.author}</small>
    <br><br>
    <button onclick="startEdit(${post.id})">Edit</button>
    <button onclick="deletePost(${post.id})">Delete</button>
  `;

  // Saves the post for editing
  editPostForm.dataset.id = post.id;
  document.getElementById('edit-title').value = post.title;
  document.getElementById('edit-content').value = post.content;
}

function addNewPostListener() {
  newPostForm.addEventListener('submit', e => {
    e.preventDefault();
    const title = document.getElementById('new-title').value;
    const content = document.getElementById('new-content').value;
    const author = document.getElementById('new-author').value;

    const newPost = { title, content, author, image: "https://via.placeholder.com/150" };

    fetch(BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newPost)
    })
      .then(res => res.json())
      .then(post => {
        renderPostListItem(post);
        newPostForm.reset();
      });
  });
}

function startEdit(id) {
  editPostForm.classList.remove('hidden');
}

editPostForm.addEventListener('submit', e => {
  e.preventDefault();
  const id = editPostForm.dataset.id;
  const updatedPost = {
    title: document.getElementById('edit-title').value,
    content: document.getElementById('edit-content').value
  };

  fetch(`${BASE_URL}/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedPost)
  })
    .then(res => res.json())
    .then(post => {
      displayPosts();
      showPostDetail(post);
      editPostForm.classList.add('hidden');
    });
});

document.getElementById('cancel-edit').addEventListener('click', () => {
  editPostForm.classList.add('hidden');
});

function deletePost(id) {
  fetch(`${BASE_URL}/${id}`, {
    method: 'DELETE'
  })
    .then(() => {
      displayPosts();
      postDetail.innerHTML = '<p>Select a post to view details</p>';
    });
}

function main() {
  displayPosts();
  addNewPostListener();
}

document.addEventListener('DOMContentLoaded', main);