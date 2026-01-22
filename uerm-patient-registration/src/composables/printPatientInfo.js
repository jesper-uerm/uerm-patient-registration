export function printPatientInfo() {

  const loadScript = (src) => {
    return new Promise((resolve, reject) => {
      if (document.querySelector(`script[src="${src}"]`)) { resolve(); return; }
      const script = document.createElement('script');
      script.src = src;
      script.onload = resolve;
      script.onerror = () => reject(new Error(`Failed to load ${src}`));
      document.body.appendChild(script);
    });
  };


  const getBase64ImageFromURL = (url) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.setAttribute('crossOrigin', 'anonymous');
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL('image/png'));
      };
      img.onerror = () => {
        console.warn(`Could not load image: ${url}`);
        resolve(null);
      };
      img.src = url;
    });
  };

  const initSdk = async () => {
    if (!window.pdfMake) {
      await loadScript('https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.71/pdfmake.min.js');
    }
    if (!window.pdfMake.vfs || Object.keys(window.pdfMake.vfs).length === 0) {
      await loadScript('https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.71/vfs_fonts.js');
    }
  };

  const generatePatientInfoPdf = async (patient) => {
    try {
      if (!patient) return;

      await initSdk();
      const pdf = window.pdfMake;

      const leftLogo = await getBase64ImageFromURL('src/assets/uerm-logo.png');
      const rightLogo = await getBase64ImageFromURL('src/assets/uerm-logo-white.png');
      // const signatureData = await getSignatureFromAPI(patient.patient_id);

      const lastname = patient.LASTNAME || '-';
      const firstname = patient.FIRSTNAME || '-';
      const middlename = patient.MIDDLENAME || '-';
      const suffix = patient.SUFFIX || '';
      const fullName = `${lastname}, ${firstname} ${middlename} ${suffix}`.trim();

      const patientId = patient.PATIENTNO || '-';
      const sex = patient.SEX || '-';
      const civilStatus = patient.STATUS || '-';
      const religion = patient.RELIGION_NAME || '-';
      const nationality = patient.NATIONALITY_NAME || '-';
      const age = (patient.AGE !== undefined && patient.AGE !== null) ? patient.AGE.toString() : '-';
      const birthdate = patient.DBIRTH
        ? new Date(patient.DBIRTH).toLocaleDateString('en-US', {month: 'long', day: 'numeric', year: 'numeric'})
        : '-';
      const birthplace = patient.BPLACE || '-';
      const occupation = patient.OCCUPATION_NAME || '-';

      const barangay = patient.BARANGAY_NAME || '';
      const municipality = patient. MUNICIPALITY_NAME || '';
      const fullAddress = [barangay, municipality].filter(Boolean).join(', ') || '-';

      const sssNo = patient.SSSNO || '-';
      const tinNo = patient.TINNO || '-';
      const scidNo = patient.SCIDNO || '-';
      const philhealthNo = patient.UDF_PHILHEALTHNO || '-';

      const spouseName = patient.NOFSPOUSE || '-';
      const spouseOccupation = patient.SPOUSEOCCUPATION || '-';
      const employer = patient.EMPLOYER || '-';
      const employerAdd = patient.EMPLOYERADD || '-';
      const employerTel = patient.EMPLOYERTELNO || '-';

      const fatherName = patient.FATHER || '-';
      const fatherAddress = patient.FADDRESS || '-';
      const fatherTel = patient.FTEL || '-';

      const motherName = patient.MOTHER || '-';
      const motherAddress = patient.MADDRESS || '-';
      const motherTel = patient.MTEL || '-';

      const incaseName = patient.INCASE || '-';
      const incaseRel = patient.RELATIONSHIP || '-';
      const incaseAddress = patient.INCASEADD || '-';
      const incasePhone = [patient.PHONENOS, patient.MOBILENO].filter(Boolean).join(' / ') || '-';

      const phoneNos = patient.landline || '-';
      const mobileNo = patient.mobile || '-';

      // const createdAt = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

      const createCell = (label, value, colSpan = 1) => ({
        stack: [
          { text: label.toUpperCase(), fontSize: 7, bold: true, color: '#888888', margin: [0, 0, 0, 2] },
          { text: value || '-', fontSize: 9, bold: true, color: '#333333', margin: [0, 0, 0, 1] }
        ],
        colSpan: colSpan,
        margin: [0, 2, 0, 2]
      });

      const getLogoColumn = (imgData, align) => {
        return imgData
          ? { image: imgData, width: 50, alignment: align }
          : { text: '', width: 50 };
      };

      const docDefinition = {
        pageMargins: [30, 30, 30, 30],
        info: { title: `Patient_Record_${patientId}` },
        content: [
          {
            columns: [
                {
                  ...getLogoColumn(leftLogo, 'right'),
                  margin: [0, 12, 0, 0]
                },              {
                width: '*',
                stack: [
                  { text: 'UNIVERSITY OF THE EAST RAMON MAGSAYSAY MEMORIAL MEDICAL CENTER, INC.', style: 'header', alignment: 'center' },
                  { text: '64 Aurora Blvd, Doña Imelda, Quezon City', style: 'subheader', alignment: 'center' },
                  { text: 'PATIENT INFORMATION SHEET', style: 'headerTitle', alignment: 'center', margin: [0, 10, 0, 0] },
                ]
              },
              getLogoColumn(rightLogo, 'right')
            ],
            margin: [0, 0, 0, 15]
          },

          {
            table: {
              widths: ['25%', '25%', '25%', '25%'],
              body: [
                [{ text: 'PATIENT DETAILS', style: 'sectionHeader', fillColor: '#eeeeee', colSpan: 4 }, {}, {}, {}],

                [createCell('Patient No', patientId), { ...createCell('Full Name', fullName), colSpan: 3 }, {}, {}],

                [{ ...createCell('Address (Barangay, Municipality)', fullAddress), colSpan: 4 }, {}, {}, {}],

                [createCell('Birthdate', birthdate), createCell('Age', age), createCell('Sex', sex), createCell('Civil Status', civilStatus)],

                [createCell('Birthplace', birthplace), createCell('Nationality', nationality), createCell('Religion', religion), createCell('Occupation', occupation)],

                [createCell('Landline No.', phoneNos), createCell('Mobile No.', mobileNo), { ...createCell('Email', patient.email || '-'), colSpan: 2}, {}],
              ]
            }
          },

          { text: ' ', margin: [0, 5] },

          {
            table: {
              widths: ['25%', '25%', '25%', '25%'],
              body: [
                [{ text: 'GOVERNMENT IDS', style: 'sectionHeader', fillColor: '#eeeeee', colSpan: 4 }, {}, {}, {}],
                [createCell('SSS / GSIS No', sssNo), createCell('TIN No', tinNo), createCell('Senior Citizen ID', scidNo), createCell('PhilHealth No', philhealthNo)]
              ]
            }
          },

          { text: ' ', margin: [0, 5] },

          {
            table: {
              widths: ['20%', '30%', '25%', '25%'],
              body: [
                [{ text: 'FAMILY BACKGROUND', style: 'sectionHeader', fillColor: '#eeeeee', colSpan: 4 }, {}, {}, {}],

                [{ ...createCell("Spouse's Name", spouseName), colSpan: 2 }, {}, createCell('Spouse Occupation', spouseOccupation), createCell('Employer Tel', employerTel)],
                [{ ...createCell("Employer Name", employer), colSpan: 2 }, {}, { ...createCell('Employer Address', employerAdd), colSpan: 2 }, {}],

                [{ ...createCell("Father's Name", fatherName), colSpan: 2}, {}, createCell('Contact No.', fatherTel), { ...createCell("Address", fatherAddress), colSpan: 1 }],

                [{ ...createCell("Mother's Name", motherName), colSpan: 2}, {}, createCell('Contact No.', motherTel), { ...createCell("Address", motherAddress), colSpan: 1 }],
              ]
            }
          },

          { text: ' ', margin: [0, 5] },

          {
            table: {
              widths: ['30%', '20%', '50%'],
              body: [
                [{ text: 'IN CASE OF EMERGENCY / PERSON RESPONSIBLE', style: 'sectionHeader', fillColor: '#eeeeee', colSpan: 3 }, {}, {}],
                [createCell('Name', incaseName), createCell('Relationship', incaseRel), createCell('Contact Nos.', incasePhone)],
                [{ ...createCell('Address', incaseAddress), colSpan: 3 }, {}, {}]
              ]
            }
          },

        ],

        styles: {
          header: { fontSize: 10, bold: true, margin: [0, 5, 0, 0] },
          subheader: { fontSize: 8, margin: [0, 0, 0, 0] },
          headerTitle: { fontSize: 14, bold: true },
          sectionHeader: { fontSize: 9, bold: true, letterSpacing: 1, margin: [0, 2, 0, 2] }
        }
      };

      pdf.createPdf(docDefinition).open();

    } catch (err) {
      console.error('PDF Generation Error:', err);
      alert('PDF Error: ' + err.message);
    }
  };

  return { generatePatientInfoPdf };
}
