// Функция GET-запрос статей блога указанной страницы с выводом loader
async function getPosts(loader, number = 1) {
  try {
    loader.innerHTML = "ИДЕТ ЗАГРУЗКА...";
    const response = await (
      await fetch(`https://gorest.co.in/public-api/posts?page=${number}`)
    ).json();
    loader.innerHTML = "";
    return response;
  } catch {
    console.error();
  }
}
// Функция GET-запрос имени автора указанной статьи
async function getName(number) {
  try {
    return (
      await (
        await fetch(`https://gorest.co.in/public-api/users?id=${number}`)
      ).json()
    ).data[0].name;
  } catch {
    console.error();
  }
}
window.addEventListener("DOMContentLoaded", function () {
  const loader = document.createElement("div");
  document.body.append(loader);

  const list = document.createElement("ul");
  list.className = "list";
  const btns = document.createElement("div");
  btns.className = "btns";
  const btnNext = document.createElement("button");
  btnNext.className = "btnNext";
  btnNext.innerHTML = "NEXT";
  const btnBack = document.createElement("button");
  btnBack.className = "btnBack";
  btnBack.innerHTML = "BACK";
  const blockNumbersPages = document.createElement("ul");
  blockNumbersPages.className = "blockNumberPages";

  // определяем номер страницы из адреса страницы
  let url = new URL(location.href);
  let page = url.searchParams.get("page");
  let nowNumberPage = page ? Number(page) : 1;

  // отрисовываем страницу
  renderPosts(nowNumberPage);

  btnNext.addEventListener("click", (ev) => {
    // при переходе вперед создание нового адреса для каждой новой страницы(содержит 10 статей)
    ev.preventDefault();
    nowNumberPage += 10;
    url.searchParams.set("page", nowNumberPage);
    location.href = url;
    blockNumbersPages.remove();
  });
  btnBack.addEventListener("click", (ev) => {
    // при переходе назад создание нового адреса для каждой новой страницы(содержит 10 статей)
    ev.preventDefault();
    nowNumberPage -= 10;
    url.searchParams.set("page", nowNumberPage);
    location.href = url;
  });
  // Функция отрисовки списка статей блога
  async function renderPosts(nowNumberPage) {
    try {
      // запрос статей
      const data = await getPosts(loader, nowNumberPage);

      // очистка перед отрисовкой страницы
      list.innerHTML = "";
      loader.innerHTML = "";
      btns.innerHTML = "";

      // отрисовка каждой статьи
      data.data.forEach(async (element) => {
        const item = document.createElement("li");
        const card = document.createElement("div");
        card.className = "card";

        // запрос  имени автора статьи по id статьи
        const itemName = document.createElement("p");
        itemName.className = "itemName";
        const dataname = await getName(element.user_id);
        itemName.innerHTML = dataname;

        // дата создания статьи
        const itemTime = document.createElement("p");
        itemTime.className = "itemTime";
        itemTime.innerHTML = new Date(element.created_at).toLocaleDateString();

        // название статьи и ссылка на страницу  данной статьи
        const itemLink = document.createElement("a");
        itemLink.className = "itemLink";
        itemLink.innerHTML = element.title;
        itemLink.setAttribute("href", `post/post.html?id=${element.id}`);

        card.append(itemName, itemLink, itemTime);
        item.append(card);

        list.append(item);
      });
      // пагинация
      const numberPage = data.meta.pagination.page;
      const allPages = data.meta.pagination.pages;

      const groupTen = Math.floor(numberPage / 10);
      let i = groupTen ? groupTen * 10 : 1;
      if (i > 1) {
        const liFirstPage = document.createElement("li");
        liFirstPage.className = "liNumberPage";
        const linkFirstPage = document.createElement("a");
        linkFirstPage.className = "linkNumberPage";
        linkFirstPage.innerHTML = "1";
        linkFirstPage.setAttribute("href", "index.html?page=1");
        liFirstPage.append(linkFirstPage);

        const liMorePage = document.createElement("li");
        liMorePage.className = "liNumberPage";
        liMorePage.innerHTML = "...";
        blockNumbersPages.append(liFirstPage, liMorePage);
      }
      let limit = i == 1 ? 11 : i + 11;
      while (i < limit && i <= allPages) {
        console.log(i, numberPage);
        const liNumberPage = document.createElement("li");
        liNumberPage.className = "liNumberPage";
        const linkNumberPage = document.createElement("a");
        linkNumberPage.className = "linkNumberPage";
        linkNumberPage.innerHTML = i;
        if (i == numberPage)
          linkNumberPage.style = "background-color: blue; color: white";
        linkNumberPage.setAttribute("href", `index.html?page=${i}`);
        liNumberPage.append(linkNumberPage);
        blockNumbersPages.append(liNumberPage);
        i++;
      }
      if (i < allPages) {
        const liLastPage = document.createElement("li");
        liLastPage.className = "liNumberPage";
        const linkLastPage = document.createElement("a");
        linkLastPage.className = "linkNumberPage";
        linkLastPage.innerHTML = allPages;
        linkLastPage.setAttribute("href", `index.html?page=${allPages}`);
        liLastPage.append(linkLastPage);

        const liMorePage = document.createElement("li");
        liMorePage.className = "liNumberPage";
        liMorePage.innerHTML = "...";
        blockNumbersPages.append(liMorePage, liLastPage);
      }
      /* при выводе первой страницы блога не отображаем кнопку btnBack
         при выводе последней страницы блога не отображаем кнопку btnNext*/
      if (numberPage >= allPages-allPages%10) btnNext.remove();
      else btns.append(btnNext);

      if (numberPage >= 10) btns.append(btnBack)
      else btnBack.remove();

      btns.append(blockNumbersPages);
      document.body.append(list, btns);
    } catch {
      console.error();
    }
  }
});
