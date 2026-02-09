import { defineStore } from 'pinia';
import axios from 'axios';
import { Notify, Loading } from 'quasar';
import { date } from "quasar";

export const useInpatientStore = defineStore('registration', {
  state: () => ({
    regFormdialogVisible: false,
    step: 1,
    submitting: false,

    civilStatusOptions: ["Single", "Married", "Widowed", "Separated", "Divorced"],
    religionOptions: ["Roman Catholic", "Christian", "Islam", "Others"],
    ownershipOptions: ["Owned", "Company", "Mortgaged"],
    relationshipOptions: ["Spouse", "Parent", "Sibling", "Child", "Co-Maker"],
    mopOptions: [
      { label: "Cash", value: "Cash" },
      { label: "Credit Card", value: "Credit Card" },
      { label: "Others", value: "Others" },
    ],
    yesNoOptions: [
      { label: "Yes", value: "yes" },
      { label: "No", value: "no" },
    ],
    sourceIncomeOptions: [
      { label: "Full-Time Employment", value: "Full-Time Employment" },
      { label: "Business", value: "Business" },
      { label: "Remittance", value: "Remittance" },
      { label: "Other", value: "Others" },
    ],

    appOptions: {
      yesNo: ['Yes', 'No'],
      sourceIncome: ['Employed', 'Self-Employed', 'Unemployed', 'Retired'],
      ownership: ['Owned', 'Mortgaged', 'Rented'],
      relationships: ['Parent', 'Spouse', 'Sibling', 'Child', 'Guardian', 'Other'],
      consentItems: [
        { label: "UERM Brochure", value: "UERM Brochure" },
        { label: "Admission Kit", value: "Admission Kit" },
        { label: "Patient Satisfaction Survey", value: "Patient Satisfaction Survey" },
      ],
    },

    formData: {
      personalInfo: {
        lastName: "",
        firstName: "",
        middleName: "",
        suffix: "",
        age: "",
        gender: null,
        civilStatus: null,
        religion: null,
        landline: "",
        mobile: "",
        email: "",
        occupation: "",
        birthdate: "",
        birthplace: "",
        nationality: "",
        selectedRegion: null,
        selectedProvince: null,
        selectedCity: null,
        selectedBarangay: null,
        streetName: "",
        permanentAddress: "",
        fathersName: "",
        fathersAddress: "",
        fatherContactNumber: "",
        mothersName: "",
        mothersAddress: "",
        motherContactNumber: "",
      },

      contactDetails: {
        seniorpwd: "",
        philhealth: "",
        sssgsis: "",
        tin: "",
        others: "",
        spouseName: "",
        spouseOccupation: "",
        spouseEmployerContact: "",
        spouseEmployerName: "",
        spouseEmployerAddress: "",
        contactPersonInpatient: "",
        contactPersonInpatientRelationship: null,
        contactPersonInpatientLandline: "",
        contactPersonInpatientMobile: "",
        contactPersonInpatientEmail: "",
        contactPersonInpatientAddress: "",
        contactPersonInpatientOccupation: "",
        contactPersonInpatientEmployerNumber: "",
      },

      patientConsent: {
        mop: "",
        specificmop: "",
        creditCard: "",
        bank: "",
        items: [],
      },

      signature: null,

      addressOptions: {
      regions: [],
      provinces: [],
      cities: [],
      barangays: []
    },

    addressLoading: {
      regions: false,
      provinces: false,
      cities: false,
      barangays: false
    },

    toggles: {
      sameAsPresent: false,
      sameAsFather: false
    },

    govtIds: {
      seniorId: '',
      philhealth: '',
      sss: '',
      tin: '',
      others: ''
    },

    contactPerson: {
      name: '',
      relationship: '',
      email: '',
      mobile: '',
      landline: '',
      address: ''
    },

    spouse: {
      name: '',
      occupation: '',
      employerName: '',
      employerAddress: '',
      employerContact: ''
    },

    socioEconomic: {
        sourceOfIncome: '',
        monthlyIncome: '',
        isCarOwner: '',
        carOwnership: null,
        numberOfCars: '',
        guardianName: '',
        guardianRelation: '',
        guardianContact: '',
      },

      consent: {
        itemsReceived: [],
        signature: null,
      },
    },
  }),

  actions: {
    openForm(patientData = null) {
      this.step = 1;
      this.regFormdialogVisible = true;
      if (patientData) {
        this.populateForm(patientData);
      } else {
        this.resetForm();
      }
    },

    resetForm() {
      this.formData.personalInfo = {
          lastName: "", firstName: "", middleName: "", suffix: "", age: "", gender: null, civilStatus: null,
          religion: null, landline: "", mobile: "", email: "", occupation: "", birthdate: "", birthplace: "",
          nationality: "", selectedRegion: "", selectedProvince: "", selectedCity: "", selectedBarangay: "",
          streetName: "", permanentAddress: "", fathersName: "", fathersAddress: "", fatherContactNumber: "",
          mothersName: "", mothersAddress: "", motherContactNumber: "",
      };
      this.formData.contactDetails = {
          seniorpwd: "", philhealth: "", sssgsis: "", tin: "", others: "", spouseName: "", spouseOccupation: "",
          spouseEmployerContact: "", spouseEmployerName: "", spouseEmployerAddress: "", contactPersonInpatient: "",
          contactPersonInpatientRelationship: null, contactPersonInpatientLandline: "", contactPersonInpatientMobile: "",
          contactPersonInpatientEmail: "", contactPersonInpatientAddress: "", contactPersonInpatientOccupation: "",
          contactPersonInpatientEmployerNumber: "",
      };
      this.formData.patientConsent = { mop: "", specificmop: "", creditCard: "", bank: "", items: [] };
      this.formData.signature = null;
    },

    populateForm(data) {
      this.formData.personalInfo = {
        ...this.formData.personalInfo,
        lastName: data.lastName || "",
        firstName: data.firstName || "",
        middleName: data.middleName || "",
        suffix: data.suffix || "",
        age: data.age || "",
        birthdate: data.birthdateStr || data.birthdate || "",
        gender: data.gender || null,
        civilStatus: data.civilStatus || null,
        religion: data.religion || null,
        birthplace: data.birthplace || "",
        nationality: data.nationality || "",
        occupation: data.occupation || "",
        landline: data.landline || "",
        mobile: data.mobile || "",
        email: data.email || "",
        selectedRegion: data.addressRegion || "",
        selectedProvince: data.addressProvince || "",
        selectedCity: data.addressCity || "",
        selectedBarangay: data.addressBarangay || "",
        streetName: data.addressStreet || "",
        fathersName: data.ptFatherName || "",
        fathersAddress: data.ptFatherAddress || "",
        fatherContactNumber: data.ptFatherContact || "",
        mothersName: data.ptMotherMaidenName || "",
        mothersAddress: data.ptMotherAddress || "",
        motherContactNumber: data.ptMotherContact || "",
      };

      this.formData.contactDetails = {
        ...this.formData.contactDetails,
        seniorpwd: data.seniorId || data.seniorpwd || "",
        philhealth: data.philhealthId || data.philhealth || "",
        sssgsis: data.sssgsisId || data.sssgsis || "",
        tin: data.tinID || data.tin || "",
        spouseName: data.spouseName || "",
        spouseOccupation: data.spouseOccupation || "",
        spouseEmployerName: data.spouseEmployerName || "",
        spouseEmployerContact: data.spouseEmployerContact || "",
        spouseEmployerAddress: data.spouseEmployerAddress || "",
        contactPersonInpatient: data.cpName || "",
        contactPersonInpatientRelationship: data.cpRelationship || null,
        contactPersonInpatientMobile: data.cpMobile || "",
        contactPersonInpatientLandline: data.cpLandline || "",
        contactPersonInpatientEmail: data.cpEmail || "",
        contactPersonInpatientAddress: data.cpAddress || "",
      };

      if (data.mop) {
        this.formData.patientConsent.mop = data.mop;
      }
    },

    async registerPatient() {
  if (this.submitting) return;

  this.submitting = true;
  Loading.show({ message: "Submitting Registration..." });

  const finalData = {
    ...this.formData.personalInfo,
    ...this.formData.contactDetails,
    ...this.formData.consent,

    signature: this.formData.consent?.signature,

    patientType: "Inpatient",
  };

  console.log("Sending to Backend:", finalData);

  try {
await axios.post("http://10.107.0.2:3000/api/auth/register", finalData);
    Notify.create({
      type: "positive",
      message: "Registration Successful!",
      position: "top",
      timeout: 4000,
    });

    setTimeout(() => {
      this.regFormdialogVisible = false;
    }, 1500);

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
        const res = await fetch("https://psgc.gitlab.io/api/regions/");
        const data = await res.json();
        this.formData.addressOptions.regions = data.sort((a, b) => a.name.localeCompare(b.name));
      } catch (e) { console.error(e); }
      finally { this.formData.addressLoading.regions = false; }
    },

    async loadProvinces() {
      this.formData.personalInfo.selectedProvince = null;
      this.formData.personalInfo.selectedCity = null;
      this.formData.personalInfo.selectedBarangay = null;
      this.formData.addressOptions.provinces = [];
      this.formData.addressOptions.cities = [];
      this.formData.addressOptions.barangays = [];

      const region = this.formData.personalInfo.selectedRegion;
      if (!region) return;

      this.formData.addressLoading.provinces = true;
      try {
        const res = await fetch(`https://psgc.gitlab.io/api/regions/${region.code}/provinces/`);
        const data = await res.json();
        this.formData.addressOptions.provinces = data.sort((a, b) => a.name.localeCompare(b.name));

        if (this.formData.addressOptions.provinces.length === 0 && region.code === "130000000") {
          await this.loadCitiesForRegion(region.code);
        }
      } catch (e) { console.error(e); }
      finally { this.formData.addressLoading.provinces = false; }
    },

    async loadCitiesForRegion(regionCode) {
      this.formData.addressLoading.cities = true;
      try {
        const res = await fetch(`https://psgc.gitlab.io/api/regions/${regionCode}/cities-municipalities/`);
        const data = await res.json();
        this.formData.addressOptions.cities = data.sort((a, b) => a.name.localeCompare(b.name));
        this.formData.personalInfo.selectedProvince = { name: "NCR", code: "NCR" };
      } catch (e) { console.error(e); }
      finally { this.formData.addressLoading.cities = false; }
    },

    async loadCities() {
      const province = this.formData.personalInfo.selectedProvince;
      if (!province || province.code === "NCR") return;

      this.formData.personalInfo.selectedCity = null;
      this.formData.personalInfo.selectedBarangay = null;
      this.formData.addressOptions.cities = [];
      this.formData.addressOptions.barangays = [];

      this.formData.addressLoading.cities = true;
      try {
        const res = await fetch(`https://psgc.gitlab.io/api/provinces/${province.code}/cities-municipalities/`);
        const data = await res.json();
        this.formData.addressOptions.cities = data.sort((a, b) => a.name.localeCompare(b.name));
      } catch (e) { console.error(e); }
      finally { this.formData.addressLoading.cities = false; }
    },

    async loadBarangays() {
      const city = this.formData.personalInfo.selectedCity;
      if (!city) return;

      this.formData.personalInfo.selectedBarangay = null;
      this.formData.addressOptions.barangays = [];

      this.formData.addressLoading.barangays = true;
      try {
        const res = await fetch(`https://psgc.gitlab.io/api/cities-municipalities/${city.code}/barangays/`);
        const data = await res.json();
        this.formData.addressOptions.barangays = data.sort((a, b) => a.name.localeCompare(b.name));
      } catch (e) { console.error(e); }
      finally { this.formData.addressLoading.barangays = false; }

      if (this.toggles.sameAsPresent) {
      this.updatePermanentAddress();
    }
    }
  },
});
