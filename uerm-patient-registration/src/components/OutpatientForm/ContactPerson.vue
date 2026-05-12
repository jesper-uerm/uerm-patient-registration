<template>
  <q-form ref="contactPersonForm" @submit="onNext">
    <div class="text-subtitle1 text-bold q-mb-md">
      Person to notify in case of emergency:
    </div>

    <div class="row q-col-gutter-sm">
      <div class="col-12 col-md-4 col-sm-4">
        <q-input
          outlined
          dense
          label-slot
          v-model="formData.contactPersonOutpatient.contactPersonOutpatient"
          lazy-rules
          :rules="[(val) => !!val || 'Please input valid name']"
        >
          <template v-slot:label> Full Name <span class="text-red">*</span> </template>
        </q-input>
      </div>

      <div class="col-12 col-md-4 col-sm-4">
        <q-input
          outlined
          dense
          label-slot
          v-model="formData.contactPersonOutpatient.contactPersonNumberOutpatient"
          type="number"
        >
          <template v-slot:label> Mobile No. <span class="text-red">*</span> </template>

          <template v-slot:append>
            <q-icon name="smartphone" />
          </template>
        </q-input>
      </div>

      <div class="col-12 col-md-4 col-sm-4">
        <q-select
          outlined
          dense
          label-slot
          v-model="formData.contactPersonOutpatient.contactPersonRelationship"
          :options="relationshipOptions"
          lazy-rules
          :rules="[(val) => !!val || 'Please select relationship']"
        >
          <template v-slot:label> Relationship <span class="text-red">*</span> </template>
        </q-select>
      </div>

      <div class="row col-12 q-col-gutter-md">
        <div class="col-12 col-md-12">
          <q-separator class="q-my-sm" />
          <div class="text-subtitle1 text-bold q-mb-md">Medical Details:</div>

          <div class="row q-col-gutter-md">
            <div class="col-12 col-sm-6 col-md-6">
              <q-input
                outlined
                dense
                label-slot
                v-model="formData.contactPersonOutpatient.outpatientProcedure"
                :rules="[(val) => !!val || 'Procedure is required']"
              >
                <template v-slot:label>
                  Procedure <span class="text-red">*</span>
                </template>
              </q-input>
            </div>

            <div class="col-12 col-md-6 col-sm-6">
              <q-input
                outlined
                dense
                label-slot
                v-model="formData.contactPersonOutpatient.outpatientPhysician"
                :rules="[(val) => !!val || 'Physician is required']"
              >
                <template v-slot:label>
                  Attending Physician <span class="text-red">*</span>
                </template>
              </q-input>
            </div>
          </div>
        </div>
      </div>
    </div>

    <q-stepper-navigation class="text-center q-gutter-md">
      <q-btn
        unelevated
        color="orange-10"
        icon-right="arrow_back"
        label="Back"
        @click="onBack"
        style="width: 120px"
        :class="$q.screen.lt.sm ? 'order-last' : 'q-px-md'"
      />

      <q-btn
        style="width: 120px"
        color="blue-10"
        icon-right="arrow_forward"
        label="Next"
        @click="onNext"
        :class="$q.screen.lt.sm ? '' : 'q-px-md'"
      />
    </q-stepper-navigation>
  </q-form>
</template>

<script>
import { mapWritableState } from "pinia";
import { useOutpatientStore } from "src/stores/outpatientStore";

export default {
  name: "ContactPersonOutpatient",

  props: {
    prefillPatient: {
      type: Object,
      default: () => null,
    },
  },

  emits: ["next", "prev"],

  data() {
    return {
      relationshipOptions: ["Spouse", "Parent", "Sibling", "Child", "Guardian", "Other"],
      hasError: false,
      selectedPatient: null,
    };
  },

  computed: {
    ...mapWritableState(useOutpatientStore, ["formData"]),
  },

  watch: {
    prefillPatient: {
      immediate: true,

      handler(patient) {
        if (patient) {
          this.formData.contactPersonOutpatient.contactPersonOutpatient =
            patient.INCASE || "";

          this.formData.contactPersonOutpatient.contactPersonNumberOutpatient =
            patient.INCASEPHONENO || "";

          this.formData.contactPersonOutpatient.contactPersonRelationship =
            patient.RELATIONSHIP || "";
        }
      },
    },
  },

  methods: {
    async validate() {
      const isFormValid = await this.$refs.contactPersonForm.validate();
      return isFormValid;
    },

    async onNext() {
      const isValid = await this.$refs.contactPersonForm.validate();

      if (!isValid) {
        this.$q.notify({
          type: "warning",
          message: "Please fill all required fields.",
          position: "top",
        });

        return;
      }

      this.$emit("next");
    },

    onBack() {
      this.$emit("prev");
    },
  },
};
</script>
