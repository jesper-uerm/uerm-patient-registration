<template>
  <q-form ref="personalInfoTriageRef" @submit.prevent="onNext">
    <div class="text-subtitle2 text-bold q-mb-md">Patient Information:</div>

    <div class="row" :class="$q.screen.lt.sm ? 'q-col-gutter-xs' : 'q-col-gutter-sm'">
      <div class="col-12 col-sm-3">
        <q-input
          outlined
          dense
          v-model="formData.lastNameTriage"
          label-slot
          :rules="[(val) => !!val || 'Required']"
        >
          <template v-slot:label> Last Name <span class="text-red">*</span> </template>
        </q-input>
      </div>
      <div class="col-12 col-sm-3">
        <q-input
          outlined
          dense
          v-model="formData.firstNameTriage"
          label-slot
          :rules="[(val) => !!val || 'Required']"
        >
          <template v-slot:label> First Name <span class="text-red">*</span> </template>
        </q-input>
      </div>
      <div class="col-12 col-sm-3 q-mb-md">
        <q-input outlined dense v-model="formData.middleNameTriage" label="Middle Name" />
      </div>
      <div class="col-12 col-sm-3 q-mb-md">
        <q-select
          outlined
          dense
          v-model="formData.suffixTriage"
          :options="['Jr.', 'Sr.', 'II', 'III', 'IV']"
          label="Suffix"
        />
      </div>
    </div>

    <div class="row" :class="$q.screen.lt.sm ? 'q-col-gutter-xs' : 'q-col-gutter-sm'">
      <div class="col-12 col-sm-3">
        <q-input
          outlined
          dense
          v-model="formData.birthdateTriage"
          label-slot
          mask="date"
          :rules="['date']"
        >
          <template v-slot:label> Birthdate <span class="text-red">*</span> </template>

          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                <q-date
                  v-model="formData.birthdateTriage"
                  @update:model-value="calculateAge"
                >
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </div>
      <div class="col-12 col-sm-3 q-mb-md">
        <q-input
          outlined
          dense
          type="number"
          v-model="formData.ageTriage"
          label="Age"
          readonly
          bg-color="grey-2"
        />
      </div>
      <div class="col-12 col-sm-3">
        <q-select
          outlined
          dense
          v-model="formData.genderTriage"
          :options="['Male', 'Female']"
          label-slot
          :rules="[(val) => !!val || 'Required']"
        >
          <template v-slot:label> Gender <span class="text-red">*</span> </template>
        </q-select>
      </div>
      <div class="col-12 col-sm-3">
        <q-select
          outlined
          dense
          v-model="formData.civilStatus"
          :options="['Single', 'Married', 'Widowed', 'Separated', 'Divorced']"
          lazy-rules
          :rules="[(val) => !!val || 'Please select Status']"
          emit-value
          map-options
          label-slot
        >
          <template v-slot:label> Civil Status <span class="text-red">*</span> </template>
        </q-select>
      </div>
    </div>

    <div class="row" :class="$q.screen.lt.sm ? 'q-col-gutter-xs' : 'q-col-gutter-sm'">
      <div class="col-12 col-sm-4">
        <q-input
          outlined
          dense
          v-model="formData.hmoName"
          label="HMO Provider"
          hint="e.g. Maxicare, Intellicare"
        />
      </div>

      <div class="col-12 col-sm-4">
        <q-select
          outlined
          dense
          v-model="formData.infirmary"
          :options="[
            'N/A',
            'Employee - UE Caloocan',
            'Employee - UE Manila',
            'Employee - UERM',
            'Faculty - UE Caloocan',
            'Faculty - UE Manila',
            'Student - UE Caloocan',
            'Student - UE Manila',
            'Student - UERM',
            'UERM Resident',
          ]"
          label-slot
          :rules="[(val) => !!val || 'Required']"
        >
          <template v-slot:label> Infirmary <span class="text-red">*</span> </template>
        </q-select>
      </div>
      <div class="col-12 col-sm-4">
        <q-input
          outlined
          dense
          v-model="formData.scidnoTriage"
          label="SC ID No. / PWD ID No."
        />
      </div>
    </div>

    <div class="text-subtitle2= text-bold q-my-md">
      Person to notify in case of Emergency:
    </div>

    <div class="row" :class="$q.screen.lt.sm ? 'q-col-gutter-xs' : 'q-col-gutter-sm'">
      <div class="col-12 col-sm-6">
        <q-input
          outlined
          dense
          v-model="formData.contactPersonTriage"
          label-slot
          :rules="[(val) => !!val || 'Required']"
        >
          <template v-slot:label> Full Name <span class="text-red">*</span> </template>
        </q-input>
      </div>
      <div class="col-12 col-sm-6">
        <q-input
          outlined
          dense
          v-model="formData.contactPersonTriageMobile"
          label-slot
          mask="####-###-####"
          :rules="[(val) => !!val || 'Required']"
        >
          <template v-slot:label>
            Mobile Number <span class="text-red">*</span>
          </template>

          <template v-slot:append>
            <q-icon name="smartphone" />
          </template>
        </q-input>
      </div>
      <div class="col-12 col-md-12">
        <q-input
          outlined
          dense
          v-model="formData.contactPersonTriageAddress"
          type="textarea"
          rows="1"
          label-slot
          :rules="[(val) => !!val || 'Required']"
        >
          <template v-slot:label> Home Address <span class="text-red">*</span> </template>
        </q-input>
      </div>
    </div>

    <q-stepper-navigation class="text-center" :class="$q.screen.lt.sm ? '' : 'q-mt-xs'">
      <q-btn
        color="blue-10"
        icon-right="arrow_forward"
        style="width: 120px"
        label="Next"
        @click="onNext"
      />
    </q-stepper-navigation>
  </q-form>
</template>

<script>
import { mapWritableState } from "pinia";
import { useTriageStore } from "../../stores/triageStore";
import { date } from "quasar";

export default {
  name: "PatientDetailsTriage",

  computed: {
    ...mapWritableState(useTriageStore, ["formData", "step"]),
  },

  mounted() {
    if (!this.formData.dateTriage) {
      this.formData.dateTriage = date.formatDate(Date.now(), "YYYY/MM/DD");
    }
  },

  methods: {
    calculateAge(newDate) {
      if (!newDate) return;
      this.formData.ageTriage = date.getDateDiff(Date.now(), new Date(newDate), "years");
    },

    async onNext() {
      const isFormValid = await this.$refs.personalInfoTriageRef.validate();

      if (isFormValid) {
        this.step = 2;
      } else {
        this.$q.notify({
          type: "warning",
          html: true,
          position: "top",
          message: "Please complete form requirements.",
        });
      }
    },
  },
};
</script>
