export const SAMPLE_REPORTS = [
  {
    id: 'cbc-routine',
    title: 'Complete Blood Count (CBC)',
    category: 'Hematology',
    date: '12 Nov 2026',
    overallStatus: 'normal',
    patientContext: 'Routine Wellness Checkup • Fasting Sample',
    summary:
      'Your Complete Blood Count checks the primary cells circulating in your bloodstream. Red blood cells transport oxygen throughout your body, white blood cells act as your immune defense against illness, and platelets help your blood clot safely when injured.\n\nAll your key cell counts fall within healthy standard reference targets. There are no signs of anemia or active infection in this panel.',
    keyFindings: [
      'Hemoglobin and red blood cell counts are optimal, indicating good oxygen-carrying capacity.',
      'White blood cell count is within normal limits, showing no signs of acute bacterial or viral infection.',
      'Platelet counts are healthy, supporting proper blood clotting and wound repair.',
      'No critical red flags detected in this baseline profile.'
    ],
    metrics: [
      {
        name: 'Hemoglobin (Hb)',
        value: '14.2',
        unit: 'g/dL',
        standardRange: '13.0 - 17.0',
        status: 'normal',
        category: 'Oxygen Transport',
        simpleExplanation:
          'Hemoglobin is the iron-rich protein inside your red blood cells that carries vital oxygen from your lungs to the rest of your body.'
      },
      {
        name: 'Packed Cell Volume (Hematocrit)',
        value: '43.0',
        unit: '%',
        standardRange: '38.0 - 50.0',
        status: 'normal',
        category: 'Red Cells',
        simpleExplanation:
          'Hematocrit measures the percentage of your blood that consists of red blood cells. A normal value means your blood has a healthy density.'
      },
      {
        name: 'Total Leukocyte Count (WBC)',
        value: '6,800',
        unit: '/mcL',
        standardRange: '4,500 - 11,000',
        status: 'normal',
        category: 'Immune Defense',
        simpleExplanation:
          'White blood cells are your body’s defense squad against bacterial and viral invaders. Your count shows a calm, balanced immune system.'
      },
      {
        name: 'Platelet Count',
        value: '265,000',
        unit: '/mcL',
        standardRange: '150,000 - 450,000',
        status: 'normal',
        category: 'Clotting',
        simpleExplanation:
          'Platelets are small cell fragments that clump together to stop bleeding if you get a scratch or cut.'
      },
      {
        name: 'Neutrophils',
        value: '58',
        unit: '%',
        standardRange: '40 - 70',
        status: 'normal',
        category: 'Immune Sub-cells',
        simpleExplanation:
          'The first-responder white blood cells that fight bacterial infections. Your proportion is standard.'
      },
      {
        name: 'Lymphocytes',
        value: '32',
        unit: '%',
        standardRange: '20 - 40',
        status: 'normal',
        category: 'Immune Sub-cells',
        simpleExplanation:
          'Specialized immune cells that create antibodies and provide long-term viral immunity.'
      }
    ],
    questionsForDoctor: [
      'Does this blood count suggest I need to continue my current multivitamin or iron supplement?',
      'How frequently do you recommend repeating this routine panel for preventative monitoring?',
      'Are there any lifestyle or dietary adjustments to maintain these healthy counts?'
    ],
    glossary: [
      {
        term: 'CBC (Complete Blood Count)',
        definition: 'A fundamental lab test evaluating cells that make up your blood: red cells, white cells, and platelets.'
      },
      {
        term: 'Reference Interval',
        definition: 'The statistical range of values found in 95% of healthy individuals for a specific test.'
      },
      {
        term: 'Anemia',
        definition: 'A condition where blood has lower than normal red blood cells or hemoglobin, leading to fatigue.'
      }
    ],
    rawTextSnippet:
      'LABORATORY INVESTIGATION REPORT\nPatient Ref: DEMO-CBC-901\nTest: Complete Blood Count\nMethod: Automated Cell Counter (Sysmex XN-1000)\n----------------------------------------\nHemoglobin: 14.2 g/dL (Ref: 13.0 - 17.0)\nPCV / Hematocrit: 43.0 % (Ref: 38.0 - 50.0)\nTotal WBC: 6,800 /mcL (Ref: 4,500 - 11,000)\nPlatelet Count: 265,000 /mcL (Ref: 150,000 - 450,000)\nNeutrophils: 58 % (Ref: 40 - 70)\nLymphocytes: 32 % (Ref: 20 - 40)\nEosinophils: 3 % (Ref: 1 - 6)\nMonocytes: 7 % (Ref: 2 - 8)\nStatus: Normal blood film, no abnormal cells seen.'
  },
  {
    id: 'lipid-profile',
    title: 'Lipid / Cholesterol Panel',
    category: 'Cardiovascular Health',
    date: '10 Nov 2026',
    overallStatus: 'attention_needed',
    patientContext: '12-Hour Fasting Blood Sample • Cardiac Screening',
    summary:
      'A lipid profile measures fatty substances (cholesterol and triglycerides) circulating in your blood. These fats are essential for building cells and hormones, but unbalanced levels can affect cardiovascular wellness.\n\nYour results show mildly elevated Total Cholesterol and LDL (“bad”) cholesterol, while your protective HDL (“good”) cholesterol remains within a desirable healthy range. These numbers highlight an opportunity for dietary and lifestyle tuning.',
    keyFindings: [
      'Total Cholesterol is mildly elevated at 218 mg/dL (desirable is below 200 mg/dL).',
      'LDL (“bad”) Cholesterol is above the standard target at 142 mg/dL.',
      'HDL (“good”) Cholesterol is healthy at 52 mg/dL, offering natural cardiovascular protection.',
      'Triglycerides are normal at 120 mg/dL.'
    ],
    metrics: [
      {
        name: 'Total Cholesterol',
        value: '218',
        unit: 'mg/dL',
        standardRange: '< 200',
        status: 'high',
        category: 'Blood Fats',
        simpleExplanation:
          'The total amount of cholesterol in your blood. Mildly elevated values are common and usually managed with diet and activity.'
      },
      {
        name: 'LDL Cholesterol ("Bad")',
        value: '142',
        unit: 'mg/dL',
        standardRange: '< 100',
        status: 'high',
        category: 'Circulating Fats',
        simpleExplanation:
          'Low-Density Lipoprotein carries cholesterol to tissues. Higher levels can gradually build up in blood vessels over years if unchecked.'
      },
      {
        name: 'HDL Cholesterol ("Good")',
        value: '52',
        unit: 'mg/dL',
        standardRange: '> 40',
        status: 'normal',
        category: 'Protective Fats',
        simpleExplanation:
          'High-Density Lipoprotein acts like a scavenger, collecting excess cholesterol from arteries and carrying it back to the liver.'
      },
      {
        name: 'Triglycerides',
        value: '120',
        unit: 'mg/dL',
        standardRange: '< 150',
        status: 'normal',
        category: 'Caloric Storage',
        simpleExplanation:
          'A type of blood fat converted from extra calories your body does not need right away. Your level is well within target.'
      },
      {
        name: 'Cholesterol / HDL Ratio',
        value: '4.19',
        unit: 'Ratio',
        standardRange: '< 5.0',
        status: 'normal',
        category: 'Risk Ratio',
        simpleExplanation:
          'A comparative calculation indicating heart health balance. A ratio under 5 is considered favorable.'
      }
    ],
    questionsForDoctor: [
      'Would lifestyle and nutritional adjustments (e.g., higher soluble fiber, heart-healthy fats) be sufficient to bring LDL into range?',
      'Based on my personal and family history, what is my ideal target for LDL cholesterol?',
      'Do you recommend repeating this test in 3 to 6 months to evaluate dietary changes?'
    ],
    glossary: [
      {
        term: 'LDL (Low-Density Lipoprotein)',
        definition: 'Often dubbed "bad cholesterol" because excess amounts can accumulate along arterial walls.'
      },
      {
        term: 'HDL (High-Density Lipoprotein)',
        definition: 'Known as "good cholesterol" because it helps remove excess cholesterol from the bloodstream.'
      },
      {
        term: 'Triglycerides',
        definition: 'The most common type of fat in your body, derived from dietary fats and excess carbohydrates.'
      }
    ],
    rawTextSnippet:
      'CLINICAL BIOCHEMISTRY REPORT\nTest: Fasting Lipid Profile (12 hrs fasting)\n----------------------------------------\nTotal Cholesterol: 218 mg/dL (Desirable: < 200)\nTriglycerides: 120 mg/dL (Normal: < 150)\nHDL Cholesterol: 52 mg/dL (Optimal: > 40)\nLDL Cholesterol (Calculated): 142 mg/dL (Optimal: < 100)\nVLDL Cholesterol: 24 mg/dL (Normal: 5 - 40)\nTotal Chol / HDL Ratio: 4.19 (Desirable: < 5.0)\nImpression: Mild Hypercholesterolemia.'
  },
  {
    id: 'glucose-diabetes',
    title: 'Glycemic & Diabetic Profile (HbA1c)',
    category: 'Metabolic Health',
    date: '08 Nov 2026',
    overallStatus: 'attention_needed',
    patientContext: 'Fasting Blood Sugar & Glycated Hemoglobin Panel',
    summary:
      'This panel examines how your body processes and regulates blood sugar over time. Fasting blood glucose reflects your immediate morning baseline, while HbA1c provides a reliable picture of your average blood glucose levels across the past 2 to 3 months.\n\nYour Fasting Glucose (108 mg/dL) and HbA1c (5.8%) sit just slightly above conventional baseline limits, placing them in what clinicians term the “impaired glucose / pre-diabetic monitoring range”. Early lifestyle interventions are often very effective here.',
    keyFindings: [
      'Fasting Blood Sugar is 108 mg/dL (normal fasting is 70 - 99 mg/dL).',
      'HbA1c is 5.8% (normal non-diabetic range is below 5.7%).',
      'Estimated Average Glucose (eAG) is approximately 120 mg/dL.',
      'Early detection provides a great window for dietary and exercise adjustments.'
    ],
    metrics: [
      {
        name: 'Fasting Blood Glucose',
        value: '108',
        unit: 'mg/dL',
        standardRange: '70 - 99',
        status: 'high',
        category: 'Immediate Sugar',
        simpleExplanation:
          'Your blood sugar concentration after an overnight fast. Mild elevations warrant mindful attention to refined sugars and meal timing.'
      },
      {
        name: 'HbA1c (Glycated Hemoglobin)',
        value: '5.8',
        unit: '%',
        standardRange: '< 5.7',
        status: 'high',
        category: '3-Month Average',
        simpleExplanation:
          'Measures the percentage of hemoglobin coated with sugar. Because red blood cells live roughly 120 days, it shows your 3-month sugar average.'
      },
      {
        name: 'Estimated Average Glucose (eAG)',
        value: '120',
        unit: 'mg/dL',
        standardRange: '< 117',
        status: 'high',
        category: 'Calculated Metric',
        simpleExplanation:
          'A translation of your HbA1c percentage into daily blood sugar unit numbers.'
      }
    ],
    questionsForDoctor: [
      'What specific dietary adjustments (such as fiber intake or carbohydrate distribution) would you recommend?',
      'Would home glucose monitoring be helpful or is repeating HbA1c in 3 months sufficient?',
      'Do my physical activity levels and sleep patterns play a role in lowering these numbers?'
    ],
    glossary: [
      {
        term: 'HbA1c',
        definition: 'Glycated hemoglobin, showing average blood sugar control over the preceding 8-12 weeks.'
      },
      {
        term: 'Impaired Fasting Glucose',
        definition: 'Blood sugar higher than standard fasting levels, but not high enough to be classified as diabetes.'
      },
      {
        term: 'eAG (Estimated Average Glucose)',
        definition: 'A calculation that converts HbA1c percentage into familiar mg/dL blood glucose units.'
      }
    ],
    rawTextSnippet:
      'METABOLIC / ENDOCRINOLOGY PANEL\nFasting Blood Glucose (Hexokinase method): 108 mg/dL (Ref: 70 - 99)\nHbA1c (HPLC method): 5.8 % (Normal: < 5.7 %, Pre-diabetic: 5.7 - 6.4 %)\nEstimated Average Glucose: 120 mg/dL (Ref: < 117)\nInterpretation: Values suggest borderline impaired fasting glucose.'
  },
  {
    id: 'lft-hepatic',
    title: 'Liver Function Test (LFT / Hepatic)',
    category: 'Hepatic & Organ Function',
    date: '05 Nov 2026',
    overallStatus: 'consult_doctor',
    patientContext: 'Comprehensive Hepatic Biomarker Screen',
    summary:
      'A Liver Function Test evaluates proteins, enzymes, and bilirubin produced or cleared by your liver. These markers help assess cellular wellness, metabolic activity, and bile flow.\n\nYour panel shows mild to moderate elevations in liver enzymes (ALT and AST), while Bilirubin and Albumin remain within standard targets. Elevated enzymes often occur due to temporary inflammation, medications, alcohol, or fatty liver changes, and warrant consultation with your doctor for proper context.',
    keyFindings: [
      'ALT (SGPT) enzyme is elevated at 64 U/L (reference target is 7 - 55 U/L).',
      'AST (SGOT) enzyme is mildly elevated at 48 U/L (reference target is 8 - 48 U/L).',
      'Total Bilirubin and Albumin are normal, indicating intact synthetic liver capacity.',
      'Follow-up with your doctor is recommended to explore potential causes (e.g. medications, fatty changes).'
    ],
    metrics: [
      {
        name: 'Alanine Aminotransferase (ALT / SGPT)',
        value: '64',
        unit: 'U/L',
        standardRange: '7 - 55',
        status: 'high',
        category: 'Liver Enzyme',
        simpleExplanation:
          'An enzyme found primarily inside liver cells. When liver cells experience stress or irritation, ALT can leak into the bloodstream.'
      },
      {
        name: 'Aspartate Aminotransferase (AST / SGOT)',
        value: '48',
        unit: 'U/L',
        standardRange: '8 - 40',
        status: 'high',
        category: 'Liver Enzyme',
        simpleExplanation:
          'An enzyme present in liver and muscle tissue. Mild elevations frequently accompany ALT changes.'
      },
      {
        name: 'Total Bilirubin',
        value: '0.8',
        unit: 'mg/dL',
        standardRange: '0.2 - 1.2',
        status: 'normal',
        category: 'Bile Pigment',
        simpleExplanation:
          'A yellowish pigment formed when old red blood cells are broken down. Your healthy level indicates good clearance by the liver.'
      },
      {
        name: 'Serum Albumin',
        value: '4.4',
        unit: 'g/dL',
        standardRange: '3.5 - 5.2',
        status: 'normal',
        category: 'Protein Synthesis',
        simpleExplanation:
          'The primary protein synthesized by the liver that keeps fluid from leaking out of blood vessels.'
      },
      {
        name: 'Alkaline Phosphatase (ALP)',
        value: '78',
        unit: 'U/L',
        standardRange: '44 - 147',
        status: 'normal',
        category: 'Biliary Enzyme',
        simpleExplanation:
          'An enzyme related to bile ducts and bone turnover. Your normal level suggests clear bile flow.'
      }
    ],
    questionsForDoctor: [
      'Could any of my current prescription medications, over-the-counter painkillers, or dietary supplements be elevating these enzymes?',
      'Do you recommend an ultrasound of the abdomen or any dietary changes to address possible fatty liver changes?',
      'Should we recheck liver enzymes in 4 to 6 weeks to see if the levels return to baseline?'
    ],
    glossary: [
      {
        term: 'ALT (Alanine Aminotransferase)',
        definition: 'A specific enzyme found mostly in liver cells; blood levels rise when liver cells are irritated.'
      },
      {
        term: 'AST (Aspartate Aminotransferase)',
        definition: 'An enzyme found in liver, heart, and muscle cells; elevated levels point to cellular stress.'
      },
      {
        term: 'Bilirubin',
        definition: 'A waste byproduct of hemoglobin breakdown; processed by the liver and excreted in bile.'
      }
    ],
    rawTextSnippet:
      'HEPATIC FUNCTION PANEL\nSample Type: Serum\n----------------------------------------\nTotal Bilirubin: 0.8 mg/dL (Ref: 0.2 - 1.2)\nDirect Bilirubin: 0.2 mg/dL (Ref: 0.0 - 0.3)\nSGPT / ALT: 64 U/L [ELEVATED] (Ref: 7 - 55)\nSGOT / AST: 48 U/L [ELEVATED] (Ref: 8 - 40)\nAlkaline Phosphatase: 78 U/L (Ref: 44 - 147)\nTotal Protein: 7.2 g/dL (Ref: 6.0 - 8.3)\nAlbumin: 4.4 g/dL (Ref: 3.5 - 5.2)\nGlobulin: 2.8 g/dL (Ref: 2.0 - 3.5)\nA/G Ratio: 1.57 (Ref: 1.2 - 2.2)\nRemarks: Mild transaminitis noted.'
  }
];
