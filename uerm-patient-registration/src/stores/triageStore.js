import { defineStore } from 'pinia'
import axios from 'axios'
import { Notify, Loading, date } from 'quasar'

const DASHBOARD_API_URL = "http://10.107.0.2:3000/api/dashboard";

const API_URL = "http://10.107.0.2:3000/api/er";

const PATIENT_API_URL = "http://10.107.0.2:3000/api/patients";

export const useTriageStore = defineStore('triage', {
  state: () => ({
    inpatientCount: 0,
    outpatientCount: 0,
    erpatientCount: 0,
    pieSeries: [],
    pieLabels: [],
    lineSeries: [],
    lineCategories: [],
    TriageAssessmentFormDialog: true,
    triageDialog: false,
    viewPatientValidationDialog: false,
    showAdmissionDialog: false,
    step: 1,
    submitting: false,
    loading: false,
    patientList: [],
    searchQuery: "",
    hasSearched: false,
    selectedPatient: {},
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
      infirmary: "",
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
      personnelSignature: null
    },
  }),

  getters: {
    formattedBirthdate: (state) => {
      return state.formData.birthdateTriage
        ? date.formatDate(state.formData.birthdateTriage, "YYYY/MM/DD")
        : ""
    }
  },

  actions: {
async fetchDashboardData() {
    this.loading = true;
    try {
      const [pieRes, lineRes, statsRes] = await Promise.all([
        axios.get(`${DASHBOARD_API_URL}/pie-chart`),
        axios.get(`${DASHBOARD_API_URL}/line-chart`),
        axios.get(`${DASHBOARD_API_URL}/stats`)
      ]);

      this.pieSeries = pieRes.data.series;
      this.pieLabels = pieRes.data.labels;
      this.lineSeries = lineRes.data.series;
      this.lineCategories = lineRes.data.categories;

      this.inpatientCount = statsRes.data.inpatient;
      this.outpatientCount = statsRes.data.outpatient;
      this.erpatientCount = statsRes.data.emergency;

    } catch (error) {
      console.error("Dashboard Fetch Error:", error);
    } finally {
      this.loading = false;
    }
},

    openDialog() {
      this.resetForm();
      this.step = 1;
      this.TriageAssessmentFormDialog = true;
    },

    resetForm() {
      this.formData.patientId = null;
      this.formData.patientSignature = null;
      this.formData.personnelSignature = null;
    },

    async fetchPatients() {
      this.loading = true;
      try {
        const response = await axios.get(`${API_URL}/patients`);
        this.patientList = response.data;
      } catch (error) {
        console.error(error);
        Notify.create({ type: "negative", message: "Failed to load Emergency List", position: "top" });
      } finally {
        this.loading = false;
      }
    },

    async fetchPatientsFinance() {
      this.loading = true;
      try {
        const response = await axios.get(`${API_URL}/review`);
        this.patientList = response.data;
      } catch (error) {
        console.error(error);
        Notify.create({ type: "negative", message: "Failed to load Review List", position: "top" });
      } finally {
        this.loading = false;
      }
    },

    async fetchAdmitPatients() {
        this.loading = true;
        try {
          const response = await axios.get(`${API_URL}/admitted`);
          this.patientList = response.data;
        } catch (error) {
          console.error(error);
          Notify.create({ type: "negative", message: "Failed to load Admitted List", position: "top" });
        } finally {
          this.loading = false;
        }
    },

    async searchPatients(query) {
      if (!query || query.length < 2) {
        Notify.create({ type: "warning", message: "Please enter at least 2 characters", position: "top" });
        return;
      }

      this.loading = true;
      this.searchQuery = query;

      try {
        const response = await axios.get(`${API_URL}/search`, {
          params: { query }
        });

        this.patientList = response.data;
        this.hasSearched = true;

        if (this.patientList.length === 0) {
          Notify.create({ type: "info", message: "No records found.", icon: "info", position: "top" });
        }
      } catch (error) {
        console.error(error);
        Notify.create({ type: "negative", message: "Search Failed", position: "top" });
      } finally {
        this.loading = false;
      }
    },

    async searchPatientList(query) {
    if (!query || query.length < 2) {
      Notify.create({ type: "warning", message: "Please enter at least 22 characters", position: "top" });
      return;
    }

    this.loading = true;
    this.searchQuery = query;

    try {
      const response = await axios.get(`http://10.107.0.2:3000/api/patients/search-finance`, {
        params: { query }
      });

      this.patientList = response.data;
      this.hasSearched = true;

      if (this.patientList.length === 0) {
        Notify.create({ type: "info", message: "No recordsssss found.", icon: "info", position: "top" });
      }
    } catch (error) {
      console.error(error);
      Notify.create({ type: "negative", message: "Search Failed", position: "top" });
    } finally {
      this.loading = false;
    }
  },

    async submitRegistration() {
      if (!this.formData.patientSignature) {
        Notify.create({ type: "warning", message: "Step 2 incomplete: Patient Consent Signature is required.", position: "top" });
        return;
      }
      if (this.submitting) return;

      this.submitting = true;
      Loading.show({ message: "Submitting Registration..." });

      const finalData = {
        ...this.formData,
        patientType: "Emergency",
      };

      try {
        await axios.post(`${API_URL}/triage`, finalData);
        Notify.create({
            type: "positive",
            message: "Registration Successful!",
            position: "top",
            timeout: 4000
        });

        setTimeout(() => {
          this.TriageAssessmentFormDialog = false;
          this.fetchPatients();
        }, 1500);

      } catch (error) {
        console.error(error);
        const errorMsg = error.response?.data?.message || "Server Error: Could not save.";
        Notify.create({ type: "negative", message: errorMsg, position: "top" });
      } finally {
        this.submitting = false;
        Loading.hide();
      }
    },

    updateTriage(row) {
      this.resetForm();

      this.formData.patientId = row.patient_id;
      this.formData.lastNameTriage = row.lastName;
      this.formData.firstNameTriage = row.firstName;
      this.formData.middleNameTriage = row.middleName || "";
      this.formData.suffixTriage = row.suffix || "";
      this.formData.ageTriage = row.age;
      this.formData.genderTriage = row.gender;


      if (row.birthdate) {
        this.formData.birthdateTriage = date.formatDate(row.birthdate, "YYYY/MM/DD");
      }

      this.triageDialog = true;
    },

    async updateTriageRecord(signatureString) {
      if (!this.formData.patientId) {
        Notify.create({ type: "negative", message: "Error: No Patient ID found. Cannot update." });
        return;
      }
      const payload = {
        ...this.formData,
        personnelSignature: signatureString,
        patientId: this.formData.patientId
      };

      this.loading = true;
      try {
        const response = await axios.put(`${API_URL}/triage`, payload);

        if (response.status === 200) {
          Notify.create({ type: "positive", message: "Patient record updated successfully!", position: "top" });
          this.triageDialog = false;
          this.fetchPatients();
        }
      } catch (error) {
        console.error("Update Error:", error);
        const errMsg = error.response?.data?.message || "Failed to update record.";
        Notify.create({ type: "negative", message: errMsg });
      } finally {
        this.loading = false;
      }
    },

    async admitPatient(patient) {
        Loading.show({ message: "Updating status..." });
        try {
          await axios.put(`${API_URL}/admit`, {
            patient_id: patient.patient_id,
          });

          Notify.create({ type: "positive", message: "Patient admitted successfully!", position: "top" });

          await this.fetchPatients();

        } catch (error) {
          console.error("Update failed:", error);
          Notify.create({ type: "negative", message: "Failed to update status.", position: "top" });
        } finally {
          Loading.hide();
        }
    },

    validatePatient(row) {
      this.selectedPatient = row;
      this.viewPatientValidationDialog = true;
    },

    viewPatient(row) {
      this.selectedPatient = row;
      this.viewDialog = true;
    },

    setSelectedPatient(row) {
        this.selectedPatient = row;
    },

    async sendDataInformation(patient, isForce = false) {
      this.loading = true;
      try {
        await axios.post(`${PATIENT_API_URL}/send-data`, {
          patient_id: patient.patient_id,
          force: isForce
        });
        Notify.create({ type: "positive", message: "Data sent successfully." });
        this.fetchPatients();
        return true;
      } catch (error) {
        if (error.response && error.response.status === 409 && !isForce) {
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

    async linkExistingPatient(patientId, existingPatientNo) {
        this.loading = true;
        try {
            await axios.post(`${PATIENT_API_URL}/link`, {
                patient_id: patientId,
                patientno: existingPatientNo,
            });
            Notify.create({ type: "positive", message: "Linked successfully!" });
            this.fetchPatients();
            return true;
        } catch (error) {
            Notify.create({ type: "negative", message: "Failed to link records." });
            throw error;
        } finally {
            this.loading = false;
        }
    },

    async getPatientFullDetails(id) {
        try {
            const response = await axios.get(`${PATIENT_API_URL}/${id}`);
            return { ...response.data, patientId: id };
        } catch (error) {
            console.error("Print Error:", error);
            Notify.create({ type: "negative", message: "Failed to fetch details for printing", position: "top" });
            throw error;
        }
    }
  }
})
