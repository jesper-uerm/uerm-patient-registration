export function printEmergencyTreatment() {

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

  const generateEmergencyTreatmentPdf = async (patient) => {
    try {
        if (!patient) return;

        await initSdk();
        const pdf = window.pdfMake;

        const rightLogo = await getBase64ImageFromURL('src/assets/uerm-logo.png');
        const leftLogo = await getBase64ImageFromURL('src/assets/uerm-logo-white.png');

        // const processSignature = (rawSig) => {
        //     if (!rawSig) return null;

        //     let finalSigString = '';

        //     if (typeof rawSig === 'object' && rawSig.type === 'Buffer' && Array.isArray(rawSig.data)) {
        //         const binaryString = new Uint8Array(rawSig.data).reduce(
        //             (data, byte) => data + String.fromCharCode(byte),
        //             ''
        //         );
        //         finalSigString = window.btoa(binaryString);
        //     }
        //     else if (typeof rawSig === 'string') {
        //         finalSigString = rawSig;
        //     }

        //     if (finalSigString) {
        //         return finalSigString.startsWith('data:image')
        //             ? finalSigString
        //             : `data:image/png;base64,${finalSigString}`;
        //     }
        //     return null;
        // };

        // const patientSigData = processSignature(patient.eSignature);
        // const personnelSigData = processSignature(patient.personnelSignature);

        // const getSignatureImage = (sigData) => {
        //     return sigData
        //         ? { image: sigData, width: 150, alignment: 'center', margin: [0, 0, 0, -5] }
        //         : { text: '(No Signature)', fontSize: 8, color: '#999', alignment: 'center', margin: [0, 15, 0, 5] };
        // };

        // const patientSigElement = getSignatureImage(patientSigData);
        // const personnelSigElement = getSignatureImage(personnelSigData);

        const getLogoColumn = (imgData, align) => {
            if (imgData) return { image: imgData, width: 60, alignment: align };
            return { text: '', width: 60 };
        };

        const createCell = (label, value) => ({
            stack: [
                { text: label.toUpperCase(), fontSize: 7, bold: true, color: '#888888', margin: [0, 0, 0, 4] },
                { text: value, fontSize: 10, bold: true, colsor: '#333333', margin: [0, 0, 0, 1] }
            ],
            margin: [0, 0, 0, 0]
        });

        const lastname = patient.lastName || 'Unknown';
        const firstname = patient.firstName || 'Unknown';
        const middlename = patient.middleName || '-';
        const birthdate = patient.birthdate ? new Date(patient.birthdate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : '-';
        const age = patient.age ? patient.age.toString() : '-';
        const sex = patient.gender || patient.sex || '-';
        const weight = patient.weight || '-';
        const civilStatus = patient.civilStatus || '-';
        const contactPerson = patient.cpName || '-';
        const contactAddress = patient.cpAddress || '-';
        const contactNumber = [patient.cpMobile, patient.cpLandline] .filter(Boolean) .join(' - ');

        const broughtBy = patient.broughtBy || '-';
        const philHealthCateg = patient.philHealthCateg || '-';
        const hmo = patient.hmo || '-';
        const infirmary = patient.infirmary || '-';
        const seniorId = patient.seniorId || '-';

        const temp = patient.temp || '-';
        const heartrate = patient.heartrate || '-';
        const bp = patient.bp || '-';
        const respirate = patient.respirate || '-';
        const ptCondition = patient.ptCondition || '-';
        const chiefComplaint = patient.chiefComplaint || '-';

        // const oxygen = patient.oxygen || '-';
        // const painScore = patient.painScore || '-';
        // const avpu = patient.avpu || '-';

        // const contagious = patient.contagious || '-';
        // const isolation = patient.isolation || '-';
        // const symptoms = patient.symptoms || '-';
        // const cpd = patient.cpd || '-';
        // const level = patient.level || '-';
        // const remarks = patient.remarks || '-';

        // const personnelName = patient.personnel_name || patient.personnel || 'Triage Officer';
        // const createdAt = patient.createdAt ? new Date(patient.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : '-';

        const docDefinition = {
            pageMargins: [30, 30, 30, 30],
            info: { title: `Record_${firstname + '_' + lastname}` },

            content: [
                {
                    columns:[
                      {
                          text: 'CTRL. NO.: ______________',
                          alignment: 'right',
                          fontSize: 9,
                          margin: [0, 8, 10, 15]
                      },
                    ]
                },
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
                        getLogoColumn(rightLogo, 'left')
                    ],
                    margin: [0, 0, 0, 10]
                },

                {
                    columns:[
                      {
                          text: 'CASE NO.:  _____________________________',
                          alignment: 'left',
                          fontSize: 9,
                          margin: [0, 0, 10, 12]
                      },

                      {
                          text: 'DATE AND TIME OF ADMISSION:  _____________________________',
                          alignment: 'right',
                          fontSize: 9,
                          margin: [0, 0, 10, 12]
                      },
                    ]
                },

                { text: 'EMERGENCY ROOM TREATMENT SHEET', style: 'headerTitle', alignment: 'center' },

                {
                    margin: [0, 10, 0, 0],
                    table: {
                        widths: ['25%', '25%', '25%', '25%'],
                        body: [
                            [{ text: 'PATIENT INFORMATION', fillColor: '#eeeeee', style: 'sectionHeader', alignment: 'center', colSpan: 4 }, {}, {}, {}],
                            [
                                createCell('Last Name', lastname),
                                createCell('First Name', firstname),
                                createCell('Middle Name', middlename),
                                createCell('Age', age),

                            ],
                            [
                                createCell('Sex', sex),
                                createCell('Marital Status', civilStatus),
                                createCell('Birthdate', birthdate),
                                createCell('Ward/Room No. ', ),
                            ],
                            [
                            {...createCell('Person to notify in case of emergency', contactPerson), colSpan: 1 },
                            {...createCell('Complete Address', contactAddress), colSpan: 2  },
                            {},
                            {...createCell('Telephone/Cellphone No.', contactNumber), colSpan: 1},
                            ],
                          ]
                        }
                },

                { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 0.5, lineColor: '#888888' }] },

                {
                    margin: [0, 10, 0, 0],
                    table: {
                        widths: ['20%', '20%', '20%', '20%', '20%',],
                        body: [
                            [{ text: 'VITAL SIGNS', style: 'sectionHeader', fillColor: '#eeeeee', alignment: 'center', colSpan: 5 }, {}, {}, {}, {}],

                            [
                                createCell('Brought By', broughtBy),
                                createCell('PhilHealth Category', philHealthCateg),
                                createCell('HMO', hmo),
                                createCell('Infirmary', infirmary),
                                createCell('Senior Citizen No.', seniorId),
                            ],

                            [
                                createCell('Blood Pressure', bp),
                                createCell('Temperature', temp),
                                createCell('Pulse', heartrate),
                                createCell('Respiratory Rate', respirate),
                                createCell('Weight (in kg)', weight),
                            ],

                            [
                                {...createCell('Patient condition upon admission' , ptCondition), colSpan: 2 },
                                {},
                                {...createCell('Chief Complaint', chiefComplaint), colSpan: 3},
                                {},
                                {},
                            ],
                        ]
                    }
                },

                  {
                    margin: [0, 10, 0, 0],
                    table: {
                        widths: ['50%', '50%', ],
                        body: [
                          [
                            {
                              ...createCell('Admitting Diagnosis'),
                              margin: [0, 0, 0, 50]
                            },

                            {
                              ...createCell('Final Diagnosis'),
                              margin: [0, 0, 0, 50]
                            },
                          ],

                          [
                            {
                              ...createCell('Brief History and Pertinent Physical Findings'),
                              margin: [0, 0, 0, 230]
                            },
                            {},
                          ],

                        ]
                    }
                },
                  {
                    columns:[
                    {
                        stack: [
                            '__________________________',
                            { text: 'CLINICAL CLERK', marginTop: 2 }
                        ],
                        alignment: 'center',
                        fontSize: 9,
                        margin: [0, 20, 0, 0]
                    },

                    {
                        stack: [
                            '__________________________',
                            { text: 'ER PHYSICIAN / RESIDENT', marginTop: 2 }
                        ],
                        alignment: 'center',
                        fontSize: 9,
                        margin: [0, 20, 0, 0]
                    },

                    {
                        stack: [
                            '__________________________',
                            { text: 'CONSULTANT', marginTop: 2 }
                        ],
                        alignment: 'center',
                        fontSize: 9,
                        margin: [0, 20, 0, 0]
                    },
                    ]
                },

                // {
                //     margin: [0, 40, 0, 0],
                //     columns: [
                //         {
                //             width: '50%',
                //             stack: [
                //                 patientSigElement,
                //                 {
                //                     text: `${firstname} ${lastname}`.toUpperCase(), fontSize: 9,
                //                     margin: [0, 0, 0, 5],
                //                     style: 'subheader', alignment: 'center', bold: true, decoration: 'underline',
                //                 },
                //                 { text: 'PATIENT / GUARDIAN', fontSize: 9, alignment: 'center' },
                //                 { text: `DATE: ${createdAt}`, fontSize: 9, alignment: 'center' }
                //             ]
                //         },

                //         {
                //             width: '50%',
                //             stack: [
                //                 personnelSigElement,
                //                 {
                //                     text: personnelName.toUpperCase(), fontSize: 9,
                //                     margin: [0, 0, 0, 5],
                //                     style: 'subheader', alignment: 'center', bold: true, decoration: 'underline',
                //                 },
                //                 { text: 'TRIAGE OFFICER', fontSize: 9, alignment: 'center' },
                //                 { text: `DATE: ${createdAt}`, fontSize: 9, alignment: 'center' }
                //             ]
                //         }
                //     ]
                // }
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
  return { generateEmergencyTreatmentPdf };
}
