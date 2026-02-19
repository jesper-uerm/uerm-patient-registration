import { defineStore } from "pinia";
import axios from "axios";

export const useFinanceStore = defineStore("finance", {
  state: () => ({
    ownershipOptions: ["Owned", "Company", "Mortgaged"],
    grossIncomeOptions: [
      { label: "Below 20k", value: "Below 20k" },
      { label: "20k - 50k", value: "20k - 50k" },
      { label: "Above 50k", value: "Above 50k" },
    ],
    mopOptions: [
      { label: "Cash", value: "Cash" },
      { label: "Credit Card", value: "Credit Card" },
      { label: "Others", value: "Others" },
    ],
    homeOwnershipOptions: [
      { label: "Owned", value: "Owned" },
      { label: "Rented", value: "Rented" },
      { label: "Mortgaged", value: "Mortgaged" },
    ],
    yearsOfStayOptions: [
      { label: "0-1 Year", value: "0-1 Year" },
      { label: "1-5 Years", value: "1-5 Years" },
      { label: "5+ Years", value: "5+ Years" },
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

    currentPatient: null,

    submitting: false,

    formData: {
      patientSourceOfIncome: {
        sourceOfIncome: "",
        specificSourceOfIncome: "",
        pt_gross_income: "",
        pt_home_ownership: "",
        pt_years_of_stay: "",
        pthasCar: "",
        carOwnership: "",
        numberOfCars: "",
        mop: "",
        specificmop: "",
        creditCard: "",
        bank: "",
      },
      ContactPersonSourceOfIncome: {
        sourceOfIncomeContactPerson: "",
        specificSourceOfIncomeContactPerson: "",
        cp_gross_income: "",
        cp_home_ownership: "",
        cp_years_of_stay: "",
        cphasCar: "",
        cpcarOwnership: "",
        cpnumberOfCars: "",
      },
      hmo: {
        hmoName: "",
        memberId: "",
        validityDate: "",
        desiredRoom: "",
        informedIncrement: "",
        hmoStaff: "",
        hmoDateTime: "",
      },
    },
  }),

  actions: {
    setCurrentPatient(patientData) {
      this.currentPatient = patientData;
    },

    resetForm() {

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

        await axios.put("http://10.107.0.2:3000/api/auth/updatePatientDetails", payload);
        return { success: true };
      } catch (error) {
        console.error("API Error updating details:", error);
        return { success: false, error };
      } finally {
        this.submitting = false;
      }
    },
  },
});
