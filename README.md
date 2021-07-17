# 🍔Nuber-Eats-BackEnd

## 📖개요
Nomad Coder에서 수강한 Nuber Eats Clone Coding입니다.<br />
크게 식당, 손님, 배달원으로 구성된 배달음식 서비스 입니다.<br />
큼직한 기능들은 구현되고 세세한 기능들은 개인적으로 추가한 내용들입니다.

[nuber-eats-frontend 소스코드](../../../nuber-eats-frontend)



## 💻Stack
### 언어 및 관련 라이브러리
- [X] TypeScript
- [X] Nest.js
- [X] JWT
- [X] TypeORM

### 환경
- [X] GraphQL (Apollo Server)
- [X] PostgreSQL
- [X] PostgreSQL
- [X] Heroku

<hr />
<br />

## 💡 주요 기능
각 유저에 맞는 기능
- 🙍‍♂Client - 음식을 주문하는 유저의 권한
- 👨‍🍳Owner - 식당을 운영하는 가게 주인의 권한
- 🛵Driver - 배달하는 분의 권한

### 기능
- 로그인/아웃 (JWT 발급)
- 유저 권한 체크 (AuthGuard)
- GraphQL PubSub (Subscription)
- Mail 인증
- 유저 (CRU)
- 식당 관련
    - 식당 (CRUD)
    - 음식 (CRUD)
    - 카테고리 (CR)
- 주문 (CRU)
- 결재 (CRU)

<hr />

## 발전 가능한 기능
강의와 개인적으로 추가한 기능 외의 발전 가능한 기능들 목록입니다.

### 기능
- [ ] 실제 Mail 인증 API 연동 (현재는 내 Email만 가능)
- [ ] 해당 기능 사항들을 관리할 수 있는 Admin Page


