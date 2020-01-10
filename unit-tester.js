function runUnitTests(unitTests, logTestNames = false) {
  var passedCount = 0;
  var failed = [];
  const onlyRunSpecificTests = !!unitTests.find((unitTest) => unitTest.only);
  unitTests.forEach((unitTest) => {
    if (!onlyRunSpecificTests || unitTest.only) {
      try {
        if (logTestNames) {
          console.log(`Running unit test "${unitTest.name}"...`);
        }
        unitTest.test();
        passedCount++;
      } catch (e) {
        console.log(`Unit test "${unitTest.name}" failed: ${e.message || e}`);
        failed.push({
          name: unitTest.name,
          message: e.message || e
        });
      }
    }
  });
  console.log();
  console.log("Results:");
  console.log(`${passedCount} passed`);
  console.log(`${failed.length} failed`);
  return { passedCount, failed };
}

function expect(result, expectedResult) {
  if (result !== expectedResult) {
    throw `Result ${result} does not match expected result ${expectedResult}`;
  }
}

module.exports = {
  runUnitTests,
  expect
};
