import { defineStore } from "pinia";
import axios from "axios";
import { Notify } from "quasar";
import { date } from "quasar";


const PATIENT_API_URL = "http://10.107.0.2:3000/api/patients";

export const useOutpatientStore = defineStore("outpatient", {
  state: () => ({
    patientList: [],
    loading: false,
    searchQuery: "",
    hasSearched: false,

    selectedPatient: null,

    duplicateList: [],
    showDuplicateDialog: false,
    pendingLinkData: null,
    selectedDuplicate: null,

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
    async fetchInitialData() {
      this.loading = true;
      try {
        const response = await axios.get(`${PATIENT_API_URL}/outpatient`);
        this.patientList = response.data;
        this.hasSearched = false;
      } catch (error) {
        console.error(error);
        Notify.create({
          type: "negative",
          message: "Failed to load Outpatients List",
          position: "top",
        });
      } finally {
        this.loading = false;
      }
    },

    async searchPatients(query) {
      if (!query || query.length < 2) return;

      this.loading = true;
      this.searchQuery = query;

      try {
        const response = await axios.get(`${PATIENT_API_URL}/search-outpatient`, {
          params: { query },
        });

        this.patientList = response.data;
        this.hasSearched = true;

        if (this.patientList.length === 0) {
          Notify.create({
            type: "info",
            message: "No records found.",
            icon: "info",
            position: "top",
          });
        }
      } catch (error) {
        console.error(error);
        Notify.create({
          type: "negative",
          message: "Search Failed",
          position: "top",
        });
      } finally {
        this.loading = false;
      }
    },

    async sendDataInformation(patient, isForce = false) {
      this.loading = true;
      try {
        await axios.post(`${PATIENT_API_URL}/send-data`, {
          patient_id: patient.patient_id || patient.patientId,
          force: isForce,
        });

        Notify.create({ type: "positive", message: "Data sent successfully." });
        await this.fetchInitialData();
        return true;
      } catch (error) {
        if (error.response && error.response.status === 409 && !isForce) {
          this.handleLinkingConflict(error.response.data, patient.patient_id);
          throw error;
        } else {
          console.error(error);
          Notify.create({ type: "negative", message: "Failed to send data." });
          return false;
        }
      } finally {
        this.loading = false;
      }
    },

    handleLinkingConflict(data, originalPatientId) {
      this.pendingLinkData = { originalId: originalPatientId };
      this.duplicateList = Array.isArray(data) ? data : [data];
      this.selectedDuplicate = null;
      this.showDuplicateDialog = true;
    },

    async linkExistingPatient() {
      if (!this.selectedDuplicate || !this.pendingLinkData) return;

      this.loading = true;
      try {
        await axios.post(`${PATIENT_API_URL}/link`, {
          patient_id: this.pendingLinkData.originalId,
          patientno: this.selectedDuplicate.existingPatientNo,
        });

        Notify.create({ type: "positive", message: "Linked successfully!" });
        this.showDuplicateDialog = false;
        await this.fetchInitialData();
        return true;
      } catch (error) {
        Notify.create({ type: "negative", message: "Failed to link records." });
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async ignoreDuplicate() {
      if (!this.pendingLinkData) return;

      this.showDuplicateDialog = false;
      await this.sendDataInformation({ patient_id: this.pendingLinkData.originalId }, true);
    },

    async sendToCredit(patientId) {
      if (!patientId) return;
      try {
        await axios.post(`${PATIENT_API_URL}/send-to-credit`, { patient_id: patientId });
        Notify.create({
          type: "positive",
          message: "Successfully sent to Credit for review.",
          position: "top",
        });
        await this.fetchInitialData();
        return true;
      } catch (error) {
        console.error(error);
        Notify.create({ type: "negative", message: "Failed to update status." });
        return false;
      }
    },

    async fetchFullPatientData(id) {
      this.loading = true;
      try {
        const response = await axios.get(`${PATIENT_API_URL}/${id}`);
        return { ...response.data, patientId: id };
      } catch (error) {
        console.error("Fetch Error:", error);
        Notify.create({ type: "negative", message: "Failed to fetch details." });
        return null;
      } finally {
        this.loading = false;
      }
    },

    calculateAge(birthDateString) {
      if (!birthDateString) {
        this.formData.personalInfoOutpatient.ageOutpatient = "";
        return;
      }

      const timeStamp = Date.now();
      const formattedString = birthDateString.replace(/-/g, "/");
      const birthDate = date.extractDate(formattedString, "YYYY/MM/DD");
      const age = date.getDateDiff(timeStamp, birthDate, "years");

      this.formData.personalInfoOutpatient.ageOutpatient = age;
    },

    updatePermanentAddress() {
      if (this.sameAsPresent) {
        const info = this.formData.personalInfoOutpatient;

        const parts = [
          info.streetNameOutpatient,
          info.selectedBarangayOutpatient?.name,
          info.selectedCityOutpatient?.name,
          info.selectedProvinceOutpatient?.name,
          info.selectedRegionOutpatient?.name
        ].filter(Boolean);

        this.formData.personalInfoOutpatient.permanentAddressOutpatient = parts.join(', ');
      }
    },

    setSameAsPresent(value) {
      this.sameAsPresent = value;
      if (value) {
        this.updatePermanentAddress();
      } else {
        this.formData.personalInfoOutpatient.permanentAddressOutpatient = "";
      }
    }
  },
});
