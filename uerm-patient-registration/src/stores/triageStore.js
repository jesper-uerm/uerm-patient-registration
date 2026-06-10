import { defineStore } from 'pinia'
import axios from 'axios'
import { Notify, Loading, date } from 'quasar'
import { useAuthStore } from "src/stores/authStore";

const DASHBOARD_API_URL = 'http://10.107.0.2:3000/patient-reg/dashboard'
const API_URL = 'http://10.107.0.2:3000/patient-reg/er'
const PATIENT_API_URL = 'http://10.107.0.2:3000/patient-reg/patients'

export const useTriageStore = defineStore('triage', {
  state: () => ({
    outpatientCount: 0,
    erpatientCount: 0,
    pieSeries: [],
    pieLabels: [],
    lineSeries: [],
    lineCategories: [],

    TriageAssessmentFormDialog: false,
    triageDialog: false,
    caseNumberDialog: false,
    viewPatientValidationDialog: false,
    showAdmissionDialog: false,
    step: 1,
    submitting: false,
    loading: false,

    formData: {
      personalInfoTriageRef: {},
      PatientConsentTriageForm: {},
      admittingPhysician:"",
      admittingDepartment:"",
      attendingPhysician:"",
      attendingDepartment:"",
      patientSignature: null,
    },

    patientList: [],
    patientListDashboard:[],
    serviceType: [],
    department:[],
    hmo: [],
    searchQuery: '',
    hasSearched: false,
    selectedPatient: {},
    appOptions: {
      relationships: ['Parent', 'Spouse', 'Sibling', 'Child', 'Guardian', 'Other'],
    },
  }),
  actions: {

    async fetchHmo() {
      if (this.hmo?.length > 0) return

      try {
        const response = await axios.get(`${PATIENT_API_URL}/hmo`)
        if (Array.isArray(response.data)) {
          this.hmo = response.data.map((hmo) => ({
            label: (hmo.label || '').toUpperCase(),
            value: hmo.value,
          }))
        } else {
          this.hmo = []
        }
      } catch (error) {
        console.error('API Error fetching HMO:', error)
        this.hmo = []
      }
    },

    async fetchDashboardDataER() {
      this.loading = true
      try {
        const [pieRes, lineRes, statsRes, listRes] = await Promise.all([
          axios.get(`${DASHBOARD_API_URL}/pie-chart`),
          axios.get(`${DASHBOARD_API_URL}/line-chart`),
          axios.get(`${DASHBOARD_API_URL}/stats`),

          axios.get(`${API_URL}/patients`, {
            params: { type: 'Emergency' },
          }),
        ])

        this.pieSeries = pieRes.data.series
        this.pieLabels = pieRes.data.labels
        this.lineSeries = lineRes.data.series
        this.lineCategories = lineRes.data.categories

        this.forAdmissionCount = statsRes.data.forAdmission
        this.outpatientCount = statsRes.data.outpatient
        this.erpatientCount = statsRes.data.emergency

        this.patientListDashboard = listRes.data
      } catch (error) {
        console.error('Dashboard Fetch Error:', error)
      } finally {
        this.loading = false
      }
    },

    async fetchPatients() {
      this.loading = true
      try {
        const response = await axios.get(`${API_URL}/patients`)
        this.patientList = response.data
      } catch (error) {
        console.error(error)
        Notify.create({
          type: 'negative',
          message: 'Failed to load Emergency List',
          position: 'top',
        })
      } finally {
        this.loading = false
      }
    },

    async fetchPatientsFinance() {
      this.loading = true
      try {
        const response = await axios.get(`${API_URL}/review`)
        this.patientList = response.data
      } catch (error) {
        console.error(error)
        Notify.create({ type: 'negative', message: 'Failed to load Review List', position: 'top' })
      } finally {
        this.loading = false
      }
    },

    async fetchAdmitPatients() {
      this.loading = true
      try {
        const response = await axios.get(`${API_URL}/admitted`)
        this.patientList = response.data
      } catch (error) {
        console.error(error)
        Notify.create({
          type: 'negative',
          message: 'Failed to load Admitted List',
          position: 'top',
        })
      } finally {
        this.loading = false
      }
    },

    async fetchServiceType() {
      if (this.serviceType?.length > 0) return;

      try {
        const response = await axios.get(`${PATIENT_API_URL}/service`);

        if (Array.isArray(response.data)) {
        this.serviceType = response.data
          .filter(ser => ser.DESCRIPTION && ser.CODE)
          .map(ser => ({
            label: ser.DESCRIPTION.toUpperCase(),
            value: ser.CODE
          }));
        } else {
          this.serviceType = [];
        }
      } catch (error) {
        console.error('API Error fetching services:', error);
        this.serviceType = [];
      }
    },

    async fetchDepartment() {
      if (this.department?.length > 0) return;

      try {
        const response = await axios.get(`${PATIENT_API_URL}/department`);

        if (Array.isArray(response.data)) {
        this.department = response.data
          .filter(ser => ser.DESCRIPTION && ser.CODE)
          .map(ser => ({
            label: ser.DESCRIPTION.toUpperCase(),
            value: ser.CODE
          }));
        } else {
          this.department = [];
        }
      } catch (error) {
        console.error('API Error fetching department:', error);
        this.department = [];
      }
    },

    async searchPatients(query) {
      this.loading = true
      this.searchQuery = query

      try {
        const response = await axios.get(`${API_URL}/search`, { params: { query } })
        this.patientList = response.data
        this.hasSearched = true

        if (this.patientList.length === 0) {
          Notify.create({
            type: 'info',
            message: 'No records found.',
            icon: 'info',
            position: 'top',
          })
        }
      } catch (error) {
        console.error(error)
        Notify.create({ type: 'negative', message: 'Search Failed', position: 'top' })
      } finally {
        this.loading = false
      }
    },

    async searchPatientsAdmitted(query) {
      this.loading = true
      this.searchQuery = query

      try {
        const response = await axios.get(`${API_URL}/search-admitted`, { params: { query } })

        this.patientList = response.data
        this.hasSearched = true

        if (this.patientList.length === 0) {
          Notify.create({
            type: 'info',
            message: 'No records found.',
            icon: 'info',
            position: 'top',
          })
        }
      } catch (error) {
        console.error('Search Action Error:', error)
        Notify.create({ type: 'negative', message: 'Search Failed', position: 'top' })
      } finally {
        this.loading = false
      }
    },

    validatePatient(row) {
      this.selectedPatient = row
      this.viewPatientValidationDialog = true
    },

    viewPatient(row) {
      this.selectedPatient = row
      this.viewDialog = true
    },

    setSelectedPatient(row) {
      this.selectedPatient = row
    },

    resetForm(payload) {
      const target = payload || this.formData

      if (target) {
        target.patientId = null
        target.patientSignature = null
        target.personnelSignature = null
      }
    },

    resetFormTriage() {
      this.formData = {
        patientId: null,
        patientNo: null,
        lastNameTriage: '',
        firstNameTriage: '',
        middleNameTriage: '',
        suffixTriage: '',
        birthdateTriage: '',
        ageTriage: null,
        genderTriage: '',
        weightTriage: null,
        broughtBy: null,
        philHealthCateg: null,
        ptCondition: null,
        chiefComplaintTriage: '',
        tempTriage: '',
        heartRateTriage: '',
        oxygenTriage: '',
        bpTriage: '',
        respiRateTriage: '',
        painScoreTriage: '',
        contagiousTriage: '',
        isolationPrecautionTriage: null,
        cpdTriage: '',
        levelTriage: null,
        checkforPresense: [],
        remarksTriage: '',
        personnelTriage: this.formData.personnelTriage,
        dateTriage: '',
      }

      this.localSignature = null

      if (this.$refs.personalInfoTriage) {
        this.$refs.personalInfoTriage.resetValidation()
      }

      this.hasError = false
    },

    openDialog() {
      this.step = 1
      this.TriageAssessmentFormDialog = true
    },

    updateTriage(payload, row) {
      this.resetForm(payload)

      payload.patientId = row.PATIENTREGID
      payload.patientNo = row.PATIENTNO
      payload.lastNameTriage = row.LASTNAME
      payload.firstNameTriage = row.FIRSTNAME
      payload.middleNameTriage = row.MIDDLENAME || ''
      payload.suffixTriage = row.SUFFIX || ''
      payload.ageTriage = row.AGE
      payload.genderTriage = row.gender

      if (row.BIRTHDATE) {
        payload.birthdateTriage = date.formatDate(row.BIRTHDATE, 'YYYY/MM/DD')
      }

      this.triageDialog = true
    },

    casenumForm(payload, row) {
      const authStore = useAuthStore()

      const midInitial = row.MIDDLENAME ? ` ${row.MIDDLENAME.charAt(0)}.` : ''
      const suffix = row.SUFFIX ? ` ${row.SUFFIX}` : ''
      payload.casefullname = `${row.LASTNAME}, ${row.FIRSTNAME}${midInitial}${suffix}`

      payload.casepatientno = row.PATIENTNO || ''
      payload.caseBirthdate = row.BIRTHDATE || ''
      payload.caseAge = row.AGE || ''
      payload.caseSeniorId = row.SENIORID || ''
      payload.casepwdId = row.PWD || ''

      if (row.dtAdmission) {
        payload.casedtAdmission = date.formatDate(row.dtAdmission, 'YYYY/MM/DD')
      }
      if (row.effectivity) {
        payload.caseEffectivity = date.formatDate(row.effectivity, 'YYYY/MM/DD')
      }

      payload.chiefComplaintTriage = row.CHIEFCOMPLAINT || ''
      payload.caseRemarks = row.REMARKS || ''
      payload.caseAdmittedBy = authStore.fullName || ''
      payload.caseCensusInfirmary = row.INFIRMARY || ''
      payload.caseDepartment = row.DEPARTMENT || ''
      payload.caseHmo = row.HMO || ''

      this.caseNumberDialog = true
    },

    async submitRegistration(payload) {
      if (this.submitting) return

      const sig = payload?.patientSignature
      const isValidSignature = typeof sig === 'string' && sig.startsWith('data:image')

      if (!isValidSignature) {
        Notify.create({
          type: 'warning',
          message: 'Signature required to submit the registration.',
          position: 'top',
        })
        return
      }

      this.submitting = true
      Loading.show({ message: 'Saving Registration...' })

      const finalData = {
        ...payload,
        patientType: 'Emergency',
        streetTriage: payload.streetName || '',
        barangayTriage: payload.selectedBarangay?.name || '',
        cityTriage: payload.selectedCity?.name || '',
        provinceTriage: payload.selectedProvince?.name || '',
        regionTriage: payload.selectedRegion?.name || '',
      }

      try {
        await axios.post(`${API_URL}/triage`, finalData)

        this.formData.patientSignature = null

        Notify.create({
          type: 'positive',
          message: 'Registration Successful!',
          position: 'top',
          timeout: 500,

        })

        this.TriageAssessmentFormDialog = false

      } catch (error) {
        console.error('Submission Error:', error)
        const errorMsg = error.response?.data?.message || 'Server Error: Could not save.'
        Notify.create({ type: 'negative', message: errorMsg, position: 'top' })
      } finally {
        this.submitting = false
        Loading.hide()
      }
    },

    async updateTriageRecord(payload, signatureString) {
      if (!payload.patientId) {
        Notify.create({ type: 'negative', message: 'Error: No Patient ID found. Cannot update.' })
        return
      }

      const requestData = {
        ...payload,
        personnelSignature: signatureString,
        patientId: payload.patientId,
        patientNo: payload.patientNo,
      }

      this.loading = true
      try {
        const response = await axios.put(`${API_URL}/triage`, requestData)
        if (response.status === 200) {
          Notify.create({
            type: 'positive',
            message: 'Patient record updated successfully!',
            position: 'top',
          })

          this.triageDialog = false

          setTimeout(() => {
            this.fetchPatients()
            this.resetFormTriage()
            this.localSignature = null
          }, 300)
        }
      } catch (error) {
        console.error('Update Error:', error)
        const errMsg = error.response?.data?.message || 'Failed to update record.'
        Notify.create({ type: 'negative', message: errMsg })
      } finally {
        this.loading = false
      }
    },

    async admitPatient(formData) {
      Loading.show({ message: 'Updating status...' })
      try {
        await axios.put(`${API_URL}/admit`, formData)
        Notify.create({
          type: 'positive',
          message: 'Patient updated successfully!',
          position: 'top',
        })
        await this.fetchPatients()
      } catch (error) {
        console.error('Update failed:', error)
        Notify.create({ type: 'negative', message: 'Failed to update status.', position: 'top' })
      } finally {
        Loading.hide()
      }
    },

    async sendDataInformation(patient, isForce = false) {
      this.loading = true
      try {
        await axios.post(`${PATIENT_API_URL}/send-data`, {
          PATIENTREGID: patient.PATIENTREGID,
          force: isForce,
        })
        Notify.create({ type: 'positive', position:"top",  message: 'Data sent successfully.' })
        this.fetchPatients()
        return true
      } catch (error) {
        if (error.response && error.response.status === 409 && !isForce) {
          throw error
        } else {
          console.error(error)
          Notify.create({ type: 'negative', message: 'Failed to send data.' })
          return false
        }
      } finally {
        this.loading = false
      }
    },

    async linkExistingPatient(patientId, existingPatientNo) {
      this.loading = true
      try {
        await axios.post(`${PATIENT_API_URL}/link`, {
          PATIENTREGID: patientId,
          patientno: existingPatientNo,
        })
        Notify.create({ type: 'positive', position: "top", message: 'Patient successfully linked.' })
        this.fetchPatients()
        return true
      } catch (error) {
        Notify.create({ type: 'negative', message: 'Failed to link records.' })
        throw error
      } finally {
        this.loading = false
      }
    },

    async getPatientFullDetails(id) {
      try {
        const response = await axios.get(`${PATIENT_API_URL}/${id}`)
        return { ...response.data, patientId: id }
      } catch (error) {
        console.error('Print Error:', error)
        Notify.create({
          type: 'negative',
          message: 'Failed to fetch details for printing',
          position: 'top',
        })
        throw error
      }
    },

    async loadRegions(payload) {
        if (!payload || payload.addressOptions.regions.length > 0) return;

        payload.addressLoading.regions = true;
        try {
          const res = await fetch(`${PATIENT_API_URL}/region`);
          if (!res.ok) throw new Error(`Server error: ${res.status}`);

          const data = await res.json();

          payload.addressOptions.regions = data.sort((a, b) => {
            const nameA = a.NAME || a.name || "";
            const nameB = b.NAME || b.name || "";
            return nameA.localeCompare(nameB);
          });
        } catch (e) {
          console.error("Failed to load regions:", e);
        } finally {
          payload.addressLoading.regions = false;
        }
      },

    async loadProvinces(payload) {
        if (!payload) return;

        payload.selectedProvince = null;
        payload.selectedCity = null;
        payload.selectedBarangay = null;

        payload.addressOptions.provinces = [];
        payload.addressOptions.cities = [];
        payload.addressOptions.barangays = [];

        const region = payload.selectedRegion;
        const regionCode = region?.CODE || region?.code;
        if (!regionCode) return;

        const regionPrefix = regionCode.substring(0, 2);

        payload.addressLoading.provinces = true;
        try {
          const res = await fetch(`${PATIENT_API_URL}/provinces?regionPrefix=${regionPrefix}`);
          if (!res.ok) throw new Error(`Server error: ${res.status}`);

          const data = await res.json();
          payload.addressOptions.provinces = data.sort((a, b) => {
            const nameA = a.Name || a.NAME || a.name || "";
            const nameB = b.Name || b.NAME || b.name || "";
            return nameA.localeCompare(nameB);
          });

          if (payload.addressOptions.provinces.length === 0 && regionPrefix === "13") {
            await this.loadCitiesForRegion(payload, regionCode);
          }
        } catch (e) {
          console.error("Failed to load provinces:", e);
        } finally {
          payload.addressLoading.provinces = false;
        }
      },

    async loadCities(payload) {
        if (!payload) return;

        const province = payload.selectedProvince;
        const provinceCode = province?.Code || province?.code || province?.PROVCODE || province?.CODE;

        if (!provinceCode || provinceCode === "130000000" || provinceCode === "NCR") return;

        payload.selectedCity = null;
        payload.selectedBarangay = null;
        payload.addressOptions.cities = [];
        payload.addressOptions.barangays = [];

        const cityPrefix = provinceCode.substring(0, 4);

        payload.addressLoading.cities = true;
        try {
          const res = await fetch(`${PATIENT_API_URL}/cities?cityPrefix=${cityPrefix}`);
          if (!res.ok) throw new Error(`Server error: ${res.status}`);

          const data = await res.json();
          payload.addressOptions.cities = data.sort((a, b) => {
            const nameA = a.Name || a.NAME || a.name || "";
            const nameB = b.Name || b.NAME || b.name || "";
            return nameA.localeCompare(nameB);
          });
        } catch (e) {
          console.error("Failed to load cities:", e);
        } finally {
          payload.addressLoading.cities = false;
        }
      },

      // async loadBarangays(payload) {
      //   if (!payload) return;

      //   const city = payload.selectedCity;
      //   const cityCode = city?.Code || city?.code || city?.CITYMUNCODE || city?.CODE;
      //   if (!cityCode) return;

      //   payload.selectedBarangay = null;
      //   payload.addressOptions.barangays = [];

      //   payload.addressLoading.barangays = true;
      //   try {
      //     const res = await fetch(`http://10.107.0.2:3000/api/patients/barangays?cityCode=${cityCode}`);
      //     if (!res.ok) throw new Error(`Server error: ${res.status}`);

      //     const data = await res.json();
      //     payload.addressOptions.barangays = data.sort((a, b) => {
      //       const nameA = a.Name || a.NAME || a.name || "";
      //       const nameB = b.Name || b.NAME || b.name || "";
      //       return nameA.localeCompare(nameB);
      //     });
      //   } catch (e) {
      //     console.error("Failed to load barangays:", e);
      //   } finally {
      //     payload.addressLoading.barangays = false;
      //   }
      // }
  },
})
