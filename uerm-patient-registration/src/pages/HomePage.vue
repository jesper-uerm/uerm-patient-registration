<template>
  <q-page class="flex flex-center">
    <div class="text-center">
      <q-btn
        label="Start Registration"
        color="primary"
        @click="openForm"
      />
    </div>

    <RegistrationForm ref="registrationFormDialog" />

  </q-page>
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
