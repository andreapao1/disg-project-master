<template>
  <div>
    <b-table striped hover :items="users_data" :fields="fields"></b-table>
  </div>
</template>

<script>
  import { usersRef } from '../firebase'
  import moment from 'moment'
  moment.locale('es-us');

  export default {
    data() {
      return {
        users: [],
        fields: [
          {
            key: 'name',
            label: 'Nombre',
            sortable: false
          },
          {
            key: 'date_of_interview',
            label: 'Fecha de Entrevista',
            sortable: true
          },
          {
            key: 'experience_area',
            label: 'Área de Experiencia',
            sortable: false
          },
          {
            key: 'experience_time',
            label: 'Tiempo de Experiencia',
            sortable: false
          },
          {
            key: 'turn',
            label: 'Turno de Interés',
            sortable: false
          },
          {
            key: 'email',
            label: 'Email',
            sortable: false
          },
          {
            key: 'phone_number',
            label: 'Teléfono',
            sortable: false
          },
          {
            key: 'age_range',
            label: 'Rango de Edad',
            sortable: false
          },
          {
            key: 'gender',
            label: 'Género',
            sortable: false
          },
          {
            key: 'status',
            label: 'Estatus',
            sortable: true
          },
          {
            key: 'last_interaction',
            label: 'Última Interacción',
            sortable: true
          }
        ],
      }
    },
    firebase: {
      users: usersRef
    },
    computed: {
      users_data(){
        return this.users.map(user => ({
          ...user, date_of_interview: moment(user.date_of_interview).format('dddd, D MMMM YYYY - hh:mm a'), last_interaction: moment(user.last_interaction).format('dddd, D MMMM YYYY')
        }));
      }
    }
  }
  
</script>


<style scoped>  /* "scoped" attribute limit the CSS to this component only */

  .my-panel {
    margin:32px;
  }
  
</style>