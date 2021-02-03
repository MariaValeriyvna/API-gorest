async function getpost(loader, title, post, nameAuthor) {
  try {
    loader.innerHTML = "ИДЕТ ЗАГРУЗКА...";
    const number = new URLSearchParams(location.search).get("id");
    const response = await (
      await fetch(`https://gorest.co.in/public-api/posts?id=${number}`)
    ).json();
    const name = await getName(response.data[0].user_id);
    nameAuthor.innerHTML = name ? name : "";
    title.innerHTML = response.data[0].title;
    post.innerHTML = response.data[0].body;
    const data = await getComment(response.data[0].id);
    loader.innerHTML = "";
    return data;
  } catch {
    console.error();
  }
}

async function getName(number) {
  try {
    const response = await (
      await fetch(`https://gorest.co.in/public-api/users?id=${number}`)
    ).json();
    return response.data[0].name;
  } catch {
    console.error();
  }
}

async function getComment(number) {
  try {
    const response = await (
      await fetch(`https://gorest.co.in/public-api/comments?id=${number}`)
    ).json();
    return response;
  } catch {
    console.error();
  }
}

window.addEventListener("DOMContentLoaded", function () {
  const loader = document.createElement("div");
  document.body.append(loader);

  const postBlock = document.createElement("div");
  postBlock.className = "postBlock";

  const btnBack = document.createElement("button");
  btnBack.className = "btnBack";
  btnBack.innerHTML = "Назад";

  const title = document.createElement("h1");
  title.style.color = "blue";
  const nameAuthor = document.createElement("h2");
  const post = document.createElement("p");
  post.style = "text-align: left; font-size: 22px";
  const nameComments = document.createElement("h3");
  nameComments.style.textAlign = "left";
  nameComments.innerHTML = "Комментарии";

  const comments = document.createElement("ul");

  renderPost();

  btnBack.addEventListener("click", (ev) => {
    ev.preventDefault();
    window.history.back();
  });

  async function renderPost() {
    try {
      const data = await getpost(loader, title, post, nameAuthor);
      data.data.forEach((element) => {
        const item = document.createElement("li");
        const cardComment = document.createElement("div");

        const itemName = document.createElement("p");
        itemName.style = "text-align: right";
        itemName.innerHTML =
          new Date(element.created_at).toLocaleDateString() +
          " " +
          element.name;

        const itemBody = document.createElement("p");
        itemBody.style = "text-align: left";
        itemBody.innerHTML = element.body;

        cardComment.append(itemName, itemBody);
        item.append(cardComment);

        comments.append(item);
      });
      postBlock.append(
        btnBack,
        title,
        nameAuthor,
        post,
        nameComments,
        comments
      );

      document.body.append(postBlock);
    } catch {
      console.error();
    }
  }
});
