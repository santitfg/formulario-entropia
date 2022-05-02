<template>
  <div class="modal-mask">
    <div class="modal-wrapper">
      <div class="modal-container">
        <h1>Por favor revisa lo siguiente:</h1>
        <ul>
          <li v-for="txt in msg" :key="txt">{{ txt }}</li>
        </ul>
        <div class="modal-footer">
          <button class="modal-default-button" @click="$emit('close')">
            OK
          </button>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
export default {
  name: "modal",
  props: {
    msg: Array,
  },
  data() {
    return {};
  },
};
</script>
<style scoped>
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: table;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.modal-container {
  width: 60%;
  margin: 0px auto;
  padding: 20px 30px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  font-family: Helvetica, Arial, sans-serif;
  justify-content: center;
  align-items: center;
}

.modal-footer {
  display: flex;
  justify-content: right;
}
.modal-body {
  margin: 20px 0;
}

.modal-default-button {
  display: block;
  margin-top: 1rem;
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.5s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
button {
  justify-content: right;
}
@media only screen and (max-width: 750px) {
  .modal-container {
    width: 80%;
    height: 95%;
    overflow: scroll;
  }
}
</style>