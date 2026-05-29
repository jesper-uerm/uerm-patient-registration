<template>
  <div class="portal-container column flex-center q-pa-md">
    <div class="column flex-center q-mb-xl text-center animate-text">
      <h1 class="text-h3 text-white text-weight-bold q-mb-sm portal-title">
        Welcome to UERMMC
        <span class="block text-h5 text-weight-medium q-mt-xs text-white-70">
          Patient Online Registration System
        </span>
      </h1>
      <p class="text-subtitle1 text-white-80">
        Please select your patient type to continue.
      </p>
    </div>

    <div class="w-full max-width-container">
      <transition
        appear
        enter-active-class="animated fadeIn"
        leave-active-class="animated fadeOut"
        mode="out-in"
      >
        <div v-if="page === 1" key="page1" class="row q-col-gutter-lg justify-center">
          <div
            v-for="(menu, index) in menuOptions"
            :key="index"
            class="col-12 col-sm-6 col-md-3"
          >
            <q-card
              v-ripple
              flat
              class="portal-card cursor-pointer animate-card text-white full-height column flex-center q-pa-md"
              :class="`delay-${index + 1}`"
              @click="handleAction(menu.action)"
            >
              <q-card-section class="column flex-center text-center">
                <div class="icon-wrapper q-mb-md">
                  <q-icon :name="menu.icon" size="60px" class="transition-icon" />
                </div>
                <div class="text-h6 text-weight-bold text-uppercase q-mb-xs">
                  {{ menu.label }}
                </div>
                <div class="text-caption text-uppercase opacity-fade text-white-70">
                  {{ menu.subLabel }}
                </div>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </transition>
    </div>

    <ReturningPatient
      ref="ReturningPatientFormDialog"
      :module="['MAIN', 'ER']"
      @open-inpatient="handleOpenInpatient"
      @open-outpatient="handleOpenOutpatient"
      @open-triage="handleOpenTriage"
    />
    <RegistrationForm ref="registrationFormDialog" />
    <RegistrationFormOutpatient ref="OutpatientregistrationFormDialog" />
    <TriageAssessment ref="TriageAssessmentFormDialog" />
  </div>
</template>

<script>
import RegistrationForm from "pages/RegistrationForm.vue";
import RegistrationFormOutpatient from "./RegistrationFormOutpatient.vue";
import ReturningPatient from "./ReturningPatient.vue";
import TriageAssessment from "./TriageAssessment.vue";

export default {
  name: "HomePortals",
  components: {
    RegistrationForm,
    RegistrationFormOutpatient,
    ReturningPatient,
    TriageAssessment,
  },
  data() {
    return {
      page: 1,
      menuOptions: [
        {
          label: "Returning",
          subLabel: "Update Patient Record",
          icon: "las la-undo-alt",
          action: "openReturningPatientForm",
        },
        {
          label: "Inpatient",
          subLabel: "Admit Patient",
          icon: "las la-procedures",
          action: "openInpatientForm",
        },
        {
          label: "Outpatient",
          subLabel: "Consultation / Check-up",
          icon: "las la-stethoscope",
          action: "openOutpatientForm",
        },
        {
          label: "Emergency",
          subLabel: "Initial Assessment",
          icon: "las la-user-plus",
          action: "personalInfoTriage",
        },
      ],
    };
  },
  methods: {
    handleAction(actionName) {
      if (typeof this[actionName] === "function") {
        this[actionName]();
      }
    },

    openReturningPatientForm() {
      this.$refs.ReturningPatientFormDialog?.show();
    },
    openInpatientForm() {
      this.$refs.registrationFormDialog?.show();
    },
    openOutpatientForm() {
      this.$refs.OutpatientregistrationFormDialog?.show();
    },
    personalInfoTriage() {
      this.$refs.TriageAssessmentFormDialog?.show();
    },

    handleOpenInpatient(patient) {
      this.$refs.registrationFormDialog?.show(patient);
    },
    handleOpenOutpatient(patient) {
      this.$refs.OutpatientregistrationFormDialog?.show(patient);
    },
    handleOpenTriage(patient) {
      this.$refs.TriageAssessmentFormDialog?.show(patient);
    },
  },
};
</script>

<style scoped>
.portal-container {
  min-height: 85vh;
  width: 100%;
}

.max-width-container {
  max-width: 1200px;
  width: 58%;
}

.portal-title {
  letter-spacing: -0.5px;
  line-height: 1.2;
}

.text-white-70 {
  color: rgba(255, 255, 255, 0.7);
}
.text-white-80 {
  color: rgba(255, 255, 255, 0.8);
}

.portal-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(3px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  min-height: 150px;
}

.portal-card:hover {
  transform: translateY(-8px);
  background: rgba(255, 255, 255, 0.15);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2), 0 0 20px rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.icon-wrapper {
  transition: transform 0.3s ease;
}

.portal-card:hover .icon-wrapper {
  transform: scale(1.15);
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
    transform: scale(0.9);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

.animate-text {
  opacity: 0;
  animation: fadeInUp 0.8s ease-out forwards;
}

.animate-card {
  opacity: 0;
  animation: popIn 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
}

.delay-1 {
  animation-delay: 0.2s;
}
.delay-2 {
  animation-delay: 0.3s;
}
.delay-3 {
  animation-delay: 0.4s;
}
.delay-4 {
  animation-delay: 0.5s;
}

@media (max-width: 599px) {
  .portal-title {
    font-size: 1.5rem;
  }
  .portal-card {
    min-height: 140px;
  }
}
</style>
