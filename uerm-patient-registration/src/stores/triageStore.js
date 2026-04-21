import { defineStore } from 'pinia'
import axios from 'axios'
import { Notify, Loading, date } from 'quasar'

const DASHBOARD_API_URL = 'http://10.107.0.2:3000/api/dashboard'
const API_URL = 'http://10.107.0.2:3000/api/er'
const PATIENT_API_URL = 'http://10.107.0.2:3000/api/patients'

export const useTriageStore = defineStore('triage', {
  state: () => ({
    outpatientCount: 0,
    erpatientCount: 0,
    pieSeries: [],
    pieLabels: [],
    lineSeries: [],
    lineCategories: [],

    TriageAssessmentFormDialog: true,
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
      patientSignature: null,
    },

    patientList: [],
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

    // async fetchDashboardData() {
    //   this.loading = true
    //   try {
    //     const [pieRes, lineRes, statsRes, listRes] = await Promise.all([
    //       axios.get(`${DASHBOARD_API_URL}/pie-chart`),
    //       axios.get(`${DASHBOARD_API_URL}/line-chart`),
    //       axios.get(`${DASHBOARD_API_URL}/stats`),
    //       axios.get(`${API_URL}/patients`),
    //     ])

    //     this.pieSeries = pieRes.data.series
    //     this.pieLabels = pieRes.data.labels
    //     this.lineSeries = lineRes.data.series
    //     this.lineCategories = lineRes.data.categories

    //     this.forAdmissionCount = statsRes.data.forAdmission
    //     this.outpatientCount = statsRes.data.outpatient
    //     this.erpatientCount = statsRes.data.emergency

    //     this.patientList = listRes.data
    //   } catch (error) {
    //     console.error('Dashboard Fetch Error:', error)
    //   } finally {
    //     this.loading = false
    //   }
    // },

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

        this.patientList = listRes.data
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

    async searchPatients(query) {
      if (!query || query.length < 2) {
        Notify.create({
          type: 'warning',
          message: 'Please enter at least 2 characters',
          position: 'top',
        })
        return
      }
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
      if (!query || query.length < 2) {
        Notify.create({
          type: 'warning',
          message: 'Please enter at least 2 characters',
          position: 'top',
        })
        return
      }

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

    async searchPatientList(query) {
      if (!query || query.length < 2) {
        Notify.create({
          type: 'warning',
          message: 'Please enter at least 2 characters',
          position: 'top',
        })
        return
      }
      this.loading = true
      this.searchQuery = query

      try {
        const response = await axios.get(`http://10.107.0.2:3000/api/patients/search-finance`, {
          params: { query },
        })
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

    openDialog(payload) {
      this.resetForm(payload)
      this.step = 1
      this.TriageAssessmentFormDialog = true
    },

    updateTriage(payload, row) {
      this.resetForm(payload)

      payload.patientId = row.ID
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

        Notify.create({
          type: 'positive',
          message: 'Registration Successful!',
          position: 'top',
          timeout: 2000,
        })

        this.TriageAssessmentFormDialog = false
        await this.fetchPatients()
        this.resetForm()
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

    async submitCaseNumber(payload) {
      if (!payload.patientId) {
        Notify.create({ type: 'negative', message: 'Error: No Patient ID found. Cannot update.' })
        return
      }

      this.loading = true
      try {
        const response = await axios.post(`${API_URL}/case`, payload)
        if (response.status === 200) {
          Notify.create({
            type: 'positive',
            message: 'Patient record updated successfully!',
            position: 'top',
          })
          this.caseNumberDialog = false
          this.fetchAdmitPatients()
        }
      } catch (error) {
        console.error('Update Error:', error)
        const errMsg = error.response?.data?.message || 'Failed to update record.'
        Notify.create({ type: 'negative', message: errMsg })
      } finally {
        this.loading = false
      }
    },

    async admitPatient(patient) {
      Loading.show({ message: 'Updating status...' })
      try {
        await axios.put(`${API_URL}/admit`, { ID: patient.ID })
        Notify.create({
          type: 'positive',
          message: 'Patient sent successfully!',
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
          ID: patient.ID,
          force: isForce,
        })
        Notify.create({ type: 'positive', message: 'Data sent successfully.' })
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
          ID: patientId,
          patientno: existingPatientNo,
        })
        Notify.create({ type: 'positive', message: 'Linked successfully!' })
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
      if (payload.addressOptions.regions.length > 0) return
      payload.addressLoading.regions = true
      try {
        const res = await fetch('https://psgc.gitlab.io/api/regions/')
        const data = await res.json()
        payload.addressOptions.regions = data.sort((a, b) => a.name.localeCompare(b.name))
      } catch (e) {
        console.error('Failed to load regions:', e)
      } finally {
        payload.addressLoading.regions = false
      }
    },

    async loadProvinces(payload) {
      payload.selectedProvince = null
      payload.selectedCity = null
      payload.selectedBarangay = null

      payload.addressOptions.provinces = []
      payload.addressOptions.cities = []
      payload.addressOptions.barangays = []

      const region = payload.selectedRegion
      if (!region) return

      payload.addressLoading.provinces = true
      try {
        const res = await fetch(`https://psgc.gitlab.io/api/regions/${region.code}/provinces/`)
        const data = await res.json()
        payload.addressOptions.provinces = data.sort((a, b) => a.name.localeCompare(b.name))

        if (payload.addressOptions.provinces.length === 0 && region.code === '130000000') {
          await this.loadCitiesForRegion(payload, region.code)
        }
      } catch (e) {
        console.error('Failed to load provinces:', e)
      } finally {
        payload.addressLoading.provinces = false
      }
    },

    async loadCitiesForRegion(payload, regionCode) {
      payload.addressLoading.cities = true
      try {
        const res = await fetch(
          `https://psgc.gitlab.io/api/regions/${regionCode}/cities-municipalities/`,
        )
        const data = await res.json()
        payload.addressOptions.cities = data.sort((a, b) => a.name.localeCompare(b.name))
        payload.selectedProvince = { name: 'NCR', code: 'NCR' }
      } catch (e) {
        console.error('Failed to load cities for region:', e)
      } finally {
        payload.addressLoading.cities = false
      }
    },

    async loadCities(payload) {
      const province = payload.selectedProvince
      if (!province || province.code === 'NCR') return

      payload.selectedCity = null
      payload.selectedBarangay = null
      payload.addressOptions.cities = []
      payload.addressOptions.barangays = []

      payload.addressLoading.cities = true
      try {
        const res = await fetch(
          `https://psgc.gitlab.io/api/provinces/${province.code}/cities-municipalities/`,
        )
        const data = await res.json()
        payload.addressOptions.cities = data.sort((a, b) => a.name.localeCompare(b.name))
      } catch (e) {
        console.error('Failed to load cities:', e)
      } finally {
        payload.addressLoading.cities = false
      }
    },

    async loadBarangays(payload) {
      const city = payload.selectedCity
      if (!city) return

      payload.selectedBarangay = null
      payload.addressOptions.barangays = []

      payload.addressLoading.barangays = true
      try {
        const res = await fetch(
          `https://psgc.gitlab.io/api/cities-municipalities/${city.code}/barangays/`,
        )
        const data = await res.json()
        payload.addressOptions.barangays = data.sort((a, b) => a.name.localeCompare(b.name))
      } catch (e) {
        console.error('Failed to load barangays:', e)
      } finally {
        payload.addressLoading.barangays = false
      }
    },
  },
})
