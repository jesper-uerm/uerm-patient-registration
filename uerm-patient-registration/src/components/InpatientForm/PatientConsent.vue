<template>
  <q-form ref="patientConsent">
    <div class="text-subtitle1 text-bold">Patient Consent</div>
    <div class="row q-col-gutter-md">
      <!-- <div class="col-12 col-md-12">
        <q-field
          borderless
          :model-value="localForm.mop"
          :rules="[(val) => !!val || 'Please provide source of income.']"
          dense
          emit-value
          map-options
        >
          <template v-slot:control>
            <q-option-group
              v-model="localForm.mop"
              :options="mopOptions"
              color="primary"
              inline
            />
          </template>
        </q-field>
        <q-slide-transition>
          <div v-if="localForm.mop === 'Others'" class="q-mt-sm">
            <q-input
              outlined
              v-model="localForm.specificmop"
              label="Please specify mode of payment *"
              dense
              :rules="[(val) => !!val || 'Please specify']"
            />
          </div>
        </q-slide-transition>
        <q-separator class="q-my-sm" />
      </div>
      <div class="row col-12 q-col-gutter-md">
        <div class="col-12 col-md-6">
          <q-input
            outlined
            dense
            v-model="localForm.creditCard"
            type="number"
            label="No. of Credit Cards owned"
          />
        </div>
        <div class="col-12 col-md-6">
          <q-input outlined dense v-model="localForm.bank" label="Bank Affliations" />
        </div>
      </div> -->
      <div class="row col-12 q-col-gutter-md">
        <div class="col-12 col-md-12">
          <q-separator class="q-my-sm" />
          <div class="text-subtitle1 text-bold">
            I / We received the following items in good order and condition:
          </div>
          <div class="row q-gutter-lg q-pt-xs" emit-value map-options>
            <q-checkbox
              v-model="localForm.items"
              val="UERM Brochure"
              label="UERM Brochure"
            />
            <q-checkbox
              v-model="localForm.items"
              val="Admission Kit"
              label="Admission Kit"
            />
            <q-checkbox
              v-model="localForm.items"
              val="Patient Satisfaction Survey"
              label="Patient Satisfaction Survey"
            />
          </div>
          <q-separator class="q-my-md" />
        </div>
      </div>
      <div class="row col-12 q-col-gutter-md">
        <div class="col-12 text-center">
          <div class="text-subtitle2">CERTIFICATION</div>
        </div>
        <div class="q-mx-xl">
          <div class="text-body2 text-justify text-grey-9">
            1. I / We hereby certify that the information provided herein is true and
            correct to the best of my / our knowledge.
          </div>
          <div class="text-body2 q-mt-sm text-justify text-grey-9">
            2. I / We further agree to bind myself / ourselves to the terms of the
            attached memorandum of undertaking and terms and conditions for inpatients.
          </div>
          <div class="text-body2 q-mt-sm text-justify text-grey-9">
            3. I / We authorize the Center and its authorized personnel to process all
            information I / we provided, including collecting, recording, organizing,
            storing, updating, modifying, retrieving, consolidating, sharing, or using the
            information and/or documents provided in any other way necessary to pursue its
            legitimate interests in relation to the admission. I understand that the
            Center may keep my information for historical and statistical purposes.
          </div>
        </div>
        <div class="col-12 items-center">
          <SignaturePad v-model="localSignature" />
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
        color="orange-10"
        icon="arrow_back"
        label="Back"
        @click="onBack"
      />
      <q-btn
        style="width: 100%; height: 45px; max-width: 130px"
        type="submit"
        color="blue-10"
        icon-right="upload"
        label="Submit"
        @click="trySubmit"
      />
    </q-stepper-navigation>
  </q-form>
</template>
<script>
import SignaturePad from "src/components/InpatientForm/SignaturePad.vue";

export default {
  name: "ModeOfPayment",
  components: {
    SignaturePad,
  },
  props: {
    form: Object,
    mopOptions: Array,
    initialSignature: {
      type: String,
      default: null,
    },
  },
  emits: ["update:form", "next", "prev", "close", "submit", "update:signature"],
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
      }
      this.$emit("update:signature", val);
    },
  },
  methods: {
    async validate() {
      const isFormValid = await this.$refs.patientConsent.validate();

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
