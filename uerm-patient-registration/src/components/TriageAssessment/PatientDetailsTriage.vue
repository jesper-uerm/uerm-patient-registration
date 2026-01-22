<template>
  <q-form ref="personalInfoTriageRef" @submit.prevent="onNext">
    <div class="text-subtitle2 text-bold q-mb-md">Patient Information:</div>

    <div class="row q-col-gutter-md">
      <div class="col-3">
        <q-input
          outlined
          dense
          v-model="localForm.lastNameTriage"
          label="Last Name *"
          :rules="[(val) => !!val || 'Required']"
        />
      </div>
      <div class="col-3">
        <q-input
          outlined
          dense
          v-model="localForm.firstNameTriage"
          label="First Name *"
          :rules="[(val) => !!val || 'Required']"
        />
      </div>
      <div class="col-3">
        <q-input
          outlined
          dense
          v-model="localForm.middleNameTriage"
          label="Middle Name"
        />
      </div>
      <div class="col-3">
        <q-select
          outlined
          dense
          v-model="localForm.suffixTriage"
          :options="['Jr.', 'Sr.', 'II', 'III', 'IV']"
          label="Suffix"
        />
      </div>
    </div>

    <div class="row q-col-gutter-md q-mt-xs">
      <div class="col-4">
        <q-input
          outlined
          dense
          v-model="localForm.birthdateTriage"
          label="Birthdate *"
          mask="date"
          :rules="['date']"
        >
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                <q-date v-model="localForm.birthdateTriage"
                  ><div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat /></div
                ></q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </div>
      <div class="col-4">
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
      <div class="col-4">
        <q-select
          outlined
          dense
          v-model="localForm.genderTriage"
          :options="['Male', 'Female']"
          label="Gender"
          :rules="[(val) => !!val || 'Required']"
        />
      </div>
    </div>

    <div class="row q-col-gutter-md q-mt-xs">
      <div class="col-12">
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
      <div class="col-4">
        <q-input
          outlined
          dense
          v-model="localForm.tempTriage"
          label="Temp (c)"
          :rules="[(val) => !!val || 'Required']"
        />
      </div>
      <div class="col-4">
        <q-input
          outlined
          dense
          v-model="localForm.heartRateTriage"
          label="HR (bpm)"
          :rules="[(val) => !!val || 'Required']"
        />
      </div>
      <div class="col-4">
        <q-input
          outlined
          dense
          v-model="localForm.oxygenTriage"
          label="O2 Sat (%)"
          :rules="[(val) => !!val || 'Required']"
        />
      </div>
      <div class="col-4">
        <q-input
          outlined
          dense
          v-model="localForm.bpTriage"
          label="BP (mmHg)"
          :rules="[(val) => !!val || 'Required']"
        />
      </div>
      <div class="col-4">
        <q-input
          outlined
          dense
          v-model="localForm.respiRateTriage"
          label="RR (cpm)"
          :rules="[(val) => !!val || 'Required']"
        />
      </div>
      <div class="col-4">
        <q-input
          outlined
          dense
          v-model="localForm.painScoreTriage"
          label="Pain Score"
          :rules="[(val) => !!val || 'Required']"
        />
      </div>
    </div>

    <q-separator class="q-my-md" />

    <div class="row q-col-gutter-md">
      <div class="col-6">
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
          label="AVPU"
          :rules="[(val) => !!val || 'Required']"
        />
      </div>
      <div class="col-6">
        <q-select
          outlined
          dense
          v-model="localForm.contagiousTriage"
          :options="[
            'Symptom/s suggestive of COVID-19',
            'Symptom/s suggestive of VIRAL EXANTHEM',
            'None',
          ]"
          label="Infectious Screen"
          :rules="[(val) => !!val || 'Required']"
        />
      </div>
      <div class="col-4">
        <q-select
          outlined
          dense
          v-model="localForm.isolationPrecautionTriage"
          :options="['COVID Complex', 'COVID Extension (OPD)']"
          label="Isolation Precaution"
          :rules="[(val) => !!val || 'Required']"
        />
      </div>
      <div class="col-4">
        <q-select
          outlined
          dense
          v-model="localForm.cpdTriage"
          :options="['Yes', 'No']"
          label="CP Distress"
          :rules="[(val) => !!val || 'Required']"
        />
      </div>
      <div class="col-4">
        <q-select
          outlined
          dense
          v-model="localForm.levelTriage"
          :options="['1 - Emergent', '2 - Urgent', '3 - Non-Urgent']"
          label="Triage Level"
          :rules="[(val) => !!val || 'Required']"
        />
      </div>
      <div class="col-6">
        <q-select
          outlined
          dense
          v-model="localForm.checkforPresense"
          multiple
          :options="['Fever', 'Cough', 'Sore Throat', 'Headache', 'Rash']"
          label="Symptoms Present"
        />
      </div>
      <div class="col-6">
        <q-input
          outlined
          dense
          v-model="localForm.remarksTriage"
          label="Remarks"
          :rules="[(val) => !!val || 'Required']"
        />
      </div>
    </div>

    <div class="row q-col-gutter-md q-mt-sm">
      <div class="col-12 col-sm-6">
        <q-input
          outlined
          dense
          v-model="localForm.personnelTriage"
          label="Name of Triage Personnel *"
          :rules="[(val) => !!val || 'Required']"
        />
      </div>
      <div class="col-12 col-sm-6">
        <q-input
          outlined
          dense
          v-model="localForm.dateTriage"
          label="Date *"
          mask="date"
          :rules="['date']"
        >
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy cover
                ><q-date v-model="localForm.dateTriage"
                  ><div class="row items-center justify-end">
                    <q-btn
                      v-close-popup
                      label="Close"
                      color="primary"
                      flat
                    /></div></q-date
              ></q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </div>

      <div class="col-12">
        <div class="text-caption text-center text-grey-8 q-mb-xs">
          Triage Personnel Signature *
        </div>
        <div
          class="rounded-borders q-pa-sm"
          :class="hasError ? 'bg-red-1' : 'bg-grey-1'"
          style="border: 1px solid #dcdcdc"
        >
          <SignaturePad v-model="localSignature" />

          <div v-if="hasError" class="text-negative text-caption q-mt-xs text-center">
            <q-icon name="warning" class="q-mr-xs" /> Signature is required
          </div>
        </div>
      </div>
    </div>

    <q-stepper-navigation class="text-center q-mt-lg">
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
import { date } from "quasar";
import SignaturePad from "src/components/InpatientForm/SignaturePad.vue";

export default {
  name: "PatientDetailsTriage",
  components: { SignaturePad },
  props: {
    form: Object,
    initialSignature: {
      type: String,
      default: null,
    },
  },
  emits: ["update:form", "next", "update:signature"],
  data() {
    return {
      localForm: { ...this.form },
      localSignature: this.initialSignature || null,
      hasError: false,
    };
  },
  watch: {
    "localForm.birthdateTriage"(newDate) {
      if (!newDate) return;
      this.localForm.ageTriage = date.getDateDiff(Date.now(), new Date(newDate), "years");
    },
    localForm: {
      deep: true,
      handler(newVal) {
        this.$emit("update:form", newVal);
      },
    },
    localSignature(val) {
      if (val) this.hasError = false;
      this.$emit("update:signature", val);
    },
    initialSignature(val) {
      if (val !== this.localSignature) {
        this.localSignature = val;
      }
    },
  },
  methods: {
    async onNext() {
      const isFormValid = await this.$refs.personalInfoTriageRef.validate();
      const isSignatureValid = !!this.localSignature;

      if (!isSignatureValid) this.hasError = true;

      if (isFormValid && isSignatureValid) {
        this.$emit("next");
      } else {
        this.$q.notify({
          type: "warning",
          message: "Please complete form and signature.",
        });
      }
    },
  },
};
</script>
