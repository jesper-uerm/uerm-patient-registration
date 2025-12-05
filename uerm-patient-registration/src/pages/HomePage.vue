<template>
  <div class="column flex-center q-pa-md" style="min-height: 85vh;">
    <div class="column flex-center q-mb-xl">
      <img
        src="~assets/uermmc-white-logo.png"
        alt="UERM Logo"
        class="q-mb-auto animate-logo"
        style="max-width: 100%; height: auto; max-height: 350px;"
      >
      <div class="animate-text text-center">
        <div class="text-h4 text-white text-weight-bold q-mb-sm">Welcome to UERMMC Patient Registration Portal</div>
        <div class="text-subtitle1 text-white text-weight-regular">Please select your patient type to continue.</div>
      </div>
    </div>
    <!-- SAMSUNG TAB
    <div :class="$q.screen.gt.xs ? 'row' : 'column'" class="row flex-center q-pa-md q-gutter-xl"> -->
      <!-- IPAD PRO -->
      <div :class="$q.screen.gt.md ? 'row' : 'column'" class="row flex-center q-pa-md q-gutter-xl">
      <q-card
      class="cursor-pointer hover-card animate-card delay-1"
      style="width: 300px;"
      @click="openInpatientForm"
      v-ripple
    >
      <q-card-section class="text-center q-py-lg">
        <q-icon name="airline_seat_flat" size="70px" class="q-mb-sm" />
        <div class="text-h5 text-weight-bold">INPATIENT</div>
      </q-card-section>
    </q-card>
    <RegistrationForm ref="registrationFormDialog" />
    <q-card
      class="cursor-pointer hover-card animate-card delay-2"
      style="width: 300px;"
      @click="openOutpatientForm"
      v-ripple
    >
      <q-card-section class="text-center q-py-lg">
        <q-icon name="directions_walk" size="70px" class="q-mb-sm"/>
        <div class="text-h5 text-weight-bold">OUTPATIENT</div>
      </q-card-section>
    </q-card>
    <RegistrationFormOutpatient ref="OutpatientregistrationFormDialog" />
    <q-card
      class="cursor-pointer hover-card animate-card delay-3"
      style="width: 300px;"
      v-ripple
    >
      <q-card-section class="text-center q-py-lg">
        <q-icon name="assignment_return" size="70px" class="q-mb-sm" />
        <div class="text-h5 text-weight-bold">RETURNING PATIENT</div>
      </q-card-section>
    </q-card>
    </div>
  </div>
</template>
<script>
  import RegistrationForm from 'pages/RegistrationForm.vue';
import RegistrationFormOutpatient from './RegistrationFormOutpatient.vue';
  export default {
    name: 'HomePage',
    components: {
      RegistrationForm,
      RegistrationFormOutpatient
    },
    methods: {
      openInpatientForm() {
        if (this.$refs.registrationFormDialog) {
          this.$refs.registrationFormDialog.show();
        }
      },
      openOutpatientForm() {
        if (this.$refs.OutpatientregistrationFormDialog) {
          this.$refs.OutpatientregistrationFormDialog.show();
        }
      }
    }
  }
</script>
<style scoped>

  .hover-card {
    transition: all 0.3s ease;
    border-radius: 20px;
    background: rgba(255, 255, 255, 0.95);
    color: #004aad;
  }

  .hover-card:hover {
    transform: translateY(-10px) !important;
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
    background-color: #004aad;
    color: white;
  }

@keyframes fadeInDown {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes popIn {
  0% { opacity: 0; transform: scale(0.8); }
  100% { opacity: 1; transform: scale(1); }
}

.animate-logo {
  animation: fadeInDown 0.8s ease-out forwards;
}

.animate-text {
  opacity: 0;
  animation: fadeInUp 0.8s ease-out forwards;
  animation-delay: 0.3s;
}

.animate-card {
  opacity: 0;
  animation: popIn 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
}

.delay-1 { animation-delay: 0.5s; }
.delay-2 { animation-delay: 0.7s; }
.delay-3 { animation-delay: 0.9s; }
</style>
