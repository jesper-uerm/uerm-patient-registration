export function printInpatientInformation() {

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
      const response = await fetch(`http://10.107.0.2:3000/patient-reg/patients/signature/${patientId}`)

      if (!response.ok) return { patientSignature: null, personnelSignature: null }

      const data = await response.json()

      return {
        patientSignature: data?.patientSignature ?? null,
        personnelSignature: data?.personnelSignature ?? null,
      }
    } catch (error) {
      console.warn('Failed to fetch signatures:', error)
      return { patientSignature: null, personnelSignature: null }
    }
  }

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

  const generatePatientPdf = async (patient) => {
    try {
      if (!patient) return;

      await initSdk();
      const pdf = window.pdfMake;

      const rightLogo = await getBase64ImageFromURL('src/assets/uerm-logo.png');
      const leftLogo = await getBase64ImageFromURL('src/assets/uerm-logo-white.png');

      const processSignature = (rawSig) => {
        if (!rawSig) return null
        let finalSigString = ''

        if (typeof rawSig === 'object' && rawSig.type === 'Buffer' && Array.isArray(rawSig.data)) {
          const binaryString = new Uint8Array(rawSig.data).reduce(
            (data, byte) => data + String.fromCharCode(byte),
            '',
          )
          finalSigString = window.btoa(binaryString)
        } else if (typeof rawSig === 'string') {
          finalSigString = rawSig
        }

        if (finalSigString) {
          return finalSigString.startsWith('data:image')
            ? finalSigString
            : `data:image/png;base64,${finalSigString}`
        }
        return null
      }

      const { patientSignature } = await getSignatureFromAPI(patient.PATIENTREGID)
      const signatureData = processSignature(patientSignature)

      const getLogoColumn = (imgData, align) => {
        if (imgData) {
          return { image: imgData, width: 60, alignment: align };
        }
        return { text: '', width: 60 };
      };

      pdf.fonts = {
        Roboto: {
          normal: 'Roboto-Regular.ttf',
          bold: 'Roboto-Medium.ttf',
          italics: 'Roboto-Italic.ttf',
          bolditalics: 'Roboto-MediumItalic.ttf'
        }
      };

      const createCell = (label, value) => ({
        stack: [
          { text: label.toUpperCase(), fontSize: 7, bold: true, color: '#888888', margin: [0, 0, 0, 4] },
          { text: value || '-', fontSize: 10, bold: true, color: '#333333', margin: [0, 0, 0, 1] }
        ],
        margin: [0, 0, 0, 0]
      });

      const lastname = patient.LASTNAME || 'Unknown';
      const firstname = [patient.FIRSTNAME, patient.suffix].filter(Boolean).join(' ') || 'Unknown';
      const middlename = patient.MIDDLENAME || '-';
      const age = patient.AGE ? patient.AGE.toString() : '-';
      const sex = patient.SEX || patient.SEX || '-';
      const civilStatus = patient.CIVILSTATUS || '-';
      const religion = patient.RELIGION_NAME || patient.RELIGION || '-';
      const landline = patient.LANDLINE || '-';
      const mobile = patient.MOBILE || '-';
      const email = patient.EMAIL || '-';

      const birthdate = patient.BIRTHDATE ? new Date(patient.BIRTHDATE).toLocaleDateString('en-US', {month: 'long', day: 'numeric', year: 'numeric'}) : '-';
      const birthplace = patient.BIRTHPLACE || '-';
      const nationality = patient.NATIONALITY_NAME || patient.NATIONALITY || '-';
      const presentAddress = [
              patient.ADDRESSSTREET,
              patient.BARANGAY_NAME || patient.ADDRESSBARANGAY,
              patient.MUNICIPALITY_NAME || patient.ADDRESSCITY,
              patient.ADDRESSPROVINCE,
              patient.ADDRESSREGION
          ]
          .filter(part => part && part.trim() !== '')
          .join(', ') || '-';
      const spousename = patient.SPOUSENAME || '-';
      const spouseoccupation = patient.SPOUSEOCCUPATION || '-';
      const spousecontact = patient.SPOUSECONTACT || '-';

      const fathersname = patient.FATHER || '-';
      const fathersaddress = patient.FATHERADDRESS || '-';
      const fathercontactnumber = patient.FATHERCONTACT || '-';

      const mothersname = patient.MOTHER || '-';
      const mothersaddress = patient.MOTHERADDRESS || '-';
      const mothercontactnumber = patient.MOTHERCONTACT || '-';

      const occupation = patient.OCCUPATION || '-';
      const employer = patient.EMPLOYER || '-';
      const employerAddress = patient.EMPLOYERADDRESS
      const employerContact = patient.EMPLOYERCONTACTNO || '-';


      const cpName = patient.CPNAME || '-';
      const cpRelationship = patient.CPRELATIONSHIP || '-';
      const cpMobile = patient.CPMOBILE || '-';
      const cpAddress = patient.CPADDRESS || '-';

      const signatureElement = signatureData
        ? { image: signatureData, width: 150, alignment: 'center', margin: [0, 0, 0, -5] }
        : { text: '(Signature Not Available)', fontSize: 9, italics: true, color: '#999', alignment: 'center', margin: [0, 0, 0, 10] };

      const createdAt = patient.CREATEDAT ? new Date(patient.CREATEDAT).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : new Date().toLocaleDateString();

      const docDefinition = {
        pageMargins: [30, 30, 30, 30],
        info: { title: `Record_${firstname + '_' + lastname}` },
        content: [
          {
            columns: [
                {
                ...getLogoColumn(leftLogo, 'right'),
                margin: [0, 12, 0, 0]
              },
              {
                width: '*',
                stack: [
                  { text: 'UNIVERSITY OF THE EAST RAMON MAGSAYSAY MEMORIAL MEDICAL CENTER, INC.', style: 'header', alignment: 'center' },
                  { text: '64 Aurora Blvd, Doña Imelda, Quezon City, 1113 Metro Manila', style: 'subheader', alignment: 'center', margin: [0, 2, 0, 0] },
                  { text: 'Telephone: +632 715 0861-77 local 215          Website: https://www.uerm.edu.ph', style: 'subheader', alignment: 'center', margin: [0, 2, 0, 0] }
                ]
              },

              getLogoColumn(rightLogo, 'right')

            ],
            margin: [0, 0, 0, 10]
          },
          { text: 'PATIENT FORM', style: 'headerTitle', alignment: 'center' },
          {
            margin: [0, 10, 0, 0],
            table: {
              widths: ['25%', '25%', '25%', '25%'],
              body: [
                [{ text: 'PATIENT INFORMATION', fillColor: '#eeeeee', style: 'sectionHeader', alignment: 'center', colSpan: 4 }, {}, {}, {}],
                [createCell('Last Name', lastname), createCell('First Name', firstname), createCell('Middle Name', middlename), createCell('Age', age)],
                [createCell('Sex', sex), createCell('Civil Status', civilStatus), createCell('Religion', religion), createCell('Nationality', nationality)],
                [createCell('Birthdate', birthdate), createCell('Birthplace', birthplace), createCell('Landline', landline), createCell('Mobile', mobile)],
                [{ ...createCell('Email Address', email), colSpan: 4 }, {}, {}, {}],
                [{ ...createCell('Present Address', presentAddress), colSpan: 4 }, {}, {}, {}],
              ]
            }
          },
          { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 0.5, lineColor: '#888888' }] },
          {
            margin: [0, 20, 0, 0],
            table: {
              widths: ['30%', '40%', '30%'],
              body: [
                [{ text: 'FAMILY BACKGROUND', style: 'sectionHeader', fillColor: '#eeeeee', margin: [0, 0, 0, 0], alignment: 'center', colSpan: 3 }, {}, {}],
                [createCell('Spouse\'s Name', spousename), createCell('Occupation', spouseoccupation), createCell('Contact No.', spousecontact)],
                [createCell('Father\'s Name', fathersname), createCell('Address', fathersaddress), createCell('Contact No.', fathercontactnumber)],
                [createCell('Mother\'s Name', mothersname), createCell('Address', mothersaddress), createCell('Contact No.', mothercontactnumber)]
              ]
            }
          },
          {
            margin: [0, 20, 0, 0],
            table: {
              widths: ['25%', '25%', '25%', '25%'],
              body: [
                [{ text: 'FINANCIAL BACKGROUND', style: 'sectionHeader', fillColor: '#eeeeee', margin: [0, 0, 0, 0], alignment: 'center', colSpan: 4 }, {}, {}, {}],
                [createCell('Occupation', occupation), createCell('Employer', employer), createCell('Employer Address', employerAddress), createCell('Employer Contact No.', employerContact)],
              ]
            }
          },
          {
            margin: [0, 20, 0, 0],
            table: {
              widths: ['25%', '25%', '25%', '25%'],
              body: [
                [{ text: 'CONTACT PERSON IN CASE OF EMERGENCY', style: 'sectionHeader', fillColor: '#eeeeee', margin: [0, 0, 0, 0], alignment: 'center', colSpan: 4 }, {}, {}, {}],
                [createCell('Name', cpName), createCell('Mobile No.', cpMobile), createCell('Relationship', cpRelationship), {}],
                [{ ...createCell('Address', cpAddress), colSpan: 4 }, {}, {}, {}],

              ]
            }
          },
          {
            margin: [0, 20, 0, 0],
            columns: [
              { width: '*', text: '' },
              {
                width: 150,
                stack: [
                  signatureElement,
                  { text: `${firstname} ${lastname}`.toUpperCase(), style: 'subheader', alignment: 'center', bold: true, margin: [0, 0, 0, 5] },
                  { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 150, y2: 0, lineWidth: 1 }] },
                  { text: 'SIGNATURE OVER PRINTED NAME', style: 'subheader', alignment: 'center', margin: [0, 5, 0, 0] },
                  { text: `DATE: ${createdAt}`, fontSize: 8, alignment: 'center', margin: [0, 3, 0, 0] }
                ]
              },
              { width: '*', text: '' }
            ]
          }
        ],
        styles: {
          header: { fontSize: 10, bold: true, margin: [5, 15, 5, 0] },
          headerTitle: { fontSize: 12, bold: true, margin: [5, 5, 5, 0] },
          subheader: { fontSize: 8, italics: true },
          sectionTitle: { fontSize: 14, bold: true, margin: [0, 10, 0, 0] },
          sectionHeader: { fontSize: 9, bold: true, letterSpacing: 1 }
        }
      };

      pdf.createPdf(docDefinition).open();
    } catch (err) {
      console.error('PDF Generation Error:', err);
      alert('PDF Error: ' + err.message);
    }
  };

  return { generatePatientPdf };
}
