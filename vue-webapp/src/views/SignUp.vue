<template>
  <div class="sign-up">
    <h3>Crea tu cuenta</h3>
    <input type="text" v-model="email" placeholder="Correo electrónico"><br>
    <input type="password" v-model="password" placeholder="Contraseña"><br>
    <input type="password" v-model="password_confirmation" placeholder="Confirmar contraseña"><br>
    <p v-if="error_message" class="error-message">Error: No coinciden las contraseñas</p>
    <b-button variant="outline-success" @click="signUp">Registrar</b-button>
    <span>o regresa a <router-link to="/login">Iniciar Sesion</router-link>.</span>
  </div>
</template>

 <script>
  import firebase from 'firebase';
  import { errorMessages } from '../firebase';
  export default {
    name: 'signUp',
    data() {
      return {
        email: '',
        password: '',
        password_confirmation: '',
        error_message: false
      }
    },
    methods: {
      signUp: function() {
        if(this.password === this.password_confirmation) {
          firebase.auth().createUserWithEmailAndPassword(this.email, this.password).then(
            (user) => {
              this.$router.replace('home')
            },
            (err) => {
              alert('Oops. ' + errorMessages[err.code])
            }
          );
        } else {
          this.error_message = true;
        }
      } 
    }
  }
</script>

 <style scoped>
  .sign-up {
    margin-top: 40px;
  }
  input {
    margin: 10px 0;
    width: 100%;
    max-width: 500px;
    padding: 15px;
  }
  span {
    display: block;
    margin-top: 20px;
    font-size: 18px;
  }
  p.error-message {
    color: red;
    font-size: 14px;
  }
</style>