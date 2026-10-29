(() => {
  "use strict";
  const config = window.LANE_FRONTIER_NEWS || {};
  const base = typeof config.apiBaseUrl === "string" ? config.apiBaseUrl.trim().replace(/\/$/, "") : "";

  function dateText(iso) {
    const date = new Date(iso);
    return Number.isNaN(date.getTime()) ? "" :
      new Intl.DateTimeFormat("ja-JP", { year: "numeric", month: "2-digit", day: "2-digit" }).format(date);
  }

  async function getJson(path) {
    if (!base) throw new Error("APIの接続先が未設定です。");
    const response = await fetch(base + path, {
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(10_000),
    });
    if (!response.ok) throw new Error("お知らせを取得できませんでした。");
    return response.json();
  }

  function newsItem(post) {
    const item = document.createElement("li");
    item.className = "news-item news-clickable-item";
    const anchor = document.createElement("a");
    anchor.className = "news-item-link";
    anchor.href = "news.html?id=" + encodeURIComponent(post.id);
    const time = document.createElement("time");
    time.dateTime = post.published_at || "";
    time.textContent = dateText(post.published_at);
    const heading = document.createElement("span");
    heading.className = "news-item-title";
    heading.textContent = post.title;
    const arrow = document.createElement("span");
    arrow.className = "news-item-arrow";
    arrow.textContent = "→";
    arrow.setAttribute("aria-hidden", "true");
    anchor.append(time, heading, arrow);
    item.append(anchor);
    return item;
  }

  async function home() {
    const list = document.getElementById("dynamic-news-list");
    if (!list || !base) return; // 設定前は既存のお知らせを保持する。
    try {
      const data = await getJson("/api/news?limit=4");
      list.replaceChildren(...data.items.map(newsItem));
      if (!data.items.length) {
        const item = document.createElement("li");
        item.className = "news-item";
        item.textContent = "現在、お知らせはありません。";
        list.append(item);
      }
    } catch {
      // 公開API障害時にも、既存の1件のお知らせを表示できるようにする。
    }
  }

  async function indexPage() {
    const list = document.getElementById("all-news-list");
    if (!list) return;
    const status = document.getElementById("news-list-status");
    const loadMore = document.getElementById("news-load-more");
    let offset = 0;
    async function load() {
      loadMore.hidden = true;
      status.textContent = "読み込み中…";
      try {
        const data = await getJson(`/api/news?limit=10&offset=${offset}`);
        list.append(...data.items.map(newsItem));
        offset = data.nextOffset;
        loadMore.hidden = !data.hasMore;
        status.textContent = list.children.length ? "" : "まだお知らせはありません。";
      } catch {
        status.textContent = base ? "お知らせを読み込めませんでした。少し時間をおいて再度お試しください。" :
          "お知らせ一覧は準備中です。ホームページのお知らせをご確認ください。";
      }
    }
    loadMore.addEventListener("click", load);
    await load();
  }

  async function articlePage() {
    const title = document.getElementById("news-article-title");
    if (!title) return;
    const status = document.getElementById("news-article-status");
    const id = new URLSearchParams(location.search).get("id") || "";
    if (!/^[a-zA-Z0-9_-]{1,64}$/.test(id)) {
      title.textContent = "記事が見つかりません";
      return;
    }
    try {
      const data = await getJson("/api/news/" + encodeURIComponent(id));
      const post = data.article;
      title.textContent = post.title;
      document.title = post.title + " | Lane Frontier";
      const date = document.getElementById("news-article-date");
      date.dateTime = post.published_at || "";
      date.textContent = dateText(post.published_at);
      document.getElementById("news-article-body").textContent = post.body;
      if (post.image_id) {
        const img = document.getElementById("news-article-image");
        img.src = base + "/api/images/" + encodeURIComponent(post.image_id);
        img.hidden = false;
      }
      status.textContent = "";
    } catch {
      title.textContent = "記事を表示できませんでした";
      status.textContent = "しばらくしてからもう一度お試しください。";
    }
  }

  home();
  indexPage();
  articlePage();
})();
