<template>
  <div>

    <header>
      프론트 헤더

      <template v-if="isLogin">
        <button type="button" @click="signOut">로그아웃</button>
      </template>
    </header>

    <router-view />

    <footer>
      프론트 푸터
    </footer>

  </div>
</template>

<script>
export default {
  name: 'FrontLayout'
}
</script>