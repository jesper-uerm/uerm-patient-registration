<template>
  <q-form ref="personalInfoTriage" @submit="onSubmit">
    <div class="text-subtitle2 text-bold q-mb-md">Patient Information:</div>
    <div class="row q-col-gutter-md">
      <div class="col-4 col-md-4">
        <q-input
          outlined
          dense
          v-model="localForm.lastNameTriage"
          label="Last Name *"
          :rules="[(val) => !!val || 'Required']"
        />
      </div>
      <div class="col-4 col-md-4">
        <q-input
          outlined
          dense
          v-model="localForm.firstNameTriage"
          label="First Name *"
          :rules="[(val) => !!val || 'Required']"
        />
      </div>
      <div class="col-4 col-md-4">
        <q-input
          outlined
          dense
          v-model="localForm.middleNameTriage"
          label="Middle Name"
        />
      </div>
    </div>
    <div class="row q-col-gutter-md">
      <div class="col-4 col-md-4">
        <q-input
          outlined
          dense
          v-model="localForm.birthdateTriage"
          label="Birthdate *"
          mask="date"
          :rules="['date', (val) => new Date(val) <= new Date() || 'Future date invalid']"
        >
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                <q-date v-model="localForm.birthdateTriage">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </div>
      <div class="col-4 col-md-4">
        <q-input
          outlined
          dense
          type="number"
          v-model="localForm.ageTriage"
          label="Age"
          readonly
          bg-color="grey-2"
        />
      </div>
      <div class="col-4 col-md-4">
        <q-select
          outlined
          dense
          v-model="localForm.genderTriage"
          :options="['Male', 'Female', 'Prefer not to say']"
          label="Gender"
          lazy-rules
          :rules="[(val) => !!val || 'Please select gender']"
        />
      </div>
    </div>
    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-12">
        <q-input
          outlined
          dense
          v-model="localForm.chiefComplaintTriage"
          label="Chief Complaint"
        />
      </div>
    </div>
    <q-separator class="q-my-md" />

    <div class="text-subtitle2 text-bold q-mb-sm">Vital Signs:</div>
    <div class="row q-col-gutter-md">
      <div class="col-4 col-md-4">
        <q-input
          outlined
          dense
          v-model="localForm.tempTriage"
          label="Temperature *"
          :rules="[(val) => !!val || 'Required']"
          hint="(c)"
        />
      </div>
      <div class="col-4 col-md-4">
        <q-input
          outlined
          dense
          v-model="localForm.heartRateTriage"
          label="Heart Rate *"
          :rules="[(val) => !!val || 'Required']"
          hint="(bpm)"
        />
      </div>
      <div class="col-4 col-md-4">
        <q-input
          outlined
          dense
          v-model="localForm.oxygenTriage"
          label="Oxygen Saturation *"
          :rules="[(val) => !!val || 'Required']"
          hint="(%)"
        />
      </div>
    </div>
    <div class="row q-col-gutter-md">
      <div class="col-4 col-md-4">
        <q-input
          outlined
          dense
          v-model="localForm.bpTriage"
          label="Blood Pressure *"
          :rules="[(val) => !!val || 'Required']"
          hint="(mmHg)"
        />
      </div>
      <div class="col-4 col-md-4">
        <q-input
          outlined
          dense
          v-model="localForm.respiRateTriage"
          label="Respiratory Rate *"
          :rules="[(val) => !!val || 'Required']"
          hint="(cpm)"
        />
      </div>
      <div class="col-4 col-md-4">
        <q-input
          outlined
          dense
          v-model="localForm.painScoreTriage"
          label="Pain Score *"
          :rules="[(val) => !!val || 'Required']"
        />
      </div>
    </div>
    <q-separator class="q-my-md" />

    <div class="row q-col-gutter-md">
      <div class="col-6 col-md-6">
        <q-select
          outlined
          dense
          v-model="localForm.avpuTriage"
          :options="[
            'Alert',
            'Verbally Responsive',
            'Painfully Responsive',
            'Unresponsive',
          ]"
          label="AVPU Scale"
          lazy-rules
          :rules="[(val) => !!val || 'Please select AVPU Scale']"
        />
      </div>
      <div class="col-6 col-md-6">
        <q-select
          outlined
          dense
          v-model="localForm.contagiousTriage"
          :options="[
            'Symptom/s suggestive of COVID-19',
            'Symptom/s suggestive of a VIRAL EXANTHEM',
            'None',
          ]"
          label="Screening for Contagious Infectious Disease"
          lazy-rules
          :rules="[(val) => !!val || 'Please select screening for contagious disease.']"
        />
      </div>
    </div>
    <div class="row q-col-gutter-md">
      <div class="col-4 col-md-4">
        <q-select
          outlined
          dense
          v-model="localForm.isolationPrecautionTriage"
          :options="['COVID Complex (Old ER)', 'COVID Complex Extension (OPD)']"
          label="Initiate Isolation Precaution and Transfer Immediately to:"
          lazy-rules
          :rules="[(val) => !!val || 'Please select precaution.']"
        />
      </div>
      <div class="col-4 col-md-4">
        <q-select
          outlined
          dense
          v-model="localForm.cpdTriage"
          :options="['Yes', 'No']"
          label="Cardio-Pulmonary Distress"
          lazy-rules
          :rules="[(val) => !!val || 'Required.']"
        />
      </div>
      <div class="col-4 col-md-4">
        <q-select
          outlined
          dense
          v-model="localForm.levelTriage"
          :options="['1 - (Emergent)', '2 - (Urgent)', '3 - (Non-Urgent)']"
          label="Triage Level:"
          lazy-rules
          :rules="[(val) => !!val || 'Please select triage level.']"
        />
      </div>
    </div>

    <div class="row q-col-gutter-md">
      <div class="col-6 col-md-6">
        <q-input
          outlined
          dense
          v-model="localForm.personnelTriage"
          label="Name of Triage Personnel *"
          :rules="[(val) => !!val || 'Required']"
        />
      </div>
      <div class="col-6 col-md-6">
        <q-input
          outlined
          dense
          v-model="localForm.dateTriage"
          label="Date Accomplished *"
          mask="date"
          :rules="[
            'date',
            (val) => new Date(val) <= new Date() || 'Date cannot be in the future',
          ]"
        >
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                <q-date v-model="localForm.dateTriage">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </div>
    </div>
    <q-stepper-navigation class="text-center">
      <q-btn
        color="blue-10"
        style="width: 100%; height: 45px; max-width: 120px"
        label="Submit"
        @click="onSubmit"
      />
    </q-stepper-navigation>
  </q-form>
</template>
//
<script>
// import { date } from "quasar";

// export default {
//   name: "personalInfoTriage",
//   props: {
//     form: Object,
//   },
//   emits: ["update:form", "submit"],
//   data() {
//     return {
//       localForm: {
//         ...this.form,
//       },
//     };
//   },

//   async validate() {
//     return await this.$refs.personalInfoTriage.validate();
//   },
//   methods: {
//     async validate() {
//       return await this.$refs.personalInfoTriage.validate();
//     },

//     async onSubmit() {
//       const isValid = await this.$refs.personalInfoTriage.validate();

//       if (!isValid) {
//         this.$q.notify({
//           type: "warning",
//           message: "Please fill all required fields.",
//           position: "top",
//         });
//         return;
//       }

//       this.$emit("submit");
//     },

//     calculateAge(birthDateString) {
//       if (!birthDateString) {
//         this.localForm.ageTriage = "";
//         return;
//       }
//       const timeStamp = Date.now();
//       const birthDate = new Date(birthDateString);

//       const age = date.getDateDiff(timeStamp, birthDate, "years");
//       this.localForm.ageTriage = age;
//     },
//   },

//   watch: {
//     "localForm.birthdateTriage": function (newDate) {
//       this.calculateAge(newDate);
//     },

//     localForm: {
//       deep: true,
//       handler(newVal) {
//         this.$emit("update:form", newVal);
//       },
//     },
//   },
// };
//
//
//
import { date } from "quasar";

export default {
  name: "personalInfoTriage",
  props: {
    form: Object,
  },
  emits: ["update:form", "next", "prev", "submit"],
  data() {
    return {
      localForm: { ...this.form },
    };
  },

  methods: {
    async validate() {
      return await this.$refs.personalInfoTriage.validate();
    },

    async onSubmit() {
      const isValid = await this.$refs.personalInfoTriage.validate();

      if (!isValid) {
        this.$q.notify({
          type: "warning",
          message: "Please fill all required fields.",
          position: "top",
        });
        return;
      }

      this.$emit("submit");
    },

    onBack() {
      this.$emit("prev");
    },

    calculateAge(birthDateString) {
      if (!birthDateString) {
        this.localForm.ageTriage = "";
        return;
      }
      const timeStamp = Date.now();
      const birthDate = new Date(birthDateString);
      const age = date.getDateDiff(timeStamp, birthDate, "years");
      this.localForm.ageTriage = age;
    },
  },

  watch: {
    "localForm.birthdateTriage": function (newDate) {
      this.calculateAge(newDate);
    },
    localForm: {
      deep: true,
      handler(newVal) {
        this.$emit("update:form", newVal);
      },
    },
  },
};
</script>
