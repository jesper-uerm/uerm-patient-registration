import { defineStore } from 'pinia';
import axios from 'axios';
import { date, Notify } from 'quasar';

export const useReturningPatientStore = defineStore('returningPatient', {
  state: () => ({
    showSearchDialog: false,
    showTriageDialog: false,
    loading: false,
    hasSearched: false,

    searchQuery: '',
    patientList: [],

    triageForm: {
      patientId: null,
      patientNo: null,

      lastNameTriage: "",
      firstNameTriage: "",
      middleNameTriage: "",
      suffixTriage: "",
      birthdateTriage: "",
      ageTriage: "",
      genderTriage: "",

      weightTriage: "",
      broughtBy: "",
      philHealthCateg: "",
      ptCondition: "",

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
      personnelSignature: null,
    },

    signatureError: false,
  }),

  actions: {
    openSearchDialog() {
      this.showSearchDialog = true;
      this.resetSearch();
    },

    resetSearch() {
      this.searchQuery = "";
      this.patientList = [];
      this.hasSearched = false;
    },

    async searchPatients() {
      if (!this.searchQuery || this.searchQuery.length < 2) {
        Notify.create({
          type: "warning",
          position: "top",
          message: "Please enter at least 2 characters",
        });
        return;
      }

      this.loading = true;
      try {
        const response = await axios.get(
          "http://10.107.0.2:3000/api/auth/searchInpatient",
          { params: { query: this.searchQuery } }
        );

        this.patientList = response.data;
        this.hasSearched = true;

        if (this.patientList.length === 0) {
          Notify.create({
            type: "info",
            position: "top",
            message: "No records found.",
            icon: "search_off",
          });
        }
      } catch (error) {
        console.error(error);
        Notify.create({
          type: "negative",
          position: "top",
          message: "Database Connection Failed",
        });
      } finally {
        this.loading = false;
      }
    },

    prepareTriageForm(row) {
      this.showTriageDialog = true;

      this.triageForm.patientId = row.PATIENTNO;
      this.triageForm.lastNameTriage = row.LASTNAME;
      this.triageForm.firstNameTriage = row.FIRSTNAME;
      this.triageForm.middleNameTriage = row.MIDDLENAME || "";
      this.triageForm.suffixTriage = row.SUFFIX || "";
      this.triageForm.ageTriage = row.AGE;
      this.triageForm.genderTriage = row.gender;

      if (row.birthdate) {
        this.triageForm.birthdateTriage = date.formatDate(row.birthdate, "YYYY/MM/DD");
      }

      this.triageForm.weightTriage = "";
      this.triageForm.broughtBy = "";
      this.triageForm.philHealthCateg = "";
      this.triageForm.ptCondition = "";

      this.triageForm.chiefComplaintTriage = "";
      this.triageForm.tempTriage = "";
      this.triageForm.bpTriage = "";
      this.triageForm.heartRateTriage = "";
      this.triageForm.oxygenTriage = "";
      this.triageForm.respiRateTriage = "";
      this.triageForm.painScoreTriage = "";

      this.triageForm.contagiousTriage = "";
      this.triageForm.isolationPrecautionTriage = "";
      this.triageForm.cpdTriage = "";
      this.triageForm.levelTriage = "";

      this.triageForm.remarksTriage = "";
      this.triageForm.checkforPresense = [];
      this.triageForm.personnelSignature = null;

      this.triageForm.dateTriage = date.formatDate(new Date(), "YYYY/MM/DD");

      this.signatureError = false;
    },

    async submitTriageRecord(signatureData) {
      if (!this.triageForm.patientId) {
        Notify.create({
          type: "negative",
          message: "Error: No Patient ID found. Cannot update.",
        });
        return false;
      }

      this.triageForm.personnelSignature = signatureData;
      this.loading = true;

      try {
        const response = await axios.put(
          "http://10.107.0.2:3000/api/auth/updateTriage",
          this.triageForm
        );

        if (response.status === 200) {
          Notify.create({
            type: "positive",
            message: "Patient record updated successfully!",
            position: "top",
          });
          this.showTriageDialog = false;
          return true;
        }
      } catch (error) {
        console.error("Update Error:", error);
        const errMsg = error.response && error.response.data
            ? error.response.data.message
            : "Failed to update record.";

        Notify.create({
          type: "negative",
          message: errMsg,
        });
        return false;
      } finally {
        this.loading = false;
      }
    },

    async fetchPatientForPrint(patientId) {
      this.loading = true;
      try {
        const checkResponse = await axios.get(
          `http://10.107.0.2:3000/api/auth/checkPatientExists/${patientId}`
        );

        const { exists, source } = checkResponse.data;

        if (!exists) {
          Notify.create({
            type: "warning",
            message: "Patient not found in Registration or Info tables.",
            position: "top",
          });
          return null;
        }

        const dataResponse = await axios.get(
          `http://10.107.0.2:3000/api/auth/getPatient/${patientId}`
        );

        return { data: dataResponse.data, source };

      } catch (error) {
        console.error("Print Fetch Error:", error);
        Notify.create({
          type: "negative",
          message: "An error occurred while fetching patient data.",
          position: "top",
        });
        return null;
      } finally {
        this.loading = false;
      }
    },

    async fetchFullPatientData(patientId) {
      this.loading = true;
      try {
        const response = await axios.get(
          `http://10.107.0.2:3000/api/auth/getPatient/${patientId}`
        );
        return { ...response.data, patientId: patientId };
      } catch (error) {
        console.error("Print Error:", error);
        Notify.create({
            type: "negative",
            message: "Failed to fetch full details for printing",
            position: "top",
        });
        return null;
      } finally {
        this.loading = false;
      }
    }
  }
});
