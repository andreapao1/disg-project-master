<template>

  <div class="login">
    
    <h3>Inicia Sesión</h3>
    <div class="form">
      <input type="text" v-model="email" placeholder="Correo electrónico"><br>
      <input type="password" v-model="password" placeholder="Contraseña"><br>
      <b-button class="login-button" variant="outline-success" @click="login">Iniciar Sesion</b-button>
    </div>
    <p>¿No tienes una cuenta? <router-link to="/sign-up">crea una</router-link></p>
  </div>
</template>


<script>
  import firebase from 'firebase';
  import { errorMessages } from '../firebase';
  export default {
    name: 'login',
    data() {
      return {
        email: '',
        password: ''
      }
    },
    methods: {
      login: function() {
        firebase.auth().signInWithEmailAndPassword(this.email, this.password).then(
          (user) => {
            this.$router.replace('home')
          },
          (err) => {
            console.log(errorMessages)
            alert('Oops. ' + errorMessages[err.code])
          }
        );
      }
    }
  }
</script>

<style scoped>  /* "scoped" attribute limit the CSS to this component only */
  .login {
    margin-top: 40px;
  }
  input {
    margin: 10px 0;
    width: 100%;
    max-width: 500px;
    padding: 15px;
  }
  p {
    margin-top: 40px;
    font-size: 18px;
  }
  p a {
    text-decoration: underline;
    cursor: pointer;
  }
</style>