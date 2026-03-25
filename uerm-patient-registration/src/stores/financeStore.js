import { defineStore } from "pinia";
import axios from "axios";
import { Notify } from "quasar";

const API_URL = "http://10.107.0.2:3000/api/er";
const PATIENT_API_URL = "http://10.107.0.2:3000/api/patients";
const DASHBOARD_API_URL = "http://10.107.0.2:3000/api/dashboard";

export const useFinanceStore = defineStore("finance", {
  state: () => ({
    patientList: [],
    loading: false,
    hasSearched: false,
    selectedPatient: {},
    viewDialog: false,

    pieSeries: [],
    pieLabels: [],
    lineSeries: [],
    lineCategories: [],
    allDoctors: [],
    hmo: [],

    patientTypeOptions: ['First Time', 'Returning', 'OPD'],
    admissionTypeOptions: ['Emergency Admission', 'Index Case', 'Elective / Non-Emergency'],
    mopOptions: ['Cash', 'Debit Card', 'Credit Card', 'Gcash', 'Check', 'Bank Transfer'],
    statusOptions: ['Endorsed to Admitting', 'Disapproved Admission-Transferred Out', 'Refused to be Admitted', 'Assessment Only', 'Unfinished Transaction'],

    appOptions: {
      relationships: ['Parent', 'Spouse', 'Sibling', 'Child', 'Guardian', 'Other'],
    },

    currentPatient: null,
    submitting: false,

    formData: {
      fnDateTime: "",
      fnAge: "",
      fnGender: "",
      fnType: "",
      fnName: "",
      fnAddress: "",
      fnDiagnosis: "",
      fnWork: "",
      fnBusAddress: "",
      fnPersonRes1: "",
      fnPersonRes1Work: "",
      fnPersonRes1Rel: "",
      fnPersonRes1Contact: "",
      fnPersonRes2: "",
      fnPersonRes2Work: "",
      fnPersonRes2Rel: "",
      fnPersonRes2Contact: "",
      fnsssCard: "",
      fnvisitTypeService: "",
      fnadmissionType: "",
      fnendorsedToSocial: "",
      fnnumAdmissionService: "",
      fnExpDate: "",
      fnLastAdmDateService: "",
      fnCoordinateByService: "",
      fnvisitTypePay: "",
      fnCoordinateByPay: "",
      fnLastAdmDatePay: "",
      fnnumAdmissionPay: "",
      fntransFrom: "",
      fnrsofTransfer: "",
      fnAdmissionStatus: "",
      fnremarksTransfer: "",
      fnHmo: "",
      fnHmoInitialStatus: "",
      fnphStatus: "",
      fnphNumber: "",
      fnphRemarks: "",
      fnMop: "",
      fnadmPhysician: "",
      fnDepartment: "",
      fnatnPhysician: "",
      fncontactatnPhysician: "",
      fnrmAdmission: "",
      fnCost: "",
      fnlengthStay: "",
      fnadmProcedure: "",
      frorDeposit: "",
      fnreqDeposit: "",
      fntoDeposit: "",
      fntofollowDeposit: "",
      fnadmRemarks: "",
      fnStatus: "",
      fnEvaluatedBY: "",
      fnApprovedBY: "",
    },
  }),

  getters: {
    inpatientCount: (state) =>
      state.patientList.filter((p) => p.patientType === "Inpatient").length,
    outpatientCount: (state) =>
      state.patientList.filter((p) => p.patientType === "Outpatient").length,
    erpatientCount: (state) =>
      state.patientList.filter(
        (p) => p.patientType === "Emergency" || p.patientType === "ER"
      ).length,
  },

  actions: {
    async fetchDoctors() {
      if (this.allDoctors?.length > 0) return;

      try {
        const response = await axios.get(`${PATIENT_API_URL}/doctors`);

        if (Array.isArray(response.data)) {
          this.allDoctors = response.data.map(doc => ({
            label: (doc.label || '').toUpperCase(),
            value: doc.value,
            department: doc.department || '',
            contactNo: doc.contactNo || ''
          }));
        } else {
          this.allDoctors = [];
        }
      } catch (error) {
        console.error('API Error fetching doctors:', error);
        this.allDoctors = [];
      }
    },

    async fetchHmo() {
      if (this.hmo?.length > 0) return;

      try {
        const response = await axios.get(`${PATIENT_API_URL}/hmo`);

        if (Array.isArray(response.data)) {
          this.hmo = response.data.map(hmo => ({
            label: (hmo.label || '').toUpperCase(),
            value: hmo.value
          }));
        } else {
          this.hmo = [];
        }
      } catch (error) {
        console.error('API Error fetching HMO:', error);
        this.hmo = [];
      }
    },

    // setCurrentPatient(patientData) {
    //   this.currentPatient = patientData;
    //   console.log('Patient Data:', patientData);

    //   const visitType =
    //   patientData.visitType == 1 ? 'Returning' : 'First Time';

    //   const now = new Date();
    //   const localDateTime = new Date(now.getTime() - (now.getTimezoneOffset() * 60000))
    //     .toISOString()
    //     .slice(0, 16);

    //   Object.assign(this.formData, {
    //     fnDateTime: localDateTime,
    //     fnName: (patientData.fullName || '').trim().toUpperCase(),
    //     fnAge: patientData.age || '',
    //     fnGender: patientData.gender || '',
    //     fnAddress: patientData.address || '',
    //     fnsssCard: patientData.class || '',
    //     fnvisitTypeService: visitType,
    //     fnExpDate: patientData.expiration
    //       ? new Date(patientData.expiration).toISOString().split('T')[0]
    //       : null,
    //     fnLastAdmDateService: patientData.DATEAD
    //       ? new Date(patientData.DATEAD).toISOString().split('T')[0]
    //       : null,
    //     fnvisitTypePay: visitType,
    //     fnphNumber: patientData.philhealthNo
    //       ? patientData.philhealthNo.toString().replace(/\D/g, '').replace(/^(\d{2})(\d{9})(\d{1})$/, '$1-$2-$3')
    //       : '',
    //     fnnumAdmissionService: patientData.ssEntryCount || 0,
    //   });
    // },

    setCurrentPatient(patientData) {
      this.currentPatient = patientData;
      console.log('Patient Data Received:', patientData);

      const visitType = patientData.visitType == 1 ? 'Returning' : '';
      const now = new Date();
      const localDateTime = new Date(now.getTime() - (now.getTimezoneOffset() * 60000))
        .toISOString()
        .slice(0, 16);

      Object.assign(this.formData, {
        fnDateTime: localDateTime,
        fnName: (patientData.fullName || '').trim().toUpperCase(),
        fnAge: patientData.age || '',
        fnGender: (patientData.gender || '').toUpperCase(),
        fnAddress: (patientData.address || '').trim(),

        fnsssCard: patientData.ssClass || '',

        fnvisitTypeService: visitType,
        fnvisitTypePay: visitType,

        fnExpDate: (patientData.expiration && patientData.expiration !== '')
          ? new Date(patientData.expiration).toISOString().split('T')[0]
          : null,

        fnLastAdmDateService: (patientData.DATEAD && patientData.DATEAD !== '')
          ? new Date(patientData.DATEAD).toISOString().split('T')[0]
          : null,

        fnphNumber: patientData.philhealthNo
          ? patientData.philhealthNo.toString().replace(/\D/g, '').replace(/^(\d{2})(\d{9})(\d{1})$/, '$1-$2-$3')
          : '',

        fnnumAdmissionService: patientData.ssEntryCount || 0,
      });
    },

    mapGender(sex) {
      if (!sex) return '';
      const s = sex.toUpperCase();
      return (s === 'M' || s === 'MALE') ? 'Male' : 'Female';
    },

    async fetchPatientsFinance() {
      this.loading = true;
      try {
        const response = await axios.get(`${API_URL}/finance`);
        this.patientList = response.data;
      } catch (error) {
        console.error(error);
        Notify.create({
          type: "negative",
          message: "Failed to load Review List",
          position: "top",
        });
      } finally {
        this.loading = false;
      }
    },

    viewPatient(row) {
      this.selectedPatient = row;
      this.viewDialog = true;
    },

    async searchPatientList(query) {
      if (!query || query.length < 2) {
        Notify.create({
          type: "warning",
          message: "Please enter at least 2 characters",
          position: "top",
        });
        return;
      }

      this.loading = true;

      try {
        const response = await axios.get(`${PATIENT_API_URL}/search-finance`, {
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

    async updatePatientDetails() {
      if (!this.currentPatient?.patient_id) {
        throw new Error("No patient selected for update.");
      }

      this.submitting = true;
      try {
        const payload = {
          patientId: this.currentPatient.patient_id,
          formData: this.formData,
        };

        await axios.put(`${PATIENT_API_URL}/details`, payload);
        return { success: true };
      } catch (error) {
        console.error("API Error updating details:", error);
        return { success: false, error };
      } finally {
        this.submitting = false;
      }
    },

    async fetchAllPatients() {
      this.loading = true;
      try {
        const response = await axios.get(`${PATIENT_API_URL}/`);
        this.patientList = response.data;
      } catch (error) {
        console.error(error);
        Notify.create({
          type: "negative",
          message: "Failed to load all patients for dashboard",
          position: "top",
        });
      } finally {
        this.loading = false;
      }
    },

    async fetchPieData() {
      try {
        const response = await axios.get(`${DASHBOARD_API_URL}/pie-chart`);
        this.pieSeries = response.data.series;
        this.pieLabels = response.data.labels;
      } catch (error) {
        console.error("Chart Load Error:", error);
      }
    },

    async fetchTrendData() {
      try {
        const response = await axios.get(`${DASHBOARD_API_URL}/line-chart`);
        this.lineSeries = response.data.series;
        this.lineCategories = response.data.categories;
      } catch (error) {
        console.error("Error loading trends:", error);
      }
    },
  },
});
