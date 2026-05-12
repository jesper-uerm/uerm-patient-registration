export function printEmergencyPatientInformation() {
  const loadScript = (src) => {
    return new Promise((resolve, reject) => {
      if (document.querySelector(`script[src="${src}"]`)) {
        resolve()
        return
      }
      const script = document.createElement('script')
      script.src = src
      script.onload = resolve
      script.onerror = () => reject(new Error(`Failed to load ${src}`))
      document.body.appendChild(script)
    })
  }

  const getSignatureFromAPI = async (patientId) => {
    try {
      const response = await fetch(`http://10.107.0.2:3000/api/patients/signature/${patientId}`)
      if (!response.ok) return null

      const data = await response.json()
      return data && data.signature ? data.signature : null
    } catch (error) {
      console.warn('Failed to fetch signature:', error)
      return null
    }
  }

  const getBase64ImageFromURL = (url) => {
    return new Promise((resolve) => {
      const img = new Image()
      img.setAttribute('crossOrigin', 'anonymous')
      img.onload = () => {
        const canvas = document.createElement('canvas')
        canvas.width = img.width
        canvas.height = img.height
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0)
        resolve(canvas.toDataURL('image/png'))
      }
      img.onerror = () => {
        console.warn(`Could not load image: ${url}`)
        resolve(null)
      }
      img.src = url
    })
  }

  const initSdk = async () => {
    if (!window.pdfMake) {
      await loadScript('https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.71/pdfmake.min.js')
    }
    if (!window.pdfMake.vfs || Object.keys(window.pdfMake.vfs).length === 0) {
      await loadScript('https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.71/vfs_fonts.js')
    }
  }

  const generateTriagePatientPdf = async (patient) => {
    try {
      if (!patient) return

      await initSdk()
      const pdf = window.pdfMake

      const rightLogo = await getBase64ImageFromURL('src/assets/uerm-logo.png')
      const leftLogo = await getBase64ImageFromURL('src/assets/uerm-logo-white.png')

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

      const patientSigData = processSignature(patient.eSignature)
      const personnelSigData = processSignature(patient.personnelSignature)

      const getSignatureImage = (sigData) => {
        return sigData
          ? { image: sigData, width: 150, alignment: 'center', margin: [0, 0, 0, -5] }
          : {
              text: '(No Signature)',
              fontSize: 8,
              color: '#999',
              alignment: 'center',
              margin: [0, 15, 0, 5],
            }
      }

      const patientSigElement = getSignatureImage(patientSigData)
      const personnelSigElement = getSignatureImage(personnelSigData)

      const getLogoColumn = (imgData, align) => {
        if (imgData) return { image: imgData, width: 60, alignment: align }
        return { text: '', width: 60 }
      }

      const createCell = (label, value) => ({
        stack: [
          {
            text: label.toUpperCase(),
            fontSize: 7,
            bold: true,
            color: '#888888',
            margin: [0, 0, 0, 4],
          },
          {
            text: String(value || '-'),
            fontSize: 10,
            bold: true,
            color: '#333333',
            margin: [0, 0, 0, 1],
          },
        ],
        margin: [0, 0, 0, 0],
      })

      const patient_id = patient.PATIENTREGID || '-'
      const lastname = (patient.LASTNAME || 'UNKNOWN').toUpperCase()
      const firstname = (patient.FIRSTNAME || 'UNKNOWN').toUpperCase()
      const middlename = (patient.MIDDLENAME || '').toUpperCase()
      const fullName = `${firstname} ${lastname}`.toUpperCase()

      const birthdate = patient.BIRTHDATE
        ? new Date(patient.BIRTHDATE)
            .toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })
            .toUpperCase()
        : '-'

      const age = patient.AGE ? patient.AGE.toString() : '-'
      const sex = (patient.SEX || patient.GENDER || '-').toUpperCase()
      const weight = (patient.WEIGHT || '-').toString().toUpperCase()
      const civilStatus = (patient.CIVILSTATUS || '-').toUpperCase()

      const contactPerson = (patient.CPNAME || '-').toUpperCase()
      const contactAddress = (patient.CPADDRESS || '-').toUpperCase()
      const contactNumber =
        [patient.CPMOBILE, patient.CPLANDLINE].filter(Boolean).join(' - ') || '-'

      const broughtBy = (patient.BROUGHTBY || '-').toUpperCase()
      const philHealthCateg = (patient.PHILHEALTHCATEG || '-').toUpperCase()
      const hmo = (patient.HMO || '-').toUpperCase()
      const infirmary = (patient.INFIRMARY || '-').toUpperCase()
      const seniorId = (patient.SENIORID || '-').toUpperCase()

      const temp = (patient.TEMP || '-').toString().toUpperCase()
      const heartrate = (patient.HEARTRATE || '-').toString().toUpperCase()
      const oxygen = (patient.OXYGEN || '-').toString().toUpperCase()
      const bp = (patient.BP || '-').toUpperCase()
      const respirate = (patient.RESPIRATE || '-').toString().toUpperCase()
      const painScore = (patient.PAINSCORE || '-').toString().toUpperCase()
      const avpu = (patient.AVPU || '-').toUpperCase()
      const ptCondition = (patient.PTCONDITION || '-').toUpperCase()
      const chiefComplaint = (patient.CHIEFCOMPLAINT || '-').toUpperCase()

      const contagious = (patient.CONTAGIOUS || '-').toUpperCase()
      const isolation = (patient.ISOLATION || '-').toUpperCase()
      const symptoms = (patient.SYMPTOMS || '-').toUpperCase()
      const cpd = (patient.CPD || '-').toUpperCase()
      const level = (patient.LEVEL || '-').toUpperCase()
      const remarks = (patient.REMARKS || '-').toUpperCase()

      const personnelName = patient.PERSONNEL || patient.PERSONNEL_NAME || 'Triage Officer'
      const signatureData = await getSignatureFromAPI(patient.patientId || patient.id)
      const createdAt = patient.CREATEDAT
        ? new Date(patient.CREATEDAT)
            .toLocaleDateString('en-US', {
              timeZone: 'Asia/Manila',
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })
            .toUpperCase()
        : '-'

      const docDefinition = {
        pageMargins: [30, 30, 30, 30],
        info: { title: `Record_${firstname}_${lastname}` },

        content: [
          // PAGE 1: TRIAGE FORM
          {
            columns: [
              {
                ...getLogoColumn(leftLogo, 'right'),
                margin: [0, 12, 0, 0],
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
                  },
                ],
              },
              getLogoColumn(rightLogo, 'right'),
            ],
            margin: [0, 0, 0, 10],
          },

          { text: 'TRIAGE FORM', style: 'headerTitle', alignment: 'center' },

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
                  {},
                  {},
                  {},
                ],
                [
                  createCell('Name', `${firstname} ${middlename} ${lastname}`.trim()),
                  createCell('Birthdate', birthdate),
                  createCell('Age', age),
                  createCell('Sex', sex),
                ],
                [{ ...createCell('Chief Complaint', chiefComplaint), colSpan: 4 }, {}, {}, {}],
              ],
            },
          },

          {
            canvas: [
              { type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 0.5, lineColor: '#888888' },
            ],
          },

          {
            margin: [0, 10, 0, 0],
            table: {
              widths: ['25%', '25%', '25%', '25%'],
              body: [
                [
                  {
                    text: 'VITAL SIGNS',
                    style: 'sectionHeader',
                    fillColor: '#eeeeee',
                    alignment: 'center',
                    colSpan: 4,
                  },
                  {},
                  {},
                  {},
                ],
                [
                  createCell('Temperature', temp + ' °C'),
                  createCell('Heart Rate', heartrate + ' bpm'),
                  createCell('Oxygen Saturation', oxygen + '%'),
                  createCell('Blood Pressure', bp + ' mmHg'),
                ],
                [
                  { ...createCell('Respiratory Rate', respirate + ' breaths/min'), colSpan: 1 },
                  { ...createCell('Pain Score', painScore), colSpan: 1 },
                  { ...createCell('AVPU Scale', avpu), colSpan: 2 },
                  {},
                ],
                [
                  { ...createCell('Contagious Screening', contagious), colSpan: 2 },
                  {},
                  { ...createCell('Symptoms', symptoms), colSpan: 1 },
                  { ...createCell('Isolation Precaution', isolation), colSpan: 1 },
                ],
                [
                  { ...createCell('CP Distress', cpd), colSpan: 1 },
                  { ...createCell('Triage-Level', level), colSpan: 1 },
                  { ...createCell('Remarks', remarks), colSpan: 2 },
                  {},
                ],
              ],
            },
          },

          {
            margin: [0, 40, 0, 0],
            columns: [
              {
                width: '50%',
                stack: [
                  patientSigElement,
                  {
                    text: `${firstname} ${lastname}`.toUpperCase(),
                    fontSize: 9,
                    margin: [0, 0, 0, 5],
                    style: 'subheader',
                    alignment: 'center',
                    bold: true,
                    decoration: 'underline',
                  },
                  { text: 'PATIENT / GUARDIAN', fontSize: 9, alignment: 'center' },
                  { text: `DATE: ${createdAt}`, fontSize: 9, alignment: 'center' },
                ],
              },
              {
                width: '50%',
                stack: [
                  personnelSigElement,
                  {
                    text: personnelName.toUpperCase(),
                    fontSize: 9,
                    margin: [0, 0, 0, 5],
                    style: 'subheader',
                    alignment: 'center',
                    bold: true,
                    decoration: 'underline',
                  },
                  { text: 'TRIAGE OFFICER', fontSize: 9, alignment: 'center' },
                  { text: `DATE: ${createdAt}`, fontSize: 9, alignment: 'center' },
                ],
              },
            ],
          },

          // PAGE 2: TREATMENT SHEET
          {
            pageBreak: 'before',
            columns: [
              {
                text: [
                  'CTRL. NO.: ',
                  {
                    text: patient_id ? patient_id.toString() : '______________',
                    color: 'red',
                    bold: true,
                  },
                ],
                alignment: 'right',
                fontSize: 9,
                margin: [0, 8, 10, 15],
              },
            ],
          },
          {
            columns: [
              {
                ...getLogoColumn(leftLogo, 'right'),
                margin: [0, 12, 0, 0],
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
                  },
                ],
              },
              getLogoColumn(rightLogo, 'left'),
            ],
            margin: [0, 0, 0, 10],
          },

          {
            columns: [
              {
                text: 'CASE NO.:  _____________________________',
                alignment: 'left',
                fontSize: 9,
                margin: [0, 0, 10, 12],
              },

              {
                text: 'DATE AND TIME OF ADMISSION:  _____________________________',
                alignment: 'right',
                fontSize: 9,
                margin: [0, 0, 10, 12],
              },
            ],
          },

          { text: 'EMERGENCY ROOM TREATMENT SHEET', style: 'headerTitle', alignment: 'center' },

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
                  {},
                  {},
                  {},
                ],
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
                  createCell('Ward/Room No. ', ''),
                ],
                [
                  {
                    ...createCell('Person to notify in case of emergency', contactPerson),
                    colSpan: 1,
                  },
                  { ...createCell('Complete Address', contactAddress), colSpan: 2 },
                  {},
                  { ...createCell('Telephone/Cellphone No.', contactNumber), colSpan: 1 },
                ],
              ],
            },
          },

          {
            canvas: [
              { type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 0.5, lineColor: '#888888' },
            ],
          },

          {
            margin: [0, 10, 0, 0],
            table: {
              widths: ['20%', '20%', '20%', '20%', '20%'],
              body: [
                [
                  {
                    text: 'VITAL SIGNS',
                    style: 'sectionHeader',
                    fillColor: '#eeeeee',
                    alignment: 'center',
                    colSpan: 5,
                  },
                  {},
                  {},
                  {},
                  {},
                ],

                [
                  createCell('Brought By', broughtBy),
                  createCell('PhilHealth Category', philHealthCateg),
                  createCell('HMO', hmo),
                  createCell('Infirmary', infirmary),
                  createCell('Senior Citizen No.', seniorId),
                ],

                [
                  createCell('Blood Pressure', bp + ' mmHg'),
                  createCell('Temperature', temp + ' °C'),
                  createCell('Pulse', heartrate + ' bpm'),
                  createCell('Respiratory Rate', respirate + ' breaths/min'),
                  createCell('Weight (in kg)', weight + ' kg'),
                ],

                [
                  { ...createCell('Patient condition upon admission', ptCondition), colSpan: 2 },
                  {},
                  { ...createCell('Chief Complaint', chiefComplaint), colSpan: 3 },
                  {},
                  {},
                ],
              ],
            },
          },

          {
            margin: [0, 10, 0, 0],
            table: {
              widths: ['50%', '50%'],
              body: [
                [
                  {
                    ...createCell('Admitting Diagnosis'),
                    margin: [0, 0, 0, 30],
                  },
                  {
                    ...createCell('Final Diagnosis'),
                    margin: [0, 0, 0, 30],
                  },
                ],
                [
                  {
                    ...createCell('Brief History and Pertinent Physical Findings'),
                    margin: [0, 0, 0, 200],
                    colSpan: 2,
                  },
                  {},
                ],
              ],
            },
          },

          {
            columns: [
              {
                stack: ['__________________________', { text: 'CLINICAL CLERK', marginTop: 2 }],
                alignment: 'center',
                fontSize: 9,
                margin: [0, 20, 0, 0],
              },
              {
                stack: [
                  '__________________________',
                  { text: 'ER PHYSICIAN / RESIDENT', marginTop: 2 },
                ],
                alignment: 'center',
                fontSize: 9,
                margin: [0, 20, 0, 0],
              },
              {
                stack: ['__________________________', { text: 'CONSULTANT', marginTop: 2 }],
                alignment: 'center',
                fontSize: 9,
                margin: [0, 20, 0, 0],
              },
            ],
          },

          // PAGE 3: CONSENT
          {
            pageBreak: 'before',
            columns: [
              {
                ...getLogoColumn(leftLogo, 'right'),
                margin: [0, 12, 0, 0],
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
                    margin: [0, 2, 0, 10],
                  },
                ],
              },
              getLogoColumn(rightLogo, 'right'),
            ],
            margin: [0, 0, 0, 10],
          },
          {
            stack: [
              {
                text: 'DATA PRIVACY ACT',
                style: 'headerTitle',
                alignment: 'center',
                margin: [0, 10, 0, 0],
              },
              {
                text: 'PATIENT CONSENT FORM',
                style: 'headerTitle',
                alignment: 'center',
                margin: [0, 0, 0, 15],
              },
            ],
          },

          {
            stack: [
              {
                text: [
                  {
                    text: 'As a patient of the Medical Center and as data subject protected under Republic Act 10173 or the Data Privacy Act of 2012, I hereby consent to the following',
                    fontSize: 11,
                  },
                  {
                    text: '(Bilang pasyente ng Medical Center at data subject na protektado ng Republic Act 10173 o and Data Privacy Act of 2012, aking pinahihintulutan ang mga sumusuno): ',
                    fontSize: 9,
                    italics: true,
                  },
                ],
                margin: [0, 0, 0, 10],
                alignment: 'justify',
              },
              {
                text: [
                  {
                    text: '1. That the collection and processing of my personal information are for the purpose of diagnosis, treatment and overall medical management which shall include taking of clinical photographs and videos by the medical team and authorized hospital staff. ',
                    fontSize: 11,
                  },
                  {
                    text: ' (Ang pagkolekta at pagproseso ng aking peronal na impormasyon ay para sa layunin ng pagsusuri, gamutan, at pangkahalatang pamamahalang-medikal kasama ang pagkuha ng litrato at video kung kinakailangan ng medical team o awtorisadong kawani ng ospital.) ',
                    fontSize: 9,
                    italics: true,
                  },
                ],
                margin: [0, 0, 0, 10],
                alignment: 'justify',
              },
              {
                text: [
                  {
                    text: '2. That the retention of my personal information including medical records shall be within the  duration of my consultation, medical procedure or confinement and may extend for longer periods for historical, statistical or scientific purposes and as required by laws or regulations',
                    fontSize: 11,
                  },
                  {
                    text: ' (Ang aking personal na impormasyon at medical records ay mananatili lamang sa Medical Center sa panahon nh aking konsultasyon, medical procedure o confinement ngunit maaring mas tumagal pa para sa historical, statistical o siyentipikong layunin o ayon sa hinihingi ng batas or regulasyon)',
                    fontSize: 9,
                    italics: true,
                  },
                ],
                margin: [0, 0, 0, 10],
                alignment: 'justify',
              },

              {
                text: [
                  {
                    text: '3. That may personal information may be subjected to automated processing including, but not limited to Electronic Health Records, profiling and other data analytics tool for purposes of corporate governance and improving patient services ',
                    fontSize: 11,
                  },
                  {
                    text: '(Ang aking personal na impormasyon ay maaring sumailalim sa awtomatikong proseso kabilang ngunit hindi limitado sa Electronic Health Records, profiling at iba pang analitikal na pagpopoproseso para sa pagpapabuti ng serbisyo sa mga pasyente)',
                    fontSize: 9,
                    italics: true,
                  },
                ],
                margin: [0, 0, 0, 10],
                alignment: 'justify',
              },

              {
                text: [
                  {
                    text: '4. That I am subjected to the Medical Centers Closed Circuit Television (CCTV) surveillance system as necessary in the implementation of patient safety and security measures for the general welfare of its stakeholders and of the public, in accordance with the guidelines set forth by laws and regulations ',
                    fontSize: 11,
                  },
                  {
                    text: '(Ako ay sumasailalim sa Closed Circuit Television (CCTV) surveilance system ng Medical Center na kinakailangan sa pagpapatupad ng mga hakbang sa kaligtasan ng pasyente at seguridad ng publiko, alinsunod sa mga patnubay na itinakda ng batas at regulasyon)',
                    fontSize: 9,
                    italics: true,
                  },
                ],
                margin: [0, 0, 0, 10],
                alignment: 'justify',
              },

              {
                text: [
                  {
                    text: '5. That my personal information, including medical results, shall be released to the following, as may be applicable and for legitimate purposes only ',
                    fontSize: 11,
                  },
                  {
                    text: '(Ang aking personal na impormasyon, kabilang ang medikal na resulta, ay ibibigay sa mga sumusunod ayon sa angkop at lehitimong layunin lamang)',
                    fontSize: 9,
                    italics: true,
                  },
                ],
                margin: [0, 0, 0, 10],
                alignment: 'justify',
              },
              {
                text: [
                  {
                    text: 'a. Parent, guardian, or disclosed person responsible for purposes of informed decision-making, or to any other person that I may authorize in writing for reasons privy to us\n',
                    fontSize: 11,
                  },
                  {
                    text: '(Magulang, tagasubaybay, taong binanggit bilang responsable upang magdesisyon, o sinumang tao na aking pinahihintulutan sa pamamagitan ng nasusulat na awtorisasyon)\n',
                    fontSize: 9,
                    italics: true,
                  },

                  {
                    text: 'b. Doctors and other health care practitioners of the Medical Center who are considered part of the medical team attending to my case',
                    fontSize: 11,
                  },
                  {
                    text: '(Mga doktor at iba pang health care practitioner ng Medical Center na itinuturing na bahagi ng aking medical team)\n',
                    fontSize: 9,
                    italics: true,
                  },

                  {
                    text: 'c. Residents, Post-Graduate Interns (PGI), students doing clinical work, interns from affiliated institutions, and academic researchers of the Medical Center for purposes of case conferences, training, and research for the furtherance of patient welfare, health care, and the medical field; medical and health professions education, subject to ethical standards of research and guidelines set forth by the National Privacy Commission (NPC)',
                    fontSize: 11,
                  },
                  {
                    text: '(Mga residente, Post-Graduate Interns (PGI), mga mag-aaral na sumasailalim sa klinikal na pagsasanay, interns mula sa mga kaanib na institusyon, at academic researchers ng Medical Center para sa mga case conference, pagsasanay, at pananaliksik para sa pagsulong ng kapakanan ng pasyente, pangangalagang pangkalusugan, at larangan ng medisina; edukasyon sa medisina at iba pang propesyong pangkalusugan, alinsunod sa mga etikal na pamantayan ng pananaliksik at mga alituntuning itinakda ng National Privacy Commission (NPC))\n',
                    fontSize: 9,
                    italics: true,
                  },

                  {
                    text: 'd. Affiliated institutions and other health care institutions in case of referrals or transfers',
                    fontSize: 11,
                  },
                  {
                    text: '(Mga kaanib na institusyon at iba pang institusyong pangkalusugan kung sakaling magkaroon ng referral o paglipat)\n\n',
                    fontSize: 9,
                    italics: true,
                  },

                  {
                    text: 'e. Outsourced systems and service providers of the Medical Center for medical procedures subject of such contract agreements, provided that a Data Sharing Agreement shall be executed by the contracting parties',
                    fontSize: 11,
                  },
                  {
                    text: '(Mga third-party service provider ng Medical Center para sa mga medikal na pamamaraan na saklaw ng mga kasunduang kontrata, sa kondisyon na ang isang Data Sharing Agreement ay maisasakatuparan ng mga partidong nakipagkontrata)\n',
                    fontSize: 9,
                    italics: true,
                  },

                  {
                    text: 'f. Private institutions for health and life insurance and other pecuniary claims in which I may have a legal interest',
                    fontSize: 11,
                  },
                  {
                    text: '(Mga pribadong institusyon para sa health at life insurance at iba pang mga paghahabol na pinansyal kung saan ako ay maaaring may legal na interes)\n',
                    fontSize: 9,
                    italics: true,
                  },

                  {
                    text: 'g. Government and Non-Government Organizations (NGOs) for medical benefits and financial assistance to which I am entitled',
                    fontSize: 11,
                  },
                  {
                    text: '(Mga ahensya ng pamahalaan at Non-Government Organizations (NGO) para sa mga benepisyong medikal at tulong pinansyal na patungkol sa akin)\n',
                    fontSize: 9,
                    italics: true,
                  },

                  {
                    text: 'h. Donors who provided funds for which I am a beneficiary and the Medical Center',
                    fontSize: 11,
                  },
                  {
                    text: '(Mga sponsor ng pondo kung saan ako ay isang benepisyaryo at ang Medical Center)\n',
                    fontSize: 9,
                    italics: true,
                  },

                  {
                    text: 'i. Courts of law, government authorities, and regulatory bodies, if necessary, for compliance with a legal obligation to which the Medical Center, as the Personal Information Controller (PIC), is subject, including the protection of lawful rights and defense of legal claims, protection of vitally important interests of data subjects, or when necessary to respond to national emergencies and requirements of public order and safety',
                    fontSize: 11,
                  },
                  {
                    text: '(Mga hukuman, awtoridad ng pamahalaan, at mga regulatory body kung kinakailangan para sa pagsunod sa legal na obligasyon ng Medical Center bilang Personal Information Controller (PIC), kabilang ang pagprotekta at pagtatanggol sa mga karapatan at legal na paghahabol, pagprotekta sa mahahalagang interes ng mga data subject, o kung kinakailangan upang tumugon sa national emergency at mapanatili ang kaayusan at kaligtasan ng publiko)\n',
                    fontSize: 9,
                    italics: true,
                  },

                  {
                    text: 'j. Other Medical Personnel on a need-to-know basis and as far as necessary in the delivery of services, fulfilllment of a contract, or for the legititmate interests pursued by the Medical Center or by a third party to whom the data is disclosed, except where such interests are overridden by fundamental rights under the Philippine Constitution ',
                    fontSize: 11,
                  },
                  {
                    text: '(Iba pang kawani ng Medical Center kung kinakailangan sa paghahatid ng serbisyo, pagtupad ng kontrata o para sa mga lehitimong interes ng Medical Center o third-party, maliban kung ang mga naturang interes ay maituturing na paglabag sa karapatang pantao sa ilalim ng Konstitusyon ng Pilipinas)\n',
                    fontSize: 9,
                    italics: true,
                  },
                ],
                margin: [15, 0, 0, 10],
                alignment: 'justify',
              },

              {
                text: [
                  {
                    text: 'Further, I acknowledge ',
                    fontSize: 11,
                  },
                  {
                    text: '(Karagdagang sinsang-ayunan ko):\n',
                    fontSize: 9,
                    italics: true,
                  },
                  {
                    text: '1. That the Privacy Notice has been made available to me upon presentment of this consent form ',
                    fontSize: 11,
                  },

                  {
                    text: '(Na ang Privacy Notice ay ipinagbigay alam sa akin kasabay ng dokumentong ito)\n',
                    fontSize: 9,
                    italics: true,
                  },

                  {
                    text: '2. That the Consent for Treatment and Waiver of Responsibility are seperate and distinct documents from this consent form ',
                    fontSize: 11,
                  },
                  {
                    text: '(Na ang Consent for Treatment at Waiver of Responsibility ay iba at hiwalay na dokumento)\n',
                    fontSize: 9,
                    italics: true,
                  },

                  {
                    text: '3. That this consent form shall remain valid until withdrawn in writing and afte rdue notification to the Medical Center ',
                    fontSize: 11,
                  },
                  {
                    text: '(Na ang consent form na ito ay mananatiling epektibo hanggang sa bawiin sa pamamagitan ng nasusulat na abiso sa Medical Center)\n',
                    fontSize: 9,
                    italics: true,
                  },

                  {
                    text: '4. That all personnel are also data subjects protected by the Medical Center - as such, collection of their personal information including taking of photos and videos without their consent is prohibited and is punishable under the Data Privacy Act of 2012 ',
                    fontSize: 11,
                  },
                  {
                    text: '(Na lahat ng kawani ay itinuturing na data subject na protektado ng Medical Center - dahil dito, ang pagkolekta ng kanilang personal na impormasyon kasama ang pagkuha ng mga litrato at video nang walang pahintulot ay ipinagbabawal at may parusa sa ilalim ng Data Privacy Act of 2012)',
                    fontSize: 9,
                    italics: true,
                  },
                ],
                margin: [0, 0, 0, 10],
                alignment: 'justify',
              },
              {
                text: 'By signing below, I acknowledge that I have read and understood this Data Privacy Consent form and fully agree to its terms.',
                italics: true,
                fontSize: 9,
                alignment: 'center',
                margin: [0, 0, 0, 40],
              },
            ],
          },

          {
            columns: [
              {
                width: '*',
                alignment: 'center',
                stack: [
                  {
                    height: 60,
                    alignment: 'center',
                    stack: [
                      signatureData
                        ? {
                            image: signatureData,
                            fit: [150, 60],
                            alignment: 'center',
                          }
                        : { text: '', height: 60 },
                    ],
                  },

                  {
                    text: fullName.toUpperCase(),
                    fontSize: 9,
                    bold: true,
                    alignment: 'center',
                    margin: [0, 0, 0, 2],
                  },

                  {
                    canvas: [{ type: 'line', x1: 0, y1: 0, x2: 180, y2: 0, lineWidth: 1 }],
                    alignment: 'center',
                    margin: [0, 0, 0, 4],
                  },

                  {
                    text: 'Patient / Guardian Signature',
                    fontSize: 9,
                    color: '#444444',
                    alignment: 'center',
                    margin: [0, 0, 0, 2],
                  },
                  {
                    text: `Date Signed: ${createdAt}`,
                    fontSize: 8,
                    italics: true,
                    color: '#666666',
                    alignment: 'center',
                  },
                ],
              },

              {
                width: '*',
                alignment: 'center',
                stack: [
                  {
                    text: '',
                    height: 60,
                  },

                  {
                    text: '______________________',
                    fontSize: 11,
                    color: 'white',
                    alignment: 'center',
                    margin: [0, 45, 0, 2],
                  },

                  {
                    canvas: [{ type: 'line', x1: 0, y1: 0, x2: 180, y2: 0, lineWidth: 1 }],
                    alignment: 'center',
                    margin: [0, 0, 0, 4],
                  },

                  {
                    text: 'Witness Signature',
                    fontSize: 9,
                    color: '#444444',
                    alignment: 'center',
                    margin: [0, 0, 0, 2],
                  },
                  {
                    text: `Date Signed: ${createdAt}`,
                    fontSize: 8,
                    italics: true,
                    color: '#666666',
                    alignment: 'center',
                  },
                ],
              },
            ],
          },
        ],

        styles: {
          header: { fontSize: 10, bold: true, margin: [5, 15, 5, 0] },
          headerTitle: { fontSize: 12, bold: true, margin: [5, 5, 5, 0] },
          subheader: { fontSize: 8, italics: true },
          sectionTitle: { fontSize: 14, bold: true, margin: [0, 10, 0, 0] },
          sectionHeader: { fontSize: 9, bold: true, letterSpacing: 1 },
        },
      }

      pdf.createPdf(docDefinition).open()
    } catch (err) {
      console.error('PDF Generation Error:', err)
      alert('PDF Error: ' + err.message)
    }
  }

  return { generateTriagePatientPdf }
}
