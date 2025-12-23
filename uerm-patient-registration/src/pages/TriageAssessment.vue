<template>
  <q-dialog
    v-model="TriageAssessmentFormDialog"
    persistent
    transition-show="scale"
    transition-hide="scale"
  >
    <q-card
      class="column no-wrap"
      style="width: 1300px; max-width: 95vw; max-height: 95vh; border-radius: 20px"
    >
      <q-card-section
        class="column text-center text-white q-py-md relative-position"
        style="background-color: #004aad"
      >
        <div class="text-h6 text-bold">TRIAGE ASSESSMENT FORM</div>
        <div class="text-caption text-white-7" style="line-height: 1.2">
          Please complete the steps below
        </div>
        <q-btn
          icon="close"
          flat
          round
          dense
          v-close-popup
          class="absolute-right q-ma-lg"
        />
      </q-card-section>

      <q-card-section class="col scroll">
        <q-stepper
          v-model="step"
          ref="stepper"
          color="primary"
          done-color="positive"
          animated
          flat
          alternative-labels
        >
          <q-step :name="1" title="Personal Info" icon="person" :done="step > 1">
            <patient-details-triage
              :form="formData.personalInfoTriage"
              @update:form="(val) => (formData.personalInfoTriage = val)"
              @submit="onSubmit"
            />
          </q-step>
        </q-stepper>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import PatientDetailsTriage from "../components/TriageAssessment/PatientDetailsTriage.vue";
import axios from "axios";

export default {
  name: "RegistrationFormOutpatient",
  components: {
    PatientDetailsTriage,
  },
  data() {
    return {
      TriageAssessmentFormDialog: false,
      step: 1,

      formData: {
        personalInfoTriage: {
          lastNameTriage: "",
          firstNameTriage: "",
          middleNameTriage: "",
          birthdateTriage: "",
          ageTriage: "",
          genderTriage: "",

          //new db column
          chiefComplaintTriage: "",
          tempTriage: "",
          heartRateTriage: "",
          oxygenTriage: "",
          bpTriage: "",
          respiRateTriage: "",
          painScoreTriage: "",
          avpuTriage: "",
          contagiousTriage: "",
          isolationPrecautionTriage: "",
          cpdTriage: "",
          levelTriage: "",
          personnelTriage: "",
          dateTriage: "", //Triage Accomplished Date
        },
      },
    };
  },
  // methods: {
  //   show() {
  //     this.step = 1;
  //     this.TriageAssessmentFormDialog = true;
  //   },
  //   async validateFinalStep() {
  //     if (this.$refs.contactPersonRef) {
  //       const isContactValid = await this.$refs.contactPersonRef.validate();

  //       if (!isContactValid) {
  //         this.$q.notify({
  //           type: "warning",
  //           message: "Please input required details.",
  //         });
  //         return false;
  //       }
  //       return true;
  //     }
  //     return false;
  //   },

  //   async onSubmit() {
  //     if (this.submitting) return;

  //     const isValid = await this.validateFinalStep();
  //     if (!isValid) return;

  //     this.submitting = true;
  //     this.$q.loading.show({ message: "Submitting Registration..." });

  //     const finalData = {
  //       ...this.formData.personalInfoTriage,

  //       patientType: "Emergency",
  //     };

  //     try {
  //       const response = await axios.post(
  //         "http://localhost:3000/api/auth/registerTriage",
  //         finalData
  //       );

  //       this.$q.notify({
  //         type: "positive",
  //         message: "Registration Successful! ID: " + (response.data.patientId || "Saved"),
  //         position: "top",
  //         timeout: 4000,
  //       });
  //       setTimeout(() => {
  //         this.TriageAssessmentFormDialog = false;
  //       }, 1500);
  //     } catch (error) {
  //       console.error(error);
  //       const errorMsg = error.response?.data?.message || "Server Error: Could not save.";

  //       this.$q.notify({
  //         type: "negative",
  //         message: errorMsg,
  //         position: "top",
  //       });
  //     } finally {
  //       this.submitting = false;
  //       this.$q.loading.hide();
  //     }
  //   },
  // },
  methods: {
    show() {
      this.step = 1;
      this.TriageAssessmentFormDialog = true;
    },

    async onSubmit() {
      if (this.submitting) return;
      this.submitting = true;
      this.$q.loading.show({ message: "Submitting Registration..." });

      const finalData = {
        ...this.formData.personalInfoTriage,
        patientType: "Emergency",
      };

      try {
        const response = await axios.post(
          "http://localhost:3000/api/auth/registerTriage",
          finalData
        );

        this.$q.notify({
          type: "positive",
          message: "Registration Successful! ID: " + (response.data.triageId || "Saved"),
          position: "top",
          timeout: 4000,
        });

        setTimeout(() => {
          this.TriageAssessmentFormDialog = false;
        }, 1500);
      } catch (error) {
        console.error(error);
        const errorMsg = error.response?.data?.message || "Server Error: Could not save.";

        this.$q.notify({
          type: "negative",
          message: errorMsg,
          position: "top",
        });
      } finally {
        this.submitting = false;
        this.$q.loading.hide();
      }
    },
  },
};
</script>
<style scoped>
:deep(.q-stepper__title) {
  font-size: 12px;
  font-weight: bold;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  margin-top: 8px;
}
:deep(.q-stepper__dot) {
  width: 40px;
  height: 40px;
  font-size: 20px;
}

:deep(.q-stepper__step-inner) {
  padding-top: 0 !important;
}
@media (max-width: 900px) {
  :deep(.q-stepper__title) {
    font-size: 12px;
    letter-spacing: 0px;
    line-height: 1.2;
  }
  :deep(.q-stepper__dot) {
    width: 30px;
    height: 30px;
    font-size: 15px;
  }
  :deep(.q-stepper__tab) {
    padding: 12px;
  }
}
</style>
