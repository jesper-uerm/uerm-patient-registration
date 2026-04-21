<template>
  <q-form ref="personalInfoTriageRef" @submit.prevent="onNext">
    <div class="text-subtitle2 text-bold q-mb-md">Patient Information:</div>

    <div class="row" :class="$q.screen.lt.sm ? 'q-col-gutter-xs' : 'q-col-gutter-sm'">
      <div class="col-12 col-sm-3">
        <q-input
          outlined
          dense
          v-model="formData.lastNameTriage"
          label-slot
          :rules="[(val) => !!val || 'Required']"
        >
          <template v-slot:label> Last Name <span class="text-red">*</span> </template>
        </q-input>
      </div>
      <div class="col-12 col-sm-3">
        <q-input
          outlined
          dense
          v-model="formData.firstNameTriage"
          label-slot
          :rules="[(val) => !!val || 'Required']"
        >
          <template v-slot:label> First Name <span class="text-red">*</span> </template>
        </q-input>
      </div>
      <div class="col-12 col-sm-3 q-mb-md">
        <q-input outlined dense v-model="formData.middleNameTriage" label="Middle Name" />
      </div>
      <div class="col-12 col-sm-3 q-mb-md">
        <q-select
          outlined
          dense
          v-model="formData.suffixTriage"
          :options="['Jr.', 'Sr.', 'II', 'III', 'IV']"
          label="Suffix"
        />
      </div>
    </div>

    <div class="row" :class="$q.screen.lt.sm ? 'q-col-gutter-xs' : 'q-col-gutter-sm'">
      <div class="col-12 col-sm-4">
        <q-input
          outlined
          dense
          v-model="formData.birthdateTriage"
          label-slot
          mask="date"
          :rules="['date']"
        >
          <template v-slot:label> Birthdate <span class="text-red">*</span> </template>

          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                <q-date v-model="formData.birthdateTriage">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </div>
      <div class="col-12 col-sm-4">
        <q-select
          outlined
          dense
          v-model="formData.genderTriage"
          :options="['Male', 'Female', 'Others']"
          label-slot
          :rules="[(val) => !!val || 'Required']"
        >
          <template v-slot:label> Gender <span class="text-red">*</span> </template>
        </q-select>
      </div>
      <div class="col-12 col-sm-4">
        <q-select
          outlined
          dense
          v-model="formData.civilStatus"
          :options="['Single', 'Married', 'Widowed', 'Separated', 'Divorced']"
          lazy-rules
          :rules="[(val) => !!val || 'Please select Status']"
          emit-value
          map-options
          label-slot
        >
          <template v-slot:label> Civil Status <span class="text-red">*</span> </template>
        </q-select>
      </div>
    </div>

    <div
      class="row q-mb-md"
      :class="$q.screen.lt.sm ? 'q-col-gutter-xs' : 'q-col-gutter-sm'"
    >
      <div v-if="isSenior" class="col-12">
        <q-input
          outlined
          dense
          v-model="formData.scidnoTriage"
          label="Senior Citizen ID No."
        />
      </div>
    </div>

    <div class="row" :class="$q.screen.lt.sm ? 'q-col-gutter-xs' : 'q-col-gutter-sm'">
      <div class="col-12 col-sm-4">
        <q-select
          outlined
          dense
          v-model="formData.hmoName"
          :options="hmo || []"
          emit-value
          map-options
          label="HMO"
          stack-label
        >
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey"> No HMO found </q-item-section>
            </q-item>
          </template>
        </q-select>
      </div>

      <div class="col-12 col-sm-4">
        <q-select
          outlined
          dense
          v-model="formData.infirmary"
          :options="[
            'N/A',
            'Employee - UE Caloocan',
            'Employee - UE Manila',
            'Employee - UERM',
            'Faculty - UE Caloocan',
            'Faculty - UE Manila',
            'Student - UE Caloocan',
            'Student - UE Manila',
            'Student - UERM',
            'UERM Resident',
          ]"
          label-slot
          :rules="[(val) => !!val || 'Required']"
        >
          <template v-slot:label> Infirmary <span class="text-red">*</span> </template>
        </q-select>
      </div>
      <div class="col-12 col-sm-4">
        <q-input outlined dense v-model="formData.pwdTriage" label="PWD ID No." />
      </div>
    </div>
    <div class="row q-col-gutter-xs">
      <div class="col-12">
        <q-input
          v-model="formData.streetName"
          label-slot
          outlined
          dense
          lazy-rules
          :rules="[(val) => !!val || 'Please enter street name or house number']"
        >
          <template v-slot:label>
            Street / House Number / Building <span class="text-red">*</span>
          </template>
        </q-input>
      </div>

      <div class="col-12 col-sm-3 col-md-3">
        <q-select
          v-model="formData.selectedRegion"
          :options="formData.addressOptions.regions"
          option-label="name"
          option-value="code"
          label-slot
          outlined
          dense
          :loading="formData.addressLoading.regions"
          @update:model-value="handleLoadProvinces"
          lazy-rules
          :rules="[(val) => !!val || 'Required']"
        >
          <template v-slot:label> Region <span class="text-red">*</span> </template>
        </q-select>
      </div>

      <div class="col-12 col-sm-3 col-md-3">
        <q-select
          v-model="formData.selectedProvince"
          :options="formData.addressOptions.provinces"
          option-label="name"
          option-value="code"
          label-slot
          :disable="!formData.selectedRegion"
          outlined
          dense
          :loading="formData.addressLoading.provinces"
          @update:model-value="handleLoadCities"
          :rules="[(val) => !!val || 'Required']"
        >
          <template v-slot:label> Province <span class="text-red">*</span> </template>
        </q-select>
      </div>

      <div class="col-12 col-sm-3 col-md-3">
        <q-select
          v-model="formData.selectedCity"
          :options="formData.addressOptions.cities"
          option-label="name"
          option-value="code"
          label-slot
          :disable="!formData.selectedProvince"
          outlined
          dense
          :loading="formData.addressLoading.cities"
          @update:model-value="handleLoadBarangays"
          :rules="[(val) => !!val || 'Required']"
        >
          <template v-slot:label>
            City/Municipality <span class="text-red">*</span>
          </template>
        </q-select>
      </div>

      <div class="col-12 col-sm-3 col-md-3">
        <q-select
          v-model="formData.selectedBarangay"
          :options="formData.addressOptions.barangays"
          option-label="name"
          option-value="code"
          label-slot
          :disable="!formData.selectedCity"
          outlined
          dense
          :loading="formData.addressLoading.barangays"
          :rules="[(val) => !!val || 'Required']"
        >
          <template v-slot:label> Barangay <span class="text-red">*</span> </template>
        </q-select>
      </div>
    </div>
    <q-stepper-navigation class="text-center" :class="$q.screen.lt.sm ? '' : 'q-mt-xs'">
      <q-btn
        unelevated
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
import { useTriageStore } from "../../stores/triageStore";
import { date } from "quasar";

export default {
  name: "PatientDetailsTriage",

  data() {
    return {
      formData: {
        patientId: null,
        patientNo: null,
        lastNameTriage: "",
        firstNameTriage: "",
        middleNameTriage: "",
        suffixTriage: "",
        birthdateTriage: "",
        ageTriage: "",
        genderTriage: "",
        contactPersonTriage: "",
        contactPersonTriageAddress: "",
        contactPersonTriageMobile: "",
        scidnoTriage: "",
        infirmary: "N/A",
        hmoName: "",
        civilStatus: "",
        chiefComplaintTriage: "",
        tempTriage: "",
        heartRateTriage: "",
        oxygenTriage: "",
        bpTriage: "",
        respiRateTriage: "",
        painScoreTriage: "",
        avpuTriage: "",
        contagiousTriage: "",
        isolationPrecautionTriage: "",
        cpdTriage: "",
        levelTriage: "",
        checkforPresense: [],
        remarksTriage: "",
        personnelTriage: "",
        dateTriage: "",
        patientSignature: null,
        personnelSignature: null,
        selectedRegion: null,
        selectedProvince: null,
        selectedCity: null,
        selectedBarangay: null,
        streetName: "",

        addressOptions: { regions: [], provinces: [], cities: [], barangays: [] },
        addressLoading: {
          regions: false,
          provinces: false,
          cities: false,
          barangays: false,
        },
      },
    };
  },

  computed: {
    ...mapWritableState(useTriageStore, ["step", "hmo"]),

    formattedBirthdate() {
      return this.formData.birthdateTriage
        ? date.formatDate(this.formData.birthdateTriage, "YYYY/MM/DD")
        : "";
    },

    isSenior() {
      if (!this.formData.birthdateTriage) return false;

      const today = new Date();
      const birthDate = new Date(this.formData.birthdateTriage);

      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();

      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }

      return age >= 60;
    },
  },

  async mounted() {
    await this.handleLoadRegions();
    await this.fetchHmo();

    if (!this.formData.dateTriage) {
      this.formData.dateTriage = date.formatDate(Date.now(), "YYYY/MM/DD");
    }
  },

  watch: {
    isSenior(newVal) {
      if (!newVal) {
        this.formData.scidnoTriage = "";
      }
    },
  },

  methods: {
    ...mapActions(useTriageStore, [
      "fetchHmo",
      "loadRegions",
      "loadProvinces",
      "loadCities",
      "loadBarangays",
    ]),

    async handleLoadRegions() {
      await this.loadRegions(this.formData);
    },

    handleLoadProvinces() {
      this.loadProvinces(this.formData);
    },

    handleLoadCities() {
      this.loadCities(this.formData);
    },

    handleLoadBarangays() {
      this.loadBarangays(this.formData);
    },

    async onNext() {
      const isFormValid = await this.$refs.personalInfoTriageRef.validate();

      if (isFormValid) {
        this.$emit("next", this.formData);
      } else {
        this.$q.notify({ type: "warning", message: "Please complete the form." });
      }
    },
  },
};
</script>
