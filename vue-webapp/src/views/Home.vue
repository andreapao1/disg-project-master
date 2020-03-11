<template>
  <div class="home">
    <b-button variant="outline-danger" @click="logout">Logout</b-button>
    <DownloadExcel class="download-excel"/>
    <UsersTable class="users-table"/>
  </div>

  
</template>

<script>
import firebase from 'firebase';
// @ is an alias to /src
import UsersTable from '@/components/UsersTable.vue'
import DownloadExcel from '@/components/DownloadExcel.vue'

export default {
  name: 'home',
  components: {
    UsersTable,
    DownloadExcel
  },
  methods: {
    logout: function() {
      firebase.auth().signOut().then(() => {
        this.$router.replace('login')
      })
    }
  }
}
</script>

<style scoped>  /* "scoped" attribute limit the CSS to this component only */
  .my-logout-button {
    padding-left: 40px;
    padding-right: 40px;
    padding-top:10px;
    padding-bottom:10px;
  }

  .users-table {
    margin-top: 35px;
  }
  
</style>