export function printOutpatientInformation() {

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

  const generatePatientPdf = async (patient) => {
    try {
      if (!patient) return;

      await initSdk();
      const pdf = window.pdfMake;

      const rightLogo = await getBase64ImageFromURL('src/assets/uerm-logo.png');
      const leftLogo = await getBase64ImageFromURL('src/assets/uermmc-blue-logo.png');

      let signatureData = null;

      if (patient.eSignature) {
        let rawSig = patient.eSignature;
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
          if (finalSigString.startsWith('data:image')) {
            signatureData = finalSigString;
          } else {
            signatureData = `data:image/png;base64,${finalSigString}`;
          }
        }
      }

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

      const lastname = patient.lastName || 'Unknown';
      const firstname = [patient.firstName, patient.suffix].filter(Boolean).join(' ') || 'Unknown';
      const middlename = patient.middleName || '-';
      const birthdate = patient.birthdate ? new Date(patient.birthdate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : '-';
      const age = patient.age ? patient.age.toString() : '-';
      const sex = patient.gender || patient.sex || '-';
      const civilStatus = patient.civilStatus || '-';
      const nationality = patient.nationality || '-';
      const religion = patient.religion || '-';
      const birthplace = patient.birthplace || '-';

      const landline = patient.landline || '-';
      const mobile = patient.mobile || '-';

      const presentAddress = [
            patient.addressStreet,
            patient.addressBarangay,
            patient.addressCity,
            patient.addressProvince,
            patient.addressRegion ]
            .filter(part => part && part.trim() !== '')
            .join(', ') || '-';
      const permanentAddress = patient.addressPermanent || '-';

      const cpName = patient.cpName || '-';
      const cpRelationship = patient.cpRelationship || '-';
      const cpLandline = patient.cpLandline || '-';
      const cpMobile = patient.cpMobile || '-';

      const medicalProcedure = patient.medicalProcedure || '-';
      const physician = patient.physician || '-';

      const philHealth = patient.philHealth ? patient.philHealth.replace(/["[\]]/g, '') : '-';
      const hmo = patient.hmo || '-';
      const scidnoOutpatient = patient.scidnoOutpatient || '-';

      const signatureElement = signatureData
        ? { image: signatureData, width: 150, alignment: 'center', margin: [0, 0, 0, 2] }
        : { text: '(Signature Not Available)', fontSize: 9, color: '#999', alignment: 'center', margin: [0, 0, 0, 10] };

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
                  {
                    text: 'UNIVERSITY OF THE EAST RAMON MAGSAYSAY MEMORIAL MEDICAL CENTER, INC.',
                    style: 'header',
                    alignment: 'center',
                  },
                  {
                    text: '64 Aurora Blvd, Doña Imelda, Quezon City, 1113 Metro Manila',
                    style: 'subheader',
                    alignment: 'center',
                    margin: [0, 2, 0, 0],
                  },
                  {
                    text: 'Telephone: +632 715 0861-77 local 215      Website: https://www.uerm.edu.ph',
                    style: 'subheader',
                    alignment: 'center',
                    margin: [0, 2, 0, 0],
                  }
                ]
              },
              getLogoColumn(rightLogo, 'right')
            ],
            margin: [0, 0, 0, 10]
          },

          {
            text: 'OUTPATIENT FORM',
            style: 'headerTitle',
            alignment: 'center',
          },

          {
            margin: [0, 10, 0, 0],
            table: {
              widths: ['25%', '25%', '25%', '25%'],
              body: [
                [
                  {
                    text: 'PATIENT INFORMATION',
                    fillColor: '#eeeeee',
                    style: 'sectionHeader',
                    alignment: 'center',
                    colSpan: 4,
                  },
                  {}, {}, {}
                ],
                [
                  createCell('Last Name', lastname),
                  createCell('First Name', firstname),
                  createCell('Middle Name', middlename),
                  createCell('Sex', sex),
                ],
                [
                  createCell('Birthdate', birthdate),
                  createCell('Age', age),
                  createCell('Birthplace', birthplace),
                  createCell('Civil Status', civilStatus),

                ],
                [
                  createCell('Religion', religion),
                  createCell('Nationality', nationality),
                  createCell('Landline', landline),
                  createCell('Mobile', mobile),
                ],

                [
                  { ...createCell('Present Address', presentAddress), colSpan: 2 },
                  {},
                  { ...createCell('Permanent Address', permanentAddress), colSpan: 2 },
                  {}
                ],
                  [
                  { ...createCell('Philhealth', philHealth), colSpan: 2 },
                  {},
                  { ...createCell('HMO', hmo), colSpan: 1 },
                  { ...createCell('SC ID No. / PWD ID No.', scidnoOutpatient), colSpan: 1 },
                ],
              ]
            }
          },

          { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 0.5, lineColor: '#888888' }] },

          {
            margin: [0, 10, 0, 0],
            table: {
              widths: ['25%', '25%', '25%', '25%'],
              body: [
                [
                  {
                    text: 'PERSONS / PARTIES RESPONSIBLE FOR THE ACCOUNT OTHER THAN THE PATIENT',
                    style: 'sectionHeader',
                    fillColor: '#eeeeee',
                    margin: [0, 0, 0, 0],
                    alignment: 'center',
                    colSpan: 4,
                  },
                  {}, {}, {},
                ],
                [
                  createCell('Full Name', cpName),
                  createCell('Mobile No.', cpMobile),
                  createCell('Landline No.', cpLandline),
                  createCell('Relationship', cpRelationship),
                ],
              ]
            }
          },

          {
            margin: [0, 10, 0, 0],
            table: {
              widths: ['50%', '50%'],
              body: [
                [
                  {
                    text: 'MEDICAL PROCEDURE',
                    style: 'sectionHeader',
                    fillColor: '#eeeeee',
                    margin: [0, 0, 0, 0],
                    alignment: 'center',
                    colSpan: 2,
                  },
                  {},
                ],
                [
                  createCell('Procedure ', medicalProcedure),
                  createCell('Attending Physician', physician),
                ],
              ]
            }
          },

          {
            margin: [0, 50, 0, 0],
            columns: [
              { width: '*', text: '' },
              {
                width: 150,
                stack: [
                  signatureElement,
                  {
                    text: `${firstname} ${lastname}`.toUpperCase(),
                    style: 'subheader',
                    alignment: 'center',
                    bold: true,
                    margin: [0, 0, 0, 5]
                  },
                  {
                    canvas: [{ type: 'line', x1: 0, y1: 0, x2: 150, y2: 0, lineWidth: 1 }]
                  },
                  {
                    text: 'SIGNATURE OVER PRINTED NAME',
                    style: 'subheader',
                    alignment: 'center',
                    margin: [0, 5, 0, 0]
                  },
                  {
                    text: `DATE: ${createdAt}`,
                    fontSize: 8,
                    alignment: 'center',
                    margin: [0, 3, 0, 0]
                  }
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
