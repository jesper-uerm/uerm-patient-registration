<template>
  <q-form ref="patientDetails" @submit="onNext">
    <div class="text-subtitle1 text-bold q-mb-md">Patient Information:</div>
    <div class="row q-col-gutter-xs">
      <div class="col-12 col-sm-3 col-md-3">
        <q-input
          outlined
          dense
          v-model="formData.personalInfo.lastName"
          label-slot
          :rules="[(val) => !!val || 'Required']"
        >
          <template v-slot:label> Last Name <span class="text-red">*</span> </template>
        </q-input>
      </div>
      <div class="col-12 col-sm-3 col-md-3">
        <q-input
          outlined
          dense
          v-model="formData.personalInfo.firstName"
          label-slot
          :rules="[(val) => !!val || 'Required']"
        >
          <template v-slot:label> First Name <span class="text-red">*</span> </template>
        </q-input>
      </div>
      <div class="col-12 col-sm-3 col-md-3 q-mb-md">
        <q-input
          outlined
          dense
          v-model="formData.personalInfo.middleName"
          label="Middle Name"
        />
      </div>
      <div class="col-12 col-md-3 col-sm-3 q-mb-lg">
        <q-select
          outlined
          dense
          v-model="formData.personalInfo.suffix"
          :options="['Jr.', 'Sr.', 'II', 'III', 'IV', 'V', 'VI']"
          label="Suffix"
          lazy-rules
        />
      </div>
    </div>
    <div class="row q-col-gutter-xs">
      <div class="col-12 col-sm-4 col-md-4">
        <q-input
          outlined
          dense
          v-model="formData.personalInfo.birthdate"
          label-slot
          mask="date"
          :rules="['date', isDateInPast]"
        >
          <template v-slot:label> Birthdate <span class="text-red">*</span> </template>

          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy
                cover
                transition-show="scale"
                transition-hide="scale"
                ref="qDateProxy"
              >
                <q-date
                  v-model="formData.personalInfo.birthdate"
                  @update:model-value="$refs.qDateProxy.hide()"
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
      <div class="col-12 col-sm-4 col-md-4 q-mb-md">
        <q-input
          outlined
          dense
          type="number"
          v-model="formData.personalInfo.age"
          label="Age"
          readonly
          bg-color="grey-2"
        />
      </div>
      <div class="col-12 col-sm-4 col-md-4 q-mb-md">
        <q-input
          outlined
          dense
          v-model="formData.personalInfo.birthplace"
          label="Birthplace"
        />
      </div>
    </div>
    <div class="row q-col-gutter-xs">
      <div class="col-12 col-sm-3 col-md-3">
        <q-select
          outlined
          dense
          v-model="formData.personalInfo.gender"
          :options="['Male', 'Female']"
          label-slot
          lazy-rules
          :rules="[(val) => !!val || 'Please select gender']"
        >
          <template v-slot:label> Gender <span class="text-red">*</span> </template>
        </q-select>
      </div>
      <div class="col-12 col-sm-3 col-md-3">
        <q-select
          outlined
          dense
          v-model="formData.personalInfo.civilStatus"
          label-slot
          :options="civilStatusOptions"
          lazy-rules
          :rules="[(val) => !!val || 'Please select Status']"
          emit-value
          map-options
        >
          <template v-slot:label> Civil Status <span class="text-red">*</span> </template>
        </q-select>
      </div>
      <div class="col-12 col-sm-3 col-md-3">
        <q-select
          outlined
          dense
          v-model="formData.personalInfo.religion"
          :options="religionOptions"
          label-slot
          lazy-rules
          :rules="[(val) => !!val || 'Please select religion']"
          emit-value
          map-options
        >
          <template v-slot:label> Religion <span class="text-red">*</span> </template>
        </q-select>
      </div>
      <div class="col-12 col-sm-3 col-md-3 q-mb-md">
        <q-input
          outlined
          dense
          v-model="formData.personalInfo.nationality"
          label="Nationality"
        />
      </div>
    </div>
    <div class="row q-col-gutter-xs">
      <div class="col-12 col-sm-4 col-md-4 q-mb-md">
        <q-input
          outlined
          dense
          v-model="formData.personalInfo.landline"
          label="Landline No."
          mask="(##) ####-####"
          unmasked-value
        >
          <template v-slot:append>
            <q-icon name="phone" />
          </template>
        </q-input>
      </div>
      <div class="col-12 col-sm-4 col-md-4">
        <q-input
          outlined
          dense
          v-model="formData.personalInfo.mobile"
          label-slot
          mask="####-###-####"
          unmasked-value
          :rules="[
            (val) => !!val || 'Please input mobile number',
            (val) => val.length === 11 || 'Must be 11 digits',
          ]"
        >
          <template v-slot:label> Mobile No. <span class="text-red">*</span> </template>

          <template v-slot:append>
            <q-icon name="smartphone" />
          </template>
        </q-input>
      </div>
      <div class="col-12 col-sm-4 col-md-4 q-mb-md">
        <q-input
          outlined
          dense
          type="email"
          v-model="formData.personalInfo.email"
          label="Email Address"
        />
      </div>
    </div>
    <div class="row q-col-gutter-md q-mb-md">
      <div class="col-12 col-md-12">
        <q-input
          outlined
          dense
          v-model="formData.personalInfo.occupation"
          type="textarea"
          rows="1"
          label="Occupation"
        />
      </div>
    </div>
    <div class="row q-col-gutter-xs">
      <div class="col-12 col-sm-3 col-md-3">
        <q-select
          v-model="formData.personalInfo.selectedRegion"
          :options="formData.addressOptions.regions"
          option-label="name"
          option-value="code"
          label-slot
          outlined
          dense
          :loading="formData.addressLoading.regions"
          @update:model-value="loadProvinces"
          lazy-rules
          :rules="[(val) => !!val || 'Please select region']"
        >
          <template v-slot:label> Region <span class="text-red">*</span> </template>
        </q-select>
      </div>
      <div class="col-12 col-sm-3 col-md-3">
        <q-select
          v-model="formData.personalInfo.selectedProvince"
          :options="formData.addressOptions.provinces"
          option-label="name"
          option-value="code"
          label-slot
          :disable="!formData.personalInfo.selectedRegion"
          outlined
          dense
          :loading="formData.addressLoading.provinces"
          @update:model-value="loadCities"
          :rules="[(val) => !!val || 'Required']"
        >
          <template v-slot:label> Province <span class="text-red">*</span> </template>
        </q-select>
      </div>
      <div class="col-12 col-sm-3 col-md-3">
        <q-select
          v-model="formData.personalInfo.selectedCity"
          :options="formData.addressOptions.cities"
          option-label="name"
          option-value="code"
          label-slot
          :disable="!formData.personalInfo.selectedProvince"
          outlined
          dense
          :loading="formData.addressLoading.cities"
          @update:model-value="loadBarangays"
          :rules="[(val) => !!val || 'Required']"
        >
          <template v-slot:label>
            City/Municipality <span class="text-red">*</span>
          </template>
        </q-select>
      </div>
      <div class="col-12 col-sm-3 col-md-3">
        <q-select
          v-model="formData.personalInfo.selectedBarangay"
          :options="formData.addressOptions.barangays"
          option-label="name"
          option-value="code"
          label-slot
          :disable="!formData.personalInfo.selectedCity"
          outlined
          dense
          :loading="formData.addressLoading.barangays"
          :rules="[(val) => !!val || 'Required']"
        >
          <template v-slot:label> Barangay <span class="text-red">*</span> </template>
        </q-select>
      </div>
      <div class="col-12 col-md-12">
        <q-input
          outlined
          dense
          v-model="formData.personalInfo.streetName"
          label-slot
          :rules="[(val) => !!val || 'Field is required']"
        >
          <template v-slot:label>
            House No. / Street Name <span class="text-red">*</span>
          </template>
        </q-input>
      </div>
    </div>
    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-12">
        <q-input
          outlined
          dense
          v-model="formData.personalInfo.permanentAddress"
          type="textarea"
          rows="1"
          label="Permanent Home Address"
        />
        <q-checkbox
          v-model="formData.toggles.sameAsPresent"
          label="Same as Present Address"
          class="q-mt-sm text-grey-8 text-caption"
          @update:model-value="updatePermanentAddress"
        />
      </div>
    </div>
    <q-separator class="q-my-md" />
    <div class="row q-col-gutter-md">
      <div class="col-12 col-sm-4 col-md-4">
        <q-input
          outlined
          dense
          v-model="formData.personalInfo.fathersName"
          label="Father's Full Name *"
        />
      </div>
      <div class="col-12 col-sm-4 col-md-4">
        <q-input
          outlined
          dense
          v-model="formData.personalInfo.fathersAddress"
          type="textarea"
          rows="1"
          label="Complete Address"
        />
      </div>
      <div class="col-12 col-sm-4 col-md-4 q-mb-md">
        <q-input
          outlined
          dense
          v-model="formData.personalInfo.fatherContactNumber"
          label="Contact No:"
          mask="####-###-####"
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
          label="Mother's Maiden Name *"
        />
      </div>
      <div class="col-12 col-sm-4 col-md-4">
        <q-input
          outlined
          dense
          v-model="formData.personalInfo.mothersAddress"
          type="textarea"
          rows="1"
          label="Complete Address"
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
          label="Contact No:"
          mask="####-###-####"
          unmasked-value
        />
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
import { mapWritableState, mapActions } from "pinia";
import { useInpatientStore } from "src/stores/inpatientStore";

export default {
  data() {
    return {
      civilStatusOptions: ["Single", "Married", "Widowed", "Separated", "Divorced"],
      religionOptions: [
        "Roman Catholic",
        "Christian",
        "Islam",
        "Iglesia ni Cristo",
        "Others",
      ],
    };
  },

  computed: {
    ...mapWritableState(useInpatientStore, ["formData"]),
  },

  watch: {
    "formData.personalInfo.birthdate": function (newVal) {
      this.calculateAge(newVal);
    },
  },

  mounted() {
    this.loadRegions();
  },

  methods: {
    ...mapActions(useInpatientStore, [
      "loadRegions",
      "loadProvinces",
      "loadCities",
      "loadBarangays",
      "calculateAge",
    ]),

    isDateInPast(dateString) {
      const dateObj = new Date(dateString);
      const today = new Date();
      return dateObj < today || "Date must be in the past";
    },

    updatePermanentAddress() {
      if (this.formData.toggles.sameAsPresent) {
        const p = this.formData.personalInfo;
        const parts = [
          p.streetName,
          p.selectedBarangay?.name,
          p.selectedCity?.name,
          p.selectedProvince?.name,
          p.selectedRegion?.name,
        ];
        this.formData.personalInfo.permanentAddress = parts.filter(Boolean).join(", ");
      } else {
        this.formData.personalInfo.permanentAddress = "";
      }
    },

    updateMotherAddress() {
      if (this.formData.toggles.sameAsFather) {
        this.formData.personalInfo.mothersAddress = this.formData.personalInfo.fathersAddress;
      } else {
        this.formData.personalInfo.mothersAddress = "";
      }
    },

    async onNext() {
      const valid = await this.$refs.patientDetails.validate();

      if (valid) {
        console.log("Form is valid", this.formData.personalInfo);
        this.$emit("next");
      } else {
        console.log("Form has errors");
      }
    },
  },
};
</script>
