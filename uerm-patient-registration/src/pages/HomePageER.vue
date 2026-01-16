<template>
  <div class="column flex-center q-pa-md" style="min-height: 85vh">
    <div class="column flex-center q-mb-xl">
      <!-- <img
        src="~assets/uermmc-white-logo.png"
        alt="UERM Logo"
        class="q-mb-auto animate-logo"
        style="max-width: 100%; height: auto; max-height: 350px"
      /> -->
      <div class="animate-text text-center">
        <div
          class="text-h4 text-white text-weight-bold q-mb-sm"
          :style="{ fontSize: $q.screen.lt.md ? '25px' : '' }"
        >
          Welcome to UERMMC Patient Online Registration System
        </div>
        <div
          class="text-subtitle1 text-white text-weight-regular"
          :style="{ fontSize: $q.screen.lt.md ? '15px' : '' }"
        >
          Please select your patient type to continue.
        </div>
      </div>
    </div>

    <div :class="$q.screen.gt.xs ? 'row' : 'row'" class="flex-center q-pa-md q-gutter-xl">
      <!-- <q-card
        class="cursor-pointer hover-card animate-card delay-1"
        @click="openInpatientForm"
        v-ripple
        :class="{
          row: $q.screen.lt.md,
          column: !$q.screen.lt.md,
        }"
        :style="{
          width: $q.screen.lt.md ? '250px' : '260px',
          height: $q.screen.lt.md ? '160px' : '200px',
        }"
      >
        <q-card-section class="col column flex-center full-height">
          <q-icon
            name="airline_seat_flat"
            class="q-mb-md transition-icon card-icon"
            :class="{
              'q-mb-md': !$q.screen.lt.md,
              'q-mb-xs': $q.screen.lt.md,
            }"
            :size="$q.screen.lt.md ? '55px' : '70px'"
            :style="{ marginBottom: $q.screen.lt.md ? '3px' : '' }"
          />
          <div
            class="text-h5 text-weight-bold"
            :class="{
              'text-h5': !$q.screen.lt.md,
              'text-subtitle1': $q.screen.lt.md,
            }"
          >
            INPATIENT
          </div>
          <div class="text-caption text-uppercase q-mt-sm opacity-fade">
            Admit Patient
          </div>
        </q-card-section>
      </q-card> -->

      <!-- <q-card
        class="cursor-pointer hover-card animate-card delay-2"
        @click="openOutpatientForm"
        v-ripple
        :class="{
          row: $q.screen.lt.md,
          column: !$q.screen.lt.md,
        }"
        :style="{
          width: $q.screen.lt.md ? '250px' : '260px',
          height: $q.screen.lt.md ? '160px' : '200px',
        }"
      >
        <q-card-section class="col column flex-center full-height">
          <q-icon
            name="directions_walk"
            class="q-mb-md transition-icon card-icon"
            :class="{
              'q-mb-md': !$q.screen.lt.md,
              'q-mb-xs': $q.screen.lt.md,
            }"
            :size="$q.screen.lt.md ? '55px' : '70px'"
            :style="{ marginBottom: $q.screen.lt.md ? '3px' : '' }"
          />
          <div
            class="text-h5 text-weight-bold text-uppercase"
            :class="{
              'text-h5': !$q.screen.lt.md,
              'text-subtitle1': $q.screen.lt.md,
            }"
          >
            OUTPATIENT
          </div>
          <div class="text-caption text-uppercase q-mt-sm opacity-fade">
            Consultation / Check-up
          </div>
        </q-card-section>
      </q-card> -->

      <q-card
        class="cursor-pointer hover-card animate-card delay-3"
        @click="openReturningPatientForm"
        v-ripple
        :class="{
          row: $q.screen.lt.md,
          column: !$q.screen.lt.md,
        }"
        :style="{
          width: $q.screen.lt.md ? '250px' : '260px',
          height: $q.screen.lt.md ? '160px' : '200px',
        }"
      >
        <q-card-section class="col column flex-center full-height">
          <q-icon
            name="assignment_return"
            class="q-mb-md transition-icon card-icon"
            :class="{
              row: $q.screen.lt.md,
              column: !$q.screen.lt.md,
            }"
            :size="$q.screen.lt.md ? '55px' : '70px'"
            :style="{ marginBottom: $q.screen.lt.md ? '3px' : '' }"
          />
          <div
            class="text-h5 text-weight-bold text-uppercase"
            :class="{
              'text-h5': !$q.screen.lt.md,
              'text-subtitle1': $q.screen.lt.md,
            }"
          >
            RETURNING
          </div>
          <div class="text-caption text-uppercase q-mt-sm opacity-fade">
            Update Patient Record
          </div>
        </q-card-section>
      </q-card>

      <q-card
        class="cursor-pointer hover-card animate-card delay-3"
        @click="personalInfoTriage"
        v-ripple
        :class="{
          row: $q.screen.lt.md,
          column: !$q.screen.lt.md,
        }"
        :style="{
          width: $q.screen.lt.md ? '250px' : '260px',
          height: $q.screen.lt.md ? '160px' : '200px',
        }"
      >
        <q-card-section class="col column flex-center full-height">
          <q-icon
            name="medical_services"
            class="q-mb-md transition-icon card-icon"
            :class="{
              row: $q.screen.lt.md,
              column: !$q.screen.lt.md,
            }"
            :size="$q.screen.lt.md ? '55px' : '70px'"
            :style="{ marginBottom: $q.screen.lt.md ? '3px' : '' }"
          />
          <div
            class="text-h5 text-weight-bold text-uppercase"
            :class="{
              'text-h5': !$q.screen.lt.md,
              'text-subtitle1': $q.screen.lt.md,
            }"
          >
            Triage Form
          </div>
          <div class="text-caption text-uppercase q-mt-sm opacity-fade">
            Initial Assessment
          </div>
        </q-card-section>
      </q-card>
    </div>

    <!-- <RegistrationForm ref="registrationFormDialog" />
    <RegistrationFormOutpatient ref="OutpatientregistrationFormDialog" /> -->
    <ReturningPatient ref="ReturningPatientFormDialog" />
    <TriageAssessment ref="TraigeAssessmentFormDialog" />
  </div>
</template>

<script>
// import RegistrationForm from "pages/RegistrationForm.vue";
// import RegistrationFormOutpatient from "./RegistrationFormOutpatient.vue";
import ReturningPatient from "./ReturningPatient.vue";
import TriageAssessment from "./TriageAssessment.vue";

export default {
  name: "HomePage",
  components: {
    // RegistrationForm,
    // RegistrationFormOutpatient,
    ReturningPatient,
    TriageAssessment,
  },
  methods: {
    // openInpatientForm() {
    //   this.$refs.registrationFormDialog?.show();
    // },
    // openOutpatientForm() {
    //   this.$refs.OutpatientregistrationFormDialog?.show();
    // },
    openReturningPatientForm() {
      this.$refs.ReturningPatientFormDialog?.show();
    },
    personalInfoTriage() {
      this.$refs.TraigeAssessmentFormDialog?.show();
    },
  },
};
</script>

<style scoped>
.hover-card {
  background: rgba(255, 255, 255, 0.95);
  color: #004aad;
  width: 300px;
  height: 220px;
  border-radius: 16px;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  border: 2px solid transparent;
  box-shadow: 0 4px 15px rgba(0, 74, 173, 0.1);

  display: flex;
  flex-direction: column;
}

.hover-card:hover {
  transform: translateY(-10px) !important;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
  background-color: #004aad;
  color: white;
}

.card-icon {
  font-size: 70px;
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
@keyframes popIn {
  0% {
    opacity: 0;
    transform: scale(0.8);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
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

.delay-1 {
  animation-delay: 0.5s;
}
.delay-2 {
  animation-delay: 0.7s;
}
.delay-3 {
  animation-delay: 0.9s;
}
</style>
