# GitHub Pages + Supabase 로그인 게시판

프론트엔드: GitHub Pages  
로그인/Auth: Supabase Auth  
데이터베이스: Supabase PostgreSQL

## 1. Supabase 준비

1. Supabase에서 새 프로젝트 생성
2. SQL Editor 열기
3. `supabase-schema.sql` 내용 붙여넣기
4. Run 실행

## 2. app.js 수정

Supabase Dashboard → Project Settings → API에서 아래 값을 찾습니다.

- Project URL
- anon public key

`app.js` 상단의 값을 교체합니다.

```js
const SUPABASE_URL = "여기에_SUPABASE_PROJECT_URL";
const SUPABASE_ANON_KEY = "여기에_SUPABASE_ANON_PUBLIC_KEY";
```

## 3. GitHub에 올리기

터미널에서 프로젝트 폴더로 이동한 뒤:

```bash
git init
git add .
git commit -m "first commit"
git branch -M main
git remote add origin 깃허브_저장소_URL
git push -u origin main
```

## 4. GitHub Pages 켜기

GitHub 저장소 → Settings → Pages

- Source: Deploy from a branch
- Branch: main
- Folder: /root

저장 후 잠시 기다리면 Pages 주소가 나옵니다.

## 주의

이 버전은 `server.js`, `npm install`, `npm start`가 필요 없습니다.  
GitHub Pages에 정적 파일로 올리고, 로그인/DB는 Supabase가 담당합니다.
