/**
 * AUTOMATED TESTS FOR POLIO CAMPAIGN CALCULATIONS
 * Verifies all required calculation test cases from the prompt specification.
 */

import {
  calculateVialsRequired,
  calculateTotalDrops,
  calculateCoverage,
  calculateWastage,
  calculateWastageRate,
  calculateDailyTarget,
  calculateChildrenFromVials,
  calculateUnder5Children,
  calculateDailyVaccineDemand,
  calculateVaccineDemand,
  calculateChildAge,
  calculateNACoverage,
  calculateRefusal,
  calculateVaccineWastageFromVials,
  calculateDailyCatchUp,
  calculateTeamRequirements,
  calculateMissedChildrenCoverage,
  calculateCombinedMissedChildren,
} from './calculatorEngine.js';

export interface TestCaseResult {
  category: string;
  name: string;
  expected: any;
  actual: any;
  passed: boolean;
}

export function runAllTests(): { passed: boolean; results: TestCaseResult[]; total: number; passCount: number } {
  const results: TestCaseResult[] = [];

  function assertEqual(category: string, name: string, actual: any, expected: any) {
    const passed = JSON.stringify(actual) === JSON.stringify(expected);
    results.push({ category, name, expected, actual, passed });
    if (!passed) {
      console.error(`[FAIL] ${category} - ${name}: expected ${expected}, got ${actual}`);
    }
  }

  // --- VACCINE DEMAND TESTS ---
  // 20 children → 1 vial
  assertEqual('Vaccine Demand', '20 children → 1 vial', calculateVialsRequired(20), 1);
  // 21 children → 2 vials
  assertEqual('Vaccine Demand', '21 children → 2 vials', calculateVialsRequired(21), 2);
  // 40 children → 2 vials
  assertEqual('Vaccine Demand', '40 children → 2 vials', calculateVialsRequired(40), 2);
  // 100 children → 5 vials
  assertEqual('Vaccine Demand', '100 children → 5 vials', calculateVialsRequired(100), 5);
  // 105 children → 6 vials
  assertEqual('Vaccine Demand', '105 children → 6 vials', calculateVialsRequired(105), 6);
  // 500 children → 25 vials
  assertEqual('Vaccine Demand', '500 children → 25 vials', calculateVialsRequired(500), 25);
  // 5,000 children → 250 vials
  assertEqual('Vaccine Demand', '5,000 children → 250 vials', calculateVialsRequired(5000), 250);
  // 0 children → 0 vials
  assertEqual('Vaccine Demand', '0 children → 0 vials', calculateVialsRequired(0), 0);

  // --- DROPS CALCULATION TESTS ---
  // 1 child → 2 drops
  assertEqual('Total Drops', '1 child → 2 drops', calculateTotalDrops(1), 2);
  // 20 children → 40 drops
  assertEqual('Total Drops', '20 children → 40 drops', calculateTotalDrops(20), 40);
  // 100 children → 200 drops
  assertEqual('Total Drops', '100 children → 200 drops', calculateTotalDrops(100), 200);
  // 5,000 children → 10,000 drops
  assertEqual('Total Drops', '5,000 children → 10,000 drops', calculateTotalDrops(5000), 10000);

  // --- FULL VACCINE DEMAND RESULT TESTS ---
  const dem5000 = calculateVaccineDemand(5000);
  assertEqual('Vaccine Demand Result', '5000 target: totalDoses = 5000', dem5000.totalDoses, 5000);
  assertEqual('Vaccine Demand Result', '5000 target: totalDrops = 10000', dem5000.totalDropsRequired, 10000);
  assertEqual('Vaccine Demand Result', '5000 target: vialsRequired = 250', dem5000.vialsRequired, 250);

  // --- COVERAGE TESTS ---
  // 5,000 target / 4,750 vaccinated → 95%
  const cov1 = calculateCoverage(5000, 4750);
  assertEqual('Coverage Rate', '5,000 target / 4,750 vaccinated → 95%', cov1.coveragePercent, 95);
  assertEqual('Coverage Remaining', '5,000 target / 4,750 vaccinated → 250 remaining', cov1.remainingChildren, 250);

  // 1,000 target / 850 vaccinated → 85%
  const cov2 = calculateCoverage(1000, 850);
  assertEqual('Coverage Rate', '1,000 target / 850 vaccinated → 85%', cov2.coveragePercent, 85);
  assertEqual('Coverage Remaining', '1,000 target / 850 vaccinated → 150 remaining', cov2.remainingChildren, 150);

  // 0 target edge case
  const covZero = calculateCoverage(0, 0);
  assertEqual('Coverage Zero', '0 target / 0 vaccinated → 0%', covZero.coveragePercent, 0);
  assertEqual('Coverage Zero', '0 target / 0 vaccinated → 0 remaining', covZero.remainingChildren, 0);

  // --- VIALS TO CHILDREN TESTS ---
  // 1 vial → 20 children, 40 drops
  const v1 = calculateChildrenFromVials(1);
  assertEqual('Vials to Children', '1 vial → 20 children', v1.children, 20);
  assertEqual('Vials to Children', '1 vial → 40 drops', v1.totalDrops, 40);

  // 250 vials → 5,000 children, 10,000 drops
  const v250 = calculateChildrenFromVials(250);
  assertEqual('Vials to Children', '250 vials → 5,000 children', v250.children, 5000);
  assertEqual('Vials to Children', '250 vials → 10,000 drops', v250.totalDrops, 10000);

  // --- UNDER-5 CHILDREN TESTS ---
  // 50,000 population × 15% → 7,500 children
  const u5_1 = calculateUnder5Children({ method: 'population', totalPopulation: 50000, under5Percentage: 15 });
  assertEqual('Under-5 Population', '50,000 pop × 15% → 7,500 children', u5_1.under5Children, 7500);

  // 100,000 population × 16.5% → 16,500 children
  const u5_2 = calculateUnder5Children({ method: 'population', totalPopulation: 100000, under5Percentage: 16.5 });
  assertEqual('Under-5 Population', '100,000 pop × 16.5% → 16,500 children', u5_2.under5Children, 16500);

  // Official target passthrough
  const u5_3 = calculateUnder5Children({ method: 'official', officialTarget: 4850 });
  assertEqual('Under-5 Official', 'Official target 4,850 → 4,850', u5_3.under5Children, 4850);

  // --- DAILY TARGET TESTS ---
  // 5,000 total target / 1,000 already vaccinated / 4 days left → 1,000 / day
  const dt1 = calculateDailyTarget(5000, 1000, 4);
  assertEqual('Daily Target', '5,000 target / 1,000 done / 4 days → 1,000/day', dt1.dailyTarget, 1000);
  assertEqual('Daily Target', 'Remaining children is 4,000', dt1.remainingChildren, 4000);

  // Zero days left
  const dtZero = calculateDailyTarget(5000, 1000, 0);
  assertEqual('Daily Target Zero Days', '0 days remaining → 0 daily target', dtZero.dailyTarget, 0);

  // --- CHILD AGE / UNDER-5 TESTS ---
  const refDate = new Date(2026, 8, 3); // 3 September 2026

  // Born 3 Sep 2021 -> Exact 5th Birthday -> NOT under 5 (< 5.0 years)
  const age5thBday = calculateChildAge('2021-09-03', refDate);
  assertEqual('Child Age', 'Born on exact 5th birthday (2021-09-03) → NOT under 5', age5thBday.isUnder5, false);
  assertEqual('Child Age', 'Born on exact 5th birthday → 5 Years, 0 Months, 0 Days', age5thBday.years, 5);

  // Born 4 Sep 2021 -> 4 Years, 11 Months, 30 Days -> YES under 5
  const ageUnder5 = calculateChildAge('2021-09-04', refDate);
  assertEqual('Child Age', 'Born 4 Sep 2021 → IS under 5', ageUnder5.isUnder5, true);
  assertEqual('Child Age', 'Born 4 Sep 2021 → 4 Years', ageUnder5.years, 4);

  // Born 3 Sep 2026 -> 0 Years, 0 Months, 0 Days -> YES under 5 (Newborn)
  const newborn = calculateChildAge('2026-09-03', refDate);
  assertEqual('Child Age', 'Newborn born today → IS under 5', newborn.isUnder5, true);
  assertEqual('Child Age', 'Newborn → 0 Years, 0 Months, 0 Days', newborn.ageString, '0 Years, 0 Months, 0 Days');

  // Born 15 Mar 2023 -> Exactly 3 Years, 5 Months, 19 Days
  const toddler = calculateChildAge('2023-03-15', refDate);
  assertEqual('Child Age', 'Born 15 Mar 2023 → 3 Years, 5 Months, 19 Days', toddler.ageString, '3 Years, 5 Months, 19 Days');
  assertEqual('Child Age', 'Toddler IS under 5', toddler.isUnder5, true);

  // Leap Year: Born 29 Feb 2024 evaluated on 28 Feb 2026
  const leapChild = calculateChildAge('2024-02-29', new Date(2026, 1, 28));
  assertEqual('Child Age Leap Year', 'Born 29 Feb 2024 on 28 Feb 2026 → IS under 5', leapChild.isUnder5, true);

  // Future DOB throws Error
  let futureError = false;
  try {
    calculateChildAge('2027-01-01', refDate);
  } catch {
    futureError = true;
  }
  assertEqual('Child Age Future DOB', 'Future DOB throws Error', futureError, true);

  // --- VIAL WASTAGE TESTS (1 vial = 20 doses/children) ---
  // 50 vials supplied (1000 doses) / 950 vaccinated -> 50 wasted (5.0%)
  const vialW1 = calculateVaccineWastageFromVials(50, 950);
  assertEqual('Vial Wastage', '50 vials (1,000 doses) / 950 vac → 50 wasted doses', vialW1.wastedDoses, 50);
  assertEqual('Vial Wastage', '50 vials / 950 vac → 5.0% wastage', vialW1.wastageRatePercent, 5);
  assertEqual('Vial Wastage', '50 vials → 1,000 total doses supplied', vialW1.totalDosesSupplied, 1000);

  // 10 vials supplied (200 doses) / 180 vaccinated -> 20 wasted (10.0%)
  const vialW2 = calculateVaccineWastageFromVials(10, 180);
  assertEqual('Vial Wastage', '10 vials (200 doses) / 180 vac → 20 wasted doses', vialW2.wastedDoses, 20);
  assertEqual('Vial Wastage', '10 vials / 180 vac → 10.0% wastage', vialW2.wastageRatePercent, 10);

  // Vaccinated > supplied capacity -> throws error
  let vialExceedError = false;
  try {
    calculateVaccineWastageFromVials(5, 110); // 5 vials = 100 capacity < 110 vaccinated
  } catch {
    vialExceedError = true;
  }
  assertEqual('Vial Wastage', 'Vaccinated > total doses supplied → throws Error', vialExceedError, true);

  // Legacy dose wastage helpers still working
  assertEqual('Wastage', '1,000 supplied / 900 administered → 100 wasted', calculateWastage(1000, 900), 100);
  assertEqual('Wastage', '1,000 supplied / 900 administered → 10%', calculateWastageRate(1000, 900), 10);

  // --- NA COVERAGE TESTS (Target removed) ---
  // 100 reported NA / 80 covered -> Covered NA=80, NA Coverage=80%, NA Remaining=20
  const na1 = calculateNACoverage(100, 80);
  assertEqual('NA Coverage', '100 NA, 80 covered → Reported NA 100', na1.reportedNA, 100);
  assertEqual('NA Coverage', '100 NA, 80 covered → Covered NA 80', na1.coveredNA, 80);
  assertEqual('NA Coverage', '100 NA, 80 covered → NA Coverage 80%', na1.coveredNaPercent, 80);
  assertEqual('NA Coverage', '100 NA, 80 covered → NA Remaining 20', na1.naRemaining, 20);

  // Zero reported NA -> NA Coverage = null (displayed as N/A)
  const na0 = calculateNACoverage(0, 0);
  assertEqual('NA Coverage', 'Zero reported NA → NA Coverage null (N/A)', na0.coveredNaPercent, null);
  assertEqual('NA Coverage', 'Zero reported NA → NA Remaining 0', na0.naRemaining, 0);

  // Covered NA > Reported NA -> Throws Error
  let naInvalidError = false;
  try {
    calculateNACoverage(50, 60);
  } catch {
    naInvalidError = true;
  }
  assertEqual('NA Coverage', 'Covered NA > Reported NA → throws Error', naInvalidError, true);

  // --- REFUSAL COVERAGE TESTS (User scenario: Reported 50, Covered 25 -> 50%) ---
  const ref1 = calculateRefusal(50, 25);
  assertEqual('Refusal', '50 ref, 25 covered → Reported Refusals 50', ref1.reportedRefusals, 50);
  assertEqual('Refusal', '50 ref, 25 covered → Covered Refusals 25', ref1.coveredRefusals, 25);
  assertEqual('Refusal', '50 ref, 25 covered → Refusal Coverage 50%', ref1.refusalCoveragePercent, 50);
  assertEqual('Refusal', '50 ref, 25 covered → Remaining Refusals 25', ref1.remainingRefusals, 25);

  // Zero reported refusals -> Refusal Coverage = null (displayed as N/A)
  const ref0 = calculateRefusal(0, 0);
  assertEqual('Refusal', 'Zero reported refusals → Coverage null (N/A)', ref0.refusalCoveragePercent, null);
  assertEqual('Refusal', 'Zero reported refusals → Remaining Refusals 0', ref0.remainingRefusals, 0);

  // Covered > Reported -> Throws Error
  let refInvalidError = false;
  try {
    calculateRefusal(30, 40);
  } catch {
    refInvalidError = true;
  }
  assertEqual('Refusal', 'Covered > Reported Refusals → throws Error', refInvalidError, true);

  // --- DAILY VACCINE DEMAND TESTS ---
  const dvd1 = calculateDailyVaccineDemand(1000);
  assertEqual('Daily Vaccine Demand', '1,000 daily target → 50 vials', dvd1.dailyVials, 50);
  assertEqual('Daily Vaccine Demand', '1,000 daily target → 2,000 drops', dvd1.dailyDrops, 2000);

  // --- DAILY CATCH-UP & COLD CHAIN RUN RATE TESTS ---
  // Target 5,000, 2,000 done, 3 days left -> Remaining 3,000, Daily target 1,000, Daily vials 50, Drops 2,000, 40% achieved
  const cu1 = calculateDailyCatchUp(5000, 2000, 3);
  assertEqual('Daily Catch-Up', '5000 target, 2000 done, 3 days left → 3,000 remaining', cu1.remainingChildren, 3000);
  assertEqual('Daily Catch-Up', '5000 target, 2000 done, 3 days left → 1,000 daily target', cu1.dailyTarget, 1000);
  assertEqual('Daily Catch-Up', '5000 target, 2000 done, 3 days left → 50 vials/day', cu1.dailyVialsRequired, 50);
  assertEqual('Daily Catch-Up', '5000 target, 2000 done, 3 days left → 2,000 drops/day', cu1.dailyDropsRequired, 2000);
  assertEqual('Daily Catch-Up', '5000 target, 2000 done → 40% achieved', cu1.currentCoveragePercent, 40);

  // --- TEAM MICROPLANNING WORKFORCE TESTS ---
  // Target 5,000, 5 days, 100 kids/team/day, 4 teams/supervisor
  // Daily UC Target = 1,000
  // Mobile Teams = 10
  // Supervisors = 3 (CEIL(10/4))
  // Daily Vials = 50 (CEIL(1,000/20))
  const tm1 = calculateTeamRequirements(5000, 5, 100, 4);
  assertEqual('Team Microplan', '5,000 target over 5 days → 1,000 daily UC target', tm1.dailyUcTarget, 1000);
  assertEqual('Team Microplan', '1,000 daily target @ 100 kids/team → 10 mobile teams', tm1.mobileTeamsRequired, 10);
  assertEqual('Team Microplan', '10 mobile teams @ 4/supervisor → 3 supervisors', tm1.supervisorsRequired, 3);
  assertEqual('Team Microplan', '1,000 daily target → 50 daily vials for all teams', tm1.dailyVialsRequired, 50);

  // --- MISSED CHILDREN COVERAGE % TESTS ---
  // Missed Children = NA + Refusal
  // 150 reported, 120 covered → 80% coverage, 30 remaining, 2 vials required, 60 drops
  const mc1 = calculateMissedChildrenCoverage(150, 120);
  assertEqual('Missed Children Coverage', '150 reported, 120 covered → 80% coverage', mc1.coveragePercent, 80);
  assertEqual('Missed Children Coverage', '150 reported, 120 covered → 30 remaining', mc1.remainingMissed, 30);
  assertEqual('Missed Children Coverage', '30 remaining → 2 vials required', mc1.vialsRequiredForRemaining, 2);
  assertEqual('Missed Children Coverage', '30 remaining → 60 drops required', mc1.dropsRequiredForRemaining, 60);

  // 100 reported, 100 covered → 100% coverage, 0 remaining, 0 vials
  const mc2 = calculateMissedChildrenCoverage(100, 100);
  assertEqual('Missed Children Coverage', '100 reported, 100 covered → 100% coverage', mc2.coveragePercent, 100);
  assertEqual('Missed Children Coverage', '100 reported, 100 covered → 0 remaining', mc2.remainingMissed, 0);
  assertEqual('Missed Children Coverage', '0 remaining → 0 vials required', mc2.vialsRequiredForRemaining, 0);

  // 0 reported, 0 covered → null (N/A)
  const mc3 = calculateMissedChildrenCoverage(0, 0);
  assertEqual('Missed Children Coverage', '0 reported, 0 covered → null coverage', mc3.coveragePercent, null);
  assertEqual('Missed Children Coverage', '0 reported, 0 covered → 0 remaining', mc3.remainingMissed, 0);

  // --- COMBINED MISSED CHILDREN TESTS (Reported NA + Reported Refusals) ---
  // 100 NA (80 covered) + 50 Refusals (40 covered)
  // Total reported = 150, Total covered = 120 (80% coverage), Total remaining = 30, 2 vials required
  const cmc1 = calculateCombinedMissedChildren(100, 80, 50, 40);
  assertEqual('Combined Missed Children', '100 NA + 50 Refusal → 150 Total Reported', cmc1.totalReportedMissed, 150);
  assertEqual('Combined Missed Children', '80 NA cov + 40 Ref cov → 120 Total Covered', cmc1.totalCoveredMissed, 120);
  assertEqual('Combined Missed Children', '120/150 → 80% Combined Coverage', cmc1.combinedCoveragePercent, 80);
  assertEqual('Combined Missed Children', '150 - 120 → 30 Remaining Missed', cmc1.totalRemainingMissed, 30);
  assertEqual('Combined Missed Children', '30 Remaining → 2 Vials Required', cmc1.vialsRequiredForRemaining, 2);
  assertEqual('Combined Missed Children', '30 Remaining → 60 Drops Required', cmc1.dropsRequiredForRemaining, 60);
  assertEqual('Combined Missed Children', 'NA Recovery % → 80%', cmc1.naCoveragePercent, 80);
  assertEqual('Combined Missed Children', 'Refusal Resolution % → 80%', cmc1.refusalCoveragePercent, 80);

  const passCount = results.filter(r => r.passed).length;
  const passed = passCount === results.length;

  return {
    passed,
    results,
    total: results.length,
    passCount,
  };
}

// Self execute if run directly
if (typeof process !== 'undefined' && process.argv && process.argv[1]?.includes('testRunner')) {
  const summary = runAllTests();
  console.log(`\n========================================`);
  console.log(`TEST SUITE EXECUTION SUMMARY:`);
  console.log(`Passed: ${summary.passCount} / ${summary.total}`);
  console.log(`Status: ${summary.passed ? 'ALL PASSED OK' : 'FAILED'}`);
  console.log(`========================================\n`);
  if (!summary.passed) {
    process.exit(1);
  }
}
