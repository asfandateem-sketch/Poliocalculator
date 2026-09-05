/**
 * POLIO CAMPAIGN CALCULATOR ENGINE
 *
 * Fixed bOPV Rules:
 * - Vaccine: bOPV (Bivalent Oral Polio Vaccine)
 * - Each child receives: 2 drops
 * - 1 vial vaccinates: 20 children
 *
 * All mathematical calculations run locally and purely.
 */

export const BOPV_CONSTANTS = {
  VACCINE_NAME: 'bOPV',
  DROPS_PER_CHILD: 2,
  CHILDREN_PER_VIAL: 20,
} as const;

export interface Under5ChildrenResult {
  method: 'population' | 'official';
  under5Children: number;
  label: 'Estimated Target' | 'Official Target';
  totalPopulation?: number;
  under5Percentage?: number;
}

export interface WastageResult {
  type: 'dose-level' | 'vial-estimate';
  suppliedDoses: number;
  administeredDoses: number;
  wastedDoses: number;
  wastageRatePercent: number;
  isEstimate: boolean;
  notes?: string;
}

export interface VaccineDemandResult {
  children: number;
  totalDoses: number;
  totalDropsRequired: number;
  vialsRequired: number;
  childrenCoveredByVials: number;
  childrenPerVial: number;
  dropsPerChild: number;
}

export interface PopulationResult {
  ucName: string;
  basePopulation: number;
  malePopulation?: number;
  femalePopulation?: number;
  otherPopulation?: number;
  adjustment: number;
  totalPopulation: number;
}

export interface VaccinationTargetResult {
  totalTarget: number;
  alreadyVaccinated: number;
  remainingChildren: number;
  progressPercent: number;
}

export interface TotalDropsResult {
  children: number;
  dropsPerChild: number;
  totalDrops: number;
}

export interface VialsToChildrenResult {
  vials: number;
  childrenPerVial: number;
  children: number;
  dropsPerChild: number;
  totalDrops: number;
}

export interface CampaignCoverageResult {
  targetChildren: number;
  childrenVaccinated: number;
  coveragePercent: number;
  remainingChildren: number;
}

export interface DailyTargetResult {
  totalTarget: number;
  alreadyVaccinated: number;
  remainingChildren: number;
  campaignDaysRemaining: number;
  dailyTarget: number;
}

export interface DailyVaccineDemandResult {
  dailyTarget: number;
  childrenPerVial: number;
  dropsPerChild: number;
  dailyVials: number;
  dailyDrops: number;
}

/**
 * 01. Calculate Under-5 Children
 * Method A: Total Population × Under-5 Percentage ÷ 100
 * Method B: Official Under-5 Target
 */
export function calculateUnder5Children(
  params:
    | { method: 'population'; totalPopulation: number; under5Percentage: number }
    | { method: 'official'; officialTarget: number }
): Under5ChildrenResult {
  if (params.method === 'population') {
    const pop = Math.max(0, params.totalPopulation || 0);
    const pct = Math.max(0, params.under5Percentage || 0);
    const calculated = Math.round((pop * pct) / 100);
    return {
      method: 'population',
      under5Children: calculated,
      label: 'Estimated Target',
      totalPopulation: pop,
      under5Percentage: pct,
    };
  } else {
    const target = Math.max(0, Math.round(params.officialTarget || 0));
    return {
      method: 'official',
      under5Children: target,
      label: 'Official Target',
    };
  }
}

/**
 * 02. Vaccine Wastage Calculations
 * Dose-level: Wasted Doses = Supplied Doses - Administered Doses
 * Wastage % = (Wasted Doses ÷ Supplied Doses) × 100
 */
export function calculateWastage(suppliedDoses: number, administeredDoses: number): number {
  const supplied = Math.max(0, suppliedDoses || 0);
  const administered = Math.max(0, administeredDoses || 0);
  return Math.max(0, supplied - administered);
}

export function calculateWastageRate(suppliedDoses: number, administeredDoses: number): number {
  const supplied = Math.max(0, suppliedDoses || 0);
  if (supplied === 0) return 0;
  const wasted = calculateWastage(supplied, administeredDoses);
  const rate = (wasted / supplied) * 100;
  return Math.round(rate * 100) / 100; // Round to 2 decimal places
}

export function calculateWastageFull(
  params:
    | { type: 'dose-level'; suppliedDoses: number; administeredDoses: number }
    | { type: 'vial-estimate'; vialsSupplied: number; childrenVaccinated: number }
): WastageResult {
  if (params.type === 'dose-level') {
    const supplied = Math.max(0, params.suppliedDoses || 0);
    const admin = Math.max(0, params.administeredDoses || 0);
    const wasted = Math.max(0, supplied - admin);
    const rate = supplied > 0 ? Math.round(((wasted / supplied) * 100) * 100) / 100 : 0;
    return {
      type: 'dose-level',
      suppliedDoses: supplied,
      administeredDoses: admin,
      wastedDoses: wasted,
      wastageRatePercent: rate,
      isEstimate: false,
    };
  } else {
    const vials = Math.max(0, params.vialsSupplied || 0);
    const vaccinated = Math.max(0, params.childrenVaccinated || 0);
    const capacityDoses = vials * BOPV_CONSTANTS.CHILDREN_PER_VIAL; // 20 children per vial
    const administered = vaccinated;
    const unusedOrWasted = Math.max(0, capacityDoses - administered);
    const rate = capacityDoses > 0 ? Math.round(((unusedOrWasted / capacityDoses) * 100) * 100) / 100 : 0;
    return {
      type: 'vial-estimate',
      suppliedDoses: capacityDoses,
      administeredDoses: administered,
      wastedDoses: unusedOrWasted,
      wastageRatePercent: rate,
      isEstimate: true,
      notes: 'Estimated wastage/capacity calculation based on 20 children per vial.',
    };
  }
}

/**
 * 03. Calculate Vials Required
 * Fixed: 20 children per vial
 * Formula: CEILING(Children ÷ 20)
 */
export function calculateVialsRequired(children: number): number {
  const c = Math.max(0, Math.round(children || 0));
  if (c === 0) return 0;
  return Math.ceil(c / BOPV_CONSTANTS.CHILDREN_PER_VIAL);
}

/**
 * Calculate Total Drops
 * Fixed: 2 drops per child
 * Formula: Children × 2
 */
export function calculateTotalDrops(children: number): number {
  const c = Math.max(0, Math.round(children || 0));
  return c * BOPV_CONSTANTS.DROPS_PER_CHILD;
}

/**
 * 03. Vaccine Demand Full Result
 */
export function calculateVaccineDemand(children: number): VaccineDemandResult {
  const c = Math.max(0, Math.round(children || 0));
  const vialsRequired = calculateVialsRequired(c);
  return {
    children: c,
    totalDoses: c,
    totalDropsRequired: calculateTotalDrops(c),
    vialsRequired,
    childrenCoveredByVials: vialsRequired * BOPV_CONSTANTS.CHILDREN_PER_VIAL,
    childrenPerVial: BOPV_CONSTANTS.CHILDREN_PER_VIAL,
    dropsPerChild: BOPV_CONSTANTS.DROPS_PER_CHILD,
  };
}

/**
 * 04. Total Population Calculator
 * Supports base population + explicit manual adjustment
 */
export function calculateTotalPopulation(params: {
  ucName?: string;
  basePopulation: number;
  malePopulation?: number;
  femalePopulation?: number;
  otherPopulation?: number;
  adjustment?: number;
}): PopulationResult {
  const ucName = params.ucName?.trim() || '';
  const base = Math.max(0, Math.round(params.basePopulation || 0));
  const adj = Math.round(params.adjustment || 0);
  const total = Math.max(0, base + adj);

  return {
    ucName,
    basePopulation: base,
    malePopulation: params.malePopulation !== undefined ? Math.max(0, Math.round(params.malePopulation)) : undefined,
    femalePopulation: params.femalePopulation !== undefined ? Math.max(0, Math.round(params.femalePopulation)) : undefined,
    otherPopulation: params.otherPopulation !== undefined ? Math.max(0, Math.round(params.otherPopulation)) : undefined,
    adjustment: adj,
    totalPopulation: total,
  };
}

/**
 * 05. Vaccination Target Calculator
 * Remaining = Target - Already Vaccinated
 */
export function calculateRemainingChildren(totalTarget: number, alreadyVaccinated: number): number {
  const target = Math.max(0, Math.round(totalTarget || 0));
  const vaccinated = Math.max(0, Math.round(alreadyVaccinated || 0));
  return Math.max(0, target - vaccinated);
}

export function calculateVaccinationTarget(totalTarget: number, alreadyVaccinated: number): VaccinationTargetResult {
  const target = Math.max(0, Math.round(totalTarget || 0));
  const vaccinated = Math.max(0, Math.round(alreadyVaccinated || 0));
  const remaining = calculateRemainingChildren(target, vaccinated);
  const progress = target > 0 ? Math.min(100, Math.round(((vaccinated / target) * 100) * 10) / 10) : 0;

  return {
    totalTarget: target,
    alreadyVaccinated: vaccinated,
    remainingChildren: remaining,
    progressPercent: progress,
  };
}

/**
 * 07. Vials to Children Calculator
 * Children = Vials × 20
 * Total Drops = Children × 2
 */
export function calculateChildrenFromVials(vials: number): VialsToChildrenResult {
  const v = Math.max(0, Math.round(vials || 0));
  const children = v * BOPV_CONSTANTS.CHILDREN_PER_VIAL;
  const totalDrops = children * BOPV_CONSTANTS.DROPS_PER_CHILD;
  return {
    vials: v,
    childrenPerVial: BOPV_CONSTANTS.CHILDREN_PER_VIAL,
    children,
    dropsPerChild: BOPV_CONSTANTS.DROPS_PER_CHILD,
    totalDrops,
  };
}

/**
 * 08. Campaign Coverage Calculator
 * Coverage % = (Children Vaccinated ÷ Target Children) × 100
 * Remaining Children = Target - Vaccinated
 */
export function calculateCoverage(targetChildren: number, childrenVaccinated: number): CampaignCoverageResult {
  const target = Math.max(0, Math.round(targetChildren || 0));
  const vaccinated = Math.max(0, Math.round(childrenVaccinated || 0));
  const coveragePercent = target > 0 ? Math.round(((vaccinated / target) * 100) * 10) / 10 : 0;
  const remainingChildren = Math.max(0, target - vaccinated);

  return {
    targetChildren: target,
    childrenVaccinated: vaccinated,
    coveragePercent,
    remainingChildren,
  };
}

export interface DailyCatchUpResult {
  totalTarget: number;
  alreadyVaccinated: number;
  daysRemaining: number;
  remainingChildren: number;
  dailyTarget: number;
  dailyVialsRequired: number;
  dailyDropsRequired: number;
  currentCoveragePercent: number;
}

/**
 * Daily Catch-Up & Cold Chain Run Rate
 * Used daily during campaigns to adjust daily team targets and morning cold chain vial issues.
 * Remaining = Target - Vaccinated
 * Daily Target = CEILING(Remaining ÷ Days Remaining)
 * Daily Vials = CEILING(Daily Target ÷ 20)
 * Daily Drops = Daily Target × 2
 */
export function calculateDailyCatchUp(
  totalTarget: number,
  alreadyVaccinated: number,
  daysRemaining: number
): DailyCatchUpResult {
  if (totalTarget < 0 || alreadyVaccinated < 0 || daysRemaining < 0) {
    throw new Error('Inputs cannot be negative.');
  }
  const target = Math.round(totalTarget);
  const vaccinated = Math.round(alreadyVaccinated);
  const days = Math.round(daysRemaining);

  const remaining = Math.max(0, target - vaccinated);
  const dailyTarget = days > 0 ? Math.ceil(remaining / days) : 0;
  const dailyVialsRequired = Math.ceil(dailyTarget / BOPV_CONSTANTS.CHILDREN_PER_VIAL);
  const dailyDropsRequired = dailyTarget * BOPV_CONSTANTS.DROPS_PER_CHILD;
  const currentCoveragePercent = target > 0 ? Math.round(((vaccinated / target) * 100) * 10) / 10 : 0;

  return {
    totalTarget: target,
    alreadyVaccinated: vaccinated,
    daysRemaining: days,
    remainingChildren: remaining,
    dailyTarget,
    dailyVialsRequired,
    dailyDropsRequired,
    currentCoveragePercent,
  };
}

export interface TeamRequirementResult {
  targetChildren: number;
  campaignDays: number;
  teamWorkloadPerDay: number;
  teamsPerSupervisor: number;
  dailyUcTarget: number;
  mobileTeamsRequired: number;
  supervisorsRequired: number;
  dailyVialsRequired: number;
}

/**
 * Microplanning: Team & Supervisor Workforce Calculator
 * Calculates field mobile teams and area supervisor staffing for a campaign.
 * Daily UC Target = CEILING(Target Children ÷ Campaign Days)
 * Mobile Teams = CEILING(Daily UC Target ÷ Workload per Team)
 * Area Supervisors = CEILING(Mobile Teams ÷ Teams per Supervisor)
 */
export function calculateTeamRequirements(
  targetChildren: number,
  campaignDays: number,
  teamWorkloadPerDay: number = 100,
  teamsPerSupervisor: number = 4
): TeamRequirementResult {
  if (targetChildren < 0 || campaignDays <= 0 || teamWorkloadPerDay <= 0 || teamsPerSupervisor <= 0) {
    throw new Error('Target must be ≥ 0 and duration/workload/ratio must be > 0.');
  }

  const target = Math.round(targetChildren);
  const days = Math.round(campaignDays);
  const workload = Math.round(teamWorkloadPerDay);
  const ratio = Math.round(teamsPerSupervisor);

  const dailyUcTarget = Math.ceil(target / days);
  const mobileTeamsRequired = Math.ceil(dailyUcTarget / workload);
  const supervisorsRequired = Math.ceil(mobileTeamsRequired / ratio);
  const dailyVialsRequired = Math.ceil(dailyUcTarget / BOPV_CONSTANTS.CHILDREN_PER_VIAL);

  return {
    targetChildren: target,
    campaignDays: days,
    teamWorkloadPerDay: workload,
    teamsPerSupervisor: ratio,
    dailyUcTarget,
    mobileTeamsRequired,
    supervisorsRequired,
    dailyVialsRequired,
  };
}

/**
 * 09. Daily Target Calculator
 * Remaining = Target - Vaccinated
 * Daily Target = CEILING(Remaining ÷ Campaign Days Remaining)
 */
export function calculateDailyTarget(
  totalTarget: number,
  alreadyVaccinated: number,
  campaignDaysRemaining: number
): DailyTargetResult {
  const target = Math.max(0, Math.round(totalTarget || 0));
  const vaccinated = Math.max(0, Math.round(alreadyVaccinated || 0));
  const days = Math.max(0, Math.round(campaignDaysRemaining || 0));
  const remaining = Math.max(0, target - vaccinated);
  const daily = days > 0 ? Math.ceil(remaining / days) : 0;

  return {
    totalTarget: target,
    alreadyVaccinated: vaccinated,
    remainingChildren: remaining,
    campaignDaysRemaining: days,
    dailyTarget: daily,
  };
}

/**
 * 10. Daily Vaccine Demand Calculator
 * Fixed: 20 children per vial, 2 drops per child
 * Daily Vials = CEILING(Daily Target ÷ 20)
 * Daily Drops = Daily Target × 2
 */
export function calculateDailyVaccineDemand(dailyTarget: number): DailyVaccineDemandResult {
  const dt = Math.max(0, Math.round(dailyTarget || 0));
  const dailyVials = Math.ceil(dt / BOPV_CONSTANTS.CHILDREN_PER_VIAL);
  const dailyDrops = dt * BOPV_CONSTANTS.DROPS_PER_CHILD;

  return {
    dailyTarget: dt,
    childrenPerVial: BOPV_CONSTANTS.CHILDREN_PER_VIAL,
    dropsPerChild: BOPV_CONSTANTS.DROPS_PER_CHILD,
    dailyVials,
    dailyDrops,
  };
}

export interface ChildAgeResult {
  dobString: string;
  formattedDob: string;
  referenceDateString: string;
  formattedReferenceDate: string;
  years: number;
  months: number;
  days: number;
  ageString: string;
  isUnder5: boolean;
}

/**
 * 11. Child Age / Under-5 Calculator
 * Exact calendar age calculation.
 * Calculates exact age on the specified campaign/reference date.
 * Under 5 = YES until the exact date of their 5th birthday.
 */
export function calculateChildAge(
  dob: Date | string,
  today: Date | string = new Date()
): ChildAgeResult {
  let dobDate: Date;
  if (typeof dob === 'string') {
    const parts = dob.split('-');
    if (parts.length === 3) {
      dobDate = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
    } else {
      dobDate = new Date(dob);
    }
  } else {
    dobDate = dob;
  }

  let todayDate: Date;
  if (typeof today === 'string') {
    const parts = today.split('-');
    if (parts.length === 3) {
      todayDate = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
    } else {
      todayDate = new Date(today);
    }
  } else {
    todayDate = today;
  }

  const bYear = dobDate.getFullYear();
  const bMonth = dobDate.getMonth();
  const bDay = dobDate.getDate();

  const tYear = todayDate.getFullYear();
  const tMonth = todayDate.getMonth();
  const tDay = todayDate.getDate();

  const fifthBirthday = new Date(bYear + 5, bMonth, bDay);
  fifthBirthday.setHours(0, 0, 0, 0);

  const todayMidnight = new Date(tYear, tMonth, tDay, 0, 0, 0, 0);
  const birthMidnight = new Date(bYear, bMonth, bDay, 0, 0, 0, 0);

  if (birthMidnight.getTime() > todayMidnight.getTime()) {
    throw new Error('Date of birth cannot be in the future.');
  }

  let years = tYear - bYear;
  let months = tMonth - bMonth;
  let days = tDay - bDay;

  if (days < 0) {
    months -= 1;
    const prevMonthLastDay = new Date(tYear, tMonth, 0).getDate();
    days += prevMonthLastDay;
  }

  if (months < 0) {
    years -= 1;
    months += 12;
  }

  const isUnder5 = todayMidnight.getTime() < fifthBirthday.getTime();

  const yStr = `${years} ${years === 1 ? 'Year' : 'Years'}`;
  const mStr = `${months} ${months === 1 ? 'Month' : 'Months'}`;
  const dStr = `${days} ${days === 1 ? 'Day' : 'Days'}`;
  const ageString = `${yStr}, ${mStr}, ${dStr}`;

  const fullMonthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const formattedDob = `${bDay} ${fullMonthNames[bMonth]} ${bYear}`;
  const formattedReferenceDate = `${tDay} ${fullMonthNames[tMonth]} ${tYear}`;
  const referenceDateString = `${tYear}-${String(tMonth + 1).padStart(2, '0')}-${String(tDay).padStart(2, '0')}`;

  return {
    dobString: `${bYear}-${String(bMonth + 1).padStart(2, '0')}-${String(bDay).padStart(2, '0')}`,
    formattedDob,
    referenceDateString,
    formattedReferenceDate,
    years,
    months,
    days,
    ageString,
    isUnder5,
  };
}

export interface VialWastageResult {
  vialsSupplied: number;
  totalDosesSupplied: number;
  childrenVaccinated: number;
  wastedDoses: number;
  wastageRatePercent: number;
}

/**
 * Vaccine Wastage from Vials Supplied
 * 1 vial = 20 doses (20 children can be vaccinated from each vial)
 * Total Doses Supplied = Vials Supplied × 20
 * Wasted Doses = Total Doses Supplied - Children Vaccinated
 * Wastage % = (Wasted Doses ÷ Total Doses Supplied) × 100
 */
export function calculateVaccineWastageFromVials(
  vialsSupplied: number,
  childrenVaccinated: number
): VialWastageResult {
  if (vialsSupplied < 0 || childrenVaccinated < 0) {
    throw new Error('Values cannot be negative.');
  }
  const vials = Math.round(vialsSupplied);
  const totalDosesSupplied = vials * BOPV_CONSTANTS.CHILDREN_PER_VIAL;
  const vaccinated = Math.round(childrenVaccinated);

  if (vaccinated > totalDosesSupplied) {
    throw new Error(
      `Children vaccinated (${vaccinated}) cannot exceed total doses supplied (${totalDosesSupplied} doses from ${vials} vials).`
    );
  }

  const wastedDoses = Math.max(0, totalDosesSupplied - vaccinated);
  const wastageRatePercent =
    totalDosesSupplied > 0
      ? Math.round(((wastedDoses / totalDosesSupplied) * 100) * 10) / 10
      : 0;

  return {
    vialsSupplied: vials,
    totalDosesSupplied,
    childrenVaccinated: vaccinated,
    wastedDoses,
    wastageRatePercent,
  };
}

export interface NACoverageResult {
  reportedNA: number;
  coveredNA: number;
  coveredNaPercent: number | null; // null represents 'N/A' when reportedNA == 0
  naRemaining: number;
}

/**
 * NA Coverage Calculator
 * NA = child Not Available at the time of team visit
 * NA Coverage % = (Covered NA / Reported NA) × 100 (N/A if reported NA is 0)
 * NA Remaining = Reported NA - Covered NA
 */
export function calculateNACoverage(
  reportedNA: number,
  coveredNA: number
): NACoverageResult {
  if (reportedNA < 0 || coveredNA < 0) {
    throw new Error('Values cannot be negative.');
  }
  if (coveredNA > reportedNA) {
    throw new Error('Covered NA cannot exceed Reported NA.');
  }

  const repNA = Math.round(reportedNA);
  const covNA = Math.round(coveredNA);

  const coveredNaPercent = repNA > 0 ? Math.round(((covNA / repNA) * 100) * 10) / 10 : null;
  const naRemaining = Math.max(0, repNA - covNA);

  return {
    reportedNA: repNA,
    coveredNA: covNA,
    coveredNaPercent,
    naRemaining,
  };
}

export interface RefusalResult {
  reportedRefusals: number;
  coveredRefusals: number;
  refusalCoveragePercent: number | null; // null represents 'N/A' when reportedRefusals == 0
  remainingRefusals: number;
}

/**
 * Refusal Coverage Percentage Calculator
 * Refusal Coverage % = (Covered Refusal / Reported Refusal) × 100
 * Remaining Refusals = Reported Refusal - Covered Refusal
 */
export function calculateRefusal(
  reportedRefusals: number,
  coveredRefusals: number
): RefusalResult {
  if (reportedRefusals < 0 || coveredRefusals < 0) {
    throw new Error('Values cannot be negative.');
  }
  if (coveredRefusals > reportedRefusals) {
    throw new Error('Covered refusals cannot exceed Reported Refusals.');
  }

  const repRef = Math.round(reportedRefusals);
  const covRef = Math.round(coveredRefusals);

  const refusalCoveragePercent = repRef > 0 ? Math.round(((covRef / repRef) * 100) * 10) / 10 : null;
  const remainingRefusals = Math.max(0, repRef - covRef);

  return {
    reportedRefusals: repRef,
    coveredRefusals: covRef,
    refusalCoveragePercent,
    remainingRefusals,
  };
}

export interface MissedChildrenCoverageResult {
  reportedMissed: number;
  coveredMissed: number;
  coveragePercent: number | null; // null represents 'N/A' when reportedMissed == 0
  remainingMissed: number;
  stillMissed: number; // alias for remainingMissed
  vialsRequiredForRemaining: number;
  dropsRequiredForRemaining: number;
  totalDropsForRemaining: number; // alias for dropsRequiredForRemaining
  status: 'OPTIMAL' | 'ACCEPTABLE' | 'ACTION NEEDED';
}

/**
 * Missed Children Coverage % Calculator
 * In Polio campaigns, Missed Children = NA (Not Available) + Refusals
 * Coverage % = (Covered Missed / Reported Missed) × 100
 * Remaining Missed = Reported Missed - Covered Missed
 * Vials Required = CEILING(Remaining Missed ÷ 20)
 * Drops Required = Remaining Missed × 2
 */
export function calculateMissedChildrenCoverage(
  reportedMissed: number,
  coveredMissed: number
): MissedChildrenCoverageResult {
  if (reportedMissed < 0 || coveredMissed < 0) {
    throw new Error('Values cannot be negative.');
  }
  if (coveredMissed > reportedMissed) {
    throw new Error('Covered missed children cannot exceed Reported missed children.');
  }

  const rep = Math.round(reportedMissed);
  const cov = Math.round(coveredMissed);

  const coveragePercent = rep > 0 ? Math.round(((cov / rep) * 100) * 10) / 10 : null;
  const remainingMissed = Math.max(0, rep - cov);
  const vialsRequiredForRemaining = Math.ceil(remainingMissed / BOPV_CONSTANTS.CHILDREN_PER_VIAL);
  const dropsRequiredForRemaining = remainingMissed * BOPV_CONSTANTS.DROPS_PER_CHILD;
  const status: 'OPTIMAL' | 'ACCEPTABLE' | 'ACTION NEEDED' =
    coveragePercent === null
      ? 'OPTIMAL'
      : coveragePercent >= 90
      ? 'OPTIMAL'
      : coveragePercent >= 80
      ? 'ACCEPTABLE'
      : 'ACTION NEEDED';

  return {
    reportedMissed: rep,
    coveredMissed: cov,
    coveragePercent,
    remainingMissed,
    stillMissed: remainingMissed,
    vialsRequiredForRemaining,
    dropsRequiredForRemaining,
    totalDropsForRemaining: dropsRequiredForRemaining,
    status,
  };
}

export interface CombinedMissedChildrenResult {
  // NA part
  reportedNA: number;
  coveredNA: number;
  remainingNA: number;
  naCoveragePercent: number | null;

  // Refusal part
  reportedRefusals: number;
  coveredRefusals: number;
  remainingRefusals: number;
  refusalCoveragePercent: number | null;

  // Combined totals
  totalReportedMissed: number;
  totalCoveredMissed: number;
  totalRemainingMissed: number;
  combinedCoveragePercent: number | null;
  vialsRequiredForRemaining: number;
  dropsRequiredForRemaining: number;
  status: 'OPTIMAL' | 'ACCEPTABLE' | 'ACTION NEEDED';
}

/**
 * Combined Missed Children Calculator
 * Combines Reported NA, Covered NA, Reported Refusals, and Covered Refusals
 * Calculates combined total missed children, recovery percentage, and required bOPV vials.
 */
export function calculateCombinedMissedChildren(
  reportedNA: number,
  coveredNA: number,
  reportedRefusals: number,
  coveredRefusals: number
): CombinedMissedChildrenResult {
  if (reportedNA < 0 || coveredNA < 0 || reportedRefusals < 0 || coveredRefusals < 0) {
    throw new Error('Values cannot be negative.');
  }
  if (coveredNA > reportedNA) {
    throw new Error('Covered NA cannot exceed Reported NA.');
  }
  if (coveredRefusals > reportedRefusals) {
    throw new Error('Covered Refusals cannot exceed Reported Refusals.');
  }

  const rNa = Math.round(reportedNA);
  const cNa = Math.round(coveredNA);
  const remNa = Math.max(0, rNa - cNa);
  const naCoveragePercent = rNa > 0 ? Math.round(((cNa / rNa) * 100) * 10) / 10 : null;

  const rRef = Math.round(reportedRefusals);
  const cRef = Math.round(coveredRefusals);
  const remRef = Math.max(0, rRef - cRef);
  const refusalCoveragePercent = rRef > 0 ? Math.round(((cRef / rRef) * 100) * 10) / 10 : null;

  const totalReportedMissed = rNa + rRef;
  const totalCoveredMissed = cNa + cRef;
  const totalRemainingMissed = remNa + remRef;
  const combinedCoveragePercent =
    totalReportedMissed > 0
      ? Math.round(((totalCoveredMissed / totalReportedMissed) * 100) * 10) / 10
      : null;

  const vialsRequiredForRemaining = Math.ceil(
    totalRemainingMissed / BOPV_CONSTANTS.CHILDREN_PER_VIAL
  );
  const dropsRequiredForRemaining = totalRemainingMissed * BOPV_CONSTANTS.DROPS_PER_CHILD;

  const status: 'OPTIMAL' | 'ACCEPTABLE' | 'ACTION NEEDED' =
    combinedCoveragePercent === null
      ? 'OPTIMAL'
      : combinedCoveragePercent >= 90
      ? 'OPTIMAL'
      : combinedCoveragePercent >= 80
      ? 'ACCEPTABLE'
      : 'ACTION NEEDED';

  return {
    reportedNA: rNa,
    coveredNA: cNa,
    remainingNA: remNa,
    naCoveragePercent,
    reportedRefusals: rRef,
    coveredRefusals: cRef,
    remainingRefusals: remRef,
    refusalCoveragePercent,
    totalReportedMissed,
    totalCoveredMissed,
    totalRemainingMissed,
    combinedCoveragePercent,
    vialsRequiredForRemaining,
    dropsRequiredForRemaining,
    status,
  };
}

