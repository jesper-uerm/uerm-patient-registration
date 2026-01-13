<template>
  <q-form ref="contactPersonForm">
    <div class="text-subtitle1 text-bold q-mb-md">
      Person to notify in case of emergency:
    </div>
    <div class="row q-col-gutter-md">
      <div class="col-4 col-md-3 col-sm-6">
        <q-input
          outlined
          dense
          v-model="localForm.contactPersonOutpatient"
          label="Full Name *"
          :rules="[(val) => !!val || 'Please input valid name']"
        />
      </div>
      <div class="col-4 col-md-3 col-sm-6">
        <q-input
          outlined
          dense
          v-model="localForm.contactPersonNumberOutpatient"
          label="Mobile No. *"
          mask="####-###-####"
          unmasked-value
          :rules="[
            (val) => !!val || 'Please input mobile number',
            (val) => val.length === 11 || 'Must be 11 digits',
          ]"
        >
          <template v-slot:append>
            <q-icon name="smartphone" />
          </template>
        </q-input>
      </div>
      <div class="col-4 col-md-3 col-sm-6">
        <q-input
          outlined
          dense
          v-model="localForm.contactPersonLandlineOutpatient"
          label="Landline No. *"
          mask="(##) ####-####"
          unmasked-value
        >
          <template v-slot:append>
            <q-icon name="phone" />
          </template>
        </q-input>
      </div>
      <div class="col-4 col-md-3 col-sm-6">
        <q-select
          outlined
          dense
          v-model="localForm.contactPersonRelationshipOutpatient"
          :options="relationshipOptions"
          label="Relationship"
        />
      </div>
      <div class="row col-12 q-col-gutter-md">
        <div class="col-12 col-md-12">
          <q-separator class="q-my-sm" />
          <div class="text-subtitle1 text-bold q-mb-md">Medical Details:</div>
          <div class="row q-col-gutter-md">
            <div class="col-6 col-md-6">
              <q-input
                outlined
                dense
                v-model="localForm.outpatientProcedure"
                label="Procedure"
              />
            </div>
            <div class="col-6 col-md-6">
              <q-input
                outlined
                dense
                v-model="localForm.outpatientPhysician"
                label="Attending Physician"
              />
            </div>
          </div>
          <q-separator class="q-my-md" />
        </div>
      </div>
      <div class="col-12">
        <div class="text-subtitle2 text-center q-mb-md">Data Privacy Consent</div>

        <div class="q-mx-xl">
          <q-scroll-area
            :style="{ height: $q.screen.lt.sm ? '200px' : '250px' }"
            style="border: 1px solid #e0e0e0; border-radius: 8px"
            class="q-pa-xl bg-grey-1 text-justify"
          >
            <p>
              <strong>1. Data Collection & Usage:</strong>
              In accordance with the
              <strong>Data Privacy Act of 2012 (Republic Act No. 10173)</strong>, I hereby
              authorize UERM Memorial Medical Center to collect, process, and store my
              personal data for the purpose of medical records, hospital administration,
              and insurance processing.
            </p>
            <p>
              <strong>2. Confidentiality:</strong>
              UERM ensures that all personal information is treated with strict
              confidentiality and is accessed only by authorized personnel.
            </p>
            <p>
              <strong>3. Third-Party Sharing:</strong>
              My data may be shared with PhilHealth, HMOs, and other regulatory bodies as
              required by law or for the facilitation of my medical benefits.
            </p>
            <p>
              <strong>4. Data Retention:</strong>
              My records will be retained in accordance with the hospital's retention
              policy and applicable laws.
            </p>
            <p>
              By signing below, I acknowledge that I have read and understood this Data
              Privacy Consent form.
            </p>
          </q-scroll-area>
        </div>
      </div>
      <div class="row col-12 q-col-gutter-md">
        <div class="col-12 items-center">
          <SignaturePadOutpatient v-model="localSignature" />
          <div
            v-if="hasError"
            class="col-12 text-center text-negative text-caption q-mt-sm"
          >
            <q-icon name="warning" class="q-mr-xs" /> Signature is required to proceed.
          </div>
        </div>
      </div>
    </div>
    <q-stepper-navigation class="text-center q-gutter-md">
      <q-btn
        style="width: 100%; height: 45px; max-width: 130px"
        color="amber-14"
        icon="arrow_back"
        label="Back"
        @click="onBack"
      />
      <q-btn
        style="width: 100%; height: 45px; max-width: 130px"
        color="blue-10"
        icon-right="upload"
        label="Submit"
        @click="trySubmit"
      />
    </q-stepper-navigation>
  </q-form>
</template>

<script>
import SignaturePadOutpatient from "src/components/OutpatientForm/SignaturePadOutpatient.vue";

export default {
  name: "contactPersonOutpatient",
  components: {
    SignaturePadOutpatient,
  },
  props: {
    form: Object,
    relationshipOptions: Array,
    initialSignature: {
      type: String,
      default: null,
    },
  },
  emits: ["update:form", "next", "prev", "submit", "update:signature"],
  data() {
    return {
      localForm: {
        ...this.form,
      },
      localSignature: this.initialSignature || null,
      hasError: false,
    };
  },
  watch: {
    localForm: {
      handler(val) {
        this.$emit("update:form", val);
      },
      deep: true,
    },
    localSignature(val) {
      if (val) {
        this.hasError = false;
        this.$emit("update:signature", val);
      }
    },
  },
  methods: {
    async validate() {
      const isFormValid = await this.$refs.contactPersonForm.validate();

      const isSignatureValid = !!this.localSignature;

      this.hasError = !isSignatureValid;

      return isFormValid && isSignatureValid;
    },

    async trySubmit() {
      const valid = await this.validate();

      if (valid) {
        this.$emit("submit");
      } else {
        this.$q.notify({
          type: "warning",
          position: "top",
          message: "Please fill all fields and provide a signature.",
        });
      }
    },

    onBack() {
      this.$emit("prev");
    },
  },
};
</script>

<style scoped></style>
