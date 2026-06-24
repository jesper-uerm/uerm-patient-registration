import { defineStore } from "pinia";
import { api } from 'boot/axios'
import { Notify, Loading } from "quasar";
import { useAuthStore } from 'src/stores/authStore';

const ER_API_URL = "http://10.107.0.2:3000/patient-reg/er";
const PATIENT_API_URL = "http://10.107.0.2:3000/patient-reg/patients";
const DASHBOARD_API_URL = "http://10.107.0.2:3000/patient-reg/dashboard";

export const useFinanceStore = defineStore("finance", {
  state: () => ({
    patientList: [],
    patientListApproval: [],
    patientListRecords: [],
    patientRecord: [],
    loading: false,
    hasSearched: false,
    selectedPatient: {},
    viewDialog: false,

    forApprovalCount: 0,
    approvedCount: 0,
    disapprovedCount: 0,

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
      relationships: ['Parent', 'Spouse', 'Fiance', 'Sibling', 'Child', 'Guardian', ' Cousin', 'Niece', 'Other'],
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
      fnAdmPhysician: "",
      fnAdmPhysicianDept: "",
      fnAttPhysician: "",
      fnAttPhysicianDept: "",
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
        const [pieRes, lineRes, listRes, statsRes] = await Promise.all([
          api.get(`${DASHBOARD_API_URL}/pie-chart`),
          api.get(`${DASHBOARD_API_URL}/line-chart`),
          api.get(`${PATIENT_API_URL}/finance`),
          api.get(`${DASHBOARD_API_URL}/stats`),
        ]);

        this.pieSeries = pieRes.data.series
        this.pieLabels = pieRes.data.labels
        this.lineSeries = lineRes.data.series
        this.lineCategories = lineRes.data.categories

        this.patientList = listRes.data

        this.forApprovalCount = statsRes.data.forApprovalCount
        this.approvedCount = statsRes.data.approvedCount
        this.disapprovedCount = statsRes.data.disapprovedCount

      } catch (error) {
        console.error('Finance Dashboard Fetch Error:', error);
      } finally {
        this.loading = false;
      }
    },

    async fetchDoctors() {
      if (this.allDoctors?.length > 0) return;

      try {
        const response = await api.get(`${PATIENT_API_URL}/doctors`);

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
        const response = await api.get(`${PATIENT_API_URL}/hmo`);

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

    //populate form
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
        fnDiagnosis: (patientData.admdiagnosis || '').toUpperCase(),
        fnHmo: (patientData.hmo || '').toUpperCase(),

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

        fnAdmPhysician: (patientData.ADM_PHYSICIAN || '').trim().toUpperCase(),
        fnAdmPhysicianDept: (patientData.ADM_PHYSICIAN_DEPT || '').trim().toUpperCase(),
        fnAttPhysician: (patientData.ATT_PHYSICIAN || '').trim().toUpperCase(),
        fnAttPhysicianDept: (patientData.ATT_PHYSICIAN_DEPT || '').trim().toUpperCase(),

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
        const response = await api.get(`${PATIENT_API_URL}/finance`);
        this.patientList = response.data;
      } catch (error) {
        console.error(error);
        Notify.create({
          type: "negative",
          message: "Failed to load Finance List",
          position: "top",
        });
      } finally {
        this.loading = false;
      }
    },

    async fetchPatientsFinanceApproval() {
      this.loading = true;
      try {
        const response = await api.get(`${PATIENT_API_URL}/financeApproval`);
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

    //list records
    async fetchPatientsFinanceRecords() {
      this.loading = true;
      try {
        //change financerecords
        const response = await api.get(`${PATIENT_API_URL}/financeRecords`);
        this.patientListRecords = response.data;
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
      const response = await api.get(`${ER_API_URL}/${PATIENTNO}/records`);
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

    async fetchPatientDetailsCredit(patientno) {
    this.detailsLoading = true;
    this.patientDetails = null;

    try {
      const response = await api.get(`${PATIENT_API_URL}/assessment-details/${patientno}`);
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
          const response = await api.get(`${PATIENT_API_URL}/search-finance`, {
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
          const response = await api.get(`${PATIENT_API_URL}/search-finance-approval`, {
            params: { query },
          });

          this.patientListApproval = response.data;
      } catch (error) {
          console.error("Search failed:", error);
      } finally {
          this.loading = false;
      }
  },

    async searchPatientListRecords(query) {
      this.loading = true;
      this.hasSearched = true;

      this.patientListRecords = [];

      try {
          const response = await api.get(`${PATIENT_API_URL}/search-finance-records`, {
            params: { query },
          });

          this.patientListRecords = response.data;
      } catch (error) {
          console.error("Search failed:", error);
      } finally {
          this.loading = false;
      }
  },

  async updatePatientDetails() {
    if (!this.currentPatient?.PATIENTNO) {
      throw new Error("No patient selected for update.");
    }

    this.submitting = true;
    try {
      const authStore = useAuthStore();
      const payload = {
        patientno: this.currentPatient.PATIENTNO,
        formData: this.formData,
        reviewedBy: authStore.fullName || '',
      };

      await api.put(`${PATIENT_API_URL}/details`, payload);
      await this.fetchPatientsFinance();
      return { success: true };
    } catch (error) {
      console.error("API Error updating details:", error);
      return { success: false, error };
    } finally {
      this.submitting = false;
    }
  },

  async approvePatient(patient) {
    if (!patient || !patient.PATIENTNO) {
      Notify.create({ type: 'negative', message: 'Patient Number is missing.' });
      return;
    }

    const authStore = useAuthStore();
    const userName = authStore.fullName || 'Unknown User';

    Loading.show({ message: 'Updating status...' });

    try {
      await api.put(`${PATIENT_API_URL}/approve`, {
        PATIENTNO: patient.PATIENTNO,
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
    if (!patient || !patient.PATIENTNO) {
      Notify.create({ type: 'negative', message: 'Patient Number is missing.' });
      return;
    }

    Loading.show({ message: 'Updating status...' });
    try {
      await api.put(`${PATIENT_API_URL}/disapprove`, { PATIENTNO: patient.PATIENTNO });

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
