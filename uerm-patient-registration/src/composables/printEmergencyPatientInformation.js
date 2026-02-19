export function printEmergencyPatientInformation() {

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

  const generateTriagePatientPdf = async (patient) => {
    try {
        if (!patient) return;

        await initSdk();
        const pdf = window.pdfMake;

        const rightLogo = await getBase64ImageFromURL('src/assets/uerm-logo.png');
        const leftLogo = await getBase64ImageFromURL('src/assets/uerm-logo-white.png');

        const processSignature = (rawSig) => {
            if (!rawSig) return null;

            let finalSigString = '';

            if (typeof rawSig === 'object' && rawSig.type === 'Buffer' && Array.isArray(rawSig.data)) {
                const binaryString = new Uint8Array(rawSig.data).reduce(
                    (data, byte) => data + String.fromCharCode(byte),
                    ''
                );
                finalSigString = window.btoa(binaryString);
            }
            else if (typeof rawSig === 'string') {
                finalSigString = rawSig;
            }

            if (finalSigString) {
                return finalSigString.startsWith('data:image')
                    ? finalSigString
                    : `data:image/png;base64,${finalSigString}`;
            }
            return null;
        };

        const patientSigData = processSignature(patient.eSignature);
        const personnelSigData = processSignature(patient.personnelSignature);

        const getSignatureImage = (sigData) => {
            return sigData
                ? { image: sigData, width: 150, alignment: 'center', margin: [0, 0, 0, -5] }
                : { text: '(No Signature)', fontSize: 8, color: '#999', alignment: 'center', margin: [0, 15, 0, 5] };
        };

        const patientSigElement = getSignatureImage(patientSigData);
        const personnelSigElement = getSignatureImage(personnelSigData);

        const getLogoColumn = (imgData, align) => {
            if (imgData) return { image: imgData, width: 60, alignment: align };
            return { text: '', width: 60 };
        };

        const createCell = (label, value) => ({
            stack: [
                { text: label.toUpperCase(), fontSize: 7, bold: true, color: '#888888', margin: [0, 0, 0, 4] },
                { text: value || '-', fontSize: 10, bold: true, colsor: '#333333', margin: [0, 0, 0, 1] }
            ],
            margin: [0, 0, 0, 0]
        });

        const lastname = patient.lastName || 'Unknown';
        const firstname = patient.firstName || 'Unknown';
        const middlename = patient.middleName || '';
        const birthdate = patient.birthdate ? new Date(patient.birthdate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : '-';
        const age = patient.age ? patient.age.toString() : '-';
        const sex = patient.gender || patient.sex || '-';
        const chiefComplaint = patient.chiefComplaint || '-';

        const temp = patient.temp || '-';
        const heartrate = patient.heartrate || '-';
        const oxygen = patient.oxygen || '-';
        const bp = patient.bp || '-';
        const respirate = patient.respirate || '-';
        const painScore = patient.painScore || '-';
        const avpu = patient.avpu || '-';

        const contagious = patient.contagious || '-';
        const isolation = patient.isolation || '-';
        const symptoms = patient.symptoms || '-';
        const cpd = patient.cpd || '-';
        const level = patient.level || '-';
        const remarks = patient.remarks || '-';

        const personnelName = patient.personnel_name || patient.personnel || 'Triage Officer';
        const createdAt = patient.createdAt ? new Date(patient.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : '-';

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
                                { text: 'Telephone: +632 715 0861-77 local 215      Website: https://www.uerm.edu.ph', style: 'subheader', alignment: 'center', margin: [0, 2, 0, 0] }
                            ]
                        },
                        getLogoColumn(rightLogo, 'right')
                    ],
                    margin: [0, 0, 0, 10]
                },

                { text: 'TRIAGE FORM', style: 'headerTitle', alignment: 'center' },

                {
                    margin: [0, 10, 0, 0],
                    table: {
                        widths: ['25%', '25%', '25%', '25%'],
                        body: [
                            [{ text: 'PATIENT INFORMATION', fillColor: '#eeeeee', style: 'sectionHeader', alignment: 'center', colSpan: 4 }, {}, {}, {}],
                            [
                                createCell('Name', `${firstname} ${middlename} ${lastname}`),
                                createCell('Birthdate', birthdate),
                                createCell('Age', age),
                                createCell('Sex', sex),
                            ],
                            [{ ...createCell('Chief Complaint', chiefComplaint), colSpan: 4 }, {}, {}, {}],
                        ]
                    }
                },

                { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 0.5, lineColor: '#888888' }] },

                {
                    margin: [0, 10, 0, 0],
                    table: {
                        widths: ['25%', '25%', '25%', '25%'],
                        body: [
                            [{ text: 'VITAL SIGNS', style: 'sectionHeader', fillColor: '#eeeeee', alignment: 'center', colSpan: 4 }, {}, {}, {}],
                            [
                                createCell('Temperature', temp),
                                createCell('Heart Rate', heartrate),
                                createCell('Oxygen Saturation', oxygen),
                                createCell('Blood Pressure', bp),
                            ],
                            [
                                { ...createCell('Respiratory Rate', respirate), colSpan: 1 },
                                { ...createCell('Pain Score', painScore), colSpan: 1 },
                                { ...createCell('AVPU Scale', avpu), colSpan: 2 },
                                {}
                            ],
                            [
                                { ...createCell('Screening for Contagious Infectious Disease', contagious), colSpan: 2 },
                                {},
                                { ...createCell('Check for Presence of Any of the Following:', symptoms), colSpan: 1 },
                                { ...createCell('Initiate Isolation Precaution and Transfer Immediately to:', isolation), colSpan: 1 },
                            ],
                            [
                                { ...createCell('Cardio-Pulmonary Distress', cpd), colSpan: 1 },
                                { ...createCell('Triage-Level', level), colSpan: 1 },
                                { ...createCell('Remarks', remarks), colSpan: 2 },
                                {},
                            ],
                        ]
                    }
                },

                {
                    margin: [0, 40, 0, 0],
                    columns: [
                        {
                            width: '50%',
                            stack: [
                                patientSigElement,
                                {
                                    text: `${firstname} ${lastname}`.toUpperCase(), fontSize: 9,
                                    margin: [0, 0, 0, 5],
                                    style: 'subheader', alignment: 'center', bold: true, decoration: 'underline',
                                },
                                { text: 'PATIENT / GUARDIAN', fontSize: 9, alignment: 'center' },
                                { text: `DATE: ${createdAt}`, fontSize: 9, alignment: 'center' }
                            ]
                        },

                        {
                            width: '50%',
                            stack: [
                                personnelSigElement,
                                {
                                    text: personnelName.toUpperCase(), fontSize: 9,
                                    margin: [0, 0, 0, 5],
                                    style: 'subheader', alignment: 'center', bold: true, decoration: 'underline',
                                },
                                { text: 'TRIAGE OFFICER', fontSize: 9, alignment: 'center' },
                                { text: `DATE: ${createdAt}`, fontSize: 9, alignment: 'center' }
                            ]
                        }
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
  return { generateTriagePatientPdf };
}
