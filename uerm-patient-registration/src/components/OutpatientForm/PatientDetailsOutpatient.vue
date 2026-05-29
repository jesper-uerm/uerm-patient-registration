<template>
  <q-form ref="personalInfoOutpatient" @submit="onNext">
    <div class="text-subtitle1 text-bold q-mb-md">Patient Information:</div>

    <div class="row q-col-gutter-sm">
      <div class="col-12 col-sm-3 col-md-3">
        <q-input
          outlined
          dense
          v-model="formData.personalInfoOutpatient.lastNameOutpatient"
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
          v-model="formData.personalInfoOutpatient.firstNameOutpatient"
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
          v-model="formData.personalInfoOutpatient.middleNameOutpatient"
          label="Middle Name"
        />
      </div>

      <div class="col-12 col-sm-3 col-md-3 q-mb-md">
        <q-select
          outlined
          dense
          v-model="formData.personalInfoOutpatient.suffixOutpatient"
          :options="['Jr.', 'Sr.', 'II', 'III', 'IV', 'V', 'VI']"
          label="Suffix"
        />
      </div>
    </div>

    <div class="row q-col-gutter-sm">
      <div class="col-12 col-sm-4 col-md-4">
        <q-input
          outlined
          dense
          v-model="formData.personalInfoOutpatient.birthdateOutpatient"
          mask="date"
          label-slot
          :rules="[
            'date',
            (val) => !!val || 'Required',
            (val) => new Date(val) <= new Date() || 'Date cannot be in the future',
          ]"
        >
          <template v-slot:label> Birthdate <span class="text-red">*</span> </template>

          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                <q-date v-model="formData.personalInfoOutpatient.birthdateOutpatient">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </div>

      <div v-if="false" class="col-12 col-sm-4 col-md-4 q-mb-md">
        <q-input
          outlined
          dense
          type="number"
          v-model="formData.personalInfoOutpatient.ageOutpatient"
          label="Age"
          readonly
        />
      </div>

      <div class="col-12 col-sm-4 col-md-4">
        <q-input
          outlined
          dense
          v-model="formData.personalInfoOutpatient.birthplaceOutpatient"
          label="Birthplace"
        />
      </div>
      <div class="col-12 col-sm-4 col-md-4">
        <q-select
          outlined
          dense
          v-model="formData.personalInfoOutpatient.genderOutpatient"
          :options="['Male', 'Female']"
          :rules="[(val) => !!val || 'Please select gender']"
          label-slot
        >
          <template v-slot:label> Gender <span class="text-red">*</span> </template>
        </q-select>
      </div>
    </div>

    <div class="row q-col-gutter-sm">
      <div class="col-12 col-sm-4 col-md-4">
        <q-select
          outlined
          dense
          v-model="formData.personalInfoOutpatient.civilStatusOutpatient"
          :options="civilStatusOptions"
          :rules="[(val) => !!val || 'Please select Status']"
          label-slot
        >
          <template v-slot:label> Civil Status <span class="text-red">*</span> </template>
        </q-select>
      </div>

      <div class="col-12 col-sm-4 col-md-4 q-mb-md">
        <q-input
          outlined
          dense
          v-model="formData.personalInfoOutpatient.nationalityOutpatient"
          label="Nationality"
        />
      </div>

      <div class="col-12 col-sm-4 col-md-4">
        <q-select
          outlined
          dense
          v-model="formData.personalInfoOutpatient.religionOutpatient"
          :options="religionOptions"
          :rules="[(val) => !!val || 'Please select religion']"
          label-slot
        >
          <template v-slot:label> Religion <span class="text-red">*</span> </template>
        </q-select>
      </div>
    </div>

    <div class="row q-col-gutter-sm">
      <div class="col-12 col-sm-3 col-md-3">
        <q-input
          outlined
          dense
          v-model="formData.personalInfoOutpatient.hmoOutpatient"
          label="HMO"
        />
      </div>

      <div class="col-12 col-sm-3 col-md-3">
        <q-input
          outlined
          dense
          v-model="formData.personalInfoOutpatient.scidnoOutpatient"
          label="SC ID No. / PWD ID No."
        />
      </div>

      <div class="col-12 col-sm-3 col-md-3">
        <q-input
          outlined
          dense
          v-model="formData.personalInfoOutpatient.landlineOutpatient"
          type="number"
          label="Landline No."
        />
      </div>

      <div class="col-12 col-sm-3 col-md-3">
        <q-input
          outlined
          dense
          v-model="formData.personalInfoOutpatient.mobileOutpatient"
          type="number"
          label="Mobile No."
          unmasked-value
        />
      </div>
    </div>

    <q-separator class="q-my-md" />

    <div class="col-12 col-md-12">
      <q-input
        outlined
        dense
        v-model="formData.personalInfoOutpatient.streetNameOutpatient"
        :rules="[(val) => !!val || 'Field is required']"
        label-slot
      >
        <template v-slot:label>
          House No. / Street Name <span class="text-red">*</span>
        </template>
      </q-input>
    </div>

    <div class="row q-col-gutter-md">
      <div class="col-12 col-sm-3 col-md-3">
        <q-select
          v-model="formData.personalInfoOutpatient.selectedRegionOutpatient"
          :options="regionList"
          option-label="NAME"
          outlined
          dense
          :loading="loadingRegions"
          @update:model-value="loadProvinces"
          :rules="[(val) => !!val || 'Required']"
          label-slot
        >
          <template v-slot:label> Region <span class="text-red">*</span> </template>
        </q-select>
      </div>

      <div class="col-12 col-sm-3 col-md-3">
        <q-select
          v-model="formData.personalInfoOutpatient.selectedProvinceOutpatient"
          :options="provinceList"
          option-label="Name"
          :disable="!formData.personalInfoOutpatient.selectedRegionOutpatient"
          outlined
          dense
          :loading="loadingProvinces"
          @update:model-value="loadCities"
          :rules="[(val) => !!val || 'Required']"
          label-slot
        >
          <template v-slot:label> Province <span class="text-red">*</span> </template>
        </q-select>
      </div>

      <div class="col-12 col-sm-3 col-md-3">
        <q-select
          v-model="formData.personalInfoOutpatient.selectedCityOutpatient"
          :options="cityList"
          option-label="Name"
          :disable="!formData.personalInfoOutpatient.selectedProvinceOutpatient"
          outlined
          dense
          :loading="loadingCities"
          :rules="[(val) => !!val || 'Required']"
          label-slot
        >
          <template v-slot:label>
            City / Municipality <span class="text-red">*</span>
          </template>
        </q-select>
      </div>

      <div class="col-12 col-sm-3 col-md-3">
        <q-input
          v-model="formData.personalInfoOutpatient.selectedBarangayOutpatient"
          :disable="!formData.personalInfoOutpatient.selectedCityOutpatient"
          outlined
          dense
          :rules="[(val) => !!val || 'Required']"
          label-slot
        >
          <template v-slot:label> Barangay <span class="text-red">*</span> </template>
        </q-input>
      </div>
    </div>

    <q-stepper-navigation class="text-center">
      <q-btn
        color="blue-10"
        icon-right="arrow_forward"
        style="width: 120px"
        label="Next"
        type="submit"
      />
    </q-stepper-navigation>
  </q-form>
</template>

<script>
import { mapWritableState, mapActions } from "pinia";
import { useOutpatientStore } from "src/stores/outpatientStore";

import { date } from "quasar";

export default {
  name: "PatientDetailsOutpatient",

  props: {
    prefillPatient: {
      type: Object,
      default: () => null,
    },
  },

  emits: ["next", "prev"],

  data() {
    return {
      civilStatusOptions: ["Single", "Married", "Widowed", "Separated", "Divorced"],

      religionOptions: ["Roman Catholic", "Christian", "Islam", "Others"],

      regionList: [],
      provinceList: [],
      cityList: [],
      barangayList: [],

      loadingRegions: false,
      loadingProvinces: false,
      loadingCities: false,
      loadingBarangays: false,
    };
  },

  computed: {
    ...mapWritableState(useOutpatientStore, ["formData", "sameAsPresent"]),
  },

  mounted() {
    this.loadRegions();
  },

  watch: {
    "formData.personalInfoOutpatient.birthdateOutpatient": function (newVal) {
      this.calculateAge(newVal);
    },
    prefillPatient: {
      immediate: true,

      handler(patient) {
        if (patient && Object.keys(patient).length > 0) {
          this.formData.personalInfoOutpatient = {
            patientNoOutpatient: patient.PATIENTNO || "",
            lastNameOutpatient: patient.LASTNAME || "",
            firstNameOutpatient: patient.FIRSTNAME || "",
            middleNameOutpatient: patient.MIDDLENAME || "",
            suffixOutpatient: patient.SUFFIX || "",
            birthdateOutpatient: patient.DBIRTH
              ? date.formatDate(patient.DBIRTH, "YYYY/MM/DD")
              : "",
            ageOutpatient: patient.AGE || "",
            birthplaceOutpatient: patient.BPLACE || "",
            genderOutpatient: patient.SEX || "",
            civilStatusOutpatient: patient.STATUS || "",
            religionOutpatient: patient.RELIGION_DESC || "",
            nationalityOutpatient: patient.NATIONALITY_DESC || "",
            occupationOutpatient: patient.OCCUPATION || "",
            hmoOutpatient: patient.HMO || "",
            scidnoOutpatient: patient.SCIDNO || patient.PWD_IDNo || "",
            landlineOutpatient: patient.LANDLINE || "",
            mobileOutpatient: patient.MOBILENO || "",
            selectedRegionOutpatient: patient.REGION_DESC || null,
            selectedProvinceOutpatient: patient.PROVINCE_DESC || null,
            selectedCityOutpatient: patient.MUNICIPALITY_DESC || null,
            selectedBarangayOutpatient: patient.BARANGAY_DESC || null,
            streetNameOutpatient: patient.ADDRESS || "",
          };
        }
      },
    },
  },

  methods: {
    ...mapActions(useOutpatientStore, ["calculateAge"]),

    async validate() {
      return await this.$refs.personalInfoOutpatient.validate();
    },

    async onNext() {
      const isValid = await this.validate();

      if (!isValid) {
        this.$q.notify({
          type: "warning",
          message: "Please fill required fields.",
        });

        return;
      }

      this.$emit("next");
    },

    async loadRegions() {
      if (this.regionList && this.regionList.length > 0) return;
      this.loadingRegions = true;
      try {
        const res = await fetch("http://10.107.0.2:3000/api/patients/region");
        if (!res.ok) throw new Error(`Server error: ${res.status}`);

        this.regionList = await res.json();
      } catch (e) {
        console.error("Failed to load regions from backend:", e);
      } finally {
        this.loadingRegions = false;
      }
    },

    async loadProvinces() {
      this.formData.personalInfoOutpatient.selectedProvinceOutpatient = null;
      this.formData.personalInfoOutpatient.selectedCityOutpatient = null;
      this.formData.personalInfoOutpatient.selectedBarangayOutpatient = null;

      this.provinceList = [];
      this.cityList = [];
      this.barangayList = [];

      const region = this.formData.personalInfoOutpatient.selectedRegionOutpatient;
      const regionCode = region?.CODE || region?.code;
      if (!regionCode) return;

      const regionPrefix = regionCode.substring(0, 2);

      this.loadingProvinces = true;
      try {
        const res = await fetch(
          `http://10.107.0.2:3000/api/patients/provinces?regionPrefix=${regionPrefix}`
        );
        if (!res.ok) throw new Error(`Server error: ${res.status}`);

        this.provinceList = await res.json();

        if (this.provinceList.length === 0 && regionPrefix === "13") {
          await this.loadCitiesForRegion(regionCode);
        }
      } catch (e) {
        console.error("Failed to load provinces:", e);
      } finally {
        this.loadingProvinces = false;
      }
    },

    async loadCities() {
      const province = this.formData.personalInfoOutpatient.selectedProvinceOutpatient;
      const provinceCode = province?.Code || province?.code;

      if (!provinceCode || provinceCode === "130000000" || provinceCode === "NCR") return;

      this.formData.personalInfoOutpatient.selectedCityOutpatient = null;
      this.formData.personalInfoOutpatient.selectedBarangayOutpatient = null;

      this.cityList = [];
      this.barangayList = [];

      const cityPrefix = provinceCode.substring(0, 4);

      this.loadingCities = true;
      try {
        const res = await fetch(
          `http://10.107.0.2:3000/api/patients/cities?cityPrefix=${cityPrefix}`
        );
        if (!res.ok) throw new Error(`Server error: ${res.status}`);

        this.cityList = await res.json();
      } catch (e) {
        console.error("Failed to load cities:", e);
      } finally {
        this.loadingCities = false;
      }
    },
  },
};
</script>
