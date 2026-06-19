<template>
  <q-form ref="patientDetails" @submit="onNext">
    <div class="text-subtitle1 text-bold q-mb-md">Patient Information:</div>
    <div class="row q-col-gutter-xs">
      <div class="col-12 q-mb-md">
        <q-input
          v-show="formData.personalInfo.patientNo"
          outlined
          dense
          v-model="formData.personalInfo.patientNo"
          label="Patient No."
          readonly
          input-class="text-weight-bold"
        />
      </div>
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
      <div v-if="false" class="col-12 col-sm-4 col-md-4 q-mb-md">
        <q-input
          outlined
          dense
          v-model="formData.personalInfo.age"
          label="Age"
          readonly
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
      <div class="col-12 col-sm-4 col-md-4">
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
    </div>
    <div class="row q-col-gutter-xs">
      <div class="col-12 col-sm-4 col-md-4">
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
      <div class="col-12 col-sm-4 col-md-4">
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
      <div class="col-12 col-sm-4 col-md-4 q-mb-md">
        <q-input
          outlined
          dense
          v-model="formData.personalInfo.nationality"
          label="Nationality"
        />
      </div>
    </div>

    <div class="row q-col-gutter-xs">
      <div class="col-12 col-sm-4 col-md-4">
        <q-input
          outlined
          dense
          v-model="formData.personalInfo.empCode"
          label="Employee Code"
        />
        <div class="text-red q-mt-xs q-pl-xs" style="font-size: 9px">
          *For UERMMMC employees only.
        </div>
      </div>
      <div class="col-12 col-sm-4 col-md-4">
        <q-input
          outlined
          dense
          v-model="formData.govtIds.philhealth"
          label="PhilHealth No."
        />
      </div>
      <div class="col-12 col-sm-4 col-md-4">
        <q-input outlined dense v-model="formData.govtIds.govId" label="Government ID" />
      </div>
      <div class="col-12 col-sm-4 col-md-4">
        <q-input
          outlined
          dense
          v-model="formData.govtIds.seniorId"
          label="Senior Citizen ID No."
        />
      </div>
      <div class="col-12 col-sm-4 col-md-4">
        <q-input
          outlined
          dense
          v-model="formData.govtIds.pwdId"
          label="PWD ID No."
          @update:model-value="
            (val) => {
              if (!val) formData.govtIds.pwdIdExp = null;
            }
          "
        />
      </div>

      <div class="col-12 col-sm-4 col-md-4">
        <q-input
          outlined
          dense
          type="date"
          v-model="formData.govtIds.pwdIdExp"
          label="PWD No. Expiry"
          :disable="!formData.govtIds.pwdId"
          :rules="
            formData.govtIds.pwdId ? [(val) => !!val || 'Expiry date is required'] : []
          "
        />
      </div>
    </div>

    <q-separator class="q-my-md" />

    <div class="row q-col-gutter-sm">
      <div class="text-subtitle2">Contact Information:</div>
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
      <div class="col-12 col-sm-3 col-md-3">
        <q-select
          v-model="formData.personalInfo.selectedRegion"
          :options="formData.addressOptions.regions"
          option-label="NAME"
          option-value="CODE"
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
          option-label="Name"
          option-value="Code"
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
          option-label="Name"
          option-value="Code"
          label-slot
          :disable="!formData.personalInfo.selectedProvince"
          outlined
          dense
          :loading="formData.addressLoading.cities"
          :rules="[(val) => !!val || 'Required']"
          @update:model-value="loadBarangays"
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
          option-label="Name"
          option-value="Code"
          label-slot
          :disable="!formData.personalInfo.selectedCity"
          outlined
          dense
          :loading="formData.addressLoading.barangays"
          :rules="[(val) => !!val || 'Required']"
        >
          <template v-slot:label> Barangay <span class="text-red">*</span> </template>
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey"
                >No matching barangays found</q-item-section
              >
            </q-item>
          </template>
        </q-select>
      </div>
    </div>

    <div class="row q-col-gutter-xs">
      <div class="col-12 col-sm-4 col-md-4">
        <q-input
          outlined
          dense
          v-model="formData.personalInfo.landline"
          label="Landline No."
        >
          <template v-slot:append>
            <q-icon name="phone" />
          </template>
        </q-input>
      </div>
      <div class="col-12 col-sm-4 col-md-4">
        <q-input outlined dense v-model="formData.personalInfo.mobile" label="Mobile No.">
          <template v-slot:append>
            <q-icon name="smartphone" />
          </template>
        </q-input>
      </div>
      <div class="col-12 col-sm-4 col-md-4">
        <q-input
          outlined
          dense
          type="email"
          v-model="formData.personalInfo.email"
          label="Email Address"
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

    <q-dialog v-model="showExistingWarningDialog" persistent>
      <q-card style="width: 500px; max-width: 90vw" class="rounded-borders">
        <q-card-section class="bg-yellow-10 text-white q-pa-md">
          <div class="row items-center justify-center text-center">
            <div class="text-subtitle2 text-weight-bold text-uppercase">
              <q-icon name="las la-exclamation-triangle" class="q-mr-xs" size="xs" />
              Existing Patient Found
            </div>
            <q-btn
              unelevated
              flat
              round
              dense
              icon="las la-times"
              class="absolute-right q-mr-md"
              v-close-popup
            />
          </div>
        </q-card-section>

        <q-separator />

        <q-card-section class="q-pa-lg">
          <div class="text-caption text-grey-8 text-center q-mb-lg">
            A patient with the same name and birthdate already exists in the system.
            Please use the <strong>Returning Patient</strong> option instead.
          </div>

          <q-list
            bordered
            separator
            class="rounded-borders q-mb-md"
            v-if="existingRecord"
          >
            <q-item>
              <q-item-section avatar>
                <q-icon name="las la-id-card" color="blue-6" />
              </q-item-section>
              <q-item-section>
                <q-item-label caption>Patient No.</q-item-label>
                <q-item-label class="text-caption1 text-bold">
                  {{ existingRecord.PATIENTNO }}
                </q-item-label>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section avatar>
                <q-icon name="las la-user" color="blue-6" />
              </q-item-section>
              <q-item-section>
                <q-item-label caption>Full Name</q-item-label>
                <q-item-label class="text-caption1 text-bold">
                  {{ existingRecord.LASTNAME }},
                  {{ existingRecord.FIRSTNAME }}
                  {{ existingRecord.MIDDLENAME }}
                  {{ existingRecord.SUFFIX }}
                </q-item-label>
              </q-item-section>
            </q-item>

            <q-item>
              <q-item-section avatar>
                <q-icon name="las la-birthday-cake" color="blue-6" />
              </q-item-section>
              <q-item-section>
                <q-item-label caption>Birthdate</q-item-label>
                <q-item-label class="text-caption1 text-bold">
                  {{ formatDate(existingRecord.DBIRTH) }}
                </q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>

        <q-separator />
        <!-- <q-card-actions align="center" class="bg-grey-1 q-pa-md">
          <q-btn
            unelevated
            label="Returning Patient Form"
            color="red-8"
            icon-right="las la-times"
            v-close-popup
          />
        </q-card-actions> -->
      </q-card>
    </q-dialog>
  </q-form>
</template>

<script>
import { mapWritableState, mapActions } from "pinia";
import { useInpatientStore } from "src/stores/inpatientStore";
import { date } from "quasar";
import axios from "axios";

const PATIENT_API_URL = "http://10.107.0.2:3000/patient-reg/patients";

export default {
  name: "PatientDetailsInpatient",

  props: {
    prefillPatient: {
      type: Object,
      default: () => null,
    },
  },

  data() {
    return {
      showExistingWarningDialog: false,
      existingRecord: null,
      civilStatusOptions: ["Single", "Married", "Widowed", "Separated", "Divorced"],
      religionOptions: ["Catholic", "Christian", "Islam", "Iglesia ni Cristo", "Others"],
    };
  },

  computed: {
    ...mapWritableState(useInpatientStore, ["formData"]),
  },

  watch: {
    "formData.personalInfo.birthdate": function (newVal) {
      this.calculateAge(newVal);
    },
    prefillPatient: {
      immediate: true,
      handler(patient) {
        if (patient && Object.keys(patient).length > 0) {
          this.formData.personalInfo.patientNo = patient.PATIENTNO || "";
          this.formData.personalInfo.lastName = patient.LASTNAME || "";
          this.formData.personalInfo.firstName = patient.FIRSTNAME || "";
          this.formData.personalInfo.middleName = patient.MIDDLENAME || "";
          this.formData.personalInfo.suffix = patient.SUFFIX || "";
          this.formData.personalInfo.streetName = patient.ADDRESS || "";
          this.formData.personalInfo.birthdate = patient.DBIRTH
            ? date.formatDate(patient.DBIRTH, "YYYY/MM/DD")
            : "";
          this.formData.personalInfo.birthplace = patient.BPLACE || "";

          this.formData.personalInfo.gender = patient.SEX || "";
          this.formData.personalInfo.civilStatus = patient.STATUS || "";
          this.formData.personalInfo.religion = patient.RELIGION_DESC || "";
          this.formData.personalInfo.nationality = patient.NATIONALITY_DESC || "";
          this.formData.govtIds.philhealth = patient.UDF_PHILHEALTHNO || "";
          this.formData.govtIds.govId = patient.GOVID || "";
          this.formData.govtIds.seniorId = patient.SCIDNO || "";
          this.formData.govtIds.pwdId = patient.PWD_IDNo || "";
          this.formData.personalInfo.empCode = patient.EmpNo || "";
          this.formData.personalInfo.mobile = patient.MOBILENO || "";
          this.formData.personalInfo.landline = patient.PHONENOS || "";
          this.formData.personalInfo.email = patient.EMAILADD || "";
          this.formData.personalInfo.selectedCity = patient.MUNICIPALITY_DESC || null;
          this.formData.personalInfo.selectedBarangay = patient.BARANGAY_DESC || null;
        }
      },
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
      "loadBarangays",
      "calculateAge",
    ]),

    formatDate(date) {
      if (!date) return "N/A";
      return new Date(date).toLocaleDateString("en-PH", {
        year: "numeric",
        month: "long",
        day: "numeric",
        timeZone: "Asia/Manila",
      });
    },

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

    // async onNext() {
    //   const valid = await this.$refs.patientDetails.validate();

    //   if (valid) {
    //     console.log("Form is valid", this.formData.personalInfo);
    //     this.$emit("next");
    //   } else {
    //     console.log("Form has errors");
    //   }
    // },

    async onNext() {
      const isFormValid = await this.$refs.patientDetails.validate();

      if (!isFormValid) {
        this.$q.notify({
          type: "warning",
          message: "Please complete the form.",
          position: "top",
        });
        return;
      }

      if (this.formData.personalInfo.patientNo) {
        this.$emit("next", this.formData);
        return;
      }

      try {
        const res = await axios.post(`${PATIENT_API_URL}/check-records`, {
          firstName: this.formData.personalInfo.firstName,
          lastName: this.formData.personalInfo.lastName,
          birthdate: this.formData.personalInfo.birthdate.replaceAll("/", "-"),
        });

        if (res.status === 200) {
          this.$emit("next", this.formData);
        }
      } catch (error) {
        if (error.response?.status === 409) {
          this.existingRecord = error.response.data.match;
          this.showExistingWarningDialog = true;
        } else {
          this.$q.notify({
            type: "negative",
            message: "Failed to check for duplicates. Please try again.",
            position: "top",
          });
        }
      }
    },
  },
};
</script>
