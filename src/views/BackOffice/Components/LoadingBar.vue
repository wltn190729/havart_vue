<template>
  <div class="loading-container">
    <div class="loading"></div>
    <div id="loading-text">loading</div>
  </div>
</template>

<style lang="scss" scoped>
@keyframes rotate-loading {
  0%  {transform: rotate(0deg);-ms-transform: rotate(0deg); -webkit-transform: rotate(0deg); -o-transform: rotate(0deg); -moz-transform: rotate(0deg);}
  100% {transform: rotate(360deg);-ms-transform: rotate(360deg); -webkit-transform: rotate(360deg); -o-transform: rotate(360deg); -moz-transform: rotate(360deg);}
}

@keyframes loading-text-opacity {
  0%  {opacity: 0}
  20% {opacity: 0}
  50% {opacity: 1}
  100%{opacity: 0}
}
.loading-container,
.loading {
  height: 100px;
  position: relative;
  width: 100px;
  border-radius: 100%;
}


.loading-container { margin: 40px auto }

.loading {
  border: 2px solid transparent;
  border-color: transparent #282828 transparent #282828;
  animation: rotate-loading 1.5s linear 0s infinite normal;
  transform-origin: 50% 50%;
}

.loading-container:hover .loading {
  border-color: transparent #E45635 transparent #E45635;
}
.loading-container:hover .loading,
.loading-container .loading {
  transition: all 0.5s ease-in-out;
}

#loading-text {
  animation: loading-text-opacity 2s linear 0s infinite normal;
  color: #282828;
  font-family: "Helvetica Neue", Helvetica, arial;
  font-size: 10px;
  font-weight: bold;
  margin-top: 45px;
  opacity: 0;
  position: absolute;
  text-align: center;
  text-transform: uppercase;
  top: 0;
  width: 100px;
}
</style>