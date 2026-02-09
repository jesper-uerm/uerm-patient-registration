import { defineStore } from 'pinia';
import { date } from "quasar";

export const useOutpatientStore = defineStore('outpatient', {
  state: () => ({
    step: 1,
    submitting: false,
    sameAsPresent: false,
    civilStatusOptions: ["Single", "Married", "Widowed", "Separated", "Divorced"],
    religionOptions: ["Roman Catholic", "Christian", "Islam", "Others"],
    formData: {
      personalInfoOutpatient: {
        lastNameOutpatient: "",
        firstNameOutpatient: "",
        middleNameOutpatient: "",
        suffixOutpatient: "",
        birthdateOutpatient: "",
        ageOutpatient: "",
        birthplaceOutpatient: "",
        genderOutpatient: null,
        civilStatusOutpatient: null,
        religionOutpatient: null,
        nationalityOutpatient: "",
        occupationOutpatient: "",
        hmoOutpatient: "",
        scidnoOutpatient: "",
        landlineOutpatient: "",
        mobileOutpatient: "",
        outpatientPhilHealth: [],
        selectedRegionOutpatient: null,
        selectedProvinceOutpatient: null,
        selectedCityOutpatient: null,
        selectedBarangayOutpatient: null,
        streetNameOutpatient: "",
        permanentAddressOutpatient: "",
      },
      contactPersonOutpatient: {
      contactPersonOutpatient: "",
      contactPersonLandlineOutpatient: "",
      contactPersonNumberOutpatient: "",
      contactPersonRelationship: null,
      outpatientProcedure: "",
      outpatientPhysician: "",
      signature: null,
      },
    }
  }),

  actions: {
    calculateAge(birthDateString) {
      if (!birthDateString) {
        this.formData.personalInfoOutpatient.ageOutpatient = "";
        return;
      }
      const timeStamp = Date.now();
      const birthDate = new Date(birthDateString);
      const age = date.getDateDiff(timeStamp, birthDate, "years");
      this.formData.personalInfoOutpatient.ageOutpatient = age;
    },

    updatePermanentAddress() {
      if (!this.sameAsPresent) return;

      const info = this.formData.personalInfoOutpatient;
      const parts = [
        info.streetNameOutpatient,
        info.selectedBarangayOutpatient?.name,
        info.selectedCityOutpatient?.name,
        info.selectedProvinceOutpatient?.name,
        info.selectedRegionOutpatient?.name,
      ];
      info.permanentAddressOutpatient = parts.filter(Boolean).join(", ");
    },

    setSameAsPresent(val) {
      this.sameAsPresent = val;
      if (val) {
        this.updatePermanentAddress();
      } else {
        this.formData.personalInfoOutpatient.permanentAddressOutpatient = "";
      }
    }
  }
});
