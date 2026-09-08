/**
 * POLIO CAMPAIGN CALCULATOR TRANSLATIONS
 * Comprehensive English & Urdu (اردو) localization with input-level formula tooltips
 */

export type Language = 'en' | 'ur';

export interface InputTooltipData {
  label: string;
  formula?: string;
  explanation: string;
  fieldRule?: string;
}

export interface CalculatorTranslations {
  num: string;
  title: string;
  shortTitle: string;
  badge: string;
  purpose: string;
  calculateBtn: string;
  resetBtn: string;
}

export interface TranslationStrings {
  appTitle: string;
  appSubtitle: string;
  roleBadge: string;
  fixedRuleBadge: string;
  fixedRuleHeader: string;
  offlineReady: string;
  offline: string;
  install: string;
  allGrid: string;
  prevTool: string;
  nextTool: string;
  toolOf: (cur: string | number, total: number) => string;
  footerRule: string;
  footerVersion: string;
  calculationLogicRule: string;
  close: string;
  gotIt: string;
  testsModalTitle: string;
  testsModalDesc: string;

  // Total Campaign Section
  totalCampaign: string;
  totalCampaignShort: string;
  totalCampaignDesc: string;
  totalTargetLabel: string;
  totalCoveredLabel: string;
  remainingLabel: string;
  coveragePercentLabel: string;
  benchmarkLabel: string;
  benchmarkMetBadge: string;
  benchmarkNeededBadge: string;
  campaignProgressBarLabel: string;
  areaBreakdownTitle: string;
  areaBreakdownDesc: string;
  additionalStatsTitle: string;
  vaccineLogisticsTitle: string;
  workforceTitle: string;
  missedChildrenTitle: string;
  addAreaBtn: string;
  editAreaBtn: string;
  saveBtn: string;
  cancelBtn: string;
  deleteBtn: string;
  areaNameLabel: string;
  actionsLabel: string;
  copyReportBtn: string;
  reportCopiedMsg: string;
  quickUpdateBtn: string;
  resetDefaultDataBtn: string;
  vialsRequiredShort: string;
  mobileTeamsLabel: string;
  supervisorsLabel: string;
  catchUpDailyTargetLabel: string;
  daysRemainingLabel: string;

  // 8 Field Calculators
  childAge: CalculatorTranslations & {
    dobLabel: string;
    dobSub: string;
    under5Status: string;
    strictRuleNotice: string;
    eligibleYes: string;
    eligibleNo: string;
    eligibleDesc: string;
    notEligibleDesc: string;
    exactAgeLabel: string;
    dobResultLabel: string;
    dobTooltip: InputTooltipData;
  };

  vaccineDemand: CalculatorTranslations & {
    targetLabel: string;
    bufferLabel: string;
    vialsResultLabel: string;
    totalDropsResultLabel: string;
    baseVialsLabel: string;
    bufferVialsLabel: string;
    targetTooltip: InputTooltipData;
    bufferTooltip: InputTooltipData;
  };

  vaccineWastage: CalculatorTranslations & {
    vialsLabel: string;
    vaccinatedLabel: string;
    dosesGivenSub: string;
    wastedDosesLabel: string;
    targetWastageNotice: string;
    vialsSuppliedLabel: string;
    dosesSuppliedLabel: string;
    vaccinatedLabelResult: string;
    vialsTooltip: InputTooltipData;
    vaccinatedTooltip: InputTooltipData;
  };

  campaignCoverage: CalculatorTranslations & {
    targetLabel: string;
    vaccinatedLabel: string;
    coverageAchievedLabel: string;
    benchmarkLabel: string;
    targetMetBadge: string;
    inProgressBadge: string;
    vaccinatedLabelResult: string;
    remainingLabelResult: string;
    targetTooltip: InputTooltipData;
    vaccinatedTooltip: InputTooltipData;
  };

  dailyCatchUp: CalculatorTranslations & {
    targetLabel: string;
    vaccinatedLabel: string;
    daysLabel: string;
    dailyTargetLabel: string;
    morningVialsLabel: string;
    remainingTargetLabel: string;
    coverageProgressLabel: string;
    targetTooltip: InputTooltipData;
    vaccinatedTooltip: InputTooltipData;
    daysTooltip: InputTooltipData;
  };

  teamMicroplan?: CalculatorTranslations & {
    ucTargetLabel: string;
    daysLabel: string;
    teamRateLabel: string;
    supervisorSpanLabel: string;
    mobileTeamsLabel: string;
    supervisorsLabel: string;
    dailyUcTargetLabel: string;
    dailyVialsLabel: string;
    ucTargetTooltip: InputTooltipData;
    daysTooltip: InputTooltipData;
    teamRateTooltip: InputTooltipData;
    supervisorSpanTooltip: InputTooltipData;
  };

  naCoverage: CalculatorTranslations & {
    reportedNaLabel: string;
    coveredNaLabel: string;
    coverageRateLabel: string;
    recoveryRateBadge: string;
    remainingNaLabel: string;
    reportedNaResult: string;
    coveredNaResult: string;
    reportedNaTooltip: InputTooltipData;
    coveredNaTooltip: InputTooltipData;
  };

  refusalCoverage: CalculatorTranslations & {
    reportedRefusalLabel: string;
    coveredRefusalLabel: string;
    coverageRateLabel: string;
    resolutionRateBadge: string;
    remainingRefusalLabel: string;
    reportedRefusalResult: string;
    coveredRefusalResult: string;
    reportedRefusalTooltip: InputTooltipData;
    coveredRefusalTooltip: InputTooltipData;
  };

  missedChildren: CalculatorTranslations & {
    reportedMissedLabel: string;
    coveredMissedLabel: string;
    coverageRateLabel: string;
    statusBadge: string;
    remainingMissedLabel: string;
    vialsForRemainingLabel: string;
    dropsForRemainingLabel: string;
    reportedMissedResult: string;
    coveredMissedResult: string;
    breakdownModeLabel: string;
    directModeLabel: string;
    naLabel: string;
    refusalLabel: string;
    reportedNaInputLabel: string;
    coveredNaInputLabel: string;
    reportedRefusalInputLabel: string;
    coveredRefusalInputLabel: string;
    totalMissedCombinedLabel: string;
    totalCoveredCombinedLabel: string;
    combinedCoveragePercentLabel: string;
    remainingCombinedMissedLabel: string;
    vialsForCombinedLabel: string;
    dropsForCombinedLabel: string;
    naRecoveryLabel: string;
    refusalResolutionLabel: string;
    reportedMissedTooltip: InputTooltipData;
    coveredMissedTooltip: InputTooltipData;
    reportedNaTooltip: InputTooltipData;
    coveredNaTooltip: InputTooltipData;
    reportedRefusalTooltip: InputTooltipData;
    coveredRefusalTooltip: InputTooltipData;
  };

  under5Population: CalculatorTranslations & {
    totalPopLabel: string;
    under5PctLabel: string;
    estimatedTargetLabel: string;
    cohortNotice: string;
    basePopLabel: string;
    vialsRequiredLabel: string;
    totalPopTooltip: InputTooltipData;
    under5PctTooltip: InputTooltipData;
  };
}

export const translations: Record<Language, TranslationStrings> = {
  en: {
    appTitle: 'Polio Campaign Calculator',
    appSubtitle: 'Field Operations Suite • Union Council & Monitoring Teams',
    roleBadge: '9 Field Calculators',
    fixedRuleBadge: 'Fixed bOPV Standard',
    fixedRuleHeader: 'bOPV: 1 vial = 20 doses (covers 20 kids) • 2 drops/child',
    offlineReady: 'Offline Ready',
    offline: 'Offline',
    install: 'Install',
    allGrid: 'All 9 Calculators',
    prevTool: 'Prev Tool',
    nextTool: 'Next Tool',
    toolOf: (cur, total) => `Tool ${cur} of ${total}`,
    footerRule: 'Fixed bOPV Rule: 1 child = 2 drops • 1 vial = 20 doses (covers 20 children)',
    footerVersion: 'Field Operations Suite • v2.2 Professional',
    calculationLogicRule: 'Calculation Logic & Rule',
    close: 'Close',
    gotIt: 'Got it (Close)',
    testsModalTitle: 'Automated Calculation Verification',
    testsModalDesc: 'Comprehensive automated test verification against WHO/EPI poliovirus eradication standards.',

    // Total Campaign Section
    totalCampaign: 'Total Campaign',
    totalCampaignShort: 'Total Campaign',
    totalCampaignDesc: 'Consolidated Field Operations Dashboard • Complete Campaign Summary & UC Breakdown',
    totalTargetLabel: 'Total Target',
    totalCoveredLabel: 'Total Covered',
    remainingLabel: 'Remaining',
    coveragePercentLabel: 'Coverage %',
    benchmarkLabel: 'Target Benchmark',
    benchmarkMetBadge: '≥95% Target Met',
    benchmarkNeededBadge: 'Gap to 95% Benchmark',
    campaignProgressBarLabel: 'Campaign Progress & Coverage Status',
    areaBreakdownTitle: 'Area / UC / Team Breakdown',
    areaBreakdownDesc: 'Field performance across operational units with interactive monitoring',
    additionalStatsTitle: 'Additional Campaign Statistics',
    vaccineLogisticsTitle: 'bOPV Vaccine Logistics',
    workforceTitle: 'Workforce & Supervision',
    missedChildrenTitle: 'Missed Children & Catch-up',
    addAreaBtn: 'Add Area / UC',
    editAreaBtn: 'Edit',
    saveBtn: 'Save',
    cancelBtn: 'Cancel',
    deleteBtn: 'Delete',
    areaNameLabel: 'Area / UC Name',
    actionsLabel: 'Actions',
    copyReportBtn: 'Copy Field Report',
    reportCopiedMsg: 'Report Copied to Clipboard!',
    quickUpdateBtn: 'Update Totals',
    resetDefaultDataBtn: 'Reset Sample Data',
    vialsRequiredShort: 'bOPV Vials',
    mobileTeamsLabel: 'Mobile Teams',
    supervisorsLabel: 'Area Supervisors',
    catchUpDailyTargetLabel: 'Daily Catch-Up Target',
    daysRemainingLabel: 'Days Remaining',

    // Tool 1: Child Age Calculator
    childAge: {
      num: '1',
      title: 'Child Age Calculator',
      shortTitle: 'Child Age Calculator',
      badge: 'Exact Calendar Age',
      purpose: 'Determines exact age and strict 5th birthday eligibility for bOPV administration',
      calculateBtn: 'Check Eligibility',
      resetBtn: 'Reset date',
      dobLabel: 'Child Date of Birth',
      dobSub: 'Current device date compared',
      under5Status: 'Under-5 Status',
      strictRuleNotice: 'Strict 5th Birthday Rule',
      eligibleYes: 'YES',
      eligibleNo: 'NO',
      eligibleDesc: 'Eligible for Polio Vaccine (< 5 yrs)',
      notEligibleDesc: 'Above Target Age (≥ 5 yrs)',
      exactAgeLabel: 'Exact Age Today:',
      dobResultLabel: 'Date of Birth:',
      dobTooltip: {
        label: 'Child Date of Birth',
        formula: 'Age = Today − Date of Birth',
        fieldRule: 'Strict 5th Birthday: < 5.0 years (< 60 months or < 1,826 days)',
        explanation: 'All children under 5 years old on the day of vaccination are eligible for 2 drops of bOPV oral polio vaccine, regardless of previous doses.',
      },
    },

    // Tool 2: Demand of Vaccine Calculator
    vaccineDemand: {
      num: '2',
      title: 'Demand of Vaccine Calculator',
      shortTitle: 'Demand of Vaccine Calculator',
      badge: '1 Vial = 20 Doses',
      purpose: 'Calculates bOPV vials (20 doses/vial), total drops (2/child), and optional safety buffer',
      calculateBtn: 'Calculate Vaccine Demand',
      resetBtn: 'Reset values',
      targetLabel: 'Target Children',
      bufferLabel: 'Safety Buffer % (Optional)',
      vialsResultLabel: 'bOPV Vials Required',
      totalDropsResultLabel: 'Total Drops (2 / child)',
      baseVialsLabel: 'Base Vials (Exact)',
      bufferVialsLabel: 'Buffer Reserve Vials',
      targetTooltip: {
        label: 'Target Children',
        formula: 'Base Vials = CEILING(Target Children ÷ 20)',
        fieldRule: '1 Vial = 20 Doses (vaccinates 20 children) • 2 Drops per Child',
        explanation: 'Vials are always rounded UP to the nearest full vial because open bOPV vials cannot be divided across teams. Each child receives exactly 2 drops.',
      },
      bufferTooltip: {
        label: 'Safety Buffer %',
        formula: 'Buffer Vials = CEILING(Base Vials × Buffer % ÷ 100)',
        fieldRule: 'Recommended field reserve: 5% to 10%',
        explanation: 'Provides backup vials for transit damage, vaccine vial monitor (VVM) heat exposure, or unanticipated nomadic / guest children.',
      },
    },

    // Tool 3: Wastage of Vaccine Calculator
    vaccineWastage: {
      num: '3',
      title: 'Wastage of Vaccine Calculator',
      shortTitle: 'Wastage of Vaccine Calculator',
      badge: '1 Vial = 20 Doses',
      purpose: '20 kids vaccinated per vial • Measures wasted doses and campaign wastage rate %',
      calculateBtn: 'Calculate Wastage Rate',
      resetBtn: 'Reset values',
      vialsLabel: 'Vials Issued',
      vaccinatedLabel: 'Children Vaccinated',
      dosesGivenSub: 'Children Vaccinated',
      wastedDosesLabel: 'Wasted Doses',
      targetWastageNotice: 'Target Wastage ≤ 5%',
      vialsSuppliedLabel: 'Vials Issued',
      dosesSuppliedLabel: 'Doses Issued (Vials × 20)',
      vaccinatedLabelResult: 'Children Vaccinated',
      vialsTooltip: {
        label: 'Vials Issued',
        formula: 'Total Doses Issued = Vials Issued × 20 doses',
        fieldRule: '1 bOPV vial = 20 doses (covers 20 kids)',
        explanation: 'Count all vials issued from the cold-chain point and opened during the campaign round.',
      },
      vaccinatedTooltip: {
        label: 'Children Vaccinated',
        formula: 'Wastage % = ((Doses Issued − Children Vaccinated) ÷ Doses Issued) × 100',
        fieldRule: 'Global PEI Target: Wastage Rate ≤ 5.0%',
        explanation: 'Each vaccinated child receives 2 drops (1 dose). Wasted doses represent issued doses not successfully administered to children.',
      },
    },

    // Tool 4: NA Coverage Calculator
    naCoverage: {
      num: '4',
      title: 'NA Coverage Calculator',
      shortTitle: 'NA Coverage Calculator',
      badge: '(Covered ÷ NA) × 100',
      purpose: 'NA = Not Available (absent during initial visit) • Recovery rate',
      calculateBtn: 'Calculate NA Recovery %',
      resetBtn: 'Reset values',
      reportedNaLabel: 'Reported NA Children',
      coveredNaLabel: 'Covered NA Children',
      coverageRateLabel: 'NA Coverage Rate',
      recoveryRateBadge: 'Recovery Rate',
      remainingNaLabel: 'Remaining NA:',
      reportedNaResult: 'Reported NA',
      coveredNaResult: 'Covered NA',
      reportedNaTooltip: {
        label: 'Reported NA Children',
        formula: 'NA = Children temporarily away from home or door locked',
        fieldRule: 'Recorded on tally sheet with door marking "X"',
        explanation: 'Children recorded by mobile teams as absent or temporarily unavailable during first-pass house visits.',
      },
      coveredNaTooltip: {
        label: 'Covered NA Children',
        formula: 'NA Recovery % = (Covered NA ÷ Reported NA) × 100',
        fieldRule: 'Target recovery on revisit days: > 85%',
        explanation: 'Previously absent children successfully found, vaccinated, and updated on tally sheets during evening or catch-up revisits.',
      },
    },

    // Tool 5: Refusal Coverage Calculator
    refusalCoverage: {
      num: '5',
      title: 'Refusal Coverage Calculator',
      shortTitle: 'Refusal Coverage Calculator',
      badge: '(Covered ÷ Reported) × 100',
      purpose: 'Tracks refusal conversions & coverage (e.g. 50 reported, 25 covered = 50% coverage)',
      calculateBtn: 'Calculate Refusal Coverage %',
      resetBtn: 'Reset values',
      reportedRefusalLabel: 'Reported Refusals',
      coveredRefusalLabel: 'Covered / Resolved',
      coverageRateLabel: 'Refusal Coverage Rate',
      resolutionRateBadge: 'Resolution Rate',
      remainingRefusalLabel: 'Remaining Refusals:',
      reportedRefusalResult: 'Reported Refusals',
      coveredRefusalResult: 'Covered Refusals',
      reportedRefusalTooltip: {
        label: 'Reported Refusals',
        formula: 'Refusal = Caregiver initially declined bOPV',
        fieldRule: 'Marked on house door with chalk "R"',
        explanation: 'Children missed due to parental hesitancy, misconceptions, or refusal during the initial team visit.',
      },
      coveredRefusalTooltip: {
        label: 'Covered / Resolved Refusals',
        formula: 'Refusal Resolution % = (Covered Refusals ÷ Reported Refusals) × 100',
        fieldRule: 'Remaining Refusals = Reported − Covered',
        explanation: 'Refusal families convinced and vaccinated through AICs, UC Medical Officers, influencers, or religious leaders.',
      },
    },

    // Tool 6: Missed Children Coverage % Calculator
    missedChildren: {
      num: '6',
      title: 'Missed Children Coverage % Calculator',
      shortTitle: 'Missed Children Coverage % Calculator',
      badge: '(Covered ÷ Missed) × 100',
      purpose: 'Combines Reported NA & Refusals, calculates total missed children recovery % and required bOPV vials',
      calculateBtn: 'Calculate Combined Missed Coverage %',
      resetBtn: 'Reset values',
      reportedMissedLabel: 'Reported Missed Children',
      coveredMissedLabel: 'Covered Missed Children',
      coverageRateLabel: 'Combined Missed Coverage %',
      statusBadge: 'Catch-Up Status',
      remainingMissedLabel: 'Still Missed Children:',
      vialsForRemainingLabel: 'bOPV Vials Required for Remaining',
      dropsForRemainingLabel: 'Total Drops Needed',
      reportedMissedResult: 'Total Missed',
      coveredMissedResult: 'Total Covered',
      breakdownModeLabel: 'Enter via NA & Refusal Breakdown',
      directModeLabel: 'Direct Combined Input',
      naLabel: 'Not Available (NA)',
      refusalLabel: 'Refusals',
      reportedNaInputLabel: 'Reported NA (Not Available)',
      coveredNaInputLabel: 'Covered NA',
      reportedRefusalInputLabel: 'Reported Refusals',
      coveredRefusalInputLabel: 'Covered Refusals',
      totalMissedCombinedLabel: 'Total Combined Missed (NA + Refusals)',
      totalCoveredCombinedLabel: 'Total Combined Covered',
      combinedCoveragePercentLabel: 'Combined Missed Coverage %',
      remainingCombinedMissedLabel: 'Total Still Missed',
      vialsForCombinedLabel: 'bOPV Vials for Remaining',
      dropsForCombinedLabel: 'Total Drops (2/child)',
      naRecoveryLabel: 'NA Recovery Rate',
      refusalResolutionLabel: 'Refusal Resolution Rate',
      reportedMissedTooltip: {
        label: 'Reported Missed Children',
        formula: 'Total Missed = Reported NA + Reported Refusals',
        fieldRule: 'Tally sheet recorded missed children from initial rounds',
        explanation: 'The combined total of children missed during regular house-to-house visits (NA children + Refusal cases).',
      },
      coveredMissedTooltip: {
        label: 'Covered Missed Children',
        formula: 'Missed Coverage % = (Covered Missed ÷ Reported Missed) × 100',
        fieldRule: 'Target Catch-Up Coverage: ≥ 90%',
        explanation: 'Missed children successfully tracked, persuaded, and vaccinated during evening sweeps or catch-up days.',
      },
      reportedNaTooltip: {
        label: 'Reported NA Children',
        formula: 'NA Children recorded on tally sheet',
        fieldRule: 'Door marked with "NA" (Child Not Available)',
        explanation: 'Children temporarily absent or away when the mobile team visited.',
      },
      coveredNaTooltip: {
        label: 'Covered NA Children',
        formula: 'Covered NA vaccinated during revisit',
        fieldRule: 'Must be ≤ Reported NA',
        explanation: 'Children previously recorded as NA who received drops during evening sweeps or catch-up.',
      },
      reportedRefusalTooltip: {
        label: 'Reported Refusals',
        formula: 'Refusal cases marked with "R" on door',
        fieldRule: 'Initial parental/guardian refusal',
        explanation: 'Children whose parents refused immunization during the team visit.',
      },
      coveredRefusalTooltip: {
        label: 'Covered Refusals',
        formula: 'Convinced & vaccinated refusal cases',
        fieldRule: 'Must be ≤ Reported Refusals',
        explanation: 'Refusal children vaccinated after counseling by community influencers, elders, or medical officers.',
      },
    },

    // Tool 7: Campaign Coverage Calculator
    campaignCoverage: {
      num: '7',
      title: 'Campaign Coverage Calculator',
      shortTitle: 'Campaign Coverage Calculator',
      badge: '(Vac ÷ Target) × 100',
      purpose: 'Evaluates campaign achievement % and tracking against the ≥ 95% threshold',
      calculateBtn: 'Calculate Coverage %',
      resetBtn: 'Reset values',
      targetLabel: 'Target Children',
      vaccinatedLabel: 'Vaccinated Children',
      coverageAchievedLabel: 'Coverage Achieved',
      benchmarkLabel: 'Benchmark: ≥ 95%',
      targetMetBadge: 'Target Met (≥ 95%)',
      inProgressBadge: 'In Progress (< 95%)',
      vaccinatedLabelResult: 'Vaccinated',
      remainingLabelResult: 'Remaining',
      targetTooltip: {
        label: 'Target Children',
        formula: 'Target = Microplanned Under-5 Cohort in catchment area',
        fieldRule: 'Census / Union Council verified target',
        explanation: 'The total microplanned under-5 population to be reached across all campaign days in the Union Council or area.',
      },
      vaccinatedTooltip: {
        label: 'Vaccinated Children',
        formula: 'Coverage % = (Vaccinated Children ÷ Target Children) × 100',
        fieldRule: 'Epidemiological target: ≥ 95.0% for herd immunity',
        explanation: 'Measures campaign quality and immunity barrier. Coverage below 95% leaves vulnerable immunity gaps.',
      },
    },

    // Tool 8: Daily Catch-Up Calculator
    dailyCatchUp: {
      num: '8',
      title: 'Daily Catch-Up Calculator',
      shortTitle: 'Daily Catch-Up Calculator',
      badge: 'Remaining ÷ Days',
      purpose: 'Recalculates required daily run rate & morning bOPV vial allocation',
      calculateBtn: 'Calculate Daily Run Rate',
      resetBtn: 'Reset values',
      targetLabel: 'Total Target Children',
      vaccinatedLabel: 'Already Vaccinated',
      daysLabel: 'Days Remaining',
      dailyTargetLabel: 'Daily Catch-Up Target',
      morningVialsLabel: 'Morning bOPV Vials',
      remainingTargetLabel: 'Remaining Target',
      coverageProgressLabel: 'Coverage Progress',
      targetTooltip: {
        label: 'Total Target Children',
        formula: 'Remaining Target = Target − Already Vaccinated',
        fieldRule: 'Area or Union Council total goal',
        explanation: 'The overall under-5 target cohort set for this campaign round in the microplan.',
      },
      vaccinatedTooltip: {
        label: 'Already Vaccinated',
        formula: 'Coverage % = (Already Vaccinated ÷ Total Target) × 100',
        fieldRule: 'Cumulative total recorded up to previous day',
        explanation: 'Cumulative tally of children vaccinated up to the start of today.',
      },
      daysTooltip: {
        label: 'Days Remaining',
        formula: 'Daily Target = CEILING(Remaining Children ÷ Days Remaining)',
        fieldRule: 'Morning Vials = CEILING(Daily Target ÷ 20)',
        explanation: 'How many operational working days are left in the campaign to vaccinate remaining children and issue cold-chain vials.',
      },
    },

    // Tool 9: Under-5 Population Calculator
    under5Population: {
      num: '9',
      title: 'Under-5 Population Calculator',
      shortTitle: 'Under-5 Population Calculator',
      badge: 'Pop × % ÷ 100',
      purpose: 'Estimates under-5 target cohort from census / union council population',
      calculateBtn: 'Calculate Under-5 Target',
      resetBtn: 'Reset values',
      totalPopLabel: 'Total Population',
      under5PctLabel: 'Under-5 % Proportion',
      estimatedTargetLabel: 'Estimated Under-5 Target',
      cohortNotice: 'Demographic Cohort',
      basePopLabel: 'Base Population',
      vialsRequiredLabel: 'bOPV Vials Required',
      totalPopTooltip: {
        label: 'Total Population',
        formula: 'Under-5 Target = ROUND(Total Population × Under-5 % ÷ 100)',
        fieldRule: 'Census or Union Council validated population',
        explanation: 'Total general population residing within the Union Council or catchment boundary.',
      },
      under5PctTooltip: {
        label: 'Under-5 % Proportion',
        formula: 'Standard demographic proportion in Pakistan / South Asia: ~13.5% to 16.0%',
        fieldRule: 'National default planning average: 15%',
        explanation: 'The demographic percentage of total population comprised of children aged 0 to 59 months.',
      },
    },
  },

  ur: {
    appTitle: 'پولیو مہم کیلکولیٹر',
    appSubtitle: 'فیلڈ آپریشنز سوٹ • یونین کونسل و مانیٹرنگ ٹیمیں',
    roleBadge: '9 فیلڈ کیلکولیٹرز',
    fixedRuleBadge: 'مقررہ bOPV اصول',
    fixedRuleHeader: 'مقررہ اصول: 1 وائل = 20 خوراکیں (20 بچے) • 2 قطرے فی بچہ',
    offlineReady: 'آف لائن تیار',
    offline: 'آف لائن',
    install: 'انسٹال کریں',
    allGrid: 'تمام 9 کیلکولیٹرز',
    prevTool: 'پچھلا ٹول',
    nextTool: 'اگلا ٹول',
    toolOf: (cur, total) => `ٹول ${cur} از ${total}`,
    footerRule: 'مقررہ bOPV اصول: 1 بچہ = 2 قطرے • 1 وائل = 20 خوراکیں (20 بچے)',
    footerVersion: 'فیلڈ آپریشنز سوٹ • پیشہ ورانہ ایڈیشن',
    calculationLogicRule: 'حسابی اصول و فارمولا',
    close: 'بند کریں',
    gotIt: 'سمجھ آگیا (بند کریں)',
    testsModalTitle: 'خودکار حسابی تصدیقی ٹیسٹ',
    testsModalDesc: 'عالمی ادارہ صحت (WHO) اور ای پی آئی پولیو مہماتی اصولوں کے مطابق مکمل حسابی تصدیق۔',

    // Total Campaign Section
    totalCampaign: 'مکمل مہم کا جائزہ',
    totalCampaignShort: 'مہم کا جائزہ',
    totalCampaignDesc: 'مربوط فیلڈ آپریشنز ڈیش بورڈ • مہم کا مجموعی خلاصہ اور یوسی بریک ڈاؤن',
    totalTargetLabel: 'کل ہدف بچے',
    totalCoveredLabel: 'کل ویکسین شدہ',
    remainingLabel: 'باقی بچے',
    coveragePercentLabel: 'کوریج شرح %',
    benchmarkLabel: 'مہماتی بینچ مارک',
    benchmarkMetBadge: '≥95% ہدف مکمل',
    benchmarkNeededBadge: '95% ہدف تک درکار',
    campaignProgressBarLabel: 'مہم کی مجموعی پیش رفت و صورتحال',
    areaBreakdownTitle: 'علاقہ و یوسی وائز جائزہ',
    areaBreakdownDesc: 'آپریشنل یونٹس کی فیلڈ کارکردگی اور مانیٹرنگ تفصیلات',
    additionalStatsTitle: 'اضافی مہماتی شماریات',
    vaccineLogisticsTitle: 'bOPV ویکسین لاجسٹکس',
    workforceTitle: 'فیلڈ ٹیمیں اور سپروائزرز',
    missedChildrenTitle: 'رہ جانے والے بچے اور کیچ اپ',
    addAreaBtn: 'نیا علاقہ / یوسی شامل کریں',
    editAreaBtn: 'ترمیم',
    saveBtn: 'محفوظ کریں',
    cancelBtn: 'منسوخ',
    deleteBtn: 'حذف کریں',
    areaNameLabel: 'علاقہ / یوسی کا نام',
    actionsLabel: 'اقدامات',
    copyReportBtn: 'فیلڈ رپورٹ کاپی کریں',
    reportCopiedMsg: 'رپورٹ کاپی ہو گئی!',
    quickUpdateBtn: 'اعداد و شمار اپڈیٹ کریں',
    resetDefaultDataBtn: 'معیاری ڈیٹا بحال کریں',
    vialsRequiredShort: 'وائلز',
    mobileTeamsLabel: 'موبائل ٹیمیں',
    supervisorsLabel: 'ایریا سپروائزرز',
    catchUpDailyTargetLabel: 'روزانہ کیچ اپ ہدف',
    daysRemainingLabel: 'مہم کے باقی دن',

    // Tool 1: Child Age Calculator
    childAge: {
      num: '1',
      title: 'چائلڈ ایج کیلکولیٹر (عمر کی اہلیت)',
      shortTitle: 'چائلڈ ایج کیلکولیٹر',
      badge: 'حقیقی کیلنڈر عمر',
      purpose: 'درست عمر اور پولیو ویکسین کے لیے 5 ویں سالگرہ سے کم اہلیت کا تعین',
      calculateBtn: 'اہلیت چیک کریں',
      resetBtn: 'تاریخ دوبارہ شروع کریں',
      dobLabel: 'بچے کی تاریخِ پیدائش',
      dobSub: 'ڈیوائس کی موجودہ تاریخ سے موازنہ',
      under5Status: '5 سال سے کم حیثیت',
      strictRuleNotice: '5 سال سے کم کی سخت حد',
      eligibleYes: 'اہل ہے (ہاں)',
      eligibleNo: 'اہل نہیں (ناں)',
      eligibleDesc: 'پولیو ویکسین کے لیے اہل ہے (عمر 5 سال سے کم)',
      notEligibleDesc: 'مطلوبہ عمر سے زیادہ ہے (عمر 5 سال یا زائد)',
      exactAgeLabel: 'آج کے دن حقیقی عمر:',
      dobResultLabel: 'تاریخِ پیدائش:',
      dobTooltip: {
        label: 'بچے کی تاریخِ پیدائش',
        formula: 'عمر = آج کی تاریخ منفی تاریخِ پیدائش',
        fieldRule: 'اہلیت کا اصول: 5 سال سے کم (60 ماہ یا 1,826 دن سے کم)',
        explanation: 'ویکسینیشن کے دن 5 سال سے کم عمر تمام بچے سابقہ حفاظتی ٹیکوں سے قطع نظر bOPV کے 2 قطرے پینے کے اہل ہیں۔',
      },
    },

    // Tool 2: Demand of Vaccine Calculator
    vaccineDemand: {
      num: '2',
      title: 'ڈیمانڈ آف ویکسین کیلکولیٹر (طلب)',
      shortTitle: 'ڈیمانڈ آف ویکسین کیلکولیٹر',
      badge: '1 وائل = 20 خوراکیں',
      purpose: 'مطلوبہ بچوں کے لیے bOPV وائلز (20 بچے/وائل)، کل قطرے (2 فی بچہ) اور حفاظتی بفر اسٹاک',
      calculateBtn: 'ویکسین کی طلب کا حساب لگائیں',
      resetBtn: 'دوبارہ شروع کریں',
      targetLabel: 'ہدف بچے',
      bufferLabel: 'حفاظتی بفر اسٹاک % (اختیاری)',
      vialsResultLabel: 'مطلوبہ bOPV وائلز',
      totalDropsResultLabel: 'کل درکار قطرے (2 فی بچہ)',
      baseVialsLabel: 'بنیادی وائلز (مکمل)',
      bufferVialsLabel: 'حفاظتی بفر وائلز',
      targetTooltip: {
        label: 'ہدف بچے',
        formula: 'بنیادی وائلز = ہدف بچے تقسیم 20 (اگلی مکمل وائل پر راؤنڈ)',
        fieldRule: '1 وائل = 20 بچے / خوراکیں • 2 قطرے فی بچہ',
        explanation: 'کھلی ہوئی وائل کو ٹیموں میں تقسیم نہیں کیا جا سکتا، اس لیے وائلز کا حساب ہمیشہ اوپر والے مکمل عدد پر راؤنڈ ہوتا ہے۔',
      },
      bufferTooltip: {
        label: 'حفاظتی بفر اسٹاک %',
        formula: 'بفر وائلز = بنیادی وائلز ضرب بفر فیصد تقسیم 100',
        fieldRule: 'تجویز کردہ فیلڈ ریزرو: 5% سے 10%',
        explanation: 'فیلڈ میں وائلز ٹوٹنے، وی وی ایم (VVM) خراب ہونے یا غیر متوقع مہمان بچوں کے لیے 5 سے 10 فیصد اضافی وائلز رکھی جاتی ہیں۔',
      },
    },

    // Tool 3: Wastage of Vaccine Calculator
    vaccineWastage: {
      num: '3',
      title: 'ویسٹیج آف ویکسین کیلکولیٹر (ضیاع)',
      shortTitle: 'ویسٹیج آف ویکسین کیلکولیٹر',
      badge: '1 وائل = 20 خوراکیں',
      purpose: 'کھولی گئی وائلز کے مقابلے میں ضائع شدہ خوراکیں اور مہم کا ویسٹیج ریٹ %',
      calculateBtn: 'ضیاع کی شرح (Wastage %) معلوم کریں',
      resetBtn: 'دوبارہ شروع کریں',
      vialsLabel: 'جاری کردہ وائلز (Vials Issued)',
      vaccinatedLabel: 'ویکسین کیے گئے بچے (Children Vaccinated)',
      dosesGivenSub: 'ویکسین شدہ بچے',
      wastedDosesLabel: 'ضائع شدہ خوراکیں',
      targetWastageNotice: 'معیاری ویسٹیج ہدف ≤ 5%',
      vialsSuppliedLabel: 'جاری کردہ وائلز',
      dosesSuppliedLabel: 'کل جاری شدہ خوراکیں (وائلز × 20)',
      vaccinatedLabelResult: 'ویکسین کیے گئے بچے',
      vialsTooltip: {
        label: 'جاری کردہ وائلز (Vials Issued)',
        formula: 'کل خوراکیں = جاری کردہ وائلز ضرب 20 خوراکیں',
        fieldRule: '1 bOPV وائل = 20 خوراکیں (20 بچوں کے لیے)',
        explanation: 'کولڈ چین پوائنٹ سے ٹیم کو جاری ہونے والی تمام وائلز کی تعداد درج کریں۔',
      },
      vaccinatedTooltip: {
        label: 'ویکسین کیے گئے بچے (Children Vaccinated)',
        formula: 'ویسٹیج % = ((جاری شدہ خوراکیں − ویکسین شدہ بچے) ÷ جاری شدہ خوراکیں) × 100',
        fieldRule: 'عالمی معیار: ضیاع کی شرح 5.0% یا اس سے کم ہونی چاہیے',
        explanation: 'ہر بچے کو 2 قطرے (1 خوراک) پلائے جاتے ہیں۔ ضائع شدہ خوراکیں وہ ہیں جو بچوں کو نہیں مل سکیں۔',
      },
    },

    // Tool 4: NA Coverage Calculator
    naCoverage: {
      num: '4',
      title: 'این اے کوریج کیلکولیٹر (غیر موجود بچے)',
      shortTitle: 'این اے کوریج کیلکولیٹر',
      badge: '(کور شدہ ÷ کل NA) × 100',
      purpose: 'NA = غیر موجود بچے (پہلے دورے پر تالہ بند یا بچہ موجود نہ ہونا) • ریکوری ریٹ',
      calculateBtn: 'غیر موجود بچوں کی ریکوری شرح معلوم کریں',
      resetBtn: 'دوبارہ شروع کریں',
      reportedNaLabel: 'رپورٹ شدہ غیر موجود (NA) بچے',
      coveredNaLabel: 'کور شدہ غیر موجود (NA) بچے',
      coverageRateLabel: 'غیر موجود بچوں کی کوریج شرح',
      recoveryRateBadge: 'ریکوری ریٹ',
      remainingNaLabel: 'باقی غیر موجود بچے:',
      reportedNaResult: 'رپورٹ شدہ NA',
      coveredNaResult: 'کور شدہ NA',
      reportedNaTooltip: {
        label: 'رپورٹ شدہ NA بچے',
        formula: 'NA = بچے گھر پر غیر موجود یا تالہ بند پائے گئے',
        fieldRule: 'ٹیلی شیٹ اور دروازے پر "X" کا نشان لگایا جاتا ہے',
        explanation: 'پہلے مرحلے کے دوران وہ بچے جو گھر پر عارضی طور پر موجود نہیں تھے یا دروازہ بند تھا۔',
      },
      coveredNaTooltip: {
        label: 'کور شدہ NA بچے',
        formula: 'ریکوری % = (کور شدہ NA تقسیم رپورٹ شدہ NA) × 100',
        fieldRule: 'کیچ اپ کے دنوں میں ہدف ریکوری: 85% سے زائد',
        explanation: 'دوبارہ دورے پر ویکسین پینے والے بچے جن کی تصدیق ٹیلی شیٹ پر کی گئی ہے۔',
      },
    },

    // Tool 5: Refusal Coverage Calculator
    refusalCoverage: {
      num: '5',
      title: 'رفیوزل کوریج کیلکولیٹر (انکاری کیسز)',
      shortTitle: 'رفیوزل کوریج کیلکولیٹر',
      badge: '(کور شدہ ÷ رپورٹ شدہ) × 100',
      purpose: 'انکاری کیسز کا حل اور کوریج شرح (مثلاً 50 رپورٹ، 25 حل = 50% کوریج)',
      calculateBtn: 'انکاری حل شرح % معلوم کریں',
      resetBtn: 'دوبارہ شروع کریں',
      reportedRefusalLabel: 'رپورٹ شدہ انکاری کیسز',
      coveredRefusalLabel: 'قائل شدہ / حل شدہ انکاری',
      coverageRateLabel: 'انکاری کوریج شرح',
      resolutionRateBadge: 'حل شرح',
      remainingRefusalLabel: 'باقی انکاری بچے:',
      reportedRefusalResult: 'رپورٹ شدہ انکاری',
      coveredRefusalResult: 'کور شدہ انکاری',
      reportedRefusalTooltip: {
        label: 'رپورٹ شدہ انکاری بچے',
        formula: 'انکاری = والدین نے قطرے پلانے سے انکار کیا',
        fieldRule: 'دروازے پر چاک سے "R" کا نشان لگایا جاتا ہے',
        explanation: 'ابتدائی دورے میں غلط فہمیوں یا ہچکچاہٹ کی بنا پر قطرے نہ پینے والے بچے جنہیں رجسٹر کیا گیا ہو۔',
      },
      coveredRefusalTooltip: {
        label: 'حل شدہ انکاری بچے',
        formula: 'انکاری حل % = (حل شدہ انکاری تقسیم رپورٹ شدہ انکاری) × 100',
        fieldRule: 'باقی انکاری = رپورٹ شدہ منفی حل شدہ',
        explanation: 'ایریا انچارجز، یوسی میڈیکل آفیسرز، مذہبی اور سماجی رہنماؤں کی مدد سے قائل کر کے ویکسین کیے گئے بچے۔',
      },
    },

    // Tool 6: Missed Children Coverage % Calculator
    missedChildren: {
      num: '6',
      title: 'مسڈ چلڈرن کوریج فیصد کیلکولیٹر',
      shortTitle: 'مسڈ چلڈرن کوریج فیصد کیلکولیٹر',
      badge: '(کور شدہ ÷ کل مسڈ) × 100',
      purpose: 'رپورٹ شدہ غیر موجود (NA) اور انکاری (Refusals) ملا کر مجموعی مسڈ بچوں کی ریکوری شرح اور درکار وائلز',
      calculateBtn: 'مجموعی مسڈ کوریج معلوم کریں',
      resetBtn: 'دوبارہ شروع کریں',
      reportedMissedLabel: 'کل رپورٹ شدہ مسڈ بچے',
      coveredMissedLabel: 'کور شدہ مسڈ بچے',
      coverageRateLabel: 'مجموعی مسڈ کوریج شرح %',
      statusBadge: 'کیچ اپ صورتحال',
      remainingMissedLabel: 'باقی مسڈ بچے:',
      vialsForRemainingLabel: 'باقی بچوں کے لیے درکار وائلز',
      dropsForRemainingLabel: 'کل درکار قطرے (2 فی بچہ)',
      reportedMissedResult: 'کل مسڈ بچے',
      coveredMissedResult: 'کل کور شدہ',
      breakdownModeLabel: 'این اے و انکاری الگ درج کریں',
      directModeLabel: 'براہِ راست مجموعی مسڈ درج کریں',
      naLabel: 'غیر موجود (NA)',
      refusalLabel: 'انکاری (Refusal)',
      reportedNaInputLabel: 'رپورٹ شدہ غیر موجود (NA)',
      coveredNaInputLabel: 'کور شدہ غیر موجود (Covered NA)',
      reportedRefusalInputLabel: 'رپورٹ شدہ انکاری (Refusals)',
      coveredRefusalInputLabel: 'کور شدہ انکاری (Covered Refusals)',
      totalMissedCombinedLabel: 'مجموعی مسڈ بچے (NA + انکاری)',
      totalCoveredCombinedLabel: 'مجموعی کور شدہ مسڈ بچے',
      combinedCoveragePercentLabel: 'مجموعی مسڈ کوریج شرح %',
      remainingCombinedMissedLabel: 'کل باقی مسڈ بچے',
      vialsForCombinedLabel: 'باقی بچوں کے لیے درکار وائلز',
      dropsForCombinedLabel: 'کل درکار قطرے (2 فی بچہ)',
      naRecoveryLabel: 'این اے کوریج شرح',
      refusalResolutionLabel: 'انکاری حل شرح',
      reportedMissedTooltip: {
        label: 'رپورٹ شدہ مسڈ بچے',
        formula: 'کل مسڈ بچے = رپورٹ شدہ NA بچے + رپورٹ شدہ انکاری بچے',
        fieldRule: 'ٹیلی شیٹ پر درج تمام مسڈ بچوں کا مجموعہ',
        explanation: 'ابتدائی راؤنڈ کے دوران وہ تمام بچے جو قطرے پینے سے رہ گئے (غیر موجود اور انکاری کیسز)۔',
      },
      coveredMissedTooltip: {
        label: 'کور شدہ مسڈ بچے',
        formula: 'مسڈ کوریج % = (کور شدہ مسڈ بچے تقسیم کل مسڈ بچے) × 100',
        fieldRule: 'مطلوبہ ہدف: 90% یا زائد مسڈ بچوں کی ریکوری',
        explanation: 'شام کے راؤنڈ یا کیچ اپ کے دنوں میں ویکسین پلائے گئے مسڈ بچے۔',
      },
      reportedNaTooltip: {
        label: 'رپورٹ شدہ غیر موجود بچے (NA)',
        formula: 'ٹیلی شیٹ پر "NA" نشان شدہ بچے',
        fieldRule: 'دروازے پر چاک سے "NA" درج کیا جاتا ہے',
        explanation: 'موبائل ٹیم کے دورے کے وقت گھر پر غیر موجود بچے جن کی بعد میں تلاش کی جاتی ہے۔',
      },
      coveredNaTooltip: {
        label: 'کور شدہ غیر موجود بچے (Covered NA)',
        formula: 'دوبارہ دورے پر پلائے گئے NA بچے',
        fieldRule: 'رپورٹ شدہ NA سے زائد نہیں ہو سکتا',
        explanation: 'شام کے راؤنڈ یا کیچ اپ کے دوران ویکسین کیے گئے غیر موجود بچے۔',
      },
      reportedRefusalTooltip: {
        label: 'رپورٹ شدہ انکاری بچے (Refusals)',
        formula: 'دروازے پر چاک سے "R" کا نشان',
        fieldRule: 'والدین یا سرپرست کا قطرے پلانے سے انکار',
        explanation: 'شروع کے وزٹ پر ویکسین نہ پینے والے انکاری کیسز۔',
      },
      coveredRefusalTooltip: {
        label: 'حل شدہ انکاری بچے (Covered Refusals)',
        formula: 'قائل کر کے پلائے گئے انکاری کیسز',
        fieldRule: 'رپورٹ شدہ انکاری سے زائد نہیں ہو سکتا',
        explanation: 'معززین علاقہ اور طبی افسران کی مدد سے حل کر کے قطرے پینے والے بچے۔',
      },
    },

    // Tool 7: Campaign Coverage Calculator
    campaignCoverage: {
      num: '7',
      title: 'مہماتی کوریج کیلکولیٹر',
      shortTitle: 'مہماتی کوریج کیلکولیٹر',
      badge: '(ویکسین شدہ ÷ ہدف) × 100',
      purpose: 'کوریج فیصد کا حساب اور 95% بین الاقوامی ہدف کے مقابلے میں پیش رفت کی نگرانی',
      calculateBtn: 'کوریج شرح % معلوم کریں',
      resetBtn: 'دوبارہ شروع کریں',
      targetLabel: 'ہدف بچے',
      vaccinatedLabel: 'ویکسین شدہ بچے',
      coverageAchievedLabel: 'حاصل شدہ کوریج',
      benchmarkLabel: 'معیار: 95% یا زائد',
      targetMetBadge: 'ہدف مکمل (≥ 95%)',
      inProgressBadge: 'جاری ہے (< 95%)',
      vaccinatedLabelResult: 'ویکسین شدہ',
      remainingLabelResult: 'باقی بچے',
      targetTooltip: {
        label: 'ہدف بچے',
        formula: 'ہدف = مائیکرو پلان میں شامل 5 سال سے کم بچے',
        fieldRule: 'یونین کونسل کا تصدیق شدہ ہدف',
        explanation: 'مہم کے دوران علاقے یا یونین کونسل میں ویکسین کیے جانے والے 5 سال سے کم کل بچوں کی تعداد۔',
      },
      vaccinatedTooltip: {
        label: 'ویکسین شدہ بچے',
        formula: 'کوریج % = (ویکسین شدہ بچے ÷ ہدف بچے) × 100',
        fieldRule: 'معیاری ہدف: وائرس کے خاتمے کے لیے 95% یا زائد کوریج لازمی ہے',
        explanation: 'مہم کی کامیابی اور قوتِ مدافعت کا معیار۔ 95 فیصد سے کم کوریج وائرس کے پھیلاؤ کا خطرہ بڑھاتی ہے۔',
      },
    },

    // Tool 8: Daily Catch-Up Calculator
    dailyCatchUp: {
      num: '8',
      title: 'روزانہ کیچ اپ کیلکولیٹر',
      shortTitle: 'روزانہ کیچ اپ کیلکولیٹر',
      badge: 'باقی بچے ÷ باقی دن',
      purpose: 'باقی دنوں کے لیے نظرثانی شدہ روزانہ ہدف اور صبح کی bOPV وائلز کا حساب',
      calculateBtn: 'روزانہ کا ہدف معلوم کریں',
      resetBtn: 'دوبارہ شروع کریں',
      targetLabel: 'کل ہدف بچے',
      vaccinatedLabel: 'اب تک ویکسین شدہ',
      daysLabel: 'مہم کے باقی دن',
      dailyTargetLabel: 'روزانہ کیچ اپ ہدف',
      morningVialsLabel: 'صبح درکار bOPV وائلز',
      remainingTargetLabel: 'باقی ہدف بچے',
      coverageProgressLabel: 'اب تک کوریج پیش رفت',
      targetTooltip: {
        label: 'کل ہدف بچے',
        formula: 'باقی ہدف = کل ہدف منفی اب تک ویکسین شدہ بچے',
        fieldRule: 'یونین کونسل کا مجموعی مہماتی ہدف',
        explanation: 'مائیکرو پلان میں اس مہم کے لیے طے شدہ مجموعی ہدف بچوں کی تعداد۔',
      },
      vaccinatedTooltip: {
        label: 'اب تک ویکسین شدہ',
        formula: 'کوریج % = (اب تک کور شدہ بچے ÷ کل ہدف) × 100',
        fieldRule: 'گزشتہ شام تک ویکسین شدہ بچوں کی تصدیق شدہ تعداد',
        explanation: 'آج کے دن کے آغاز تک فیلڈ میں قطرے پینے والے کل بچوں کا مجموعہ۔',
      },
      daysTooltip: {
        label: 'مہم کے باقی دن',
        formula: 'روزانہ ہدف = باقی بچے تقسیم باقی دن (اگلی وائل پر راؤنڈ)',
        fieldRule: 'صبح کی وائلز = روزانہ ہدف تقسیم 20',
        explanation: 'باقی بچوں کو کور کرنے کے لیے مہم کے جتنے کام کے دن باقی رہ گئے ہیں۔',
      },
    },

    // Tool 9: Under-5 Population Calculator
    under5Population: {
      num: '9',
      title: 'انڈر 5 آبادی کیلکولیٹر',
      shortTitle: 'انڈر 5 آبادی کیلکولیٹر',
      badge: 'آبادی × فیصد ÷ 100',
      purpose: 'یونین کونسل یا مردم شماری آبادی سے 5 سال سے کم ہدف بچوں کا تخمینہ',
      calculateBtn: '5 سال سے کم ہدف معلوم کریں',
      resetBtn: 'دوبارہ شروع کریں',
      totalPopLabel: 'کل آبادی',
      under5PctLabel: '5 سال سے کم بچوں کا تناسب (%)',
      estimatedTargetLabel: 'تخمینی 5 سال سے کم ہدف',
      cohortNotice: 'آبادیاتی تخمینہ',
      basePopLabel: 'بنیادی آبادی',
      vialsRequiredLabel: 'درکار bOPV وائلز',
      totalPopTooltip: {
        label: 'کل آبادی',
        formula: '5 سال سے کم ہدف = کل آبادی ضرب بچوں کا تناسب تقسیم 100',
        fieldRule: 'مردم شماری یا یوسی تصدیق شدہ کل آبادی',
        explanation: 'یونین کونسل یا مخصوص علاقے میں رہائش پذیر کل آبادی۔',
      },
      under5PctTooltip: {
        label: '5 سال سے کم بچوں کا تناسب (%)',
        formula: 'پاکستان اور جنوبی ایشیا میں معیاری تناسب: 13.5% سے 16.0%',
        fieldRule: 'قومی اوسط فیلڈ معیار: 15%',
        explanation: 'مجموعی آبادی میں 0 سے 59 ماہ کے بچوں کا آبادیاتی تناسب۔',
      },
    },
  },
};
