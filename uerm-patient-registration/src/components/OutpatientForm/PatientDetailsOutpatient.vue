<template>
  <q-form ref="personalInfoOutpatient" @submit="onNext">
    <div class="text-subtitle1 text-bold q-mb-md">Patient Information:</div>

    <div class="row q-col-gutter-sm">
      <div class="col-12 col-sm-3 col-md-3">
        <q-input
          outlined
          dense
          v-model="info.lastNameOutpatient"
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
          v-model="info.firstNameOutpatient"
          label-slot
          :rules="[(val) => !!val || 'Required']"
        >
          <template v-slot:label> First Name <span class="text-red">*</span> </template>
        </q-input>
      </div>
      <div class="col-12 col-sm-3 col-md-3 q-mb-md">
        <q-input outlined dense v-model="info.middleNameOutpatient" label="Middle Name" />
      </div>
      <div class="col-12 col-sm-3 col-md-3 q-mb-md">
        <q-select
          outlined
          dense
          v-model="info.suffixOutpatient"
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
          v-model="info.birthdateOutpatient"
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
                <q-date v-model="info.birthdateOutpatient">
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
          v-model="info.ageOutpatient"
          label="Age"
          readonly
          bg-color="grey-2"
        />
      </div>
      <div class="col-12 col-sm-4 col-md-4">
        <q-input outlined dense v-model="info.birthplaceOutpatient" label="Birthplace" />
      </div>
    </div>

    <div class="row q-col-gutter-sm">
      <div class="col-12 col-sm-3 col-md-3">
        <q-select
          outlined
          dense
          v-model="info.genderOutpatient"
          :options="['Male', 'Female']"
          :rules="[(val) => !!val || 'Please select gender']"
          label-slot
        >
          <template v-slot:label> Gender <span class="text-red">*</span> </template>
        </q-select>
      </div>
      <div class="col-12 col-sm-3 col-md-3">
        <q-select
          outlined
          dense
          v-model="info.civilStatusOutpatient"
          :options="civilStatusOptions"
          :rules="[(val) => !!val || 'Please select Status']"
          label-slot
        >
          <template v-slot:label> Civil Status <span class="text-red">*</span> </template>
        </q-select>
      </div>
      <div class="col-12 col-sm-3 col-md-3 q-mb-md">
        <q-input
          outlined
          dense
          v-model="info.nationalityOutpatient"
          label="Nationality"
        />
      </div>
      <div class="col-12 col-sm-3 col-md-3">
        <q-select
          outlined
          dense
          v-model="info.religionOutpatient"
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
        <q-input outlined dense v-model="info.hmoOutpatient" label="HMO " />
      </div>
      <div class="col-12 col-sm-3 col-md-3">
        <q-input
          outlined
          dense
          v-model="info.scidnoOutpatient"
          label="SC ID No. / PWD ID No."
        />
      </div>
      <div class="col-12 col-sm-3 col-md-3">
        <q-input
          outlined
          dense
          v-model="info.landlineOutpatient"
          label="Landline No."
          mask="(##) ####-####"
          unmasked-value
        />
      </div>
      <div class="col-12 col-sm-3 col-md-3">
        <q-input
          outlined
          dense
          v-model="info.mobileOutpatient"
          label="Mobile No. *"
          mask="####-###-####"
          unmasked-value
          :rules="[
            (val) => !!val || 'Required',
            (val) => val.length === 11 || 'Must be 11 digits',
          ]"
        />
      </div>
    </div>

    <div class="text-subtitle2 text-grey-8">PhilHealth (Check all that apply)</div>
    <div class="row q-col-gutter-md">
      <q-field
        class="col-12 col-sm-3 col-md-3"
        borderless
        :model-value="info.outpatientPhilHealth"
        dense
      >
        <template v-slot:control>
          <div class="column">
            <q-checkbox v-model="info.outpatientPhilHealth" val="P/M" label="P/M" />
            <q-checkbox v-model="info.outpatientPhilHealth" val="G/M" label="G/M" />
            <q-checkbox v-model="info.outpatientPhilHealth" val="S/M" label="S/M" />
          </div>
        </template>
      </q-field>

      <q-field
        class="col-12 col-sm-3 col-md-3"
        borderless
        :model-value="info.outpatientPhilHealth"
      >
        <template v-slot:control>
          <div class="column">
            <q-checkbox v-model="info.outpatientPhilHealth" val="P/D" label="P/D" />
            <q-checkbox v-model="info.outpatientPhilHealth" val="G/D" label="G/D" />
            <q-checkbox v-model="info.outpatientPhilHealth" val="S/D" label="S/D" />
          </div>
        </template>
      </q-field>

      <q-field
        class="col-12 col-sm-3 col-md-3"
        borderless
        :model-value="info.outpatientPhilHealth"
      >
        <template v-slot:control>
          <div class="column">
            <q-checkbox v-model="info.outpatientPhilHealth" val="I/M" label="I/M" />
            <q-checkbox v-model="info.outpatientPhilHealth" val="OFW/M" label="OFW/M" />
            <q-checkbox
              v-model="info.outpatientPhilHealth"
              val="P/RM (SSS/GSIS)"
              label="P/RM (SSS/GSIS)"
            />
          </div>
        </template>
      </q-field>

      <q-field
        class="col-12 col-sm-3 col-md-3"
        borderless
        :model-value="info.outpatientPhilHealth"
      >
        <template v-slot:control>
          <div class="column">
            <q-checkbox v-model="info.outpatientPhilHealth" val="I/D" label="I/D" />
            <q-checkbox v-model="info.outpatientPhilHealth" val="OFW/D" label="OFW/D" />
            <q-checkbox
              v-model="info.outpatientPhilHealth"
              val="P/RD (SSS/GSIS)"
              label="P/RD (SSS/GSIS)"
            />
          </div>
        </template>
      </q-field>
    </div>

    <q-separator class="q-my-md" />

    <div class="row q-col-gutter-md">
      <div class="col-12 col-sm-3 col-md-3">
        <q-select
          v-model="info.selectedRegionOutpatient"
          :options="regionList"
          option-label="name"
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
          v-model="info.selectedProvinceOutpatient"
          :options="provinceList"
          option-label="name"
          :disable="!info.selectedRegionOutpatient"
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
          v-model="info.selectedCityOutpatient"
          :options="cityList"
          option-label="name"
          :disable="!info.selectedProvinceOutpatient"
          outlined
          dense
          :loading="loadingCities"
          @update:model-value="loadBarangays"
          :rules="[(val) => !!val || 'Required']"
          label-slot
        >
          <template v-slot:label>
            City / Municipality <span class="text-red">*</span>
          </template>
        </q-select>
      </div>
      <div class="col-12 col-sm-3 col-md-3">
        <q-select
          v-model="info.selectedBarangayOutpatient"
          :options="barangayList"
          option-label="name"
          :disable="!info.selectedCityOutpatient"
          outlined
          dense
          :loading="loadingBarangays"
          :rules="[(val) => !!val || 'Required']"
          label-slot
        >
          <template v-slot:label> Barangay <span class="text-red">*</span> </template>
        </q-select>
      </div>
      <div class="col-12 col-md-12">
        <q-input
          outlined
          dense
          v-model="info.streetNameOutpatient"
          :rules="[(val) => !!val || 'Field is required']"
          label-slot
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
          v-model="info.permanentAddressOutpatient"
          type="textarea"
          rows="1"
          label="Permanent Home Address"
        />
        <q-checkbox
          :model-value="sameAsPresent"
          @update:model-value="setSameAsPresent"
          label="Same as Present Address"
          class="q-mt-sm text-grey-8 text-caption"
        />
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

export default {
  name: "PatientDetailsOutpatient",
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
    info() {
      return this.formData.personalInfoOutpatient;
    },
  },

  mounted() {
    this.loadRegions();
  },

  methods: {
    ...mapActions(useOutpatientStore, [
      "calculateAge",
      "updatePermanentAddress",
      "setSameAsPresent",
    ]),

    async validate() {
      return await this.$refs.personalInfoOutpatient.validate();
    },

    async onNext() {
      const isValid = await this.validate();
      if (!isValid) {
        this.$q.notify({ type: "warning", message: "Please fill required fields." });
        return;
      }
      this.$emit("next");
    },

    async loadRegions() {
      this.loadingRegions = true;
      try {
        const response = await fetch("https://psgc.gitlab.io/api/regions/");
        const data = await response.json();
        this.regionList = data.sort((a, b) => a.name.localeCompare(b.name));
      } catch (error) {
        console.error("Failed to load regions:", error);
      } finally {
        this.loadingRegions = false;
      }
    },

    async loadProvinces() {
      this.info.selectedProvinceOutpatient = null;
      this.info.selectedCityOutpatient = null;
      this.info.selectedBarangayOutpatient = null;
      this.provinceList = [];
      this.cityList = [];
      this.barangayList = [];

      if (!this.info.selectedRegionOutpatient) return;

      if (this.info.selectedRegionOutpatient.code === "130000000") {
        await this.loadCitiesForRegion();
        return;
      }

      this.loadingProvinces = true;
      try {
        const res = await fetch(
          `https://psgc.gitlab.io/api/regions/${this.info.selectedRegionOutpatient.code}/provinces/`
        );
        const data = await res.json();
        this.provinceList = data.sort((a, b) => a.name.localeCompare(b.name));
      } catch (error) {
        console.error("Failed to load provinces:", error);
      } finally {
        this.loadingProvinces = false;
      }
    },

    async loadCitiesForRegion() {
      this.loadingCities = true;
      try {
        const response = await fetch(
          `https://psgc.gitlab.io/api/regions/${this.info.selectedRegionOutpatient.code}/cities-municipalities/`
        );
        const data = await response.json();
        this.cityList = data.sort((a, b) => a.name.localeCompare(b.name));

        this.info.selectedProvinceOutpatient = {
          name: "NCR / Metro Manila",
          code: "NCR",
        };
      } catch (e) {
        console.error("Failed to load cities for region:", e);
      } finally {
        this.loadingCities = false;
      }
    },

    async loadCities() {
      this.info.selectedCityOutpatient = null;
      this.info.selectedBarangayOutpatient = null;
      this.cityList = [];
      this.barangayList = [];

      if (
        !this.info.selectedProvinceOutpatient ||
        this.info.selectedProvinceOutpatient.code === "NCR"
      )
        return;

      this.loadingCities = true;
      try {
        const res = await fetch(
          `https://psgc.gitlab.io/api/provinces/${this.info.selectedProvinceOutpatient.code}/cities-municipalities/`
        );
        const data = await res.json();
        this.cityList = data.sort((a, b) => a.name.localeCompare(b.name));
      } catch (error) {
        console.error("Failed to load cities:", error);
      } finally {
        this.loadingCities = false;
      }
    },

    async loadBarangays() {
      this.info.selectedBarangayOutpatient = null;
      this.barangayList = [];

      if (!this.info.selectedCityOutpatient) return;

      this.loadingBarangays = true;
      try {
        const res = await fetch(
          `https://psgc.gitlab.io/api/cities-municipalities/${this.info.selectedCityOutpatient.code}/barangays/`
        );
        const data = await res.json();
        this.barangayList = data.sort((a, b) => a.name.localeCompare(b.name));
      } catch (error) {
        console.error("Failed to load barangays:", error);
      } finally {
        this.loadingBarangays = false;
      }
    },
  },

  watch: {
    "info.birthdateOutpatient"(newVal) {
      this.calculateAge(newVal);
    },
    "info.streetNameOutpatient": "updatePermanentAddress",
    "info.selectedBarangayOutpatient": "updatePermanentAddress",
    "info.selectedCityOutpatient": "updatePermanentAddress",
    "info.selectedProvinceOutpatient": "updatePermanentAddress",
    "info.selectedRegionOutpatient": "updatePermanentAddress",
  },
};
</script>
