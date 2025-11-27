<template>
<div class="row justify-center q-pa-md">
    <q-card
      class="bg-primary text-white cursor-pointer"
      style="width: 280px;"
      @click="openForm"
      v-ripple
    >
      <q-card-section class="text-center q-py-lg">
        <q-icon name="edit_note" size="50px" class="q-mb-sm" />
        <div class="text-h5 text-weight-bold">Register Now</div>
        <div class="text-subtitle2 opacity-80">Patient Admission Form</div>
      </q-card-section>
    </q-card>
    <RegistrationForm ref="registrationFormDialog" />
  </div>
</template>

<script>

import RegistrationForm from 'pages/RegistrationForm.vue';

export default {
  name: 'HomePage',
  components: {
    RegistrationForm
  },
  methods: {
    openForm() {
      if (this.$refs.registrationFormDialog) {
        this.$refs.registrationFormDialog.show();
      }
    }
  }
}
</script>

<style scoped>
  .my-hover-card {
    transition: transform 0.2s, box-shadow 0.2s;
  }
  .my-hover-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0,0,0,0.2);
  }
</style>
