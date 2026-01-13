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

  const getSignatureFromAPI = async (patientId) => {
    try {
      const response = await fetch(`http://10.107.0.2:3000/api/auth/getpatientSignature/${patientId}`);
      if (!response.ok) return null;
      const data = await response.json();
      return (data && data.signature) ? data.signature : null;
    } catch (error) {
      console.warn('Failed to fetch signature:', error);
      return null;
    }
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
      const rightLogo = await getBase64ImageFromURL('src/assets/uermmc-blue-logo.png');
      const signatureData = await getSignatureFromAPI(patient.patient_id);

      const lastname = patient.lastName || '-';
      const firstname = patient.firstName || '-';
      const middlename = patient.middleName || '-';
      const suffix = patient.suffix || '';
      const fullName = `${lastname}, ${firstname} ${middlename} ${suffix}`.trim();

      const patientId = patient.patient_id || '-';
      const sex = patient.sex || '-';
      const civilStatus = patient.civilStatus || '-';
      const religion = patient.religion || '-';
      const nationality = patient.nationality || '-';
      const age = patient.age ? patient.age.toString() : '-';
      const birthdate = patient.birthdate
        ? new Date(patient.birthdate).toLocaleDateString('en-US', {month: 'long', day: 'numeric', year: 'numeric'})
        : '-';
      const birthplace = patient.birthplace || '-';
      const occupation = patient.occupation || '-';

      const barangay = patient.addressBarangay || '';
      const municipality = patient.addressCity || '';
      const fullAddress = [barangay, municipality].filter(Boolean).join(', ') || '-';

      const sssNo = patient.sssgsisId || '-';
      const tinNo = patient.tinID || '-';
      const scidNo = patient.seniorId || '-';
      const philhealthNo = patient.philhealthId || '-';

      const spouseName = patient.spouseName || '-';
      const spouseOccupation = patient.spouseOccupation || '-';
      const employer = patient.employerName || '-';
      const employerAdd = patient.employerAddress || '-';
      const employerTel = patient.spouseEmployerContact || '-';

      const fatherName = patient.ptFatherName || '-';
      const fatherAddress = patient.ptFatherAddress || '-';
      const fatherTel = patient.ptFatherContact || '-';

      const motherName = patient.ptMotherMaidenNam || '-';
      const motherAddress = patient.ptMotherAddress || '-';
      const motherTel = patient.ptMotherContact || '-';

      const incaseName = patient.cpName || '-';
      const incaseRel = patient.cpRelationship || '-';
      const incaseAddress = patient.cpAddress || '-';
      const incasePhone = [patient.cpLandline, patient.cpMobile].filter(Boolean).join(' / ') || '-';

      const phoneNos = patient.landline || '-';
      const mobileNo = patient.mobile || '-';

      const createdAt = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

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
              getLogoColumn(leftLogo, 'left'),
              {
                width: '*',
                stack: [
                  { text: 'UNIVERSITY OF THE EAST RAMON MAGSAYSAY MEMORIAL MEDICAL CENTER, INC.', style: 'header', alignment: 'center' },
                  { text: '64 Aurora Blvd, Doña Imelda, Quezon City', style: 'subheader', alignment: 'center' },
                  { text: 'INPATIENT INFORMATION SHEET', style: 'headerTitle', alignment: 'center', margin: [0, 10, 0, 0] },
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

          {
            margin: [0, 30, 0, 0],
            columns: [
              { width: '*', text: '' },
              {
                width: 200,
                stack: [
                  signatureData
                    ? { image: signatureData, width: 120, alignment: 'center', margin: [0, 0, 0, 5] }
                    : { text: '(Signature)', color: '#ccc', alignment: 'center', margin: [0, 0, 0, 20] },
                  { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 200, y2: 0, lineWidth: 1 }] },
                  { text: fullName.toUpperCase(), style: 'subheader', alignment: 'center', bold: true, margin: [0, 5, 0, 0] },
                  { text: 'Signature over Printed Name', style: 'subheader', alignment: 'center', color: '#555' },
                  { text: `Date Printed: ${createdAt}`, fontSize: 8, alignment: 'center', margin: [0, 5, 0, 0] }
                ]
              },
              { width: '*', text: '' }
            ]
          }
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
