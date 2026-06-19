import { defineStore } from 'pinia'
import axios from 'axios'
import { Notify, Loading } from 'quasar'
import { date } from 'quasar'

const PATIENT_API_URL = 'http://10.107.0.2:3000/patient-reg/patients'

export const useInpatientStore = defineStore('inpatient', {
  state: () => ({
    patientList: [],
    patientListfromER: [],
    allRooms: [],
    searchQuery: '',
    hasSearched: false,

    selectedPatient: null,

    duplicateList: [],
    showDuplicateDialog: false,
    pendingLinkData: null,
    selectedDuplicate: null,

    regFormdialogVisible: false,
    step: 1,
    submitting: false,

    civilStatusOptions: ['Single', 'Married', 'Widowed', 'Separated', 'Divorced'],
    religionOptions: ['Roman Catholic', 'Christian', 'Islam', 'Others'],
    relationshipOptions: ['Spouse', 'Parent', 'Sibling', 'Child', 'Co-Maker'],
    appOptions: {
      relationships: ['Parent', 'Spouse', 'Sibling', 'Child', 'Guardian', 'Other'],
    },

    formData: {
      personalInfo: {
        empCode: '',
        patientNo: '',

        lastName: '',
        firstName: '',
        middleName: '',
        suffix: '',

        birthdate: '',
        age: '',
        birthplace: '',

        gender: null,
        civilStatus: null,
        religion: null,
        nationality: '',

        streetName: '',
        landline: '',
        mobile: '',
        email: '',

        selectedRegion: null,
        selectedProvince: null,
        selectedCity: null,
        selectedBarangay: null,

        occupation: '',
        employer: '',
        employerAddress: '',
        employerContactNo: '',

        fathersName: '',
        fathersAddress: '',
        fatherContactNumber: '',

        mothersName: '',
        mothersAddress: '',
        motherContactNumber: '',
      },

      govtIds: {
        philhealth: '',
        govId: '',
        seniorId: '',
        pwdId: '',
        pwdIdExp: '',
      },

      contactDetails: {
        spouseName: '',
        spouseAddress: '',
        spouseContact: '',
        spouseOccupation: '',

        contactPersonInpatient: '',
        contactPersonInpatientRelationship: null,
        contactPersonInpatientAddress: '',
        contactPersonInpatientMobile: '',
      },

      consent: {
        signature: null,
      },

      addressOptions: {
        regions: [],
        provinces: [],
        cities: [],
        barangays: [],
      },

      addressLoading: {
        regions: false,
        provinces: false,
        cities: false,
        barangays: false,
      },

      toggles: {
        sameAsFather: false,
      },

      cPatientno: '',
      cFullname: '',
      cBirthdate: '',
      cAge: '',
      cSeniorNo: '',
      cPwdNo: '',
      cPatientType: '',
      cAdmissionDate: '',
      cDateDisc: '',
      CRoom: '',
      CRoomRate: '',
      cChiefComplaint: '',
      cAdmissionDiag: '',
      cAdmissionType: '',
      cServiceType: '',
      cPhic: '',
      cCaseType: '',
      cDoc: '',
      cWatcherID: '',
      cRemarks: '',
      cAllergies: '',
      cAdmittedBy: '',
      cMotherCaseno: '',

      cTypeClass: '',
      cValidity: '',
      cClassifiedBy: '',

      cCompany: '',
      cHMO: '',
      cEmployer: '',
      cCardNo: '',
      cCoverageAmount: '',
      cAppCode: '',
      cEffectivity: '',
      cRoomPlan: '',
      cLoaNo: '',
      cApprovalNo: '',

      cErPatient: false,
      cConfidential: false,
      cIndigent: false,
      cVIP: false,
      cPay: false,
      cCharity: false,
      cPatho: false,
      cOrSched: false,
      cEmpDependent: false,
      cNewborn: false,
      cWalkin: false,
    },
  }),

  actions: {
    openForm() {
      this.step = 1
      this.regFormdialogVisible = true
    },

    resetForm() {
      this.formData = {
        personalInfo: {
          empCode: '',
          patientNo: '',

          lastName: '',
          firstName: '',
          middleName: '',
          suffix: '',

          birthdate: '',
          age: '',
          birthplace: '',

          gender: null,
          civilStatus: null,
          religion: null,
          nationality: '',

          streetName: '',
          landline: '',
          mobile: '',
          email: '',

          selectedRegion: null,
          selectedProvince: null,
          selectedCity: null,
          selectedBarangay: null,

          occupation: '',
          employer: '',
          employerAddress: '',
          employerContactNo: '',

          fathersName: '',
          fathersAddress: '',
          fatherContactNumber: '',

          mothersName: '',
          mothersAddress: '',
          motherContactNumber: '',
        },

        govtIds: {
          philhealth: '',
          govId: '',
          seniorId: '',
          pwdId: '',
          pwdIdExp: '',
        },

        contactDetails: {
          spouseName: '',
          spouseAddress: '',
          spouseContact: '',
          spouseOccupation: '',

          contactPersonInpatient: '',
          contactPersonInpatientRelationship: null,
          contactPersonInpatientAddress: '',
          contactPersonInpatientMobile: '',
        },

        consent: {
          signature: null,
        },

        addressOptions: {
          regions: [],
          provinces: [],
          cities: [],
          barangays: [],
        },

        addressLoading: {
          regions: false,
          provinces: false,
          cities: false,
          barangays: false,
        },

        toggles: {
          sameAsFather: false,
        },
      }
    },

    async registerPatient() {
      if (this.submitting) return

      this.submitting = true
      Loading.show({ message: 'Submitting Registration...' })

      const finalData = {
        ...this.formData.personalInfo,
        ...this.formData.contactDetails,
        ...this.formData.govtIds,
        ...this.formData.consent,

        signature: this.formData.consent?.signature,

        patientType: 'INPATIENT',
      }

      try {
        await axios.post(`${PATIENT_API_URL}/register`, finalData)

        this.resetForm()

        this.formData.patientSignature = null

        Notify.create({
          type: 'positive',
          message: 'Registration Successful!',
          position: 'top',
          timeout: 500,
        })

        this.regFormdialogVisible = false

        return true
      } catch (error) {
        console.error(error)
        const errorMsg = error.response?.data?.message || 'Server Error: Could not save.'

        Notify.create({
          type: 'negative',
          message: errorMsg,
          position: 'top',
        })
        return false
      } finally {
        this.submitting = false
        Loading.hide()
      }
    },

    calculateAge(birthDateString) {
      if (!birthDateString) {
        this.formData.personalInfo.age = ''
        return
      }
      const timeStamp = Date.now()
      const formattedString = birthDateString.replace(/-/g, '/')
      const birthDate = date.extractDate(formattedString, 'YYYY/MM/DD')
      const age = date.getDateDiff(timeStamp, birthDate, 'years')
      this.formData.personalInfo.age = age
    },

    async loadRegions() {
      if (this.formData.addressOptions.regions.length > 0) return
      this.formData.addressLoading.regions = true
      try {
        const res = await fetch('http://10.107.0.2:3000/patient-reg/patients/region')
        if (!res.ok) {
          throw new Error(`Server error: ${res.status}`)
        }
        const data = await res.json()
        this.formData.addressOptions.regions = data
      } catch (e) {
        console.error('Failed to load regions from backend:', e)
      } finally {
        this.formData.addressLoading.regions = false
      }
    },

    async loadProvinces() {
      this.formData.personalInfo.selectedProvince = null
      this.formData.personalInfo.selectedCity = null
      this.formData.personalInfo.selectedBarangay = null
      this.formData.addressOptions.provinces = []
      this.formData.addressOptions.cities = []
      this.formData.addressOptions.barangays = []

      const region = this.formData.personalInfo.selectedRegion
      const regionCode = region?.CODE || region?.code
      if (!regionCode) return

      const regionPrefix = regionCode.substring(0, 2)

      this.formData.addressLoading.provinces = true
      try {
        const res = await fetch(
          `http://10.107.0.2:3000/patient-reg/patients/provinces?regionPrefix=${regionPrefix}`,
        )
        if (!res.ok) throw new Error(`Server error: ${res.status}`)

        const data = await res.json()
        this.formData.addressOptions.provinces = data

        if (this.formData.addressOptions.provinces.length === 0 && regionPrefix === '13') {
          await this.loadCitiesForRegion(regionCode)
        }
      } catch (e) {
        console.error('Failed to load provinces:', e)
      } finally {
        this.formData.addressLoading.provinces = false
      }
    },

    async loadCities() {
      const province = this.formData.personalInfo.selectedProvince;
      const provinceCode = province?.Code || province?.code || province?.PROVCODE || province?.CODE;

      if (!provinceCode || provinceCode === "130000000" || provinceCode === "NCR") return;

      this.formData.personalInfo.selectedCity = null;
      this.formData.personalInfo.selectedBarangay = null;
      this.formData.addressOptions.cities = [];
      this.formData.addressOptions.barangays = [];

      const cityPrefix = provinceCode.substring(0, 4);

      this.formData.addressLoading.cities = true;
      try {
        const res = await fetch(
          `http://10.107.0.2:3000/patient-reg/patients/cities?cityPrefix=${cityPrefix}&provinceCode=${provinceCode}`
        );
        if (!res.ok) throw new Error(`Server error: ${res.status}`);

        const data = await res.json();
        this.formData.addressOptions.cities = data
          .map((c) => ({
            Code: c.Code || c.CODE || c.code,
            Name: c.Name || c.NAME || c.name || "",
            PSGCCode: c.Code || c.CODE || c.code,
          }))
          .sort((a, b) => a.Name.localeCompare(b.Name));

      } catch (e) {
        console.error("Failed to load cities:", e);
      } finally {
        this.formData.addressLoading.cities = false;
      }
    },

    async loadBarangays() {
      const city = this.formData.personalInfo.selectedCity;
      const cityName = city?.Name || city?.NAME || city?.name;
      const region = this.formData.personalInfo.selectedRegion;

      const rawRegionCode = typeof region === "string"
        ? region
        : region?.CODE || region?.Code || region?.code;

      const regionCode = rawRegionCode
        ? rawRegionCode.padEnd(9, "0")
        : null;

      if (!cityName) return;

      this.formData.personalInfo.selectedBarangay = null;
      this.formData.addressOptions.barangays = [];
      this.formData.addressLoading.barangays = true;

      try {
        const normalize = (str) =>
          str
            .toUpperCase()
            .replace(/^CITY OF\s+/i, "")
            .replace(/\s+/g, " ")
            .trim();

        const allCitiesRes = await fetch(
          `https://psgc.gitlab.io/api/cities-municipalities/`
        );

        if (!allCitiesRes.ok) throw new Error(`PSGC error: ${allCitiesRes.status}`);

        const allCities = await allCitiesRes.json();
        const normalizedCityName = normalize(cityName);

        const regionFiltered = regionCode
          ? allCities.filter((c) => c.regionCode === regionCode)
          : allCities;

        let match = regionFiltered.find(
          (c) => normalize(c.name) === normalizedCityName
        );

        if (!match) {
          const stripped = normalizedCityName.replace(/\s+CITY$/i, "").trim();
          match = regionFiltered.find(
            (c) => normalize(c.name).replace(/\s+CITY$/i, "").trim() === stripped
          );
        }

        if (!match) {
          match = allCities.find(
            (c) => normalize(c.name) === normalizedCityName
          );
        }

        if (!match) {
          console.warn("No PSGC match found for city:", cityName);
          this.formData.addressOptions.barangays = [];
          return;
        }

        const barangayRes = await fetch(
          `https://psgc.gitlab.io/api/cities-municipalities/${match.code}/barangays/`
        );

        if (!barangayRes.ok) throw new Error(`PSGC barangay error: ${barangayRes.status}`);

        const data = await barangayRes.json();
        this.formData.addressOptions.barangays = data
          .map((b) => ({
            Code: b.code,
            Name: b.name,
          }))
          .sort((a, b) => a.Name.localeCompare(b.Name));

      } catch (e) {
        console.error("Barangay load error:", e);
        this.formData.addressOptions.barangays = [];
      } finally {
        this.formData.addressLoading.barangays = false;
      }
    },

    async fetchInitialData() {
      this.loading = true
      try {
        const response = await axios.get(`${PATIENT_API_URL}/inpatient`)
        this.patientList = response.data
        this.hasSearched = false
      } catch (error) {
        console.error(error)
        Notify.create({
          type: 'negative',
          message: 'Failed to load Inpatients List',
          position: 'top',
        })
      } finally {
        this.loading = false
      }
    },

    //fetch from er
    async fetchFromErList() {
      this.loading = true
      try {
        const response = await axios.get(`${PATIENT_API_URL}/for-admission`)
        this.patientListfromER = response.data
        this.hasSearched = false
      } catch (error) {
        console.error(error)
        Notify.create({
          type: 'negative',
          message: 'Failed to load Inpatients List',
          position: 'top',
        })
      } finally {
        this.loading = false
      }
    },

    async searchErPatients(query) {
      this.loading = true
      this.searchQuery = query

      try {
        const response = await axios.get(`${PATIENT_API_URL}/search-from-er`, {
          params: { query },
        })

        this.patientListfromER = response.data
        this.hasSearched = true

        if (this.patientListfromER.length === 0) {
          Notify.create({
            type: 'info',
            message: 'No records found.',
            icon: 'info',
            position: 'top',
          })
        }
      } catch (error) {
        console.error(error)
        Notify.create({
          type: 'negative',
          message: 'Search Failed',
          position: 'top',
        })
      } finally {
        this.loading = false
      }
    },

    async searchPatients(query) {
      if (!query || query.length < 2) return

      this.loading = true
      this.searchQuery = query

      try {
        const response = await axios.get(`${PATIENT_API_URL}/search-inpatient`, {
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
        Notify.create({
          type: 'negative',
          message: 'Search Failed',
          position: 'top',
        })
      } finally {
        this.loading = false
      }
    },

    async sendDataInformation(patient, isForce = false) {
      this.loading = true
      try {
          await axios.post(`${PATIENT_API_URL}/send-data`, {
          PATIENTREGID: patient.PATIENTREGID || patient.patientId,
          force: isForce,
        })
        Notify.create({ type: 'positive', message: 'Data sent successfully.', position: 'top' })
        this.viewPatientValidationDialog = false
        await this.fetchInitialData()
        return true
      } catch (error) {
        if (error.response?.status === 409 && !isForce) {
          this.handleLinkingConflict(error.response.data, patient.PATIENTREGID || patient.patientId)
        } else if (error.response?.status === 404) {
          Notify.create({
            type: 'negative',
            message: 'Patient not found in Registration records.',
            position: 'top',
          })
        } else if (error.response?.status === 400) {
          Notify.create({ type: 'negative', message: 'Patient ID is required.', position: 'top' })
        } else {
          Notify.create({ type: 'negative', message: 'Failed to send data.', position: 'top' })
        }
        return false
      } finally {
        this.loading = false
      }
    },

    async handleLinkingConflict(data, originalPatientId) {
      this.pendingLinkData = { originalId: originalPatientId }
      this.duplicateList = Array.isArray(data) ? data : [data]
      this.selectedDuplicate = null
      this.showDuplicateDialog = true
    },

    async linkExistingPatient(patientId, existingPatientNo) {
      this.loading = true;
      try {
        const res = await axios.post(`${PATIENT_API_URL}/link`, {
          PATIENTREGID: patientId,
          patientno: existingPatientNo,
        });
        await this.fetchInitialData();
        return res.data;
      } finally {
        this.loading = false;
      }
    },

    async ignoreDuplicate() {
      if (!this.pendingLinkData) return

      this.showDuplicateDialog = false
      await this.sendDataInformation({ PATIENTREGID: this.pendingLinkData.originalId }, true)
    },

    async sendToCredit(patientId) {
      if (!patientId) return

      try {
        const payload = { PATIENTREGID: patientId }
        console.log('Sending Payload:', payload)

        await axios.post(`${PATIENT_API_URL}/send-to-credit`, payload)

        Notify.create({
          type: 'positive',
          message: 'Successfully sent to Credit for review.',
          position: 'top',
        })

        await this.fetchInitialData()
        return true
      } catch (error) {
        console.error(error)
        Notify.create({
          type: 'negative',
          message: 'Failed to update status.',
          position: 'top',
        })
        return false
      }
    },

    async fetchFullPatientData(id) {
      this.loading = true
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
        return null
      } finally {
        this.loading = false
      }
    },

    //populate form admitting from er
    setCurrentPatient(patientData) {
      this.currentPatient = patientData

      Object.assign(this.formData, {
        cPatientno: (patientData.PATIENTNO || '').trim().toUpperCase(),
        cFullname: (patientData.fullName || '').trim().toUpperCase(),
        cBirthdate: (patientData.birthdate || '').trim().toUpperCase(),
        cAge: (patientData.AGE || '').trim().toUpperCase(),
        cSeniorNo: (patientData.scid || '').trim().toUpperCase(),
        cPwdNo: (patientData.PWD_IDNo || '').trim().toUpperCase(),
        cPatientType: (patientData.PATIENTTYPE || '').trim().toUpperCase(),
        cAdmissionDate: (patientData.DATEAD || '').trim().toUpperCase(),
        cChiefComplaint: (patientData.CC || '').trim().toUpperCase(),
        cAdmissionDiag: (patientData.diagnosis || '').trim().toUpperCase(),
        cAdmissionType: (patientData.TYPE_OF_ADMISSION || '').trim().toUpperCase(),
        // cServiceType: (patientData.cServiceType || '').trim().toUpperCase(),
        cPhic: (patientData.phicDesc || '').trim().toUpperCase(),
        cCaseType: (patientData.TYPECASE || '').trim().toUpperCase(),
      })
    },

    //for submission admitting from er
    async updatePatientDetails() {
      if (!this.currentPatient?.CASENO || !this.currentPatient?.PATIENTNO) {
        throw new Error('No patient selected for update.')
      }
      this.submitting = true
    },

    async fetchRooms() {
      if (this.allRooms?.length > 0) return

      try {
        const response = await axios.get(`${PATIENT_API_URL}/rooms`)

        if (Array.isArray(response.data)) {
          this.allRooms = response.data.map((room) => ({
            label: (room.label || '').toUpperCase(),
            value: room.value,
            rate: room.rate,
          }))
        } else {
          this.allRooms = []
        }
      } catch (error) {
        console.error('API Error fetching rooms:', error)
        this.allRooms = []
      }
    },
  },
})
