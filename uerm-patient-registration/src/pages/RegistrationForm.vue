<template>
    <div class="row justify-center items-center q-ma-xl" style="height: 70vh;">
    <q-card class="my-card">
      <q-card-section class="bg-primary text-white text-center">
        <div class="text-h6">Patient Registration</div>
      </q-card-section>
      <q-card-section>
        <q-stepper v-model="step" ref="stepper" color="primary" animated flat>
          <q-step :name="1" title="Personal Info" icon="person" :done="step > 1">
            <patient-details
              :form="formData.personalInfo"
              :civilStatusOptions="civilStatusOptions"
              :religionOptions="religionOptions"
              :sameAsPresent="sameAsPresent"
              :sameAsFather="sameAsFather"
              @update:form="val => formData.personalInfo = val"
              @next="step = 2"
              />
          </q-step>
          <q-step :name="2" title="Occupation Details" icon="call" :done="step > 2">
            <source-of-income
              :form="formData.sourceOfIncome"
              :yesNoOptions="yesNoOptions"
              :ownershipOptions="ownershipOptions"
              :sourceIncomeOptions="sourceIncomeOptions"
              @update:form="val => formData.sourceOfIncome = val"
              @next="step = 3" @prev="step = 1"
              />
          </q-step>
          <q-step :name="3" title="Guarantor Details" icon="call" :done="step > 3">
            <guarantor-details
              :form="formData.guarantorInfo"
              :relationshipOptions="relationshipOptions"
              :yesNoOptions="yesNoOptions"
              :ownershipOptions="ownershipOptions"
              @update:form="val => formData.guarantorInfo = val"
              @next="step = 4" @prev="step = 2"
              />
          </q-step>
        </q-stepper>
      </q-card-section>
    </q-card>
  </div>
</template>
<script>
  import GuarantorDetails from 'components/GuarantorDetails.vue'
  import PatientDetails from 'components/PatientDetails.vue'
  import SourceOfIncome from 'components/SourceOfIncome.vue'

  export default {
    components: {
      GuarantorDetails,
      PatientDetails,
      SourceOfIncome,
    },

    data() {
      return {
        step: 1,
        sameAsPresent: false,
        sameAsFather: false,
        civilStatusOptions: ['Single', 'Married', 'Widowed', 'Separated', 'Divorced'],
        religionOptions: ['Roman Catholic', 'Christian', 'Islam', 'Others'],
        relationshipOptions: ['Spouse', 'Parent', 'Sibling', 'Child', 'Co-Maker'],
        yesNoOptions: [{
          label: 'Yes',
          value: 'yes'
        }, {
          label: 'No',
          value: 'no'
        }],
        sourceIncomeOptions: [{
          label: 'Full-Time Employment',
          value: 'Full-Time Employment'
        }, {
          label: 'Business',
          value: 'Business'
        }, {
          label: 'Remittance',
          value: 'Remittance'
        }, {
          label: 'Other',
          value: 'Others'
        }],
        ownershipOptions: ['Owned', 'Company', 'Mortgaged'],
        formData: {
          personalInfo: {
            lastName: '',
            firstName: '',
            middleName: '',
            age: '',
            gender: null,
            civilStatus: null,
            religion: null,
            landline: '',
            mobile: '',
            email: '',
            birthdate: '',
            birthplace: '',
            nationality: '',
            presentAddress: '',
            permanentAddress: '',
            fathersName: '',
            fathersAddress: '',
            fatherContactNumber: '',
            mothersName: '',
            mothersAddress: '',
            motherContactNumber: ''
          },

          sourceOfIncome: {
            sourceOfIncome: '',
            specificSourceOfIncome: '',
            seniorpwd: '',
            philhealth: '',
            sssgsis: '',
            tin: '',
            others: '',
            pt_gross_income: [],
            pt_home_ownership: [],
            pt_years_of_stay: [],
            spouseName: '',
            spouseOccupation: '',
            spouseEmployerContact: '',
            pthasCar: 'no',
            hasCar: 'no',
            carOwnership: null,
            numberOfCars: '',
          },

          guarantorInfo: {
          resp1_fullname: '',
          resp1_relationship: null,
          resp1_landline: '',
          resp1_mobile: '',
          resp1_email: '',
          resp1_address: '',
          resp1_occupation: '',
          resp1_contact_no: '',
          resp1_employer_address: '',
          resp1_source_income: [],
          resp1_gross_income: [],
          resp1_home_ownership: [],
          resp1_years_of_stay: [],
          }
        }
      }
    }
  }
</script>
<style scoped>
  .my-card {
    max-width: 100%;
    width: 1000px;
    margin: 0 auto;
  }
</style>
