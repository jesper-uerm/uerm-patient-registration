import { defineStore } from "pinia";
import axios from "axios";
import { Notify, Loading } from 'quasar';
import { date } from "quasar";


const PATIENT_API_URL = "http://10.107.0.2:3000/api/patients";

export const useInpatientStore = defineStore("inpatient", {
  state: () => ({
    patientList: [],
    patientListfromER: [],
    allRooms: [],
    searchQuery: "",
    hasSearched: false,

    selectedPatient: null,

    duplicateList: [],
    showDuplicateDialog: false,
    pendingLinkData: null,
    selectedDuplicate: null,

    regFormdialogVisible: false,
    step: 1,
    submitting: false,

    civilStatusOptions: ["Single", "Married", "Widowed", "Separated", "Divorced"],
    religionOptions: ["Roman Catholic", "Christian", "Islam", "Others"],
    relationshipOptions: ["Spouse", "Parent", "Sibling", "Child", "Co-Maker"],
    appOptions: {
      relationships: ['Parent', 'Spouse', 'Sibling', 'Child', 'Guardian', 'Other'],
    },

    formData: {
      personalInfo: {
      empCode: "",
      patientNo: "",

      lastName: "",
      firstName: "",
      middleName: "",
      suffix: "",

      birthdate: "",
      age: "",
      birthplace: "",

      gender: null,
      civilStatus: null,
      religion: null,
      nationality: "",

      streetName: "",
      landline: "",
      mobile: "",
      email: "",

      selectedRegion: null,
      selectedProvince: null,
      selectedCity: null,
      selectedBarangay: null,

      occupation: "",
      employer: "",
      employerAddress: "",
      employerContactNo: "",

      fathersName: "",
      fathersAddress: "",
      fatherContactNumber: "",

      mothersName: "",
      mothersAddress: "",
      motherContactNumber: "",
    },

    govtIds: {
      philhealth: "",
      govId: "",
      seniorId: "",
      pwdId: "",
      pwdIdExp: "",
    },

    contactDetails: {
      spouseName: "",
      spouseAddress: "",
      spouseContact: "",
      spouseOccupation: "",

      contactPersonInpatient: "",
      contactPersonInpatientRelationship: null,
      contactPersonInpatientAddress: "",
      contactPersonInpatientMobile: "",
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

    cPatientno: "",
    cFullname: "",
    cBirthdate: "",
    cAge: "",
    cSeniorNo: "",
    cPwdNo: "",
    cPatientType: "",
    cAdmissionDate: "",
    cDateDisc: "",
    CRoom: "",
    CRoomRate: "",
    cChiefComplaint: "",
    cAdmissionDiag: "",
    cAdmissionType: "",
    cServiceType: "",
    cPhic: "",
    cCaseType: "",
    cDoc: "",
    cWatcherID: "",
    cRemarks: "",
    cAllergies: "",
    cAdmittedBy: "",
    cMotherCaseno: "",

    cTypeClass: "",
    cValidity: "",
    cClassifiedBy: "",

    cCompany: "",
    cHMO: "",
    cEmployer: "",
    cCardNo: "",
    cCoverageAmount: "",
    cAppCode: "",
    cEffectivity: "",
    cRoomPlan: "",
    cLoaNo: "",
    cApprovalNo: "",

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
    this.step = 1;
      this.regFormdialogVisible = true;
  },

  resetForm() {
    this.formData = {
      personalInfo: {
        empCode: "",
        patientNo: "",

        lastName: "",
        firstName: "",
        middleName: "",
        suffix: "",

        birthdate: "",
        age: "",
        birthplace: "",

        gender: null,
        civilStatus: null,
        religion: null,
        nationality: "",

        streetName: "",
        landline: "",
        mobile: "",
        email: "",

        selectedRegion: null,
        selectedProvince: null,
        selectedCity: null,
        selectedBarangay: null,

        occupation: "",
        employer: "",
        employerAddress: "",
        employerContactNo: "",

        fathersName: "",
        fathersAddress: "",
        fatherContactNumber: "",

        mothersName: "",
        mothersAddress: "",
        motherContactNumber: "",
      },

      govtIds: {
        philhealth: "",
        govId: "",
        seniorId: "",
        pwdId: "",
        pwdIdExp: "",
      },

      contactDetails: {
        spouseName: "",
        spouseAddress: "",
        spouseContact: "",
        spouseOccupation: "",

        contactPersonInpatient: "",
        contactPersonInpatientRelationship: null,
        contactPersonInpatientAddress: "",
        contactPersonInpatientMobile: "",
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
    };
  },

  async registerPatient() {
  if (this.submitting) return;

  this.submitting = true;
  Loading.show({ message: "Submitting Registration..." });

const finalData = {
  ...this.formData.personalInfo,
  ...this.formData.contactDetails,
  ...this.formData.govtIds,
  ...this.formData.consent,

  signature: this.formData.consent?.signature,

  patientType: "INPATIENT",
};

  try {
    await axios.post(`${PATIENT_API_URL}/register`, finalData);

        this.resetForm()

        this.formData.patientSignature = null

        Notify.create({
          type: "positive",
          message: "Registration Successful!",
          position: "top",
          timeout: 500,
        });

        this.regFormdialogVisible = false;

        return true;
      } catch (error) {
        console.error(error);
        const errorMsg = error.response?.data?.message || "Server Error: Could not save.";

        Notify.create({
          type: "negative",
          message: errorMsg,
          position: "top",
        });
        return false;
      } finally {
        this.submitting = false;
        Loading.hide();
      }
  },

  calculateAge(birthDateString) {
    if (!birthDateString) {
      this.formData.personalInfo.age = "";
      return;
    }
    const timeStamp = Date.now();
    const formattedString = birthDateString.replace(/-/g, "/");
    const birthDate = date.extractDate(formattedString, "YYYY/MM/DD");
    const age = date.getDateDiff(timeStamp, birthDate, "years");
    this.formData.personalInfo.age = age;
  },

  async loadRegions() {
    if (this.formData.addressOptions.regions.length > 0) return;
    this.formData.addressLoading.regions = true;
    try {
      const res = await fetch("http://10.107.0.2:3000/api/patients/region");
      if (!res.ok) {
        throw new Error(`Server error: ${res.status}`);
      }
      const data = await res.json();
      this.formData.addressOptions.regions = data;

    } catch (e) {
      console.error("Failed to load regions from backend:", e);
    } finally {
      this.formData.addressLoading.regions = false;
    }
  },

  async loadProvinces() {
    this.formData.personalInfo.selectedProvince = null;
    this.formData.personalInfo.selectedCity = null;
    this.formData.personalInfo.selectedBarangay = null;
    this.formData.addressOptions.provinces = [];
    this.formData.addressOptions.cities = [];
    this.formData.addressOptions.barangays = [];

    const region = this.formData.personalInfo.selectedRegion;
    const regionCode = region?.CODE || region?.code;
    if (!regionCode) return;

    const regionPrefix = regionCode.substring(0, 2);

    this.formData.addressLoading.provinces = true;
    try {
      const res = await fetch(`http://10.107.0.2:3000/api/patients/provinces?regionPrefix=${regionPrefix}`);
      if (!res.ok) throw new Error(`Server error: ${res.status}`);

      const data = await res.json();
      this.formData.addressOptions.provinces = data;

      if (this.formData.addressOptions.provinces.length === 0 && regionPrefix === "13") {
        await this.loadCitiesForRegion(regionCode);
      }
    } catch (e) {
      console.error("Failed to load provinces:", e);
    } finally {
      this.formData.addressLoading.provinces = false;
    }
  },

  async loadCities() {
    const province = this.formData.personalInfo.selectedProvince;
    const provinceCode = province?.Code || province?.code;

    if (!provinceCode || provinceCode === "130000000" || provinceCode === "NCR") return;

    this.formData.personalInfo.selectedCity = null;
    this.formData.personalInfo.selectedBarangay = null;
    this.formData.addressOptions.cities = [];
    this.formData.addressOptions.barangays = [];

    const cityPrefix = provinceCode.substring(0, 4);

    this.formData.addressLoading.cities = true;
    try {
      const res = await fetch(`http://10.107.0.2:3000/api/patients/cities?cityPrefix=${cityPrefix}`);
      if (!res.ok) throw new Error(`Server error: ${res.status}`);

      const data = await res.json();
      this.formData.addressOptions.cities = data;
    } catch (e) {
      console.error("Failed to load cities:", e);
    } finally {
      this.formData.addressLoading.cities = false;
    }
  },

  async fetchInitialData() {
    this.loading = true;
    try {
      const response = await axios.get(`${PATIENT_API_URL}/inpatient`);
      this.patientList = response.data;
      this.hasSearched = false;
    } catch (error) {
      console.error(error);
      Notify.create({
        type: "negative",
        message: "Failed to load Inpatients List",
        position: "top",
      });
    } finally {
      this.loading = false;
    }
  },

  //fetch from er
    async fetchFromErList() {
    this.loading = true;
    try {
      const response = await axios.get(`${PATIENT_API_URL}/for-admission`);
      this.patientListfromER = response.data;
      this.hasSearched = false;
    } catch (error) {
      console.error(error);
      Notify.create({
        type: "negative",
        message: "Failed to load Inpatients List",
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
      const response = await axios.get(`${PATIENT_API_URL}/search-inpatient`, {
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
        PATIENTREGID: patient.PATIENTREGID || patient.patientId,
        force: isForce,
      });

      Notify.create({ type: "positive", message: "Data sent successfully.", position: "top" });
      this.viewPatientValidationDialog = false;
      await this.fetchInitialData();
      return true;
    } catch (error) {
      if (error.response && error.response.status === 409 && !isForce) {
        this.handleLinkingConflict(error.response.data, patient.PATIENTREGID);
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

    async linkExistingPatient(patientId, existingPatientNo) {
      this.loading = true
      try {
        const res = await axios.post(`${PATIENT_API_URL}/link`, {
          PATIENTREGID: patientId,
          patientno: existingPatientNo,
        })

        this.fetchInitialData()
        return res.data

      } finally {
        this.loading = false
      }
    },

    async ignoreDuplicate() {
    if (!this.pendingLinkData) return;

    this.showDuplicateDialog = false;
    await this.sendDataInformation(
      { PATIENTREGID: this.pendingLinkData.originalId },
      true
    );
  },

    async sendToCredit(patientId) {
    if (!patientId) return;

    try {
      const payload = { PATIENTREGID: patientId };
      console.log("Sending Payload:", payload);

      await axios.post(`${PATIENT_API_URL}/send-to-credit`, payload);

      Notify.create({
        type: "positive",
        message: "Successfully sent to Credit for review.",
        position: "top",
      });

      await this.fetchInitialData();
      return true;
    } catch (error) {
      console.error(error);
      Notify.create({
        type: "negative",
        message: "Failed to update status.",
        position: "top",
      });
      return false;
    }
  },

  async fetchFullPatientData(id) {
    this.loading = true;
    try {
      const response = await axios.get(`${PATIENT_API_URL}/${id}`);
      return { ...response.data, patientId: id };
    } catch (error) {
      console.error("Print Error:", error);
      Notify.create({
        type: "negative",
        message: "Failed to fetch details for printing",
        position: "top",
      });
      return null;
    } finally {
      this.loading = false;
    }
  },

  //populate form admitting from er
  setCurrentPatient(patientData) {
    this.currentPatient = patientData;

    Object.assign(this.formData, {
      cPatientno: (patientData.PATIENTNO || '').trim().toUpperCase(),
      cFullname: (patientData.fullName || '').trim().toUpperCase(),
      cBirthdate: (patientData.birthdate || '').trim().toUpperCase(),
      cAge: (patientData.AGE || '').trim().toUpperCase(),
      cSeniorNo: (patientData.scid || '').trim().toUpperCase(),
      cPwdNo: (patientData. PWD_IDNo || '').trim().toUpperCase(),
      cPatientType: (patientData.PATIENTTYPE || '').trim().toUpperCase(),
      cAdmissionDate: (patientData.DATEAD || '').trim().toUpperCase(),
      cChiefComplaint: (patientData.CC || '').trim().toUpperCase(),
      cAdmissionDiag: (patientData.diagnosis || '').trim().toUpperCase(),
      cAdmissionType: (patientData.TYPE_OF_ADMISSION || '').trim().toUpperCase(),
      // cServiceType: (patientData.cServiceType || '').trim().toUpperCase(),
      cPhic: (patientData.phicDesc || '').trim().toUpperCase(),
      cCaseType: (patientData.TYPECASE || '').trim().toUpperCase(),



    });
  },

  //for submission admitting from er
  async updatePatientDetails() {
    if (!this.currentPatient?.CASENO || !this.currentPatient?.PATIENTNO) {
      throw new Error("No patient selected for update.");
    }
    this.submitting = true;
  },

    async fetchRooms() {
      if (this.allRooms?.length > 0) return;

      try {
        const response = await axios.get(`${PATIENT_API_URL}/rooms`);

        if (Array.isArray(response.data)) {
          this.allRooms = response.data.map(room => ({
            label: (room.label || '').toUpperCase(),
            value: room.value,
            rate: room.rate
          }));
        } else {
          this.allRooms = [];
        }
      } catch (error) {
        console.error('API Error fetching rooms:', error);
        this.allRooms = [];
      }
    },

},
});
