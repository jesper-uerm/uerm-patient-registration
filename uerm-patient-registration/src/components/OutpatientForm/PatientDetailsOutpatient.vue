<template>
  <q-form ref="personalInfoOutpatient" @submit="onNext">
    <div class="text-subtitle1 text-bold q-mb-md">Patient Information:</div>
    <div class="row q-col-gutter-md">
      <div class="col-3 col-md-3">
        <q-input
          outlined
          dense
          v-model="localForm.lastName"
          label="Last Name *"
          :rules="[(val) => !!val || 'Required']"
        />
      </div>
      <div class="col-3 col-md-3">
        <q-input
          outlined
          dense
          v-model="localForm.firstName"
          label="First Name *"
          :rules="[(val) => !!val || 'Required']"
        />
      </div>
      <div class="col-3 col-md-3">
        <q-input outlined dense v-model="localForm.middleName" label="Middle Name" />
      </div>
      <div class="col-3 col-md-3">
        <q-select
          outlined
          dense
          v-model="localForm.suffixOutpatient"
          :options="['Jr.', 'Sr.', 'II', 'III', 'IV', 'V', 'VI']"
          label="Suffix"
          lazy-rules
        />
      </div>
    </div>
    <div class="row q-col-gutter-md">
      <div class="col-4 col-md-4">
        <q-input
          outlined
          dense
          v-model="localForm.birthdate"
          label="Birthdate *"
          mask="date"
          :rules="[
            'date',
            (val) => new Date(val) <= new Date() || 'Date cannot be in the future',
          ]"
        >
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                <q-date v-model="localForm.birthdate">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </div>
      <div class="col-4 col-md-4">
        <q-input
          outlined
          dense
          type="number"
          v-model="localForm.age"
          label="Age"
          readonly
          bg-color="grey-2"
        />
      </div>
      <div class="col-4 col-md-4">
        <q-input
          outlined
          dense
          v-model="localForm.birthplace"
          label="Birthplace *"
          :rules="[(val) => !!val || 'Required']"
        />
      </div>
    </div>
    <div class="row q-col-gutter-md">
      <div class="col-3 col-md-3">
        <q-select
          outlined
          dense
          v-model="localForm.gender"
          :options="['Male', 'Female', 'Prefer not to say']"
          label="Gender"
          lazy-rules
          :rules="[(val) => !!val || 'Please select gender']"
        />
      </div>
      <div class="col-3 col-md-3">
        <q-select
          outlined
          dense
          v-model="localForm.civilStatus"
          label="Civil Status"
          :options="civilStatusOptions"
          lazy-rules
          :rules="[(val) => !!val || 'Please select Status']"
          emit-value
          map-options
        />
      </div>
      <div class="col-3 col-md-3">
        <q-input outlined dense v-model="localForm.nationality" label="Nationality" />
      </div>
      <div class="col-3 col-md-3">
        <q-select
          outlined
          dense
          v-model="localForm.religion"
          :options="religionOptions"
          label="Religion"
          lazy-rules
          :rules="[(val) => !!val || 'Please select religion']"
          emit-value
          map-options
        />
      </div>
    </div>
    <div class="row q-col-gutter-md q-mb-md">
      <div class="col-12 col-md-12">
        <q-input
          outlined
          dense
          v-model="localForm.occupationOutpatient"
          type="textarea"
          rows="1"
          label="Occupation"
        />
      </div>
    </div>
    <div class="row q-col-gutter-md">
      <div class="col-3 col-md-3">
        <q-input outlined dense v-model="localForm.hmoOutpatient" label="HMO " />
      </div>
      <div class="col-3 col-md-3">
        <q-input
          outlined
          dense
          v-model="localForm.scidnoOutpatient"
          label="SC ID No. / PWD ID No."
        />
      </div>
      <div class="col-3 col-md-3">
        <q-input
          outlined
          dense
          v-model="localForm.landline"
          label="Landline No."
          mask="(##) ####-####"
          unmasked-value
        >
          <template v-slot:append>
            <q-icon name="phone" />
          </template>
        </q-input>
      </div>
      <div class="col-3 col-md-3">
        <q-input
          outlined
          dense
          v-model="localForm.mobile"
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
    </div>

    <q-separator class="q-my-sm" />

    <div class="text-subtitle2 text-grey-8">PhilHealth (Check all that apply)</div>
    <div class="row q-col-gutter-md">
      <q-field
        class="col-12 col-sm-3 col-md-3"
        borderless
        :model-value="localForm.outpatientPhilHealth"
        dense
      >
        <template v-slot:control>
          <div class="column">
            <q-checkbox v-model="localForm.outpatientPhilHealth" val="P/M" label="P/M" />
            <q-checkbox v-model="localForm.outpatientPhilHealth" val="G/M" label="G/M" />
            <q-checkbox v-model="localForm.outpatientPhilHealth" val="S/M" label="S/M" />
          </div>
        </template>
      </q-field>
      <q-field class="col-12 col-sm-3 col-md-3" borderless>
        <template v-slot:control>
          <div class="column">
            <q-checkbox v-model="localForm.outpatientPhilHealth" val="P/D" label="P/D" />
            <q-checkbox v-model="localForm.outpatientPhilHealth" val="G/D" label="G/D" />
            <q-checkbox v-model="localForm.outpatientPhilHealth" val="S/D" label="S/D" />
          </div>
        </template>
      </q-field>
      <q-field class="col-12 col-sm-3 col-md-3" borderless>
        <template v-slot:control>
          <div class="column">
            <q-checkbox v-model="localForm.outpatientPhilHealth" val="I/M" label="I/M" />
            <q-checkbox
              v-model="localForm.outpatientPhilHealth"
              val="OFW/M"
              label="OFW/M"
            />
            <q-checkbox
              v-model="localForm.outpatientPhilHealth"
              val="P/RM (SSS/GSIS)"
              label="P/RM (SSS/GSIS)"
            />
          </div>
        </template>
      </q-field>
      <q-field class="col-12 col-sm-3 col-md-3" borderless>
        <template v-slot:control>
          <div class="column">
            <q-checkbox v-model="localForm.outpatientPhilHealth" val="I/D" label="I/D" />
            <q-checkbox
              v-model="localForm.outpatientPhilHealth"
              val="OFW/D"
              label="OFW/D"
            />
            <q-checkbox
              v-model="localForm.outpatientPhilHealth"
              val="P/RD (SSS/GSIS)"
              label="P/RD (SSS/GSIS)"
            />
          </div>
        </template>
      </q-field>
    </div>

    <q-separator class="q-my-md" />

    <div class="row q-col-gutter-md">
      <div class="col-3 col-md-3">
        <q-select
          v-model="localForm.selectedRegion"
          :options="regionList"
          option-label="name"
          option-value="code"
          label="Region"
          outlined
          dense
          :loading="loadingRegions"
          @update:model-value="loadProvinces"
          lazy-rules
          :rules="[(val) => !!val || 'Please select region']"
        />
      </div>
      <div class="col-3 col-md-3">
        <q-select
          v-model="localForm.selectedProvince"
          :options="provinceList"
          option-label="name"
          option-value="code"
          label="Province"
          :disable="!localForm.selectedRegion"
          outlined
          dense
          :loading="loadingProvinces"
          @update:model-value="loadCities"
        />
      </div>
      <div class="col-3 col-md-3">
        <q-select
          v-model="localForm.selectedCity"
          :options="cityList"
          option-label="name"
          option-value="code"
          label="City/Municipality"
          :disable="!localForm.selectedProvince"
          outlined
          dense
          :loading="loadingCities"
          @update:model-value="loadBarangays"
        />
      </div>
      <div class="col-3 col-md-3">
        <q-select
          v-model="localForm.selectedBarangay"
          :options="barangayList"
          option-label="name"
          option-value="code"
          label="Barangay"
          :disable="!localForm.selectedCity"
          outlined
          dense
          :loading="loadingBarangays"
        />
      </div>
      <div class="col-12 col-md-12">
        <q-input
          outlined
          dense
          v-model="localForm.streetName"
          label="House No. / Street Name"
          :rules="[(val) => !!val || 'Field is required']"
        />
      </div>
    </div>
    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-12">
        <q-input
          outlined
          dense
          v-model="localForm.permanentAddress"
          type="textarea"
          rows="1"
          label="Permanent Home Address"
        />
        <q-checkbox
          v-model="localSameAsPresent"
          label="Same as Present Address"
          class="q-mt-sm text-grey-8 text-caption"
        />
      </div>
    </div>
    <q-stepper-navigation class="text-center">
      <q-btn
        color="blue-10"
        icon-right="arrow_forward"
        style="width: 100%; height: 45px; max-width: 120px"
        label="Next"
        @click="onNext"
      />
    </q-stepper-navigation>
  </q-form>
</template>
<script>
import { date } from "quasar";

export default {
  name: "PatientDetailsOutpatient",
  props: {
    form: Object,
    civilStatusOptions: Array,
    religionOptions: Array,
    sameAsPresent: Boolean,
  },
  emits: ["update:form", "next", "prev"],
  data() {
    return {
      localForm: {
        ...this.form,
        outpatientPhilHealth: this.form.outpatientPhilHealth || [],
        selectedRegion: this.form.selectedRegion || null,
        selectedProvince: this.form.selectedProvince || null,
        selectedCity: this.form.selectedCity || null,
        selectedBarangay: this.form.selectedBarangay || null,
      },
      localSameAsPresent: false,

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
  mounted() {
    this.loadRegions();
  },
  async validate() {
    return await this.$refs.personalInfoOutpatient.validate();
  },

  methods: {
    async onNext() {
      const isValid = await this.$refs.personalInfoOutpatient.validate();

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

    calculateAge(birthDateString) {
      if (!birthDateString) {
        this.localForm.age = "";
        return;
      }
      const timeStamp = Date.now();
      const birthDate = new Date(birthDateString);
      const age = date.getDateDiff(timeStamp, birthDate, "years");
      this.localForm.age = age;
    },

    constructPresentAddress() {
      const parts = [
        this.localForm.streetName,
        this.localForm.selectedBarangay?.name,
        this.localForm.selectedCity?.name,
        this.localForm.selectedProvince?.name,
        this.localForm.selectedRegion?.name,
      ];
      return parts.filter(Boolean).join(", ");
    },

    async loadRegions() {
      this.loadingRegions = true;
      try {
        const response = await fetch("https://psgc.gitlab.io/api/regions/");
        this.regionList = await response.json();
        this.regionList.sort((a, b) => a.name.localeCompare(b.name));
      } catch (error) {
        console.error("Failed to load regions:", error);
      } finally {
        this.loadingRegions = false;
      }
    },

    async loadProvinces() {
      this.localForm.selectedProvince = null;
      this.localForm.selectedCity = null;
      this.localForm.selectedBarangay = null;
      this.provinceList = [];
      this.cityList = [];
      this.barangayList = [];

      if (!this.localForm.selectedRegion) return;

      this.loadingProvinces = true;
      try {
        const response = await fetch(
          `https://psgc.gitlab.io/api/regions/${this.localForm.selectedRegion.code}/provinces/`
        );
        this.provinceList = await response.json();
        this.provinceList.sort((a, b) => a.name.localeCompare(b.name));

        if (
          this.provinceList.length === 0 &&
          this.localForm.selectedRegion.code === "130000000"
        ) {
          this.loadCitiesForRegion();
        }
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
          `https://psgc.gitlab.io/api/regions/${this.localForm.selectedRegion.code}/cities-municipalities/`
        );
        this.cityList = await response.json();
        this.cityList.sort((a, b) => a.name.localeCompare(b.name));
        this.localForm.selectedProvince = { name: "NCR", code: "NCR" };
      } catch (e) {
        console.error(e);
      } finally {
        this.loadingCities = false;
      }
    },
    async loadCities() {
      this.localForm.selectedCity = null;
      this.localForm.selectedBarangay = null;
      this.cityList = [];
      this.barangayList = [];

      if (
        !this.localForm.selectedProvince ||
        this.localForm.selectedProvince.code === "NCR"
      )
        return;

      this.loadingCities = true;
      try {
        const response = await fetch(
          `https://psgc.gitlab.io/api/provinces/${this.localForm.selectedProvince.code}/cities-municipalities/`
        );
        this.cityList = await response.json();
        this.cityList.sort((a, b) => a.name.localeCompare(b.name));
      } catch (error) {
        console.error("Failed to load cities:", error);
      } finally {
        this.loadingCities = false;
      }
    },
    async loadBarangays() {
      this.localForm.selectedBarangay = null;
      this.barangayList = [];

      if (!this.localForm.selectedCity) return;

      this.loadingBarangays = true;
      try {
        const response = await fetch(
          `https://psgc.gitlab.io/api/cities-municipalities/${this.localForm.selectedCity.code}/barangays/`
        );
        this.barangayList = await response.json();
        this.barangayList.sort((a, b) => a.name.localeCompare(b.name));
      } catch (error) {
        console.error("Failed to load barangays:", error);
      } finally {
        this.loadingBarangays = false;
      }
    },
  },

  watch: {
    form: {
      deep: true,
      handler(newVal) {
        if (JSON.stringify(newVal) !== JSON.stringify(this.localForm)) {
          this.localForm = { ...newVal };
        }
      },
    },

    localForm: {
      deep: true,
      handler(val) {
        this.$emit("update:form", val);
        if (this.localSameAsPresent) {
          this.localForm.permanentAddress = this.constructPresentAddress();
        }
      },
    },

    localSameAsPresent(isChecked) {
      if (isChecked) {
        this.localForm.permanentAddress = this.constructPresentAddress();
      } else {
        this.localForm.permanentAddress = "";
      }
    },

    "localForm.streetName": function () {
      if (this.localSameAsPresent)
        this.localForm.permanentAddress = this.constructPresentAddress();
    },
    "localForm.selectedBarangay": function () {
      if (this.localSameAsPresent)
        this.localForm.permanentAddress = this.constructPresentAddress();
    },
    "localForm.selectedCity": function () {
      if (this.localSameAsPresent)
        this.localForm.permanentAddress = this.constructPresentAddress();
    },

    "localForm.birthdate": function (newDate) {
      this.calculateAge(newDate);
    },
  },
};
</script>
