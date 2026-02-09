<template>
  <q-form ref="contactDetails" @submit="onNext">
    <div class="text-subtitle2 text-bold q-mb-md">Government ID's:</div>
    <div class="row q-col-gutter-md">
      <div class="col-12 col-sm-4 col-md-4">
        <q-input
          outlined
          dense
          v-model="formData.govtIds.seniorId"
          type="number"
          label="Senior/PWD No."
        />
      </div>
      <div class="col-12 col-sm-4 col-md-4">
        <q-input
          outlined
          dense
          v-model="formData.govtIds.philhealth"
          type="number"
          label="PhilHealth No."
        />
      </div>
      <div class="col-12 col-sm-4 col-md-4">
        <q-input
          outlined
          dense
          v-model="formData.govtIds.sss"
          type="number"
          label="SSS/GSIS No."
        />
      </div>
      <div class="col-12 col-sm-4 col-md-4">
        <q-input
          outlined
          dense
          v-model="formData.govtIds.tin"
          type="number"
          label="TIN No."
        />
      </div>
      <div class="col-12 col-sm-4 col-md-4">
        <q-input
          outlined
          dense
          v-model="formData.govtIds.others"
          type="number"
          label="Others"
        />
      </div>
    </div>

    <q-separator class="q-my-md" />

    <div class="row q-col-gutter-md">
      <div class="col-12">
        <div class="text-subtitle2">Spouse Details:</div>
      </div>
      <div class="col-12 col-sm-4 col-md-4">
        <q-input
          outlined
          dense
          v-model="formData.spouse.name"
          label="Spouse's Full Name"
        />
      </div>
      <div class="col-12 col-sm-4 col-md-4">
        <q-input outlined dense v-model="formData.spouse.occupation" label="Occupation" />
      </div>
      <div class="col-12 col-sm-4 col-md-4 q-mb-md">
        <q-input
          outlined
          dense
          mask="####-###-####"
          unmasked-value
          v-model="formData.spouse.employerContact"
          label="Employer Contact"
        />
      </div>
    </div>

    <div class="row q-col-gutter-md">
      <div class="col-12 col-sm-6 col-md-6">
        <q-input
          outlined
          dense
          v-model="formData.spouse.employerName"
          label="Employer Name"
        />
      </div>
      <div class="col-12 col-sm-6 col-md-6">
        <q-input
          outlined
          dense
          v-model="formData.spouse.employerAddress"
          label="Employer Address"
        />
      </div>
    </div>

    <q-separator class="q-my-md" />

    <div class="col-12 q-mb-md">
      <div class="text-subtitle2">Contact Person:</div>
    </div>
    <div class="row q-col-gutter-xs">
      <div class="col-12 col-sm-8 col-md-8">
        <q-input
          outlined
          dense
          v-model="formData.contactPerson.name"
          label-slot
          :rules="[(val) => !!val || 'Required']"
        >
          <template v-slot:label> Full Name <span class="text-red">*</span> </template>
        </q-input>
      </div>
      <div class="col-12 col-sm-4 col-md-4">
        <q-select
          outlined
          dense
          v-model="formData.contactPerson.relationship"
          :options="appOptions.relationships"
          label-slot
          :rules="[(val) => !!val || 'Required']"
        >
          <template v-slot:label> Relationship <span class="text-red">*</span> </template>
        </q-select>
      </div>
    </div>

    <div class="row q-col-gutter-xs">
      <div class="col-12 col-sm-4 col-md-4 q-mb-md">
        <q-input
          outlined
          dense
          v-model="formData.contactPerson.email"
          type="email"
          label="Email Address"
        />
      </div>
      <div class="col-12 col-sm-4 col-md-4">
        <q-input
          outlined
          dense
          v-model="formData.contactPerson.mobile"
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
      <div class="col-12 col-sm-4 col-md-4 q-mb-md">
        <q-input
          outlined
          dense
          v-model="formData.contactPerson.landline"
          label="Landline"
          mask="(##) ####-####"
        >
          <template v-slot:append>
            <q-icon name="phone" />
          </template>
        </q-input>
      </div>
    </div>

    <div class="row">
      <div class="col-12">
        <q-input
          outlined
          dense
          v-model="formData.contactPerson.address"
          type="textarea"
          rows="1"
          label-slot
          :rules="[(val) => !!val || 'Required']"
        >
          <template v-slot:label> Home Address <span class="text-red">*</span> </template>
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
  emits: ["next", "prev"],

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

    resetCarData(value) {
      if (value === "No" || value === false) {
        this.formData.socioEconomic.carOwnership = null;
        this.formData.socioEconomic.numberOfCars = "";
      }
    },
  },
};
</script>
