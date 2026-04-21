import { defineStore } from "pinia";
import axios from "axios";
import { Notify, Loading } from "quasar";
import { useAuthStore } from 'src/stores/authStore';

const API_URL = "http://10.107.0.2:3000/api/er";
const PATIENT_API_URL = "http://10.107.0.2:3000/api/patients";
const DASHBOARD_API_URL = "http://10.107.0.2:3000/api/dashboard";

export const useFinanceStore = defineStore("finance", {
  state: () => ({
    patientList: [],
    patientListApproval: [],
    patientRecord: [],
    loading: false,
    hasSearched: false,
    selectedPatient: {},
    viewDialog: false,

    approvedCount: 0,
    declinedCount: 0,

    patientDetails: null,
    detailsLoading: false,

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
      fnorDeposit: "",
      fnreqDeposit: "",
      fntoDeposit: "",
      fntofollowDeposit: "",
      fnadmRemarks: "",
      fnStatus: "",
      fnEvaluatedBY: "",
      fnApprovedBY: "",
    },
  }),

  actions: {
    async fetchFinanceDashboardData() {
      this.loading = true;
      try {
        const [pieRes, lineRes, listRes] = await Promise.all([
          axios.get(`${DASHBOARD_API_URL}/pie-chart`),
          axios.get(`${DASHBOARD_API_URL}/line-chart`),
          axios.get(`${API_URL}/finance`),
        ]);

        this.pieSeries = pieRes.data.series;
        this.pieLabels = pieRes.data.labels;
        this.lineSeries = lineRes.data.series;
        this.lineCategories = lineRes.data.categories;

        this.patientList = listRes.data;

        this.approvedCount = this.patientList.filter((p) => p.is_approved === true).length;
        this.declinedCount = this.patientList.filter((p) => p.is_approved === false).length;

      } catch (error) {
        console.error('Finance Dashboard Fetch Error:', error);
      } finally {
        this.loading = false;
      }
    },

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

    setCurrentPatient(patientData) {
      this.currentPatient = patientData;

      const authStore = useAuthStore();

      const visitTypePay = patientData.admissionCountPay >= 1 ? 'Returning' : '';
      const visitTypeSer = patientData.admissionCountSer >= 1 ? 'Returning' : '';

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

        fnvisitTypeService: visitTypeSer,
        fnvisitTypePay: visitTypePay,

        fnExpDate: (patientData.expiration && patientData.expiration !== '')
          ? new Date(patientData.expiration).toISOString().split('T')[0]
          : null,

        fnLastAdmDateService: (patientData.lastAdSer && patientData.lastAdSer !== '')
          ? new Date(patientData.lastAdSer).toISOString().split('T')[0]
          : null,

        fnphNumber: patientData.philhealthNo
          ? patientData.philhealthNo.toString().replace(/\D/g, '').replace(/^(\d{2})(\d{9})(\d{1})$/, '$1-$2-$3')
          : '',

        fnnumAdmissionService: patientData.admissionCountSer || 0,

        fnnumAdmissionPay: patientData.admissionCountPay || 0 ,
        fnLastAdmDatePay: (patientData.lastAdPay && patientData.lastAdPay !== '')
          ? new Date(patientData.lastAdPay).toISOString().split('T')[0]
          : null,

        fnEvaluatedBY: authStore.fullName || '',

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

    async fetchPatientsFinanceApproval() {
      this.loading = true;
      try {
        const response = await axios.get(`${API_URL}/financeApproval`);
        this.patientListApproval = response.data;
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

    async fetchPatientRecords(PATIENTNO) {
      this.loading = true;
      try {
      const response = await axios.get(`${API_URL}/${PATIENTNO}/records`);
        this.patientRecord = response.data;
      } catch (error) {
        console.error(error);
        Notify.create({
          type: "negative",
          message: "Failed to load Record List",
          position: "top",
        });
      } finally {
        this.loading = false;
      }
    },

    async fetchPatientDetailsCredit(caseno) {
      this.detailsLoading = true;
      this.patientDetails = null;

      try {
      const response = await axios.get(`${PATIENT_API_URL}/assessment-details/${caseno}`);
        this.patientDetails = response.data;
      } catch (error) {
        console.error("Error fetching patient details:", error);
      } finally {
        this.detailsLoading = false;
      }
    },

    viewPatient(row) {
      this.selectedPatient = row;
      this.viewDialog = true;
    },

  async searchPatientList(query) {
      this.loading = true;
      this.hasSearched = true;

      this.patientList = [];

      try {
          const response = await axios.get(`${PATIENT_API_URL}/search-finance`, {
            params: { query },
          });

          this.patientList = response.data;
      } catch (error) {
          console.error("Search failed:", error);
      } finally {
          this.loading = false;
      }
    },

  async searchPatientListApproval(query) {
      this.loading = true;
      this.hasSearched = true;

      this.patientListApproval = [];

      try {
          const response = await axios.get(`${PATIENT_API_URL}/search-finance-approval`, {
            params: { query },
          });

          this.patientListApproval = response.data;
      } catch (error) {
          console.error("Search failed:", error);
      } finally {
          this.loading = false;
      }
  },

    async updatePatientDetails() {
      if (!this.currentPatient?.CASENO || !this.currentPatient?.PATIENTNO) {
        throw new Error("No patient selected for update.");
      }

      this.submitting = true;
      try {
        const authStore = useAuthStore();

        const payload = {
          caseno: this.currentPatient.CASENO,
          patientno: this.currentPatient.PATIENTNO,
          formData: this.formData,
          reviewedBy: authStore.fullName || '',
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

    async approvePatient(patient) {
    if (!patient || !patient.CASENO) {
      Notify.create({ type: 'negative', message: 'Case Number is missing.' });
      return;
    }

    const authStore = useAuthStore();
    const userName = authStore.fullName || 'Unknown User';

    Loading.show({ message: 'Updating status...' });

    try {
      await axios.put(`${PATIENT_API_URL}/approve`, {
        CASENO: patient.CASENO,
        approvedBy: userName
      });

      Notify.create({
        type: 'positive',
        message: 'Patient admitted successfully!',
        position: 'top',
      });

      await this.fetchPatientsFinanceApproval();
    } catch (error) {
      console.error('Update failed:', error);
      Notify.create({ type: 'negative', message: 'Failed to update status.', position: 'top' });
    } finally {
      Loading.hide();
    }
  },

    async disapprovePatient(patient) {
      if (!patient || !patient.CASENO) {
        Notify.create({ type: 'negative', message: 'Case Number is missing.' });
        return;
      }

      Loading.show({ message: 'Updating status...' });
      try {
        await axios.put(`${PATIENT_API_URL}/disapprove`, { CASENO: patient.CASENO });

        Notify.create({
          type: 'warning',
          message: 'Patient has been declined.',
          position: 'top',
        });

        await this.fetchPatientsFinanceApproval();
      } catch (error) {
        console.error('Update failed:', error);
        Notify.create({ type: 'negative', message: 'Failed to update status.', position: 'top' });
      } finally {
        Loading.hide();
      }
    },
  },
});
