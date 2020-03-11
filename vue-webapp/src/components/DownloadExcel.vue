<template>
    <download-excel
        :data   = users
        :fields = "json_fields"
        worksheet = "My Worksheet"
        name    = "filename.xls">
        <b-button variant="success">Descargar Excel</b-button>
    </download-excel>
</template>

<script>
  import { usersRef } from '../firebase'

  export default {
    data() {
      return {
        users: [],
        json_fields: {
            "Nombre": "name",
            "Fecha de Entrevista": "date_of_interview",
            "Área de Experiencia": "experience_area",
            "Tiempo de Experiencia": "experience_time",
            "Turno de Interés": "turn",
            "Email": "email",
            "Telefono": "phone_number",
            "Rango de Edad": "age_range",
            "Género": "gender",
            "Estatus":"status",
            "Dia de Registro": "last_interaction"
        },
      }
    },
    firebase: {
      users: usersRef
    },
  }
</script>

<style scoped>  /* "scoped" attribute limit the CSS to this component only */
  .download-excel {
    margin-top: 30px;
  }
</style>