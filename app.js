// 1. Supabase 프로젝트에서 아래 두 값을 복사해서 넣으세요.
// Supabase Dashboard → Project Settings → API
const SUPABASE_URL = "여기에_SUPABASE_PROJECT_URL";
const SUPABASE_ANON_KEY = "여기에_SUPABASE_ANON_PUBLIC_KEY";

const client = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const loginStatus = document.querySelector("#loginStatus");
const logoutBtn = document.querySelector("#logoutBtn");

const signupEmail = document.querySelector("#signupEmail");
const signupPassword = document.querySelector("#signupPassword");
const signupBtn = document.querySelector("#signupBtn");

const loginEmail = document.querySelector("#loginEmail");
const loginPassword = document.querySelector("#loginPassword");
const loginBtn = document.querySelector("#loginBtn");

const postTitle = document.querySelector("#postTitle");
const postContent = document.querySelector("#postContent");
const postBtn = document.querySelector("#postBtn");
const refreshBtn = document.querySelector("#refreshBtn");
const postList = document.querySelector("#postList");

let currentUser = null;

function escapeHtml(text) {
  return String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

async function checkMe() {
  const { data, error } = await client.auth.getUser();

  if (error || !data.user) {
    currentUser = null;
    loginStatus.textContent = "로그인하지 않음";
    logoutBtn.classList.add("hidden");
    return;
  }

  currentUser = data.user;
  loginStatus.textContent = `${currentUser.email} 로그인 중`;
  logoutBtn.classList.remove("hidden");
}

async function loadPosts() {
  const { data, error } = await client
    .from("posts")
    .select("id, title, content, user_email, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    postList.innerHTML = `<p class="hint">게시글을 불러오지 못했습니다: ${escapeHtml(error.message)}</p>`;
    return;
  }

  if (!data || data.length === 0) {
    postList.innerHTML = `<p class="hint">아직 게시글이 없습니다.</p>`;
    return;
  }

  postList.innerHTML = data
    .map(
      (post) => `
        <article class="post">
          <h3>${escapeHtml(post.title)}</h3>
          <div class="meta">
            작성자: ${escapeHtml(post.user_email)} · ${new Date(post.created_at).toLocaleString()}
          </div>
          <p>${escapeHtml(post.content)}</p>
        </article>
      `
    )
    .join("");
}

signupBtn.addEventListener("click", async () => {
  const email = signupEmail.value.trim();
  const password = signupPassword.value;

  const { error } = await client.auth.signUp({
    email,
    password
  });

  if (error) {
    alert(error.message);
    return;
  }

  alert("회원가입 요청 완료. Supabase 설정에 따라 이메일 확인이 필요할 수 있습니다.");
  signupEmail.value = "";
  signupPassword.value = "";
  await checkMe();
});

loginBtn.addEventListener("click", async () => {
  const email = loginEmail.value.trim();
  const password = loginPassword.value;

  const { error } = await client.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    alert(error.message);
    return;
  }

  alert("로그인 성공");
  loginEmail.value = "";
  loginPassword.value = "";
  await checkMe();
});

logoutBtn.addEventListener("click", async () => {
  await client.auth.signOut();
  await checkMe();
});

postBtn.addEventListener("click", async () => {
  await checkMe();

  if (!currentUser) {
    alert("로그인이 필요합니다.");
    return;
  }

  const title = postTitle.value.trim();
  const content = postContent.value.trim();

  if (!title || !content) {
    alert("제목과 내용을 입력하세요.");
    return;
  }

  const { error } = await client.from("posts").insert({
    title,
    content,
    user_id: currentUser.id,
    user_email: currentUser.email
  });

  if (error) {
    alert(error.message);
    return;
  }

  alert("게시글 작성 완료");
  postTitle.value = "";
  postContent.value = "";
  await loadPosts();
});

refreshBtn.addEventListener("click", loadPosts);

checkMe();
loadPosts();
