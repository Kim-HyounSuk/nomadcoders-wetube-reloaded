const $videoContainer = document.querySelector("#videoContainer");
const $form = document.querySelector("#commentForm");

let deleteComments = document.querySelectorAll("#delete__comment");

const addComment = (text, userInfo, id) => {
  const $videoComments = document.querySelector(".video__comments ul");
  const newComment = document.createElement("li");
  newComment.dataset.id = id;
  newComment.classList.add("video__comment");
  newComment.innerHTML = `
    <div>
      <a href='/users/${userInfo._id}'>
        <div class='video__comment__avatar' style='background-image:url(/${userInfo.avatarUrl});'>
        </div>
      </a>
    </div>
    <div>
      <a href='/users/${userInfo._id}'>
        <span>${userInfo.username}</span>
      </a>
      <p>${text}</p>
    </div>
    <div>
      <span id='delete__comment'>삭제</span>
    </div>
  `;
  $videoComments.prepend(newComment);
};

const handleSubmit = async (e) => {
  e.preventDefault();
  const $input = $form.querySelector("input");
  const text = $input.value;
  const videoId = $videoContainer.dataset.id;
  if (text === "") {
    return;
  }
  const response = await fetch(`/api/videos/${videoId}/comment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text,
    }),
  });
  if (response.status === 201) {
    const { userInfo, newCommentId } = await response.json();
    addComment(text, userInfo, newCommentId);
  }
};

if ($form) {
  $form.addEventListener("submit", handleSubmit);
}

const handleDeleteComment = async (e) => {
  const li = e.srcElement.parentNode.parentNode;
  const commentId = li.dataset.id;

  await fetch(`/api/comments/${commentId}/delete`, {
    method: "DELETE",
  });
  li.remove();
};

if (deleteComments) {
  deleteComments.forEach((deleteComment) => {
    deleteComment.addEventListener("click", handleDeleteComment);
  });
}
