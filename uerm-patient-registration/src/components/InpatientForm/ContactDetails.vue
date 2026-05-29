<template>
  <q-form ref="contactDetails" @submit="onNext">
    <div class="row q-col-gutter-md q-mb-md">
      <div class="col-12">
        <div class="text-subtitle2">Patient Employer Details:</div>
      </div>

      <div class="col-12 col-sm-3 col-md-3">
        <q-input
          outlined
          dense
          v-model="formData.personalInfo.occupation"
          label="Occupation"
        />
      </div>

      <div class="col-12 col-sm-3 col-md-3">
        <q-input
          outlined
          dense
          v-model="formData.personalInfo.employer"
          label="Employer Name"
        />
      </div>

      <div class="col-12 col-sm-3 col-md-3">
        <q-input
          outlined
          dense
          v-model="formData.personalInfo.employerAddress"
          label="Employer Address"
        />
      </div>

      <div class="col-12 col-sm-3 col-md-3">
        <q-input
          outlined
          dense
          v-model="formData.personalInfo.employerContactNo"
          label="Contact No."
        />
      </div>
    </div>

    <q-separator class="q-my-xs q-mb-md" />

    <div class="row q-col-gutter-md">
      <div class="col-12">
        <div class="text-subtitle2">Parent Information:</div>
      </div>
      <div class="col-12 col-sm-4 col-md-4">
        <q-input
          outlined
          dense
          v-model="formData.personalInfo.fathersName"
          label="Father's Full Name "
        />
      </div>
      <div class="col-12 col-sm-4 col-md-4">
        <q-input
          outlined
          dense
          v-model="formData.personalInfo.fathersAddress"
          type="textarea"
          rows="1"
          label="Address"
        />
      </div>
      <div class="col-12 col-sm-4 col-md-4 q-mb-md">
        <q-input
          outlined
          dense
          v-model="formData.personalInfo.fatherContactNumber"
          label="Contact No."
          unmasked-value
        />
      </div>
    </div>
    <div class="row q-col-gutter-md">
      <div class="col-12 col-sm-4 col-md-4">
        <q-input
          outlined
          dense
          v-model="formData.personalInfo.mothersName"
          label="Mother's Name"
        />
      </div>
      <div class="col-12 col-sm-4 col-md-4">
        <q-input
          outlined
          dense
          v-model="formData.personalInfo.mothersAddress"
          type="textarea"
          rows="1"
          label="Address"
        />
        <q-checkbox
          v-model="formData.toggles.sameAsFather"
          label="Same as Father's Address"
          class="q-mt-sm text-grey-8 text-caption"
          @update:model-value="updateMotherAddress"
        />
      </div>
      <div class="col-12 col-sm-4 col-md-4">
        <q-input
          outlined
          dense
          v-model="formData.personalInfo.motherContactNumber"
          label="Contact No."
          unmasked-value
        />
      </div>
    </div>

    <q-separator class="q-my-xs q-mb-md" />

    <div class="row q-col-gutter-sm">
      <div class="col-12">
        <div class="text-subtitle2">Spouse Details:</div>
      </div>
      <div class="col-12 col-sm-3 col-md-3">
        <q-input
          outlined
          dense
          v-model="formData.contactDetails.spouseName"
          label="Full Name"
        />
      </div>
      <div class="col-12 col-sm-3 col-md-3">
        <q-input
          outlined
          dense
          v-model="formData.contactDetails.spouseAddress"
          label="Address"
        />
      </div>
      <div class="col-12 col-sm-3 col-md-3">
        <q-input
          outlined
          dense
          unmasked-value
          v-model="formData.contactDetails.spouseContact"
          label="Contact No."
        />
      </div>
      <div class="col-12 col-sm-3 col-md-3">
        <q-input
          outlined
          dense
          v-model="formData.contactDetails.spouseOccupation"
          label="Ocupation"
        />
      </div>
    </div>

    <q-separator class="q-my-md" />

    <div class="col-12 q-mb-md">
      <div class="text-subtitle2">Contact Person:</div>
    </div>
    <div class="row q-col-gutter-xs">
      <div class="col-12 col-sm-3 col-md-3">
        <q-input
          outlined
          dense
          v-model="formData.contactDetails.contactPersonInpatient"
          label-slot
          :rules="[(val) => !!val || 'Required']"
        >
          <template v-slot:label>Name <span class="text-red">*</span> </template>
        </q-input>
      </div>
      <div class="col-12 col-sm-3 col-md-3">
        <q-select
          outlined
          dense
          v-model="formData.contactDetails.contactPersonInpatientRelationship"
          :options="appOptions.relationships"
          label-slot
          :rules="[(val) => !!val || 'Required']"
        >
          <template v-slot:label> Relationship <span class="text-red">*</span> </template>
        </q-select>
      </div>
      <div class="col-12 col-sm-3 col-md-3">
        <q-input
          outlined
          dense
          v-model="formData.contactDetails.contactPersonInpatientAddress"
          type="textarea"
          rows="1"
          label-slot
          :rules="[(val) => !!val || 'Required']"
        >
          <template v-slot:label> Home Address <span class="text-red">*</span> </template>
        </q-input>
      </div>

      <div class="col-12 col-sm-3 col-md-3">
        <q-input
          outlined
          dense
          v-model="formData.contactDetails.contactPersonInpatientMobile"
          label-slot
          :rules="[(val) => !!val || 'Required']"
        >
          <template v-slot:label> Contact No. <span class="text-red">*</span> </template>
        </q-input>
      </div>
    </div>

    <q-stepper-navigation class="text-center q-gutter-md">
      <q-btn
        style="width: 120px"
        color="orange-10"
        icon="arrow_back"
        label="Back"
        @click="onBack"
      />
      <q-btn
        style="width: 120px"
        color="blue-10"
        icon-right="arrow_forward"
        label="Next"
        @click="onNext"
      />
    </q-stepper-navigation>
  </q-form>
</template>

<script>
import { mapWritableState } from "pinia";
import { useInpatientStore } from "src/stores/inpatientStore";

export default {
  name: "ContactDetails",

  props: {
    prefillPatient: {
      type: Object,
      default: () => null,
    },
  },

  data() {
    return {
      selectedPatient: null,
    };
  },

  emits: ["next", "prev"],

  watch: {
    prefillPatient: {
      immediate: true,
      handler(patient) {
        if (patient) {
          this.formData.personalInfo.occupation = patient.OCCUPATION_DESC || "";
          this.formData.personalInfo.employer = patient.EMPLOYER || "";
          this.formData.personalInfo.employerAddress = patient.EMPLOYERADD || "";
          this.formData.personalInfo.employerContactNo = patient.EMPLOYERTELNO || "";

          this.formData.personalInfo.fathersName = patient.FATHER || "";
          this.formData.personalInfo.fathersAddress = patient.FADDRESS || "";
          this.formData.personalInfo.fatherContactNumber = patient.FTEL || "";

          this.formData.personalInfo.mothersName = patient.MOTHER || "";
          this.formData.personalInfo.mothersAddress = patient.MADDRESS || "";
          this.formData.personalInfo.motherContactNumber = patient.MTEL || "";

          this.formData.contactDetails.spouseName = patient.NAMEOFSPOUSE || "";
          this.formData.contactDetails.spouseAddress = patient.UDF_SPOUSEADDRESS || "";
          this.formData.contactDetails.spouseContact = patient.UDF_SPOUSECONT || "";
          this.formData.contactDetails.spouseOccupation = patient.SPOUSEOCCUPATION || "";

          this.formData.contactDetails.contactPersonInpatient = patient.INCASE || "";
          this.formData.contactDetails.contactPersonInpatientRelationship =
            patient.RELATIONSHIP || "";
          this.formData.contactDetails.contactPersonInpatientAddress =
            patient.INCASEADD || "";
          this.formData.contactDetails.contactPersonInpatientMobile =
            patient.INCASEPHONENO || "";
        }
      },
    },
  },

  computed: {
    ...mapWritableState(useInpatientStore, ["formData", "appOptions"]),
  },

  methods: {
    async validate() {
      return await this.$refs.contactDetails.validate();
    },

    async onNext() {
      const isValid = await this.validate();

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

    updateMotherAddress() {
      if (this.formData.toggles.sameAsFather) {
        this.formData.personalInfo.mothersAddress = this.formData.personalInfo.fathersAddress;
      } else {
        this.formData.personalInfo.mothersAddress = "";
      }
    },
  },
};
</script>
